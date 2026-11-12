# Pre-order Callout Placement and Gold Buttons

**Date:** 2026-11-11
**Issue:** #241 - Pre-order callout inside the book section; gold pre-order buttons on the framework page

---

## Prompt Summary

Owner feedback on the test site after #238:

- the Mythic Gold pre-order callout on the home page belongs inside the Resonance Core Framework (book) section, not in a band below it
- on `/resonance-core-framework`, make the pre-order buttons more prominent: Mythic Gold instead of the standard teal

---

## Notes

- Gold is now a `TwButton` variant (`variant='gold'`) on the `--tw-mythic-gold` tokens, replacing the home page's one-off override. `TwHero` call-to-action entries accept an optional `variant` so the framework page hero can use it.
- Only the pre-order buttons are gold. Other primary buttons keep the standard accent, so gold stays the mark of the one decision the page asks for.
- The home book section's date blockquote is gone; the callout carries the launch line.
