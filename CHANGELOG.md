# Changelog

All notable changes to terencewaters.com are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the site uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Aligned with the fluxline.pro revamp (#235), copy and links only. Book pre-orders are now described as open, with a "Pre-order" call to action to the Fluxline Store (`store.fluxline.pro/book`) on the home page (the announcement card, #238), `/resonance-core-framework`, the footer, and `llms.txt`; "Be notified at launch" stays as the secondary link. The DII summary uses the approved gloss instead of a score range, and the book is described as three parts (The Self, The Outward Reach, Systemic Architecture & Legacy). The five services use their exact names (home cards, consultation stepper) and link to their fluxline.pro pages. The home Work intro says in first person what Fluxline does. Fluxline links use `https://www.fluxline.pro`, and the Organization schema is named "Fluxline Resonance Group, LLC" (display name as `alternateName`).

- Home page (#246): the contact section no longer shows the email address as text; an Email icon leads the social row and links to it. The hero quote loses its em dashes ("...systems that make your life and work feel like they finally fit.").

### Added

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
