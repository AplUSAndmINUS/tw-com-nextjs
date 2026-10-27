---
mode: agent
description: TerenceWaters.com voice and congruence pass (copy and links only). Applies the owner's decisions, holds the open items, opens a PR to develop.
---

# terencewaters.com: voice and congruence pass

Repo: `AplUSAndmINUS/tw-com-nextjs`. Find where each string lives (component, MDX, JSON, CMS fixture). If a string lives only in a live system and not in the repo, **do not guess**: list it under "Questions for the owner" with the exact current text and the replacement.

First read [rcf-voice-core.md](../rcf-voice-core.md). Its rules, decisions, glosses and PR standards apply to everything below.

Register: warm, first person, a little funny. Keep it. Do not make it sound like Fluxline.

## Apply

**A1. Experience (four places, exact replacements)**

- Home stat "15+ / Years bridging tech & design" becomes "20+ / Years in design, development, architecture & product management".
- About header "Founder, architect, and coach. Fifteen years turning complexity into something people can actually live and work inside." becomes "Author, architect, and solopreneur. Twenty years turning complexity into something people can actually live and work inside." (author title per owner, 2026-10-19)
- About bio sentence "For 15+ years I have worked across IT architecture, full-stack development, brand identity, curriculum design, and personal transformation." becomes "For 20+ years I have worked across design, development, architecture, and product management, and I have been consulting for 3+ years." Keep the sentences around it.
- About stat "15+ / Years bridging tech & design" gets the same label as the home stat.
- Do not touch the 2008 to present timeline, degrees or certifications.

**A2. Book date.** Replace "Late Fall 2026" with the targeted-Q1-2027 wording on home (book heading), `/resonance-core-framework/` (hero line, section eyebrow "Coming Late Fall 2026", the details-table row "Publication: Late Fall 2026", meta description), About, and all metadata, JSON-LD and `llms.txt`.

**A3. "Be notified at launch."** Both "Be notified at launch" / "Be Notified at Launch →" CTAs (home and `/resonance-core-framework/`) now link to `https://fluxline.pro/resonance-core-framework/#notify` (owner, 2026-10-19), not `/contact`. Leave the footer newsletter signup exactly as it is.

**A4. Framework page terms (`/resonance-core-framework/`)**

- Rename the two loops (core decision 6), using the core glosses.
- Rewrite Behavioral Gravity to the approved gloss. Check the "More info →" anchors and any teaser text on home. **Do not edit the blog post "Behavioral Gravity: The Pull You Don't Notice"** (published 2026-09-23); see Hold 1.
- Replace "The DRIVE System" with "The DRIVE Model". Expand DRIVE at first use.
- Expand SSI, EROI and SI once in the DAS gloss, or drop them from it.
- Define Overview terms where they first appear, or move the one-line glosses up so no concept is named before it is explained.

**A5. Marks.** Add ™ to "The Resonance Core Framework" in the book details table and any visible text missing it at first use. No ® anywhere.

**A6. Offerings.** Remove **Fractional Leadership** from the Work section list. Do not rename the other services (Hold 4).

**A7. Cross-sell and links**

- Footer: TW uses a shorter "More from Terence Waters" block instead of the shared block (owner, 2026-10-20): "The Resonant Identity Podcast" (→ theresonantidentity.com/start-here/) and "Fluxline Resonance Group — Coaching & Consulting" (→ fluxline.pro). Keep it to those two links.
- Under the book section, after the launch-notify CTA, add: "Want to see the Framework at work in a business? Fluxline builds it into strategy, systems, brand, and body." with the link "See how Fluxline works →" to `https://fluxline.pro/services/`. (Do not say "finished the book"; it is not out yet.)
- Unify the GitHub link to `https://github.com/AplUSAndmINUS` in hero, contact and footer.

## Hold (change nothing, list every occurrence in the PR)

1. Resolved (owner, 2026-10-19): the blog post "Behavioral Gravity: The Pull You Don't Notice" was revised to the book's meaning; keep it as revised. Any *other* post that carries the old meaning is still a Hold: list it, don't edit it.
2. Resolved (owner, 2026-10-19): the PhD is National University, Technology Information Management, Information Systems emphasis, 2026 to 2030.
3. Resolved (owner, 2026-10-19): the company count is 2 (Fluxline Resonance Group, Enteractive Studios).
4. Resolved (owner, 2026-10-19): the Work list uses the five Fluxline offering names (Brand & Experience Design, Web Development & Digital Architecture, Business Strategy & Systems Alignment, The Resonance Core Framework™, Personal Training & Wellness); Design Facilitation is removed.
5. Resolved (owner, 2026-10-19): keep the proficiency bars as they are.
6. Resolved (owner, 2026-10-19): keep the footer line "© 2025-2026 Terence Waters and his awesomeness" and the tagline "Know who you are and what you stand for!" as they are.
7. Resolved: the About text now says "31-chapter book and identity system."
8. Resolved: the placeholder `#` social links were replaced with real profiles.
9. Resolved (owner, 2026-10-19): the TW author title is "author, architect, and solopreneur".
10. Glossary or terminology mismatches with core Section 4.

## Acceptance

- Every changed page glosses each framework term once at first use.
- No locked term renamed, re-cased or removed. No new claim, statistic or em dash.
- Metadata, JSON-LD and `llms.txt` match the visible copy.
- PR follows core Section 8 and lists Applied, Held, Left alone and Questions.
