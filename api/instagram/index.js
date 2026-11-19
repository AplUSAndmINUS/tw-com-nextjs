'use strict';

/**
 * Azure Function: api/instagram
 *
 * Proxies the most recent posts from Terence's Instagram account for the grid
 * on /about-me. It replaces the browser-side fetch in the open-source
 * `embed-instagram-feed` component (instagram/embed-instagram-feed), which put
 * the NoCodeAPI URL, and the account token inside it, in the page source.
 *
 * PLACEHOLDER: nothing is connected yet. Until INSTAGRAM_FEED_URL is set, this
 * answers 503 and the grid shows its "see it on Instagram" fallback.
 *
 * Environment variables:
 *   INSTAGRAM_FEED_URL      — The account's NoCodeAPI Instagram endpoint,
 *                             e.g. https://v1.nocodeapi.com/<user>/instagram/<token>.
 *                             Secret: it authorises reads of the account. Set it
 *                             in Azure SWA Application Settings, never in code.
 *                             It must return NoCodeAPI's { data: [...] } shape
 *                             (the Instagram Graph API media fields).
 *   INSTAGRAM_CACHE_TTL_MS  — How long a good response is reused (default
 *                             900000, 15 min). Every page view calls this
 *                             function, and NoCodeAPI plans are metered.
 *   INSTAGRAM_TIMEOUT_MS    — Per-attempt upstream timeout (default 4000). With
 *                             one retry, a hung upstream is given up on in
 *                             about 9 s, so visitors aren't left on the grid's
 *                             placeholders.
 *   ALLOWED_ORIGIN_EXTRA    — One extra browser origin allowed by CORS (e.g.
 *                             http://localhost:3000), shared with the other
 *                             functions.
 *
 * Query params:
 *   limit — posts to return, 1–24 (default 12). Not forwarded upstream.
 *
 * Responses:
 *   200 { data: [...] }   id, caption, media_type, media_url, thumbnail_url,
 *                         permalink, timestamp. Every other field is dropped.
 *   503                   not configured
 *   502                   upstream error or unexpected payload
 *   504                   upstream timed out
 *
 * If the upstream fails but an earlier response is cached, the cached posts
 * are served (even past their TTL) rather than emptying the grid.
 *
 * Requests that arrive while an upstream call is already running share that
 * call, so a burst of page views after the cache expires (or a cold start)
 * costs one NoCodeAPI request, not one per visitor.
 *
 * Outbound HTTP goes through ../httpClient, per the Azure Functions rules in
 * CLAUDE.md. It is a read, so a retry is safe. This endpoint passes its own
 * shorter budget (INSTAGRAM_TIMEOUT_MS, 1 retry) because a page section is
 * waiting on it.
 */

const { requestJson, isTimeoutError } = require('../httpClient');

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 4000;
const UPSTREAM_MAX_RETRIES = 1;

const MEDIA_FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
];

// Matches terencewaters.com and any subdomain (e.g. www., dev., staging.),
// the same allow-list as api/podcasts and api/subscribe.
const ALLOWED_ORIGIN_RE =
  /^https:\/\/((?:[a-zA-Z0-9-]+\.)?terencewaters\.com)$/;

/**
 * CORS headers scoped to an allowed origin: the request origin is echoed back
 * instead of '*', so other sites can't read the feed from their visitors'
 * browsers. The site itself calls /api on its own origin, where CORS doesn't
 * apply. Set ALLOWED_ORIGIN_EXTRA for one more origin (local development).
 * @param {string|undefined} origin
 * @returns {object}
 */
function getCorsHeaders(origin) {
  const extra = process.env.ALLOWED_ORIGIN_EXTRA || '';
  const isAllowed =
    (origin && ALLOWED_ORIGIN_RE.test(origin)) || (extra && origin === extra);

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    Vary: 'Origin',
  };
}

/** Success responses may be cached by the browser for as long as we cache. */
function withCacheControl(headers, ttlMs) {
  return {
    ...headers,
    'Cache-Control': `public, max-age=${Math.round(ttlMs / 1000)}`,
  };
}

/**
 * Per-instance cache of the last good upstream response, trimmed to
 * MAX_LIMIT items. Resets on cold start, which is fine for a public feed.
 * @type {{ fetchedAt: number, items: object[] } | null}
 */
let cache = null;

/**
 * The upstream call in progress, if any. Concurrent requests await this
 * instead of starting their own.
 * @type {Promise<{ statusCode: number, body: object }> | null}
 */
let inflight = null;

/** For tests. */
function resetInstagramCache() {
  cache = null;
  inflight = null;
}

function cacheTtlMs() {
  const raw = Number(process.env.INSTAGRAM_CACHE_TTL_MS);
  return Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_CACHE_TTL_MS;
}

function upstreamTimeoutMs() {
  const raw = Number(process.env.INSTAGRAM_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_UPSTREAM_TIMEOUT_MS;
}

/**
 * @param {unknown} value - the raw `limit` query param
 * @returns {number} an integer in 1..MAX_LIMIT
 */
function parseLimit(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

/**
 * True only for an absolute https URL, so a mistyped setting fails as "not
 * configured" instead of as an opaque fetch error.
 * @param {string | undefined} value
 */
function isHttpsUrl(value) {
  try {
    return new URL(String(value)).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Keeps only the fields the grid uses, and only string values. Items without
 * an id or permalink are dropped. Deeper checks (URL schemes, instagram.com
 * permalinks) happen in the front end's normaliser, src/lib/instagram.ts.
 * @param {unknown} item
 * @returns {object | null}
 */
function pickMedia(item) {
  if (!item || typeof item !== 'object') return null;

  const picked = {};
  for (const field of MEDIA_FIELDS) {
    if (typeof item[field] === 'string') picked[field] = item[field];
  }
  return picked.id && picked.permalink ? picked : null;
}

/**
 * One upstream read, shared by every request that arrives while it runs.
 * The URL is never logged: it carries the account token. The label is what
 * identifies this call in timeout and retry logs.
 * @param {string} feedUrl
 * @param {(msg: string) => void} log
 */
function fetchUpstream(feedUrl, log) {
  if (!inflight) {
    inflight = requestJson(feedUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      timeoutMs: upstreamTimeoutMs(),
      maxRetries: UPSTREAM_MAX_RETRIES,
      label: 'Instagram feed (NoCodeAPI)',
      log,
    }).finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

function json(status, payload, headers) {
  return { status, headers, body: JSON.stringify(payload) };
}

module.exports = async function (context, req) {
  const origin = req.headers && req.headers.origin;
  const cors = getCorsHeaders(origin);

  if ((req.method || '').toUpperCase() === 'OPTIONS') {
    return { status: 204, headers: cors, body: '' };
  }

  const feedUrl = process.env.INSTAGRAM_FEED_URL;
  if (!isHttpsUrl(feedUrl)) {
    return json(503, { error: 'Instagram feed is not configured' }, cors);
  }

  const limit = parseLimit(req.query && req.query.limit);
  const ttlMs = cacheTtlMs();

  if (cache && Date.now() - cache.fetchedAt < ttlMs) {
    return json(
      200,
      { data: cache.items.slice(0, limit) },
      withCacheControl(cors, ttlMs)
    );
  }

  /** Serve the last good feed if there is one, else the given error. */
  const fallback = (status, error) =>
    cache
      ? json(
          200,
          { data: cache.items.slice(0, limit) },
          withCacheControl(cors, 0)
        )
      : json(status, { error }, cors);

  try {
    const { statusCode, body } = await fetchUpstream(feedUrl, (msg) =>
      context.log(msg)
    );

    if (statusCode !== 200 || !Array.isArray(body.data)) {
      context.log.warn(
        `Instagram feed returned HTTP ${statusCode}` +
          (Array.isArray(body.data) ? '' : ' without a data array')
      );
      return fallback(502, 'Instagram feed unavailable');
    }

    const items = body.data.map(pickMedia).filter(Boolean).slice(0, MAX_LIMIT);
    cache = { fetchedAt: Date.now(), items };

    return json(
      200,
      { data: items.slice(0, limit) },
      withCacheControl(cors, ttlMs)
    );
  } catch (err) {
    if (isTimeoutError(err)) {
      context.log.error(
        `Instagram feed timed out calling ${err.label} after ${err.timeoutMs} ms`
      );
      return fallback(504, 'Instagram feed timed out');
    }

    // Name only: a network error's message can echo the request URL.
    context.log.error(`Instagram feed request failed: ${err && err.name}`);
    return fallback(502, 'Instagram feed unavailable');
  }
};

module.exports.resetInstagramCache = resetInstagramCache;
module.exports.parseLimit = parseLimit;
module.exports.pickMedia = pickMedia;
module.exports.getCorsHeaders = getCorsHeaders;
module.exports.DEFAULT_UPSTREAM_TIMEOUT_MS = DEFAULT_UPSTREAM_TIMEOUT_MS;
module.exports.UPSTREAM_MAX_RETRIES = UPSTREAM_MAX_RETRIES;
