'use strict';

const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 3;

const newsletterRateLimitStore = new Map();

function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const clientIp = req.headers['x-client-ip'] || req.headers['x-real-ip'];
  return clientIp ? clientIp.trim() : 'unknown';
}

function takeNewsletterRateLimitToken(ipAddress) {
  const windowMs =
    Number(process.env.NEWSLETTER_RATE_LIMIT_WINDOW_MS) ||
    DEFAULT_RATE_LIMIT_WINDOW_MS;
  const maxRequests =
    Number(process.env.NEWSLETTER_RATE_LIMIT_MAX_REQUESTS) ||
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
  const existing = newsletterRateLimitStore.get(key);

  if (!existing || now >= existing.resetTime) {
    newsletterRateLimitStore.set(key, {
      count: 1,
      resetTime: now + effectiveWindowMs,
      violations: 0,
    });
    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(effectiveWindowMs / 1000),
      violations: 0,
    };
  }

  if (existing.count >= effectiveMaxRequests) {
    existing.violations += 1;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetTime - now) / 1000)
      ),
      violations: existing.violations,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetTime - now) / 1000)
    ),
    violations: existing.violations,
  };
}

function resetNewsletterRateLimitStore() {
  newsletterRateLimitStore.clear();
}

module.exports = {
  getClientIp,
  takeNewsletterRateLimitToken,
  resetNewsletterRateLimitStore,
};
