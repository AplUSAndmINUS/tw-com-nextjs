'use strict';

/**
 * Shared HTTP client for the Azure Functions in this directory.
 *
 * Replaces the per-function `httpsRequest()` helpers that wrapped
 * `https.request()` by hand. Those had no timeout, so a stalled upstream
 * (Microsoft Graph, Entra ID, SMTP2Go, reCAPTCHA) held the invocation open
 * until the Functions host killed it, and no retry, so a single transient 5xx
 * surfaced to the caller as a hard failure.
 *
 * This module provides:
 *   - a request timeout enforced with AbortController (default 5s), covering
 *     both the response headers and the body read;
 *   - exponential backoff with jitter on 5xx responses and timeouts
 *     (default 2 retries, i.e. up to 3 attempts);
 *   - a typed HttpTimeoutError so callers can map timeouts onto 504.
 *
 * Uses the global fetch() built into Node 18+ (see engines in package.json),
 * so it adds no dependency.
 */

/** Default per-attempt timeout budget. */
const DEFAULT_TIMEOUT_MS = 5000;

/** Default number of retries *after* the initial attempt. */
const DEFAULT_MAX_RETRIES = 2;

/** First backoff delay; doubles per retry. */
const DEFAULT_BASE_DELAY_MS = 500;

/** Upper bound on the random jitter added to each backoff delay. */
const JITTER_MS = 250;

/**
 * Reads a positive-number override from the environment, falling back to the
 * built-in default when unset, unparseable, or non-positive. Mirrors the
 * pattern in api/newsletterRateLimit.js, and is read per call so tests and
 * Azure app settings can both change it without a redeploy of this module.
 *
 * @param {string} name - Environment variable name
 * @param {number} fallback
 * @returns {number}
 */
function envNumber(name, fallback) {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

/**
 * Retry count override. Unlike envNumber() this accepts 0, so retries can be
 * switched off globally via API_HTTP_MAX_RETRIES=0.
 *
 * Blank and whitespace-only values fall back to the default rather than
 * becoming 0 — Number(' ') is 0, which would silently disable retries for what
 * is almost certainly an unset app setting. Non-integers fall back too, since a
 * fractional count would make the attempt loop's bounds meaningless.
 *
 * @returns {number}
 */
function envRetries() {
  const raw = process.env.API_HTTP_MAX_RETRIES;
  if (raw === undefined || raw.trim() === '') return DEFAULT_MAX_RETRIES;

  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : DEFAULT_MAX_RETRIES;
}

/**
 * Raised when a request exceeds its timeout budget.
 *
 * `isTimeout` lets handlers map the failure onto 504 Gateway Timeout.
 * `isTransient` matches the flag api/leads/index.js already sets on retryable
 * Graph errors, so its outer retry loop treats a timeout as worth retrying.
 */
class HttpTimeoutError extends Error {
  /**
   * @param {string} label - Human-readable endpoint name, used in logs
   * @param {number} timeoutMs
   */
  constructor(label, timeoutMs) {
    super(`Request to ${label} timed out after ${timeoutMs} ms`);
    this.name = 'HttpTimeoutError';
    this.label = label;
    this.timeoutMs = timeoutMs;
    this.isTimeout = true;
    this.isTransient = true;
  }
}

/**
 * @param {unknown} err
 * @returns {boolean} true if err came from a request exceeding its timeout
 */
function isTimeoutError(err) {
  return Boolean(err && err.isTimeout === true);
}

/**
 * Only 5xx is retried. 4xx is a client error that will fail identically on a
 * retry, and 429 carries a Retry-After that a blind backoff would ignore.
 * @param {number} statusCode
 * @returns {boolean}
 */
function isRetryableStatus(statusCode) {
  return statusCode >= 500 && statusCode < 600;
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter. Jitter spreads retries from concurrent
 * invocations so they don't re-hit a struggling upstream in lockstep.
 * @param {number} attempt - 1-based attempt number that just failed
 * @param {number} baseDelayMs
 * @returns {number} delay in milliseconds
 */
function backoffDelayMs(attempt, baseDelayMs) {
  return baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * JITTER_MS;
}

/**
 * Emits a line through whichever logger the caller passed.
 * Handlers pass `context.log`; api/leads/index.js passes its own `log`.
 * @param {((msg: string) => void)|undefined} log
 * @param {string} message
 */
function writeLog(log, message) {
  if (typeof log === 'function') {
    log(message);
  }
}

/**
 * Performs one fetch attempt under a timeout.
 *
 * The timer spans the body read as well as the response headers, so a server
 * that sends headers promptly and then stalls mid-body still trips it.
 *
 * @param {string} url
 * @param {object} opts
 * @param {string} opts.method
 * @param {object|undefined} opts.headers
 * @param {string|undefined} opts.body
 * @param {number} opts.timeoutMs
 * @param {string} opts.label
 * @returns {Promise<{ statusCode: number; headers: Headers; text: string }>}
 */
async function fetchOnce(url, { method, headers, body, timeoutMs, label }) {
  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: response.headers,
      text,
    };
  } catch (err) {
    // An abort surfaces as a generic AbortError, so consult our own flag to
    // tell "we timed it out" apart from any other abort or network failure.
    if (timedOut) {
      throw new HttpTimeoutError(label, timeoutMs);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Performs an HTTPS request with a timeout and exponential-backoff retry.
 *
 * Retries are attempted on 5xx responses and timeouts only. Note that retrying
 * a non-idempotent POST can duplicate a write if the upstream actually applied
 * it before failing; callers that cannot tolerate that should pass
 * `maxRetries: 0`, or rely on an outer retry layer that can dedupe.
 *
 * Defaults may be overridden per call, or globally via the environment:
 *   API_HTTP_TIMEOUT_MS         — per-attempt timeout (default 5000)
 *   API_HTTP_MAX_RETRIES        — retries after the first attempt (default 2)
 *   API_HTTP_RETRY_BASE_DELAY_MS — first backoff delay (default 500)
 *
 * @param {string} url - Absolute URL
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object} [options.headers]
 * @param {string} [options.body] - Pre-serialized request body
 * @param {number} [options.timeoutMs] - Per-attempt timeout
 * @param {number} [options.maxRetries] - Retries after the initial attempt
 * @param {number} [options.baseDelayMs] - First backoff delay
 * @param {string} [options.label] - Endpoint name for logs; defaults to the host
 * @param {(msg: string) => void} [options.log]
 * @returns {Promise<{ statusCode: number; headers: Headers; text: string }>}
 * @throws {HttpTimeoutError} if every attempt times out
 */
async function request(url, options = {}) {
  const {
    method = 'GET',
    headers,
    body,
    timeoutMs = envNumber('API_HTTP_TIMEOUT_MS', DEFAULT_TIMEOUT_MS),
    baseDelayMs = envNumber(
      'API_HTTP_RETRY_BASE_DELAY_MS',
      DEFAULT_BASE_DELAY_MS
    ),
    // 0 is a meaningful value here (api/leads/index.js passes it to avoid
    // nesting retries), and a destructuring default only fires on undefined,
    // so an explicit 0 correctly bypasses the env lookup below.
    maxRetries = envRetries(),
    log,
  } = options;

  const label = options.label || safeHost(url);
  const totalAttempts = maxRetries + 1;

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    const isLastAttempt = attempt === totalAttempts;

    try {
      const result = await fetchOnce(url, {
        method,
        headers,
        body,
        timeoutMs,
        label,
      });

      if (isRetryableStatus(result.statusCode) && !isLastAttempt) {
        const delay = backoffDelayMs(attempt, baseDelayMs);
        writeLog(
          log,
          `${label}: attempt ${attempt}/${totalAttempts} returned HTTP ${result.statusCode}. Retrying in ${Math.round(delay)} ms.`
        );
        await sleep(delay);
        continue;
      }

      return result;
    } catch (err) {
      if (!isTimeoutError(err)) {
        // Not a timeout (DNS failure, TLS error, socket reset). Out of scope
        // for backoff — surface it to the caller unchanged.
        throw err;
      }

      writeLog(
        log,
        `${label}: attempt ${attempt}/${totalAttempts} timed out after ${timeoutMs} ms.`
      );

      if (isLastAttempt) {
        throw err;
      }

      const delay = backoffDelayMs(attempt, baseDelayMs);
      writeLog(log, `${label}: retrying in ${Math.round(delay)} ms.`);
      await sleep(delay);
    }
  }

  // Unreachable: the loop either returns or throws on the last attempt.
  throw new Error(`${label}: exhausted ${totalAttempts} attempts`);
}

/**
 * Same as request(), but parses the response body as JSON.
 *
 * A body that is empty or unparseable resolves to `{}` rather than throwing,
 * matching the behaviour of the httpsRequest() helpers this replaces: callers
 * branch on statusCode first and only then read the body.
 *
 * @param {string} url
 * @param {object} [options] - Same options as request()
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
async function requestJson(url, options = {}) {
  const { statusCode, text } = await request(url, options);

  if (!text) {
    return { statusCode, body: {} };
  }

  try {
    return { statusCode, body: JSON.parse(text) };
  } catch {
    return { statusCode, body: {} };
  }
}

/**
 * Extracts the host for log labelling without throwing on a malformed URL.
 * @param {string} url
 * @returns {string}
 */
function safeHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return 'unknown-endpoint';
  }
}

module.exports = {
  request,
  requestJson,
  HttpTimeoutError,
  isTimeoutError,
  DEFAULT_TIMEOUT_MS,
};
