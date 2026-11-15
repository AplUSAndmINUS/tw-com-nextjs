# /about-me: Link-in-Bio Landing Page

**Date:** 2026-11-14

---

## Prompt Summary

Owner request: update `/about-me` (the Linktree-style short version of `/about`) so it better represents Terence as a podcaster, systems architect, and business consultant who represents The Resonance Core Framework™.

- Simplify it into a Linktree-like landing page with 60-second content that is easy to scan and act on.
- The top callout loses its action buttons. They move to the bottom of the page: `/about`, how to get in touch, and `/resonance-core-framework`.
- Use existing DSM, Next.js, and React components, with a fresh landing-page look.
- Social media icons (existing icons and links) at the bottom of the page.
- Cards for blog posts, the RCF, The Resonant Identity podcast and its link, skills with talent bars (X out of 100), and some projects.
- Mobile friendly and responsive.
- Use only content already in the repo.

---

## Notes

- Page order: hero callout (no CTAs) → In 60 seconds (three role cards + stats) → the book and the podcast → talent bars → selected projects → recent writing → actions band, contact tiles, social icon row → footer.
- Sources: `about/aboutData.ts` (roles, stats, projects framing), `content/aboutSkills.ts` (scores), `lib/rcf.ts` (book), `lib/spreaker.ts` / `lib/socials.ts` (podcast platforms, social URLs), `home/homeData.ts` (`serviceHref`), blog and portfolio frontmatter via `getAllContent`.
- Built from DSM parts: `TwHero`, `TwCard`, `TwChip`, `TwContentGrid`, `TwStatCard`, `TwArticleCard`, `TwCTABand`, `TwButton`, `TwSectionHeading`, `TwReveal`, `TwPageNav`. Icons come from `components/icons`. The social row reuses the homepage `SocialRow` (mask icons from `/assets/icons`).
- The talent bars use the same reveal-driven fill as the `/about` meters. Skills are picked by name, and `aboutMeData.test.ts` fails if a name stops matching `aboutSkills.ts`.
- Projects: curated slugs (`fluxline-pro-website`, `myintermountain-sharepoint-intranet`, `enterprise-dashboard`), topped up from featured entries if one disappears. Writing: the latest three posts.
- No live podcast feed on this page, so the static build never depends on Spreaker being reachable.
- The page's `.container` does not use the `container-width` mixin. That mixin's `width: 100%` plus padding overflows the viewport because the project has no global `border-box` rule. The mixin was left unchanged because other DSM components use it.
- Not addressed (already there, out of scope): React's `inert=""` console warning from `TwAppearancePanel`, which shows on every page that uses `TwPageNav`.

---

## Follow-up: refinements

Owner feedback after review:

1. On mobile the hero card covers the face. Use a parallax or scroll effect so the photo is seen first, and as the visitor scrolls the text comes into view while the photo fades out. Most visitors are on phones.
2. In the RCF book card, make the "Pre-orders open" link a more prominent Mythic Gold button, echoing the top pre-order bar.
3. Make the links at the bottom of the book and podcast cards into buttons, in the home page's order (primary, then secondary), with the pre-order as the gold one.

### Notes

- `TwHero` gets an opt-in `scrollReveal` prop, so home, `/about` and `/resonance-core-framework` are unchanged (mobile and desktop screenshots were pixel-identical before and after). Below tablet width the hero stacks: a photo stage (`min(74svh, 680px)`), then the card, overlapping the photo's faded lower edge by 96px. `TwHeroScrollReveal` writes `--tw-hero-reveal` (0 to 1) and the CSS fades the photo (down to 10%) and scales it up slightly. TwParallax's drift still runs behind it. A JS requestAnimationFrame handler is used rather than CSS scroll timelines because older iOS Safari doesn't support those.
- The stacked `.inner` needs `box-sizing: border-box`. It is the same `container-width` overflow as in the first round, which the flex layout had been hiding.
- Book card: gold `TwButton` "Pre-order the book" (the home page's label), then outline "Explore the framework →". Podcast card: primary "Listen to the podcast", then outline "Browse episodes →". External buttons open in a new tab. Each button grows to fill its row, so they stack full width on phones.
- The gold badge uses the `--tw-mythic-gold*` tokens, as the pre-order bar does. Its text wraps only on screens narrower than 360px, because forcing one line there widened the card past the screen.

---

## Follow-up: console errors, sticky hero, mobile footer

Owner feedback:

- Two dev console errors: the `inert` empty-string warning from `TwAppearancePanel`, and a hydration mismatch on the `<head>` scripts in `layout.tsx`.
- Mobile hero: keep the photo sticky and have the content scroll over it. Fade the photo into the page's normal background. Show the "Hi" card about a third of an inch higher above the fold.
- Footer is too long and messy on mobile: hide Work on mobile only, and give "More from" simpler link names, spaced evenly from the Social section.

### Notes

- `inert`: React 19 treats it as a boolean, so `inert={!open}`.
- Hydration: reproduced by stubbing `adsbygoogle.js` in Playwright with Google's behaviour (createElement, no `async` attribute, insertBefore the first `<script>`) and delaying the Next chunks so it runs before hydration. In `canHydrateInstance`, React 19 only skips a foreign head script that has an `async` attribute, so it paired the injected script with the theme script. The fix is `suppressHydrationWarning` on React's head `<script>`s (the theme script, three schemas, Consent Mode defaults and GTM). Two alternatives were rejected: moving the scripts into `<body>`, or loading AdSense after hydration. Both would change Consent Mode ordering and what AdSense's crawler sees. Verified with zero warnings with and without GTM.
- Sticky hero: in `scrollReveal` mode the `.media` is `position: sticky; top: var(--tw-nav-height)`. The hero switches to `overflow: clip`, because `hidden` makes it a scroll container and breaks sticky. The TwParallax transform is overridden, the photo fades to opacity 0, a mask dissolves its lower edge, and the hero background is `--tw-bg-page`. The card overlap went from 96px to 144px (about a third of an inch higher on a phone). Measured at 390x844: the photo holds at 76px from scroll 120 to 480 while the card rises from 536 to 176, and it is fully faded before the pin releases.
- Footer: Work uses the existing `mdOnly` class (hidden below 768px). Ecosystem labels are shortened at every width. On phones the list stacks, with a top hairline and `--tw-space-xl` / `--tw-space-l` spacing. The copyright loses its blockquote indent on phones.

---

## Follow-up: card position and truly sticky photo

Owner feedback: set `--tw-hero-overlap: 240px` in the `scrollReveal` block. The hero image still scrolls with the content; it should stay pinned while scrolling up and down, and come back into view when scrolling back up. The gradient and content placement are right.

### Notes

- Overlap set to 240px as specified.
- Measured rather than assumed. `html { scroll-behavior: smooth }` (effects.css) makes `scrollTo` animate, so the first measurements were mid-scroll; later tests use `behavior: 'instant'`. With clean numbers, sticky worked, but the pin only lasts while the hero is in view: it releases when the hero's bottom edge meets the photo's bottom edge. At tablet widths (820x1180) the card is short (421px against 627px on a phone), so the pin released at scroll 240 with the photo at 46% opacity, and the photo visibly scrolled away. The higher card made that earlier.
- Fix in `TwHeroScrollReveal`: the fade ends at the sooner of (a) the card's rise and (b) the pin release point (`heroTop + heroHeight - stickyTop - photoHeight`, read from the sticky child). Checked at 8 sizes from 360x740 to 1023x1366, in dev and the static export: the photo's opacity is 0.000 at every step after release, and back to 1 at the top.
- Not verified on WebKit: Playwright's WebKit download is blocked in the sandbox. Sticky and `overflow: clip` need Safari/iOS 16 or later. On older iOS the photo does not pin but still fades.

---

## Follow-up: footer link type, home hero card placement

Owner feedback:

1. On mobile the footer's "More from" links are not typography styled; they should be Merriweather and look like links.
2. The home page hero card should get the same mobile placement as `/about-me` (card below the photo so the face shows), without the parallax.

### Notes

- The "More from" links were plain `<a>` tags with no font set, so they fell back to `ui-sans-serif`. They are now `ThemedLink variant='small' isFooter`, the same as the Content/Work/Connect lists, and measure identically: Merriweather, 14px on phones and 16px on desktop, same colour and hover. `rel="me"` passes through. The stray `a` colour and hover rules in `.ecosystem` were removed, since ThemedLink's inline styles would override them anyway. This applies at all widths, because the fallback happened on desktop too.
- `TwHero` has a new `stackOnMobile` prop: the stacked layout only (photo stage, masked lower edge, card overlapping by `--tw-hero-overlap`, no parallax, photo scrolls normally). `scrollReveal` now adds the sticky pin and fade on top of it. The home page uses `stackOnMobile`. Home at 1440 and `/about` and the RCF page at 390 and 1440 are pixel-identical. `/about-me`'s pin test passes at all 8 sizes in dev and in the static export.
- Not changed: the home nav already overflows by 17px at 820px wide (the Newsletter button is clipped). The baseline measures the same.

---

## Follow-up: unit tests

Owner request: update and fix any applicable Jest unit tests as part of this work.

### Notes

- The repo has no Jest. The front end uses Vitest (`yarn test`; same describe/it/expect API) and `api/` uses `node --test`. Tests were written in Vitest rather than adding a second runner.
- Baseline: front end 26/26 passing. API 45/46: `subscribe returns 429...` asserted `warnings[0]`, but with `RECAPTCHA_SECRET_KEY` unset the handler logs "not configured" first. That is a stale test, not a handler bug (it returns 429 and logs the violation). The test now filters for the warning and asserts exactly one; it passes with and without the key.
- New: `scrollRevealProgress.ts` (pure fade math moved out of `TwHeroScrollReveal`, same behaviour; the browser pin check still passes at 8 sizes) with tests from real measurements. Also `TwHero.test.tsx`, `TwAppearancePanel.test.tsx`, `FooterContent.test.tsx`, `layout.test.tsx`, `about-me/page.test.tsx` and `HomePageClient.test.tsx`.
- Approach: render with `renderToStaticMarkup` in the Node environment (as the static export does), then parse with `jsdom` as a DOM parser only. Added `jsdom@^26` and `@types/jsdom@^21`; the latest jsdom needs a `bcp-47` version the registry lacks. The `vitest.config.ts` comment now describes this approach.
- `layout.test.tsx` mocks `./fonts` (next/font needs Next's compiler) and `./providers` (only used as an element type). A `beforeAll` with a 30s timeout does the one-time import, which otherwise timed out the first test under parallel load. Checked with 6 sequential full runs and 2 runs of two concurrent suites.
- Each test was checked by reintroducing its bug (old `inert`, the original footer, the fade ignoring the pin release, a head script without the flag, home without `stackOnMobile`, buttons back in the hero, a non-gold pre-order, scrollReveal without stacked). All 8 were caught. A console-warning test for `inert` was removed, because the server renderer never emits that warning so it could not fail.
- Not changed: Vite's "ESM syntax in a file loaded as CommonJS (vitest.config.ts)" notice was already there before this work.
