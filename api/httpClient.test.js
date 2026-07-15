'use strict';

/**
 * Unit tests for api/httpClient.js
 *
 * Run with: node --test api/
 *
 * Every test stubs the global fetch() so nothing leaves the machine, and uses
 * a 1 ms base backoff delay so the retry paths run instantly.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  request,
  requestJson,
  HttpTimeoutError,
  isTimeoutError,
  DEFAULT_TIMEOUT_MS,
} = require('./httpClient');

const URL_UNDER_TEST = 'https://graph.microsoft.com/v1.0/ping';

/** Keeps the retry tests fast without changing the code path under test. */
const FAST = { baseDelayMs: 1 };

/**
 * Builds a minimal stand-in for the fetch Response objects the client reads.
 * @param {number} status
 * @param {string} body
 */
function fakeResponse(status, body) {
  return {
    status,
    headers: new Headers(),
    text: async () => body,
  };
}

/**
 * Replaces global fetch for the duration of one test and restores it after.
 * @param {(url: string, opts: object) => Promise<object>} impl
 * @returns {{ calls: object[]; restore: () => void }}
 */
function stubFetch(impl) {
  const original = globalThis.fetch;
  const calls = [];

  globalThis.fetch = (url, opts) => {
    calls.push({ url, opts });
    return impl(url, opts, calls.length);
  };

  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

/**
 * A fetch that never settles until its abort signal fires — simulates an
 * upstream that accepts the connection and then goes silent.
 */
function hangingFetch() {
  return (_url, opts) =>
    new Promise((_resolve, reject) => {
      opts.signal.addEventListener('abort', () => {
        const err = new Error('This operation was aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
}

// --- happy path ---

test('request returns status and body text on success', async () => {
  const stub = stubFetch(async () => fakeResponse(200, 'hello'));

  try {
    const result = await request(URL_UNDER_TEST);
    assert.equal(result.statusCode, 200);
    assert.equal(result.text, 'hello');
    assert.equal(stub.calls.length, 1, 'should not retry a successful request');
  } finally {
    stub.restore();
  }
});

test('requestJson parses a JSON body', async () => {
  const stub = stubFetch(async () =>
    fakeResponse(200, JSON.stringify({ access_token: 'abc' }))
  );

  try {
    const { statusCode, body } = await requestJson(URL_UNDER_TEST);
    assert.equal(statusCode, 200);
    assert.equal(body.access_token, 'abc');
  } finally {
    stub.restore();
  }
});

test('requestJson resolves to an empty object on an unparseable body', async () => {
  const stub = stubFetch(async () => fakeResponse(500, '<html>oops</html>'));

  try {
    const { statusCode, body } = await requestJson(URL_UNDER_TEST, {
      ...FAST,
      maxRetries: 0,
    });
    assert.equal(statusCode, 500);
    assert.deepEqual(body, {}, 'garbage body must not throw');
  } finally {
    stub.restore();
  }
});

test('requestJson resolves to an empty object on an empty body', async () => {
  const stub = stubFetch(async () => fakeResponse(204, ''));

  try {
    const { statusCode, body } = await requestJson(URL_UNDER_TEST);
    assert.equal(statusCode, 204);
    assert.deepEqual(body, {});
  } finally {
    stub.restore();
  }
});

// --- timeout (issue #133) ---

test('request throws HttpTimeoutError when the upstream never responds', async () => {
  const stub = stubFetch(hangingFetch());

  try {
    await assert.rejects(
      () =>
        request(URL_UNDER_TEST, {
          ...FAST,
          timeoutMs: 20,
          maxRetries: 0,
          label: 'Graph ping',
        }),
      (err) => {
        assert.ok(err instanceof HttpTimeoutError);
        assert.ok(isTimeoutError(err), 'isTimeoutError must recognise it');
        assert.equal(err.isTransient, true, 'leads retry layer keys off this');
        assert.equal(err.label, 'Graph ping');
        assert.equal(err.timeoutMs, 20);
        return true;
      }
    );
  } finally {
    stub.restore();
  }
});

test('the default timeout is 5 seconds', () => {
  assert.equal(DEFAULT_TIMEOUT_MS, 5000);
});

test('timeout aborts the underlying fetch rather than leaking the socket', async () => {
  const stub = stubFetch(hangingFetch());

  try {
    await assert.rejects(() =>
      request(URL_UNDER_TEST, { ...FAST, timeoutMs: 20, maxRetries: 0 })
    );
    assert.equal(stub.calls[0].opts.signal.aborted, true);
  } finally {
    stub.restore();
  }
});

test('a timeout is logged with the endpoint name and attempt number', async () => {
  const stub = stubFetch(hangingFetch());
  const lines = [];

  try {
    await assert.rejects(() =>
      request(URL_UNDER_TEST, {
        ...FAST,
        timeoutMs: 20,
        maxRetries: 0,
        label: 'Entra ID token endpoint',
        log: (msg) => lines.push(msg),
      })
    );

    assert.ok(
      lines.some(
        (l) => l.includes('Entra ID token endpoint') && l.includes('timed out')
      ),
      `expected a timeout log naming the endpoint, got: ${JSON.stringify(lines)}`
    );
    assert.ok(
      lines.some((l) => l.includes('attempt 1/1')),
      'timeout log should carry the attempt number'
    );
  } finally {
    stub.restore();
  }
});

test('request retries a timeout and succeeds on a later attempt', async () => {
  const hang = hangingFetch();
  const stub = stubFetch((url, opts, callNumber) =>
    callNumber === 1
      ? hang(url, opts)
      : Promise.resolve(fakeResponse(200, 'ok'))
  );

  try {
    const result = await request(URL_UNDER_TEST, { ...FAST, timeoutMs: 20 });
    assert.equal(result.statusCode, 200);
    assert.equal(stub.calls.length, 2);
  } finally {
    stub.restore();
  }
});

// --- backoff on 5xx (issue #135) ---

test('request retries a 5xx and returns the first success', async () => {
  const stub = stubFetch(async (_url, _opts, callNumber) =>
    callNumber < 3
      ? fakeResponse(503, 'unavailable')
      : fakeResponse(201, 'made')
  );

  try {
    const result = await request(URL_UNDER_TEST, FAST);
    assert.equal(result.statusCode, 201);
    assert.equal(stub.calls.length, 3, 'two retries then success');
  } finally {
    stub.restore();
  }
});

test('request makes at most maxRetries+1 attempts and returns the last 5xx', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));

  try {
    const result = await request(URL_UNDER_TEST, FAST);
    assert.equal(
      stub.calls.length,
      3,
      'default of 2 retries means 3 attempts total'
    );
    assert.equal(
      result.statusCode,
      500,
      'exhausted retries surface the response, not an exception'
    );
  } finally {
    stub.restore();
  }
});

test('retry attempts are logged with the attempt number', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  const lines = [];

  try {
    await request(URL_UNDER_TEST, {
      ...FAST,
      label: 'Graph list item create',
      log: (msg) => lines.push(msg),
    });

    assert.ok(
      lines.some(
        (l) => l.includes('attempt 1/3') && l.includes('Graph list item create')
      ),
      `expected attempt 1 log, got: ${JSON.stringify(lines)}`
    );
    assert.ok(
      lines.some((l) => l.includes('attempt 2/3')),
      'expected attempt 2 log'
    );
    assert.ok(
      !lines.some((l) => l.includes('attempt 3/3')),
      'the final attempt is not a retry and should not log one'
    );
  } finally {
    stub.restore();
  }
});

test('request does not retry a 4xx', async () => {
  const stub = stubFetch(async () => fakeResponse(400, 'bad request'));

  try {
    const result = await request(URL_UNDER_TEST, FAST);
    assert.equal(result.statusCode, 400);
    assert.equal(stub.calls.length, 1, '4xx will fail identically on a retry');
  } finally {
    stub.restore();
  }
});

test('request does not retry a 429', async () => {
  // 429 carries Retry-After, which a blind backoff would ignore.
  const stub = stubFetch(async () => fakeResponse(429, 'slow down'));

  try {
    const result = await request(URL_UNDER_TEST, FAST);
    assert.equal(result.statusCode, 429);
    assert.equal(stub.calls.length, 1);
  } finally {
    stub.restore();
  }
});

test('maxRetries: 0 performs exactly one attempt', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));

  try {
    const result = await request(URL_UNDER_TEST, { ...FAST, maxRetries: 0 });
    assert.equal(result.statusCode, 500);
    assert.equal(
      stub.calls.length,
      1,
      'leads passes maxRetries: 0 to avoid nesting its own retry loop'
    );
  } finally {
    stub.restore();
  }
});

// --- non-timeout failures ---

test('a network error propagates unchanged and is not retried', async () => {
  const stub = stubFetch(async () => {
    throw new Error('getaddrinfo ENOTFOUND');
  });

  try {
    await assert.rejects(() => request(URL_UNDER_TEST, FAST), {
      message: 'getaddrinfo ENOTFOUND',
    });
    assert.equal(stub.calls.length, 1, 'backoff covers 5xx and timeouts only');
  } finally {
    stub.restore();
  }
});

test('isTimeoutError is false for ordinary errors', () => {
  assert.equal(isTimeoutError(new Error('nope')), false);
  assert.equal(isTimeoutError(null), false);
  assert.equal(isTimeoutError(undefined), false);
});

// --- environment overrides ---

test('API_HTTP_MAX_RETRIES=0 disables retries globally', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  process.env.API_HTTP_MAX_RETRIES = '0';

  try {
    await request(URL_UNDER_TEST, FAST);
    assert.equal(stub.calls.length, 1, '0 must not fall back to the default');
  } finally {
    delete process.env.API_HTTP_MAX_RETRIES;
    stub.restore();
  }
});

test('an explicit maxRetries option beats the environment', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  process.env.API_HTTP_MAX_RETRIES = '0';

  try {
    await request(URL_UNDER_TEST, { ...FAST, maxRetries: 1 });
    assert.equal(stub.calls.length, 2);
  } finally {
    delete process.env.API_HTTP_MAX_RETRIES;
    stub.restore();
  }
});

test('a junk API_HTTP_MAX_RETRIES falls back to the default', async () => {
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  process.env.API_HTTP_MAX_RETRIES = 'not-a-number';

  try {
    await request(URL_UNDER_TEST, FAST);
    assert.equal(stub.calls.length, 3);
  } finally {
    delete process.env.API_HTTP_MAX_RETRIES;
    stub.restore();
  }
});

test('a whitespace-only API_HTTP_MAX_RETRIES does not disable retries', async () => {
  // Number(' ') is 0, which would silently turn retries off for what is
  // almost certainly an unset app setting.
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  process.env.API_HTTP_MAX_RETRIES = '   ';

  try {
    await request(URL_UNDER_TEST, FAST);
    assert.equal(stub.calls.length, 3);
  } finally {
    delete process.env.API_HTTP_MAX_RETRIES;
    stub.restore();
  }
});

test('a fractional API_HTTP_MAX_RETRIES falls back to the default', async () => {
  // A non-integer count would leave the attempt loop unable to reach its
  // bound, falling through to the "unreachable" throw.
  const stub = stubFetch(async () => fakeResponse(500, 'boom'));
  process.env.API_HTTP_MAX_RETRIES = '0.5';

  try {
    const result = await request(URL_UNDER_TEST, FAST);
    assert.equal(result.statusCode, 500);
    assert.equal(stub.calls.length, 3);
  } finally {
    delete process.env.API_HTTP_MAX_RETRIES;
    stub.restore();
  }
});

test('API_HTTP_TIMEOUT_MS overrides the default timeout', async () => {
  const stub = stubFetch(hangingFetch());
  process.env.API_HTTP_TIMEOUT_MS = '15';

  try {
    await assert.rejects(
      () => request(URL_UNDER_TEST, { ...FAST, maxRetries: 0 }),
      (err) => {
        assert.equal(err.timeoutMs, 15);
        return true;
      }
    );
  } finally {
    delete process.env.API_HTTP_TIMEOUT_MS;
    stub.restore();
  }
});

// --- request shape passed to fetch ---

test('request forwards method, headers and body to fetch', async () => {
  const stub = stubFetch(async () => fakeResponse(200, '{}'));

  try {
    await requestJson(URL_UNDER_TEST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"a":1}',
    });

    const { opts } = stub.calls[0];
    assert.equal(opts.method, 'POST');
    assert.deepEqual(opts.headers, { 'Content-Type': 'application/json' });
    assert.equal(opts.body, '{"a":1}');
    assert.ok(opts.signal, 'a timeout signal must always be attached');
  } finally {
    stub.restore();
  }
});
