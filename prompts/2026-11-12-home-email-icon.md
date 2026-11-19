# Home: Email Icon and Hero Quote

**Date:** 2026-11-12
**Issue:** #246 - Home: email icon in place of the visible address; remove em dashes from the hero quote

---

## Prompt Summary

Owner feedback from QA on the test site:

- the contact section shows the email address as plain text; replace it with an email icon that links to the address
- remove the em dashes from the hero quote so it reads "...make your life and work..."

---

## Notes

- The icon reuses `mail.svg` and `SOCIAL_URLS.email`, as the About rail already does. A new `contactSocials` list puts Email first, then the wider social set; the newsletter row is unchanged.
- Only the hero quote changed. Other em dashes on the home page were left as they are.
