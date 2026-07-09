# Newsletter Server-Side Rate Limiting

**Date:** 2026-06-13  
**Issue:** #129 — Add server-side rate limiting to subscribe/unsubscribe endpoints

---

## Prompt Summary

Implement the smallest possible repository change to enforce server-side newsletter throttling:

- limit `/api/subscribe` and `/api/unsubscribe` to 3 requests per IP per rolling hour
- return `429 Too Many Requests` when exceeded
- log repeated violations for monitoring
- add focused validation for the new behavior

---

## Files Updated

- `api/newsletterRateLimit.js`
- `api/newsletterRateLimit.test.js`
- `api/subscribe/index.js`
- `api/unsubscribe/index.js`
- `README.md`
- `prompts/2026-06-13-newsletter-server-rate-limit.md`

---

## Validation

- `node --test api/newsletterRateLimit.test.js` ✅
- `yarn build` ⛔ blocked by the existing Adobe Fonts prebuild network check in this sandbox
