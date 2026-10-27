# Changelog

All notable changes to terencewaters.com are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the site uses
[Semantic Versioning](https://semver.org/).

## [2.1.0] - Unreleased

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

[2.1.0]: https://github.com/AplUSAndmINUS/tw-com-nextjs/compare/master...test
