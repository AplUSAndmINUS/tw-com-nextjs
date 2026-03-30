/**
 * Azure Function: api/ping
 *
 * HTTP-triggered keep-alive function. Azure Static Web Apps only supports
 * httpTrigger functions, so the previous timerTrigger has been replaced with
 * an HTTP GET endpoint.
 *
 * To replicate the 15-minute warm-up schedule, call this endpoint from a
 * scheduled GitHub Actions workflow (see .github/workflows/ping-warmup.yml).
 *
 * Environment variables (all optional):
 *   ENVIRONMENT              — The current environment (dev, test, or prod)
 *   PING_RATE_LIMIT_WINDOW_MS       — Rate-limit window in ms (default: 900000 = 15 min)
 *   PING_RATE_LIMIT_MAX_REQUESTS    — Max requests per IP per window (default: 10)
 */

'use strict';

const DEFAULT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 10;

// In-memory store: IP address → { count, resetTime }
const pingRateLimitStore = new Map();

// Extracts the real client IP from Azure/proxy forwarding headers.
const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const clientIp = req.headers['x-client-ip'] || req.headers['x-real-ip'];
  return clientIp ? clientIp.trim() : 'unknown';
};

// Consumes one rate-limit slot for the given IP.
// Returns { allowed: boolean, retryAfterSeconds: number }.
const takeRateLimitToken = (ipAddress) => {
  const windowMs =
    Number(process.env.PING_RATE_LIMIT_WINDOW_MS) ||
    DEFAULT_RATE_LIMIT_WINDOW_MS;
  const maxRequests =
    Number(process.env.PING_RATE_LIMIT_MAX_REQUESTS) ||
    DEFAULT_RATE_LIMIT_MAX_REQUESTS;
  const effectiveWindowMs =
    Number.isFinite(windowMs) && windowMs > 0
      ? windowMs
      : DEFAULT_RATE_LIMIT_WINDOW_MS;
  const effectiveMaxRequests =
    Number.isFinite(maxRequests) && maxRequests > 0
      ? maxRequests
      : DEFAULT_RATE_LIMIT_MAX_REQUESTS;

  const now = Date.now();
  const key = ipAddress || 'unknown';
  const existing = pingRateLimitStore.get(key);

  if (!existing || now >= existing.resetTime) {
    pingRateLimitStore.set(key, {
      count: 1,
      resetTime: now + effectiveWindowMs,
    });
    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(effectiveWindowMs / 1000),
    };
  }

  if (existing.count >= effectiveMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetTime - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.ceil((existing.resetTime - now) / 1000),
  };
};

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
module.exports = async function (context, req) {
  const clientIp = getClientIp(req);
  const rateLimitResult = takeRateLimitToken(clientIp);

  if (!rateLimitResult.allowed) {
    context.log.warn(`Ping rate limit exceeded for IP ${clientIp}.`);
    context.res = {
      status: 429,
      body: JSON.stringify({ ok: false, error: 'Too Many Requests' }),
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimitResult.retryAfterSeconds),
      },
    };
    return;
  }

  const environment = (process.env.ENVIRONMENT || 'dev').toLowerCase();
  const timestamp = new Date().toISOString();

  context.log(`Ping OK — ${environment} keep-alive at ${timestamp}`);

  context.res = {
    status: 200,
    body: JSON.stringify({ ok: true, environment, timestamp }),
    headers: { 'Content-Type': 'application/json' },
  };
};
