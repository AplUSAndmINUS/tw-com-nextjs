# Site-wide Pre-order Bar

**Date:** 2026-11-12
**Issue:** #249 - Site-wide Mythic Gold pre-order bar at the top of every page

---

## Prompt Summary

Owner request, the last change before the 2026-11-20 pre-order launch, for all three sites:

- a slim bar at the top of every page, modelled on the store's "PRE-ORDER NOW OPEN" bar: transparent background with Mythic Gold trim, mobile friendly
- copy: "PRE-ORDER FOR THE RCF BOOK NOW OPEN • Expected release: late February to mid-March 2027 (subject to change)", with a "Go to Store →" link

---

## Notes

- `PreorderBar` is rendered once in `src/app/providers.tsx`, inside `AccessGate` and above the page, so it sits above the sticky DSM nav and scrolls away with the page.
- Routes still on the legacy layout (`/podcasts` and its pages, `/unsubscribe`) have a fixed `Header`, so the bar sits directly under it; anything at the very top would be hidden behind it. The header is taller than `--site-header-height` on desktop, so its height is observed, which moves the bar into place just after load on those pages.
- The release wording is the owner's and matches the store. Other copy keeps "targeted for Q1 2027".
- The link goes to the book's page on the Fluxline Store (`RCF_PREORDER_HREF`).
