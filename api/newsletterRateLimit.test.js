'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const subscribe = require('./subscribe');
const unsubscribe = require('./unsubscribe');
const {
  getClientIp,
  takeNewsletterRateLimitToken,
  resetNewsletterRateLimitStore,
} = require('./newsletterRateLimit');

function createLogger(warnings) {
  const logger = () => {};
  logger.warn = (message) => warnings.push(message);
  logger.error = () => {};
  return logger;
}

function createRequest(ipAddress) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://terencewaters.com',
      'x-forwarded-for': ipAddress,
    },
    body: {
      email: 'reader@example.com',
    },
  };
}

test.beforeEach(() => {
  resetNewsletterRateLimitStore();
  delete process.env.NEWSLETTER_RATE_LIMIT_WINDOW_MS;
  delete process.env.NEWSLETTER_RATE_LIMIT_MAX_REQUESTS;
});

test('getClientIp prefers the first forwarded IP address', () => {
  assert.equal(
    getClientIp({
      headers: {
        'x-forwarded-for': '203.0.113.10, 198.51.100.20',
        'x-client-ip': '198.51.100.30',
      },
    }),
    '203.0.113.10'
  );
});

test('takeNewsletterRateLimitToken allows three requests per hour by default', () => {
  const attempts = Array.from({ length: 4 }, () =>
    takeNewsletterRateLimitToken('203.0.113.15')
  );

  assert.equal(attempts[0].allowed, true);
  assert.equal(attempts[1].allowed, true);
  assert.equal(attempts[2].allowed, true);
  assert.equal(attempts[3].allowed, false);
  assert.equal(attempts[3].violations, 1);
  assert.ok(attempts[3].retryAfterSeconds > 0);
});

test('subscribe returns 429 and logs when the IP exceeds the limit', async () => {
  const warnings = [];
  const context = { log: createLogger(warnings) };
  const req = createRequest('203.0.113.21');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await subscribe(context, req);
  }

  const response = await subscribe(context, req);
  const body = JSON.parse(response.body);

  assert.equal(response.status, 429);
  assert.equal(body.error, 'Too Many Requests');
  assert.equal(body.retryAfter, 3600);
  assert.equal(response.headers['Retry-After'], '3600');
  assert.match(warnings[0], /Newsletter subscribe rate limit exceeded/);
  assert.match(warnings[0], /Violation #1/);
});

test('subscribe and unsubscribe share the same per-IP limiter', async () => {
  const warnings = [];
  const subscribeContext = { log: createLogger([]) };
  const unsubscribeContext = { log: createLogger(warnings) };
  const req = createRequest('203.0.113.42');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await subscribe(subscribeContext, req);
  }

  const response = await unsubscribe(unsubscribeContext, req);
  const body = JSON.parse(response.body);

  assert.equal(response.status, 429);
  assert.equal(body.error, 'Too Many Requests');
  assert.equal(response.headers['Retry-After'], '3600');
  assert.match(warnings[0], /Newsletter unsubscribe rate limit exceeded/);
});
