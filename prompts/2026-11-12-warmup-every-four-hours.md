# PROD Warm-up Every Four Hours

**Date:** 2026-11-12
**Issue:** #256 - Change the WARMUP for PROD timeframe to every four hours.

---

## Prompt Summary

Owner bug report: change the PROD warm-up to run every four hours.

---

## Notes

- The schedule lives in `.github/workflows/ping-warmup.yml`. The cron changes from `*/15 * * * *` to `23 */4 * * *`: every four hours, at minute 23 so it stays off the top of the hour.
- GitHub runs scheduled workflows from the default branch (`develop`), so the new interval starts when this merges into `develop`, not at the production promotion.
- At four hours the Azure Functions host may idle out between pings, so the first API call after a quiet spell can be a cold start. The ping still confirms PROD answers.
- The `/api/ping` rate limit (10 requests per 15 minutes per IP) is a separate setting and is unchanged.
