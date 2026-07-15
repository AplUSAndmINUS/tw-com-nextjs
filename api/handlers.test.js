'use strict';

/**
 * End-to-end tests for the Azure Function handlers.
 *
 * These drive the real handlers — not the http client in isolation — against a
 * stubbed upstream, covering:
 *
 *   - the timeout handling added in #133 / #135: an upstream that accepts the
 *     connection and then goes silent used to hang the invocation until the
 *     Functions host killed it, and must now surface as 504;
 *   - the OData filter escaping from #131, which the move from https.request()
 *     to fetch() must not regress.
 *
 * Run with: node --test api/
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const subscribe = require('./subscribe');
const unsubscribe = require('./unsubscribe');
const contact = require('./contact');
const { resetNewsletterRateLimitStore } = require('./newsletterRateLimit');

/**
 * Shrinks the timeout and backoff budget so these tests finish in milliseconds
 * rather than the 5 s x 3 attempts the handlers use in production. The retry
 * count is left at its default of 2 — the attempt-count assertion below
 * depends on it.
 */
const FAST_HTTP_ENV = {
  API_HTTP_TIMEOUT_MS: '20',
  API_HTTP_RETRY_BASE_DELAY_MS: '1',
};

const SHAREPOINT_ENV = {
  ...FAST_HTTP_ENV,
  ENTRAID_TENANT_ID: 'tenant-id',
  ENTRAID_SP_APP_REGISTRATION_CLIENT_ID: 'client-id',
  ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET: 'client-secret',
  SHAREPOINT_SITE_ID: 'site-id',
  SHAREPOINT_LIST_ID: 'list-id',
};

const CONTACT_ENV = {
  ...FAST_HTTP_ENV,
  SMTP2GO_API_KEY: 'api-key',
  CONTACT_FROM_EMAIL: 'from@terencewaters.com',
  CONTACT_TO_EMAIL: 'to@terencewaters.com',
};

/**
 * Installs env vars for one test and restores the previous values after.
 * @param {object} vars
 * @returns {() => void} restore
 */
function withEnv(vars) {
  const previous = Object.entries(vars).map(([k, v]) => [k, process.env[k]]);
  for (const [k, v] of Object.entries(vars)) {
    process.env[k] = v;
  }
  return () => {
    for (const [k, v] of previous) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
}

/**
 * Stubs global fetch with an upstream that never answers, so every attempt
 * trips the client's timeout.
 * @returns {{ callCount: () => number; restore: () => void }}
 */
function stubHangingUpstream() {
  const original = globalThis.fetch;
  let calls = 0;

  globalThis.fetch = (_url, opts) => {
    calls += 1;
    return new Promise((_resolve, reject) => {
      opts.signal.addEventListener('abort', () => {
        const err = new Error('This operation was aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
  };

  return {
    callCount: () => calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

function createContext() {
  const logs = [];
  const log = (...args) => logs.push(args.join(' '));
  log.warn = (...args) => logs.push(args.join(' '));
  log.error = (...args) => logs.push(args.join(' '));
  return { log, logs };
}

function newsletterRequest(ip) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://terencewaters.com',
      'x-forwarded-for': ip,
    },
    body: { email: 'reader@example.com' },
  };
}

test.beforeEach(() => {
  resetNewsletterRateLimitStore();
});

test('subscribe returns 504 when the upstream never responds', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const upstream = stubHangingUpstream();
  const context = createContext();

  try {
    const res = await subscribe(context, newsletterRequest('203.0.113.1'));

    assert.equal(res.status, 504, 'a hung upstream must surface as 504');
    assert.match(JSON.parse(res.body).error, /timed out/i);
    assert.ok(
      context.logs.some((l) => /timed out/i.test(l)),
      `expected a timeout log, got: ${JSON.stringify(context.logs)}`
    );
  } finally {
    upstream.restore();
    restoreEnv();
  }
});

test('subscribe retries the timed-out token call before giving up', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const upstream = stubHangingUpstream();
  const context = createContext();

  try {
    await subscribe(context, newsletterRequest('203.0.113.2'));

    assert.equal(
      upstream.callCount(),
      3,
      'the default of 2 retries means 3 attempts against the token endpoint'
    );
    assert.ok(
      context.logs.some((l) => l.includes('attempt 1/3')),
      'retry logs should carry the attempt number'
    );
  } finally {
    upstream.restore();
    restoreEnv();
  }
});

test('unsubscribe returns 504 when the upstream never responds', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const upstream = stubHangingUpstream();
  const context = createContext();

  try {
    const res = await unsubscribe(context, newsletterRequest('203.0.113.3'));

    assert.equal(res.status, 504);
    assert.match(JSON.parse(res.body).error, /timed out/i);
  } finally {
    upstream.restore();
    restoreEnv();
  }
});

test('contact returns 504 when SMTP2Go never responds', async () => {
  const restoreEnv = withEnv(CONTACT_ENV);
  const upstream = stubHangingUpstream();
  const context = createContext();

  try {
    // No RECAPTCHA_SECRET_KEY, so verification is skipped and the first
    // outbound call is the SMTP2Go send itself.
    const previousRecaptcha = process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.RECAPTCHA_SECRET_KEY;

    const res = await contact(context, {
      method: 'POST',
      headers: { origin: 'https://terencewaters.com' },
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello there',
      }),
    });

    if (previousRecaptcha !== undefined) {
      process.env.RECAPTCHA_SECRET_KEY = previousRecaptcha;
    }

    assert.equal(res.status, 504);
    assert.match(JSON.parse(res.body).error, /timed out/i);
  } finally {
    upstream.restore();
    restoreEnv();
  }
});

// --- write safety: a retry must not duplicate a committed write ---

test('subscribe does not retry the list-item POST, so a slow Graph cannot double-subscribe', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const original = globalThis.fetch;
  const context = createContext();
  let creates = 0;

  // Graph answers the token call, then accepts the create and goes silent —
  // the case where the row is most likely already committed.
  globalThis.fetch = (url, opts) => {
    const target = String(url);

    if (target.includes('login.microsoftonline.com')) {
      return Promise.resolve({
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ access_token: 'token' }),
      });
    }

    creates += 1;
    return new Promise((_resolve, reject) => {
      opts.signal.addEventListener('abort', () => {
        const err = new Error('This operation was aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
  };

  try {
    const res = await subscribe(context, newsletterRequest('203.0.113.7'));

    assert.equal(creates, 1, 'the create POST must be attempted exactly once');
    assert.equal(
      res.status,
      504,
      'and the timeout must surface, not a false 200'
    );
  } finally {
    globalThis.fetch = original;
    restoreEnv();
  }
});

test('contact does not retry the SMTP2Go send, so a slow upstream cannot double-send', async () => {
  const restoreEnv = withEnv(CONTACT_ENV);
  const original = globalThis.fetch;
  const previousRecaptcha = process.env.RECAPTCHA_SECRET_KEY;
  delete process.env.RECAPTCHA_SECRET_KEY;
  const context = createContext();
  let sends = 0;

  globalThis.fetch = (_url, opts) => {
    sends += 1;
    return new Promise((_resolve, reject) => {
      opts.signal.addEventListener('abort', () => {
        const err = new Error('This operation was aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
  };

  try {
    const res = await contact(context, {
      method: 'POST',
      headers: { origin: 'https://terencewaters.com' },
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello there',
      }),
    });

    assert.equal(sends, 1, 'the recipient must not get a second copy');
    assert.equal(res.status, 504);
  } finally {
    globalThis.fetch = original;
    if (previousRecaptcha !== undefined) {
      process.env.RECAPTCHA_SECRET_KEY = previousRecaptcha;
    }
    restoreEnv();
  }
});

test('unsubscribe reports success when the delete 404s after a retried timeout', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const original = globalThis.fetch;
  const context = createContext();
  let deletes = 0;

  globalThis.fetch = (url, opts) => {
    const target = String(url);

    if (target.includes('login.microsoftonline.com')) {
      return Promise.resolve({
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ access_token: 'token' }),
      });
    }

    if (target.includes('$filter=')) {
      return Promise.resolve({
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ value: [{ id: '7' }] }),
      });
    }

    deletes += 1;

    // First DELETE lands but stalls; the retry finds the item already gone.
    if (deletes === 1) {
      return new Promise((_resolve, reject) => {
        opts.signal.addEventListener('abort', () => {
          const err = new Error('This operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    }

    return Promise.resolve({
      status: 404,
      headers: new Headers(),
      text: async () =>
        JSON.stringify({ error: { message: 'Item not found' } }),
    });
  };

  try {
    const res = await unsubscribe(context, newsletterRequest('203.0.113.8'));

    assert.equal(
      deletes,
      2,
      'the delete is idempotent, so retrying it is fine'
    );
    assert.equal(
      res.status,
      200,
      'the reader is unsubscribed — a 404 on the retry must not report failure'
    );
  } finally {
    globalThis.fetch = original;
    restoreEnv();
  }
});

test('contact returns 504, not 400, when reCAPTCHA times out', async () => {
  // A Google outage is not the user failing a captcha.
  const restoreEnv = withEnv({
    ...CONTACT_ENV,
    RECAPTCHA_SECRET_KEY: 'secret',
  });
  const upstream = stubHangingUpstream();
  const context = createContext();

  try {
    const res = await contact(context, {
      method: 'POST',
      headers: { origin: 'https://terencewaters.com' },
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello there',
        recaptchaToken: 'token',
      }),
    });

    assert.equal(res.status, 504);
    assert.match(JSON.parse(res.body).error, /timed out/i);
  } finally {
    upstream.restore();
    restoreEnv();
  }
});

test('unsubscribe still escapes single quotes in the OData filter (#131)', async () => {
  const restoreEnv = withEnv({
    ...SHAREPOINT_ENV,
    SHAREPOINT_EMAIL_FIELD: 'Title',
  });
  const original = globalThis.fetch;
  const context = createContext();
  const requestedUrls = [];

  globalThis.fetch = async (url) => {
    const target = String(url);
    requestedUrls.push(target);

    if (target.includes('login.microsoftonline.com')) {
      return {
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ access_token: 'token' }),
      };
    }

    // No match, so the handler stops after the lookup.
    return {
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ value: [] }),
    };
  };

  try {
    // A quote is legal in an address (RFC 5321) and is the injection vector.
    const res = await unsubscribe(context, {
      method: 'POST',
      headers: {
        origin: 'https://terencewaters.com',
        'x-forwarded-for': '203.0.113.6',
      },
      body: { email: "o'hara@example.com" },
    });

    assert.equal(res.status, 200);

    const lookupUrl = requestedUrls.find((u) => u.includes('$filter='));
    assert.ok(lookupUrl, 'expected a list lookup request');

    // fetch percent-encodes ' as %27 in the query of an https URL, so decode
    // before asserting on the OData expression the server will actually parse.
    const filter = decodeURIComponent(
      new URL(lookupUrl).searchParams.get('$filter')
    );
    assert.equal(
      filter,
      "fields/Title eq 'o''hara@example.com'",
      'the quote must reach Graph doubled, not raw'
    );
  } finally {
    globalThis.fetch = original;
    restoreEnv();
  }
});

test('subscribe still returns 200 when the upstream answers', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const original = globalThis.fetch;
  const context = createContext();

  globalThis.fetch = async (url) => ({
    status: String(url).includes('login.microsoftonline.com') ? 200 : 201,
    headers: new Headers(),
    text: async () =>
      String(url).includes('login.microsoftonline.com')
        ? JSON.stringify({ access_token: 'token' })
        : JSON.stringify({ id: '42' }),
  });

  try {
    const res = await subscribe(context, newsletterRequest('203.0.113.4'));

    assert.equal(res.status, 200, 'the happy path must be unaffected');
    assert.equal(JSON.parse(res.body).message, 'Subscribed successfully');
  } finally {
    globalThis.fetch = original;
    restoreEnv();
  }
});

test('unsubscribe still returns 200 when the upstream answers', async () => {
  const restoreEnv = withEnv(SHAREPOINT_ENV);
  const original = globalThis.fetch;
  const context = createContext();

  globalThis.fetch = async (url) => {
    const target = String(url);

    if (target.includes('login.microsoftonline.com')) {
      return {
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ access_token: 'token' }),
      };
    }

    // The lookup returns one matching item; the delete then returns 204.
    if (target.includes('$filter=')) {
      return {
        status: 200,
        headers: new Headers(),
        text: async () => JSON.stringify({ value: [{ id: '7' }] }),
      };
    }

    return { status: 204, headers: new Headers(), text: async () => '' };
  };

  try {
    const res = await unsubscribe(context, newsletterRequest('203.0.113.5'));

    assert.equal(res.status, 200);
    assert.equal(JSON.parse(res.body).message, 'Unsubscribed successfully');
  } finally {
    globalThis.fetch = original;
    restoreEnv();
  }
});
