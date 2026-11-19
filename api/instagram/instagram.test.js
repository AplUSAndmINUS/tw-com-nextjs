'use strict';

/**
 * Tests for the api/instagram proxy, against a stubbed upstream. Nothing here
 * reaches the network.
 *
 * The upstream payload is fixtures/nocodeapi-feed.json: a Faker-generated mock
 * NoCodeAPI response, written by src/lib/instagram.test.ts from the same
 * factory the front end's mock mode uses (src/lib/instagram.mock.ts). It is a
 * committed file because api/ has no dependencies and can't import Faker.
 *
 * Run with: cd api && yarn test
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const instagram = require('./index');
const fixture = require('./fixtures/nocodeapi-feed.json');

/** A made-up token, so the tests can prove it never reaches a log. */
const FEED_TOKEN = 'tok_TEST_SECRET_123';
const FEED_URL = `https://v1.nocodeapi.invalid/mock/instagram/${FEED_TOKEN}`;

const FEED_ENV = {
  INSTAGRAM_FEED_URL: FEED_URL,
  // This endpoint sets its own timeout (INSTAGRAM_TIMEOUT_MS), which takes
  // precedence over the shared API_HTTP_TIMEOUT_MS. Shrunk so tests are fast.
  INSTAGRAM_TIMEOUT_MS: '20',
  API_HTTP_RETRY_BASE_DELAY_MS: '1',
};

/** Installs env vars for one test; returns a restore function. */
function withEnv(vars) {
  const previous = Object.keys(vars).map((k) => [k, process.env[k]]);
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return () => {
    for (const [k, v] of previous) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
}

/**
 * Replaces global fetch. `respond` gets (url, opts) and returns a Response or
 * throws. Records every URL requested.
 */
function stubUpstream(respond) {
  const original = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (url, opts) => {
    urls.push(String(url));
    return respond(url, opts);
  };
  return {
    urls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Upstream that never answers, so the client's timeout fires. */
const hang = (_url, opts) =>
  new Promise((_resolve, reject) => {
    opts.signal.addEventListener('abort', () => {
      const err = new Error('This operation was aborted');
      err.name = 'AbortError';
      reject(err);
    });
  });

function createContext() {
  const logs = [];
  const log = (...args) => logs.push(args.join(' '));
  log.warn = (...args) => logs.push(args.join(' '));
  log.error = (...args) => logs.push(args.join(' '));
  return { log, logs };
}

const get = (query = {}) => ({ method: 'GET', headers: {}, query });

/** Runs the handler with the given env and upstream, then cleans up. */
async function run({ env = FEED_ENV, upstream, query } = {}) {
  const restoreEnv = withEnv(env);
  const stub = stubUpstream(upstream || (() => jsonResponse(fixture)));
  const context = createContext();
  try {
    const res = await instagram(context, get(query));
    return {
      res,
      body: res.body ? JSON.parse(res.body) : undefined,
      urls: stub.urls,
      logs: context.logs,
    };
  } finally {
    stub.restore();
    restoreEnv();
  }
}

test.beforeEach(() => {
  instagram.resetInstagramCache();
});

test('the fixture is a Faker mock feed of 16 posts (the grid pool)', () => {
  assert.equal(fixture.data.length, 16);
  assert.ok(fixture.paging, 'mock includes the paging block NoCodeAPI sends');
});

test('answers 503 until INSTAGRAM_FEED_URL is configured', async () => {
  const { res, body, urls } = await run({
    env: { INSTAGRAM_FEED_URL: undefined },
  });
  assert.equal(res.status, 503);
  assert.match(body.error, /not configured/i);
  assert.equal(urls.length, 0, 'nothing is fetched without a feed URL');
});

test('treats a non-https feed URL as not configured', async () => {
  for (const value of ['', 'not a url', 'http://v1.nocodeapi.invalid/x']) {
    const { res, urls } = await run({ env: { INSTAGRAM_FEED_URL: value } });
    assert.equal(res.status, 503, `expected 503 for ${JSON.stringify(value)}`);
    assert.equal(urls.length, 0);
  }
});

test('gives up on a hung upstream after one retry, within its own budget', async () => {
  const env = { ...FEED_ENV, INSTAGRAM_TIMEOUT_MS: '50' };
  const started = Date.now();
  const { res, urls } = await run({ env, upstream: hang });
  const elapsed = Date.now() - started;

  assert.equal(res.status, 504);
  assert.equal(urls.length, 2, 'one attempt plus one retry');
  assert.ok(elapsed < 1000, `gave up in ${elapsed} ms`);
  // Production budget: 4 s per attempt, 1 retry. About 9 s worst case
  // instead of the shared client's ~17 s (5 s x 3 attempts plus backoff).
  assert.equal(instagram.DEFAULT_UPSTREAM_TIMEOUT_MS, 4000);
  assert.equal(instagram.UPSTREAM_MAX_RETRIES, 1);
});

test('concurrent requests share one upstream call', async () => {
  const restoreEnv = withEnv(FEED_ENV);
  const stub = stubUpstream(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return jsonResponse(fixture);
  });
  try {
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => instagram(createContext(), get()))
    );
    assert.equal(stub.urls.length, 1, 'five page views, one NoCodeAPI call');
    for (const res of responses) {
      assert.equal(res.status, 200);
      assert.equal(JSON.parse(res.body).data.length, 12);
    }
  } finally {
    stub.restore();
    restoreEnv();
  }
});

test('concurrent requests share a failure too, then the next request retries', async () => {
  const restoreEnv = withEnv(FEED_ENV);
  let calls = 0;
  const stub = stubUpstream(async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return jsonResponse({ message: 'down' }, 500);
  });
  try {
    const responses = await Promise.all(
      Array.from({ length: 3 }, () => instagram(createContext(), get()))
    );
    assert.deepEqual(
      responses.map((r) => r.status),
      [502, 502, 502]
    );
    assert.equal(calls, 2, 'one shared call: an attempt plus one retry');

    await instagram(createContext(), get());
    assert.equal(calls, 4, 'the shared call is released once it settles');
  } finally {
    stub.restore();
    restoreEnv();
  }
});

test('CORS: echoes the site and its subdomains, refuses other origins', () => {
  const restoreEnv = withEnv({ ALLOWED_ORIGIN_EXTRA: 'http://localhost:3000' });
  try {
    const allow = (origin) =>
      instagram.getCorsHeaders(origin)['Access-Control-Allow-Origin'];
    assert.equal(
      allow('https://terencewaters.com'),
      'https://terencewaters.com'
    );
    assert.equal(
      allow('https://www.terencewaters.com'),
      'https://www.terencewaters.com'
    );
    assert.equal(allow('http://localhost:3000'), 'http://localhost:3000');
    assert.equal(allow('https://evil.example'), 'null');
    assert.equal(allow('https://terencewaters.com.evil.example'), 'null');
    assert.equal(allow('http://terencewaters.com'), 'null', 'https only');
    assert.equal(allow(undefined), 'null');
    assert.equal(instagram.getCorsHeaders('x').Vary, 'Origin');
  } finally {
    restoreEnv();
  }
});

test('CORS headers are on every response, including errors', async () => {
  const origin = 'https://terencewaters.com';
  const noOrigin = await run();
  assert.equal(noOrigin.res.headers['Access-Control-Allow-Origin'], 'null');

  const restoreEnv = withEnv({ INSTAGRAM_FEED_URL: undefined });
  try {
    const res = await instagram(createContext(), {
      method: 'GET',
      headers: { origin },
      query: {},
    });
    assert.equal(res.status, 503);
    assert.equal(res.headers['Access-Control-Allow-Origin'], origin);
  } finally {
    restoreEnv();
  }
});

test('answers a CORS preflight with 204', async () => {
  const origin = 'https://www.terencewaters.com';
  const res = await instagram(createContext(), {
    method: 'OPTIONS',
    headers: { origin },
  });
  assert.equal(res.status, 204);
  assert.match(res.headers['Access-Control-Allow-Methods'], /GET/);
  assert.equal(res.headers['Access-Control-Allow-Origin'], origin);
});

test('returns the 12 most recent posts with only the grid fields', async () => {
  const { res, body } = await run();

  assert.equal(res.status, 200);
  assert.equal(body.data.length, 12);
  assert.deepEqual(
    body.data.map((item) => item.id),
    fixture.data.slice(0, 12).map((item) => item.id)
  );
  assert.equal(body.paging, undefined, 'paging is dropped');
  for (const item of body.data) {
    assert.equal(item.username, undefined, 'username is dropped');
    assert.ok(item.permalink.startsWith('https://www.instagram.com/'));
  }
  const video = body.data.find((item) => item.media_type === 'VIDEO');
  assert.ok(video && video.thumbnail_url, 'videos keep their thumbnail');
  assert.match(res.headers['Cache-Control'], /max-age=900/);
});

test('honours ?limit=, clamped to 1..24, and never forwards it upstream', async () => {
  const cases = [
    ['3', 3],
    ['0', 1],
    ['abc', 12],
    ['16', 16], // what the grid asks for: 12 to show + 4 spares
    ['999', 16], // the fixture only has 16; the clamp is covered below
  ];
  for (const [limit, expected] of cases) {
    instagram.resetInstagramCache();
    const { body, urls } = await run({ query: { limit } });
    assert.equal(body.data.length, expected, `limit=${limit}`);
    assert.deepEqual(urls, [FEED_URL], 'upstream URL is used verbatim');
  }
  assert.equal(instagram.parseLimit('999'), 24);
  assert.equal(instagram.parseLimit(undefined), 12);
});

test('drops items without an id or permalink, and non-string fields', () => {
  assert.equal(instagram.pickMedia(null), null);
  assert.equal(instagram.pickMedia({ id: '1' }), null);
  assert.deepEqual(
    instagram.pickMedia({
      id: '1',
      permalink: 'https://www.instagram.com/p/x/',
      caption: 42,
      extra: 'x',
    }),
    { id: '1', permalink: 'https://www.instagram.com/p/x/' }
  );
});

test('caches a good response, so repeat views do not hit NoCodeAPI', async () => {
  const first = await run();
  const second = await run();
  assert.equal(first.urls.length, 1);
  assert.equal(second.urls.length, 0, 'second request served from cache');
  assert.deepEqual(second.body, first.body);
});

test('refetches once the cache has expired', async () => {
  const env = { ...FEED_ENV, INSTAGRAM_CACHE_TTL_MS: '0' };
  await run({ env });
  const second = await run({ env });
  assert.equal(second.urls.length, 1);
});

test('returns 502 when the upstream keeps failing', async () => {
  const { res, body, urls } = await run({
    upstream: () => jsonResponse({ message: 'quota exceeded' }, 500),
  });
  assert.equal(res.status, 502);
  assert.match(body.error, /unavailable/i);
  assert.equal(
    urls.length,
    2,
    '5xx is retried once: a read, but a page waits on it'
  );
});

test('returns 502 when the upstream answers without a data array', async () => {
  const { res } = await run({
    upstream: () => jsonResponse({ error: 'Invalid token' }),
  });
  assert.equal(res.status, 502);
});

test('returns 504 when the upstream never responds', async () => {
  const { res, body, logs } = await run({ upstream: hang });
  assert.equal(res.status, 504);
  assert.match(body.error, /timed out/i);
  assert.ok(logs.some((l) => l.includes('Instagram feed (NoCodeAPI)')));
});

test('serves the last good feed when the upstream fails', async () => {
  const env = { ...FEED_ENV, INSTAGRAM_CACHE_TTL_MS: '0' };
  const good = await run({ env });
  const failed = await run({ env, upstream: hang });

  assert.equal(failed.res.status, 200);
  assert.deepEqual(failed.body, good.body);
  assert.match(failed.res.headers['Cache-Control'], /max-age=0/);
});

test('never logs the feed URL, which carries the account token', async () => {
  const outcomes = [
    await run({ upstream: hang }),
    await run({ upstream: () => jsonResponse({}, 500) }),
    await run({
      upstream: (url) => {
        throw new TypeError(`fetch failed for ${url}`);
      },
    }),
  ];
  for (const { logs, res } of outcomes) {
    assert.ok(res.status >= 500);
    for (const line of logs) {
      assert.ok(!line.includes(FEED_TOKEN), `token leaked in log: ${line}`);
    }
    assert.ok(!res.body.includes(FEED_TOKEN), 'token leaked in response');
  }
});
