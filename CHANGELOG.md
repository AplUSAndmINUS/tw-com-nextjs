# Changelog

All notable changes to terencewaters.com are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the site uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- Book a consultation: the consent line's Privacy Policy link pointed to `/legal/privacy-policy`, which terencewaters.com doesn't have, so it opened the 404 page. It now opens the Privacy Policy on fluxline.pro in a new tab (#270).
- Code-review follow-ups on `/about-me` and the shared pieces it touches. `TwHero`'s `stackOnMobile` and `scrollReveal` now apply only when a `backgroundImage` is set, since the stacked layout pulls the card up over the photo and would otherwise drag it over the content above the hero. The photo stage height now has a `vh` fallback for browsers without `svh` (iOS before 15.4). The footer's "More from" links use the shared `TRI_URL`, `RCF_PREORDER_HREF` and `FLUXLINE_URL` constants, so two of them lose their trailing slash. Writing-card meta goes through `formatPostMeta()`, so a missing date no longer leaves a stray " · " or an empty `dateTime`. The arrows in the "Explore the framework" and "Browse episodes" buttons are hidden from screen readers. The Resonant Identity icon is a 192px copy (7 KB) instead of the 1024px original (271 KB) in the footer and on `/about-me`. Stale comments corrected, and one test no longer hard-codes a skill score.
- The podcast card on `/about-me` has three short facts under its blurb, like the book card, so it no longer leaves an empty gap on desktop. They reuse the podcast page's own wording (`PODCAST_FACTS`).
- API test `subscribe returns 429 and logs when the IP exceeds the limit` failed whenever `RECAPTCHA_SECRET_KEY` was unset. The handler logs "not configured" on each allowed request, so the rate-limit warning was no longer `warnings[0]`. The test now finds that warning wherever it falls and asserts there is exactly one. The handler is unchanged. API suite: 46/46.
- Console errors in development: `TwAppearancePanel` passed `inert=""`, which React 19 reads as false and warns about; it now passes a real boolean. A hydration mismatch in the root `<head>` happened because Google's loaders (AdSense, and GTM when enabled) insert a script, with no `async` attribute, before the first `<script>`, often before React hydrates. React then paired it with the theme script and shifted every head script by one. React's head scripts now carry `suppressHydrationWarning`, with the cause documented in `layout.tsx`. Load order, which Consent Mode depends on, is unchanged.

### Security

- Newsletter sign-up (`/api/subscribe`): bot submissions were reaching the SharePoint distribution list unfiltered — the endpoint had no bot check at all, only a loose email-format regex. Added reCAPTCHA v3 verification (success + score, matching `/api/contact`'s existing check via the shared `httpClient`). `ReCaptchaProvider` moves from scoped-to-the-homepage-contact-section to global in `providers.tsx`, since the newsletter forms it now protects (home, footer, drawer) render sitewide, not just on the homepage — the reCAPTCHA script now loads on every page rather than only when a visitor scrolls to Contact. New shared `useRecaptchaToken` hook (waits for the async script, up to 10s) used by all three forms.

### Changed

- `/about-me` rebuilt as a one-page, link-in-bio landing page ("Terence in 60 seconds"): a hero callout with no buttons (Podcaster · Systems Architect · Business Consultant, author of The Resonance Core Framework™), three role cards, stat cards, the book and The Resonant Identity podcast side by side (with listen-on icons and the podcast link), eight talent bars scored out of 100 (scores read from `aboutSkills.ts`, so they match `/about`), three portfolio projects and the three latest blog posts (both loaded from the content system at build time), and at the bottom the actions that used to sit in the hero: Read my full story (`/about`), Get in touch, and The Resonance Core Framework™ page, then email / booking / contact-form tiles and a row of social icons. All copy comes from content already in the repo. Responsive from 320px up; works in every theme mode. New `aboutMeData.test.ts` catches a renamed skill, a missing project slug, or a missing icon file.
- `/about-me` refinements: on phones and portrait tablets the hero no longer covers the photo. The face shows first, the copy card peeks in below it, and as the visitor scrolls the card rises into view while the photo fades and eases forward. It is still under reduced motion. The book and podcast cards end in buttons, following the home page's order (strong button first, outline second): a Mythic Gold "Pre-order the book" and "Explore the framework", then "Listen to the podcast" and "Browse episodes". The book card also carries a gold "Pre-orders open" badge styled like the top pre-order bar.
- `TwHero` has an opt-in `scrollReveal` prop (new `TwHeroScrollReveal` client component) for the layout above. It applies below tablet width, drives only opacity and transform from one requestAnimationFrame scroll handler, and does nothing under reduced motion. Pages that don't set it render exactly as before.
- `/about-me` hero on phones and portrait tablets: the photo is now pinned (sticky) under the nav while the copy card scrolls up over it, and the photo fades out into the page background instead of the hero gradient. The card sits 48px higher above the fold at rest. Parallax drift is off while the photo is pinned. `TwHero`'s `scrollReveal` mode only; other heroes are unchanged.
- `/about-me` hero, sticky photo: the card starts higher (`--tw-hero-overlap` 240px). The photo's fade now always finishes by the moment the pin releases. On wider screens the card is short, so the hero ended early and the pinned photo used to scroll away while still about half visible. It is now never seen moving, and scrolling back up re-pins it and fades it back in.
- Home page hero on phones and portrait tablets: the card now sits below the photo, as on `/about-me`, so the face shows first. The photo fades into the page at its lower edge and scrolls normally, with no pin, fade or parallax. It uses a new opt-in `TwHero` `stackOnMobile` prop, and `scrollReveal` now builds on the same stacked layout. Desktop is unchanged.
- Footer "More from Terence Waters" links now use `ThemedLink`, like the other footer link lists (Merriweather, footer colours and hover), instead of falling back to the system sans-serif. `rel="me"` is kept.
- Footer, site-wide: on phones the Work column is hidden (footer height 857px to 681px at 390px wide), the "More from Terence Waters" links have shorter names (The Resonant Identity, Pre-order the Book, Fluxline Resonance Group) and on phones stack below a hairline, spaced evenly from the Social icons, and the copyright no longer carries the blockquote indent.
- PROD warm-up ping (#256): the scheduled `/api/ping` call runs every four hours instead of every 15 minutes (`.github/workflows/ping-warmup.yml`). At that interval the ping no longer keeps the Functions host warm.
- "Building a Book the Way I Build Systems" corrected (#252): the post, its summary, and its FAQ no longer say pre-orders open in early November 2026 or that the book has four parts. They say pre-orders are open on the Fluxline Store, link to the store's book page, and give three parts. The post carries a dated update note.
- Aligned with the fluxline.pro revamp (#235), copy and links only. Book pre-orders are now described as open, with a "Pre-order" call to action to the Fluxline Store (`store.fluxline.pro/book`) on the home page (the announcement card, #238), `/resonance-core-framework`, the footer, and `llms.txt`; "Be notified at launch" stays as the secondary link. The DII summary uses the approved gloss instead of a score range, and the book is described as three parts (The Self, The Outward Reach, Systemic Architecture & Legacy). The five services use their exact names (home cards, consultation stepper) and link to their fluxline.pro pages. The home Work intro says in first person what Fluxline does. Fluxline links use `https://www.fluxline.pro`, and the Organization schema is named "Fluxline Resonance Group, LLC" (display name as `alternateName`).

- Home page (#246): the contact section no longer shows the email address as text; an Email icon leads the social row and links to it. The hero quote loses its em dashes ("...systems that make your life and work feel like they finally fit.").

### Added

- Unit tests (Vitest) for this work, 26 to 68 front-end tests: `/about-me` page requirements (no hero buttons, actions at the bottom, gold pre-order first, talent bars match `/about`, curated projects, latest posts, social icons), `TwHero` mobile modes, the scroll-reveal fade (extracted to a pure `scrollRevealProgress.ts`, including the tablet pin-release regression), the footer's short labels, `rel="me"` and styling, Work hidden on phones, the appearance panel's `inert`, the home hero's stacked layout, and `suppressHydrationWarning` on every head script (with and without GTM) without changing load order. Component tests server-render in Node and parse with `jsdom` (new dev dependency, with `@types/jsdom`), used only as a parser.
- Site-wide pre-order bar (#249): a slim bar at the top of every page reads "Pre-order for the RCF book now open", gives the expected release (late February to mid-March 2027, subject to change, the store's wording), and links to the book's page on the Fluxline Store. Transparent, with Mythic Gold label, link and bottom rule; it wraps to a few centred lines on a phone. Pages still on the legacy header show it directly under that header.
- Book pre-order announcement (#238, #241) on the home page, inside the book (Resonance Core Framework) section: a Mythic Gold callout with a label, heading, launch line, and the page's one "Pre-order the book" button to the Fluxline Store. The section's other links stay outline. New `--tw-mythic-gold`, `--tw-mythic-gold-ink`, and `--tw-mythic-gold-text` tokens follow each theme (the accessibility themes use that theme's own gold). No link to the fluxline.pro pricing page, which is not live yet.
- `TwButton` has a `gold` variant (#241) built on those tokens, and `TwHero` call-to-action entries can name a variant. The pre-order buttons on `/resonance-core-framework` (hero and book section) use it in place of the standard accent.
- Google Tag Manager (`GTM-P3QP35V2`): the standard container snippet loads in `<head>` right after the existing Consent Mode v2 defaults, with the `<noscript>` fallback iframe as the first element in `<body>`, per Google's documented install. Gated by `NEXT_PUBLIC_GTM_ID` (empty disables it, same pattern as `NEXT_PUBLIC_GA_MEASUREMENT_ID`).

## [2.2.0] - 2026-11-02

### Changed

- SEO and AI-crawler pass: `robots.txt` names the major search and AI crawlers
  in one allow group and no longer blocks `/_next/` or `/static/`, so search
  engines can render pages. `llms.txt` gains a site summary, a Key terms
  glossary, questions the site answers, and the missing main pages. Focused
  `keywords` on the root layout, home, About, RCF, Blog and Podcasts pages;
  wider `knowsAbout` on the Person schema; `keywords` on the WebSite and Book
  schemas; and a `DefinedTermSet` of the RCF core concepts on
  `/resonance-core-framework`.
- On-page search phrases: specific titles (about 50 to 60 characters) and
  meta descriptions (about 140 to 160) on home, About, RCF, Blog, Portfolio,
  Podcasts, The Resonant Identity, Videos, Content Hub and GitHub, mirrored
  into Open Graph and Twitter. They target phrases about Terence himself
  (author, systems architect, identity coach in Salt Lake City); service
  phrases stay with fluxline.pro. Blog and portfolio posts use their
  `seoDescription` for Open Graph too, and a `seoTitle` ending in
  "| Terence Waters" no longer prints the brand twice. A clearer site-wide
  default description, a lightly extended Blog lede, descriptive alt on the
  home and About portraits, and the About "See the services" link now goes
  straight to the services on fluxline.pro.
- Shorter search titles (about 50 to 60 characters with the brand) and meta
  descriptions (120 to 160) on 20 blog posts and 7 portfolio entries, via
  `seoTitle` / `seoDescription` frontmatter only; visible titles and excerpts
  are unchanged.

## [2.1.1] - 2026-10-28

### Added

- `docs/RECAPTCHA-SETUP.md`: reCAPTCHA setup notes (docs only, already on test).

### Changed

- Retired the GitHub Copilot instructions file; project guidance now lives in `CLAUDE.md` (#219). Tag: `v2_1_1.PROD`.

## [2.1.0] - 2026-10-27

The release after the v2.0 site launch: a voice and congruence pass across
copy, the book-launch updates, a site-wide UI pass, and a new blog post.

### Added

- Blog post "Building a Book the Way I Build Systems", with links to the
  Fluxline case study and the `Fluxline-pro/rcf-pipeline` repository, key
  insights and FAQ in structured data, and the Responsible AI disclosure.
- Page transitions on every page: the current page fades out on an in-app link
  click, the next page fades in, and sections rise in as they scroll into view.
  Opt out per link with `data-no-route-transition`.
- Twitch, TikTok and Reddit links alongside the other social profiles.
- `.github/rcf-voice-core.md` and `.github/prompts/terencewaters-com.prompt.md`:
  the shared voice rules and owner decisions for copy across the three sites.

### Changed

- **Book:** The Resonance Core Framework™ is targeted for Q1 2027, with
  preorders opening in early November 2026, everywhere the date appears
  (home, About, `/resonance-core-framework`, JSON-LD, `llms.txt`, posts).
- **Launch sign-up:** "Be notified at launch" links go to the sign-up on
  fluxline.pro's RCF page (`#notify`).
- **Framework terms:** the Judgment Loop and Data Loop; the DRIVE Model, with
  DRIVE spelled out at first use; Embodiment as the sixth DRIVE stage;
  Behavioral Gravity uses the book's meaning (including a revised blog post).
- **The Decision Integrity Index:** written "The Decision Integrity Index
  (The DII)" at first use, then "The DII", across pages, metadata and posts.
  "DII Protocol" is retired; the `/blog/dii-protocol` URL is unchanged.
- **Creative Truth:** listed as a Core Value only, no longer as a framework
  concept.
- **DRIVE artwork:** a new DRIVE Model wheel and a new Embodiment step image,
  renamed `drive_model.jpg` and `embodiment_step.jpg`.
- **About and home:** experience reads 20+ years; the Work list uses
  Fluxline's five offering names (Fractional Leadership and Design Facilitation
  removed); the PhD is listed as National University; companies founded or led
  reads 2; the author title is "author, architect, and solopreneur".
- **Consultation CTAs:** every button reads "Book a free consultation".
- **Home RCF section:** shorter, with the date and preorder line in a quote.
- **`/resonance-core-framework` book facts:** a fixed three-column grid; the
  summary reads "31 chapters and Three Mystic Phases".
- **Cards:** cards in a row now match heights (home, About, the RCF page, 404).
- **Footer:** "More from Terence Waters" is two links, The Resonant Identity
  Podcast and Fluxline Resonance Group — Coaching & Consulting.
- **TEST deploys:** pull requests no longer create preview environments on
  TEST; the workflow deploys on push to `test` or a manual run on `test`.
- Dependencies: next 16.3.3 → 16.4.1, vite 8.3.1 → 8.3.5, source-map-js
  1.2.1 → 1.2.2.

### Fixed

- Social icons that linked to `#`.
- Visitors who turned motion off with the site's own toggle no longer see the
  first-load fade.
- Pressing back or forward during a page fade no longer jumps to the link that
  was clicked.
- Printing a long page no longer leaves not-yet-scrolled sections blank.
- The Book JSON-LD no longer claims a publication date for an unreleased book.

## [2.0.0]

The v2.0 site: the DSM design system rebuild of the home, About, Content Hub
and `/resonance-core-framework` pages, with the podcast and video cards and the
Case Studies button fixes (issue #181). Released to `master` without a tag.

[2.2.0]: https://github.com/AplUSAndmINUS/tw-com-nextjs/compare/v2_1_1.PROD...v2_2_0.PROD
[2.1.0]: https://github.com/AplUSAndmINUS/tw-com-nextjs/releases/tag/v2.1.0
