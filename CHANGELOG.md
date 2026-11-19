# Changelog

All notable changes to terencewaters.com are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the site uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Book a Conversation opens full screen (#278): the redesign's `BookingFlow` (the same three steps, the same `/api/leads` POST and prefilled TidyCal page) in a new `BookingModal` (a labelled modal dialog: focus kept inside and returned on close, Escape, the X or a tap outside closes it, the page behind is locked). `BookingModalProvider` is mounted once in `providers.tsx`; `<BookingTrigger />` and `useBookingModal()` open it, and the header's "Book a free consultation" button now does. The folder's README explains how to move it to another Fluxline app. Brought in from the redesign with it: `ConsultationStepper/lead.ts` and its updated stepper files, `content/site/booking.ts`, `contact.ts`, `copy.ts`, the shared style tokens and mixins it uses (`_mixins.scss`, `spacing.css`, `typography.css`, `effects.css`; new tokens and mixins, some used only by the later home and nav work), its tests and test harness, and the `/api/leads` test. Vitest renders links with trailing slashes, as the static export does.
- One site nav on every page (#281): About, The Book, Content (a dropdown on desktop, a drawer in the phone menu; the Content link itself still goes to the Content Hub) and Contact, with Display and Book a Conversation at the top and a thumb-reach Book a Conversation pill on phones. It replaces each page's own nav; /podcasts and /unsubscribe, still on the older layout, get it in a fixed slot, and only the internal /dsm-preview keeps the old header. Book a Conversation opens the full-screen booking dialog from the bar, the phone menu and the pill. Contact goes to the home page's contact section until /contact/ is rebuilt. A "Skip to content" link comes first on every page, and blog, portfolio and video detail pages get a back link.
- Text size in the Display panel (#281): 100%, 125% or 150%, applied before the page paints so it never flashes at 100% first.
- The rebuilt home page (#285), in the owner's order:
  - The hero photo stays pinned while the card scrolls up over it, as on /about-me, at full height (the sub-pages use the compact hero, #288). The hero card leads with Pre-order the book and Read my full story.
  - The book section: "MY RCF BOOK", "Because I hate self-help books." and the pre-order card.
  - The Shifts, introduced by the old About paragraphs and a "Structure. Clarity…" quote.
  - Humans FIRST, with drifting light traces behind it and glacier-cyan periods.
  - "What I stand for", now with a heading.
  - Design, architecture, and coaching.
  - The Content Hub: the three newest posts and episodes, with their cover art, and "See what I've been building".
  - Let's talk: Book a Conversation opens the booking dialog, beside the message form.
  - The closing quote.
- New design-system pieces from the redesign (#285): `TwHook`, `TwCredo` (with an `animated` option) and `TwShiftTrack`, with their copy in `content/site/home.ts`, `shifts.ts` and `microcopy.ts`.

- The rebuilt /about-me (#288), in the owner's order:
  - The compact pinned-photo hero, without the "I rejected the mission…" quote.
  - Five quick links on one row (gold icons; "Pre-order my book!" highlighted). They stack on phones, and Book a Conversation opens the booking dialog.
  - In 60 seconds ("Three roles, one system"): the blurb and quick facts, then the role cards (Founder, Host, 20+ years, shortened) and the numbers.
  - The user copy's book and podcast cards, "Everything I'm making", and "Some of the work".
  - Off the page: the latest Instagram posts in a lead-plus-four layout.
  - What I bring to the table, with the owner's new paragraph under "I still build".
  - Find me online, and Want to go deeper?
  - Recent writing is gone.
- A second In 60 seconds paragraph on /about-me (#291), the owner's own wording: helping individuals, solopreneurs, and small- to medium-sized businesses find their _why_, so their decisions _land_, and **_Structure the Shift_**.
- The Instagram feed behind Off the page (#288, from the Instagram build):
  - An `/api/instagram` Azure Function. It reads NoCodeAPI through `INSTAGRAM_FEED_URL`, caches the result, and maps a timeout to 504.
  - `src/lib/instagram.ts`, which normalises the feed and backfills posts whose image fails.
  - The `InstagramGrid` component, with a new `feature` layout.
  - A Faker mock mode for DEV/TEST builds (`NEXT_PUBLIC_INSTAGRAM_MOCK`). A postbuild check fails any production build that contains Faker.
  - The setup guide is `docs/instagram/INSTAGRAM_README.md`.
- `TwMeter`/`TwMeterGroup` and the Content Hub tile copy (`content/site/contentHub.ts`) from the redesign (#288).

- The rebuilt /about (#294), from the redesign with the owner's changes:
  - Nine numbered sections, each with a gold number, a one-word category and a title.
  - The hero's two sentences on separate lines.
  - The short version as one paragraph.
  - The Shifts in depth.
  - Learning to play by feel, without the "back seat" line, and The body as its own section with the owner's personal-training photo.
  - What I stand for, with the combined needs sentence and without "Accepting people…".
  - How I work, led by a gold "Humans First. AI Second." callout, with the pull quote on two lines and glowing approach cards.
  - I still build and what I do now; experience.
  - Skills, degrees, and certifications in the previous design at full width.
  - The closing band, whose Book a Conversation opens the booking dialog.
  - Motifs throughout: the ripple, the sound wave, gold rules, and slow gold light traces.
- `TwRipple`, `TwWave` and `TwAside`, plus the /about and services copy (`content/site/about.ts`, `services.ts`), from the redesign (#294).

- /contact (#295), as in the redesign: "Let's talk" with a jump list, Book a Conversation, Send a message (the contact form), Get new writing in your inbox (the newsletter form) and Find me online. Book a Conversation, in the jump list and in its section, opens the same full-screen booking dialog as the rest of the site. Without JavaScript the section offers TidyCal directly. Brought in from the redesign with it: `ContactForm`, `NewsletterForm`, `TwLinkStack` (now with an optional click handler), `lib/formErrors.ts` and the updated `contactValidation.ts`.

### Changed

- The nav's Contact link, the footer's Contact and Newsletter links, the blog's newsletter button, /about's "Send a message" and the booking flow's "send me a message instead" now go to /contact (#295) instead of the home page's sections. The footer keeps its #newsletter anchor on Home only, so /contact has one.
- Home's Let's talk band uses the same `ContactForm` as /contact (#295), replacing `HomeContactForm`. One set of rules: a name of 2+ characters, inline field errors, a clear message when the network or rate limit fails. /contact is in the sitemap.
- The footer (#285): the newsletter signup is its own larger block at the top, in the heading font, and shows on phones too (it is the `/#newsletter` target). "Case Studies" is gone from the links. On phones the tagline is hidden and the "More from" links wrap, so the footer is shorter.
- Every Book a Conversation opener on the home page uses the booking dialog (#285), including the Fractional service drawer. The direct TidyCal links are gone.
- Book pre-orders are announced on the site (#285): `RCF_PREORDERS_OPEN` is on, so the site-wide pre-order bar, the home callout, the /about-me badge and button, the /about sentence, the book page's pre-order row and button, the footer link, the content hub note and the book's structured data are back. The "Building a Book the Way I Build Systems" post and `llms.txt` say pre-orders are open again (restoring what #273 removed).
- The home page follows the chosen theme from the first paint (#281): the pre-paint script no longer forces it dark, which had caused a dark-to-light flash for light-mode visitors.
- The Ko-fi "Tip Me" button is hidden while the booking dialog is open (#281); on phones it sat on top of the dialog.

### Removed

- The /about numbered image-rail layout (`AboutSection`), its stats row, audience trio and role chips, replaced by the redesign's sections (#294).
- Home sections the owner dropped (#285): the separate About ("Hi! I'm Terence"), Portfolio, and the large "Get new writing" band. Also removed: the content filter chips and their client fetches, and `HomeNewsletterForm`.
- The per-page navs (`TwPageNav`, the home page's `HomeNav`, the blog and portfolio link lists) and the old Book a Conversation pop-up (`ConsultationStepper` and its step components), all replaced by the site nav and the booking dialog (#281). The stepper's data and helpers stay; the booking dialog uses them.

### Fixed

- Nav background in the protanopia, deuteranopia, tritanopia and grayscale modes (#278, from the redesign's `effects.css`): those light-family palettes inherited the dark nav colour, so the nav text was unreadable; each now uses its own page colour.
- Booking failure link (#278): "send me a message instead" in the old stepper had been changed to a `/contact/` page that does not exist yet; it and the new flow go to the home page's contact section (`MESSAGE_FALLBACK_HREF`).

## [2.3.0] - 2026-11-18

**The rebuilt `/about-me` page, newsletter bot protection, and the Fluxline
revamp alignment.** This release ships the one-page `/about-me` landing page
("Terence in 60 seconds"), reCAPTCHA v3 on newsletter sign-up, copy and links
aligned with the fluxline.pro revamp, the corrected "Building a Book the Way I
Build Systems" post, Google Tag Manager, and a set of fixes, including the
booking form's Privacy Policy link.

The book pre-order elements built in this cycle (the site-wide bar, the home
callout, the gold buttons and the footer link) ship **turned off**: one switch,
`RCF_PREORDERS_OPEN` in `src/lib/rcf.ts`, hides them until pre-orders are
announced on this site (#273). Nothing on the site says pre-orders are open.

Notes for the release:

- Tag after the merge to `master`: `v2_3_0.PROD`.
- To announce pre-orders later, set `RCF_PREORDERS_OPEN` to `true` and, in the
  same change, restore the pre-order lines in the blog post "Building a Book
  the Way I Build Systems" and in `public/llms.txt` (see the comment in
  `src/lib/rcf.ts`). If the store's release window moves, update
  `RCF_EXPECTED_RELEASE` there too.
- Newsletter sign-up now verifies reCAPTCHA v3 on the server. The site key is
  in the PROD workflow and `RECAPTCHA_SECRET_KEY` is set in the PROD Static Web
  App (confirmed 2026-11-16). Without it the endpoint logs "not configured" and
  accepts sign-ups unverified (still rate limited).
- The PROD warm-up ping now runs every four hours instead of every 15 minutes,
  so the first API call after a quiet spell can be slower.
- No content-only shortcut applies here: this release carries code, so it
  needs the tag and the version bump above.

### Fixed

- Body margin reset (#262): `body { margin: 0 }` in `tw-prose.css`, so the browser's default 8px margin no longer shows around full-bleed pages.
- Newsletter reCAPTCHA hardening: `useRecaptchaToken` returns immediately when no site key is configured (the form posts without a token, as the contact form does) instead of polling for 10 seconds and then blocking every sign-up with a false "spam protection didn't load" error. `/api/subscribe` also checks the reCAPTCHA action (`newsletter_subscribe`), so a token minted for another form on the same site key can't be replayed against it.
- Book a consultation: the consent line's Privacy Policy link pointed to `/legal/privacy-policy`, which terencewaters.com doesn't have, so it opened the 404 page. It now opens the Privacy Policy on fluxline.pro in a new tab (#270).
- Code-review follow-ups on `/about-me` and the shared pieces it touches. `TwHero`'s `stackOnMobile` and `scrollReveal` now apply only when a `backgroundImage` is set, since the stacked layout pulls the card up over the photo and would otherwise drag it over the content above the hero. The photo stage height now has a `vh` fallback for browsers without `svh` (iOS before 15.4). The footer's "More from" links use the shared `TRI_URL`, `RCF_PREORDER_HREF` and `FLUXLINE_URL` constants, so two of them lose their trailing slash. Writing-card meta goes through `formatPostMeta()`, so a missing date no longer leaves a stray " · " or an empty `dateTime`. The arrows in the "Explore the framework" and "Browse episodes" buttons are hidden from screen readers. The Resonant Identity icon is a 192px copy (7 KB) instead of the 1024px original (271 KB) in the footer and on `/about-me`. Stale comments corrected, and one test no longer hard-codes a skill score.
- The podcast card on `/about-me` has three short facts under its blurb, like the book card, so it no longer leaves an empty gap on desktop. They reuse the podcast page's own wording (`PODCAST_FACTS`).
- API test `subscribe returns 429 and logs when the IP exceeds the limit` failed whenever `RECAPTCHA_SECRET_KEY` was unset. The handler logs "not configured" on each allowed request, so the rate-limit warning was no longer `warnings[0]`. The test now finds that warning wherever it falls and asserts there is exactly one. The handler is unchanged. API suite: 46/46.
- Console errors in development: `TwAppearancePanel` passed `inert=""`, which React 19 reads as false and warns about; it now passes a real boolean. A hydration mismatch in the root `<head>` happened because Google's loaders (AdSense, and GTM when enabled) insert a script, with no `async` attribute, before the first `<script>`, often before React hydrates. React then paired it with the theme script and shifted every head script by one. React's head scripts now carry `suppressHydrationWarning`, with the cause documented in `layout.tsx`. Load order, which Consent Mode depends on, is unchanged.

### Security

- Newsletter sign-up (`/api/subscribe`): bot submissions were reaching the SharePoint distribution list unfiltered — the endpoint had no bot check at all, only a loose email-format regex. Added reCAPTCHA v3 verification (success + score, matching `/api/contact`'s existing check via the shared `httpClient`). `ReCaptchaProvider` moves from scoped-to-the-homepage-contact-section to global in `providers.tsx`, since the newsletter forms it now protects (home, footer, drawer) render sitewide, not just on the homepage — the reCAPTCHA script now loads on every page rather than only when a visitor scrolls to Contact. New shared `useRecaptchaToken` hook (waits for the async script, up to 10s) used by all three forms.

### Changed

- Book pre-order content hidden until pre-orders are announced on this site (#273): one switch, `RCF_PREORDERS_OPEN` in `src/lib/rcf.ts` (off), hides the site-wide pre-order bar, the home callout (the book section keeps "Release is targeted for Q1 2027."), the /about-me badge and button, the /about sentence, the /resonance-core-framework buttons, "Pre-orders" row and description (the hero leads with "Be notified at launch" again), the footer link, the content hub note and the book's structured data. The blog post "Building a Book the Way I Build Systems" and `llms.txt` no longer claim pre-orders are open, and the post's November 20 note is removed.
- `/about-me` rebuilt as a one-page, link-in-bio landing page ("Terence in 60 seconds"): a hero callout with no buttons (Podcaster · Systems Architect · Business Consultant, author of The Resonance Core Framework™), three role cards, stat cards, the book and The Resonant Identity podcast side by side (with listen-on icons and the podcast link), eight talent bars scored out of 100 (scores read from `aboutSkills.ts`, so they match `/about`), three portfolio projects and the three latest blog posts (both loaded from the content system at build time), and at the bottom the actions that used to sit in the hero: Read my full story (`/about`), Get in touch, and The Resonance Core Framework™ page, then email / booking / contact-form tiles and a row of social icons. All copy comes from content already in the repo. Responsive from 320px up; works in every theme mode. New `aboutMeData.test.ts` catches a renamed skill, a missing project slug, or a missing icon file.
- `/about-me` refinements: on phones and portrait tablets the hero no longer covers the photo. The face shows first, the copy card peeks in below it, and as the visitor scrolls the card rises into view while the photo fades and eases forward. It is still under reduced motion. The book and podcast cards end in buttons, following the home page's order (strong button first, outline second): a Mythic Gold "Pre-order the book" and "Explore the framework", then "Listen to the podcast" and "Browse episodes". The book card also carries a gold "Pre-orders open" badge styled like the top pre-order bar. (Badge and pre-order button hidden before release, #273.)
- `TwHero` has an opt-in `scrollReveal` prop (new `TwHeroScrollReveal` client component) for the layout above. It applies below tablet width, drives only opacity and transform from one requestAnimationFrame scroll handler, and does nothing under reduced motion. Pages that don't set it render exactly as before.
- `/about-me` hero on phones and portrait tablets: the photo is now pinned (sticky) under the nav while the copy card scrolls up over it, and the photo fades out into the page background instead of the hero gradient. The card sits 48px higher above the fold at rest. Parallax drift is off while the photo is pinned. `TwHero`'s `scrollReveal` mode only; other heroes are unchanged.
- `/about-me` hero, sticky photo: the card starts higher (`--tw-hero-overlap` 240px). The photo's fade now always finishes by the moment the pin releases. On wider screens the card is short, so the hero ended early and the pinned photo used to scroll away while still about half visible. It is now never seen moving, and scrolling back up re-pins it and fades it back in.
- Home page hero on phones and portrait tablets: the card now sits below the photo, as on `/about-me`, so the face shows first. The photo fades into the page at its lower edge and scrolls normally, with no pin, fade or parallax. It uses a new opt-in `TwHero` `stackOnMobile` prop, and `scrollReveal` now builds on the same stacked layout. Desktop is unchanged.
- Footer "More from Terence Waters" links now use `ThemedLink`, like the other footer link lists (Merriweather, footer colours and hover), instead of falling back to the system sans-serif. `rel="me"` is kept.
- Footer, site-wide: on phones the Work column is hidden (footer height 857px to 681px at 390px wide), the "More from Terence Waters" links have shorter names (The Resonant Identity, Pre-order the Book, Fluxline Resonance Group) and on phones stack below a hairline, spaced evenly from the Social icons, and the copyright no longer carries the blockquote indent. (The "Pre-order the Book" link is hidden before release, #273.)
- PROD warm-up ping (#256): the scheduled `/api/ping` call runs every four hours instead of every 15 minutes (`.github/workflows/ping-warmup.yml`). At that interval the ping no longer keeps the Functions host warm.
- "Building a Book the Way I Build Systems" corrected (#252): the post, its summary, and its FAQ no longer say pre-orders open in early November 2026 or that the book has four parts. They say pre-orders are open on the Fluxline Store, link to the store's book page, and give three parts. The post carries a dated update note. (Pre-order wording and the update note removed before release, #273.)
- Aligned with the fluxline.pro revamp (#235), copy and links only. Book pre-orders are now described as open, with a "Pre-order" call to action to the Fluxline Store (`store.fluxline.pro/book`) on the home page (the announcement card, #238), `/resonance-core-framework`, the footer, and `llms.txt`; "Be notified at launch" stays as the secondary link on `/resonance-core-framework`; the home page no longer shows it (see #262 below). The DII summary uses the approved gloss instead of a score range, and the book is described as three parts (The Self, The Outward Reach, Systemic Architecture & Legacy). The five services use their exact names (home cards, consultation stepper) and link to their fluxline.pro pages. The home Work intro says in first person what Fluxline does. Fluxline links use `https://www.fluxline.pro`, and the Organization schema is named "Fluxline Resonance Group, LLC" (display name as `alternateName`). (Pre-order wording hidden again before release, #273.)
- UI and wording pass (#262): the home book section drops its "Be notified at launch" button (the pre-order button is the one call to action there) and reads "Listen to the TRI Podcast →"; the home hero line now says "who writes and talks about resonance, identity, and…". The pre-order bar reads "Pre-order for my book is now open!" with a "Go to My Store →" link. `TRI_URL` points at `theresonantidentity.com/start-here`, and the separate framework link is removed in favour of it, so "Hear the framework on the podcast →" and the other podcast links go to the same page. The home pre-order callout card is no longer capped at `60ch` wide. (Pre-order bar and button hidden before release, #273.)
- Reddit is removed as a contact and social option (#262): it is no longer in the social row, the social icons, or `SOCIAL_URLS`.
- Home page (#246): the contact section no longer shows the email address as text; an Email icon leads the social row and links to it. The hero quote loses its em dashes ("...systems that make your life and work feel like they finally fit.").

### Added

- `--tw-mythic-gold-bg` token (#255): the pre-order bar's faint gold background tint, defined in all eight theme modes and the accessibility layer (aliased to `--tw-gold-bg` where the mode already aliases Mythic Gold to the base gold).
- Unit tests (Vitest) for this work, 26 to 68 front-end tests: `/about-me` page requirements (no hero buttons, actions at the bottom, gold pre-order first, talent bars match `/about`, curated projects, latest posts, social icons), `TwHero` mobile modes, the scroll-reveal fade (extracted to a pure `scrollRevealProgress.ts`, including the tablet pin-release regression), the footer's short labels, `rel="me"` and styling, Work hidden on phones, the appearance panel's `inert`, the home hero's stacked layout, and `suppressHydrationWarning` on every head script (with and without GTM) without changing load order. Component tests server-render in Node and parse with `jsdom` (new dev dependency, with `@types/jsdom`), used only as a parser.
- Site-wide pre-order bar (#249): a slim bar at the top of every page reads "Pre-order for my book is now open!" (reworded in #262), gives the expected release (late February to mid-March 2027, subject to change, the store's wording), and links to the book's page on the Fluxline Store ("Go to My Store"). Transparent, with Mythic Gold label, link and bottom rule; it wraps to a few centred lines on a phone. Pages still on the legacy header show it directly under that header. (Off in this release, #273.)
- Book pre-order announcement (#238, #241) on the home page, inside the book (Resonance Core Framework) section: a Mythic Gold callout with a label, heading, launch line, and the page's one "Pre-order the book" button to the Fluxline Store. The section's other links stay outline. New `--tw-mythic-gold`, `--tw-mythic-gold-ink`, and `--tw-mythic-gold-text` tokens follow each theme (the accessibility themes use that theme's own gold). No link to the fluxline.pro pricing page, which is not live yet. (Off in this release, #273.)
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
