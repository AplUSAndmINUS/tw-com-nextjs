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
- About header "Founder, architect, and coach. Fifteen years turning complexity into something people can actually live and work inside." becomes "Founder, architect, and coach. Twenty years turning complexity into something people can actually live and work inside."
- About bio sentence "For 15+ years I have worked across IT architecture, full-stack development, brand identity, curriculum design, and personal transformation." becomes "For 20+ years I have worked across design, development, architecture, and product management, and I have been consulting for 3+ years." Keep the sentences around it.
- About stat "15+ / Years bridging tech & design" gets the same label as the home stat.
- Do not touch the 2008 to present timeline, degrees or certifications.

**A2. Book date.** Replace "Late Fall 2026" with the targeted-Q1-2027 wording on home (book heading), `/resonance-core-framework/` (hero line, section eyebrow "Coming Late Fall 2026", the details-table row "Publication: Late Fall 2026", meta description), About, and all metadata, JSON-LD and `llms.txt`.

**A3. "Be notified at launch."** Both "Be notified at launch" / "Be Notified at Launch →" CTAs (home and `/resonance-core-framework/`) now link to `https://fluxline.pro/contact`. Leave the footer newsletter signup exactly as it is.

**A4. Framework page terms (`/resonance-core-framework/`)**

- Rename the two loops (core decision 6), using the core glosses.
- Rewrite Behavioral Gravity to the approved gloss. Check the "More info →" anchors and any teaser text on home. **Do not edit the blog post "Behavioral Gravity: The Pull You Don't Notice"** (published 2026-09-23); see Hold 1.
- Replace "The DRIVE System" with "The DRIVE Model". Expand DRIVE at first use.
- Expand SSI, EROI and SI once in the DAS gloss, or drop them from it.
- Define Overview terms where they first appear, or move the one-line glosses up so no concept is named before it is explained.

**A5. Marks.** Add ™ to "The Resonance Core Framework" in the book details table and any visible text missing it at first use. No ® anywhere.

**A6. Offerings.** Remove **Fractional Leadership** from the Work section list. Do not rename the other services (Hold 4).

**A7. Cross-sell and links**

- Footer: add the **shared block** from core Section 7 without building a new component.
- Under the book section, after the launch-notify CTA, add: "Want to see the Framework at work in a business? Fluxline builds it into strategy, systems, brand, and body." with the link "See how Fluxline works →" to `https://fluxline.pro/services/`. (Do not say "finished the book"; it is not out yet.)
- Unify the GitHub link to `https://github.com/AplUSAndmINUS` in hero, contact and footer.

## Hold (change nothing, list every occurrence in the PR)

1. The blog post "Behavioral Gravity: The Pull You Don't Notice" and any other post that carries the old meaning. The owner decides whether to revise.
2. PhD wording: "Northcentral University, Technology Management, Information Systems, 2026 to 2030." The book bio says National University, Technology Information Management. Which is correct?
3. "Companies founded or led: 3" and home "3 companies in the ecosystem": only two are named (Fluxline Resonance Group, Enteractive Studios).
4. Service names. Work list: Design & Identity, Architecture & Development, Enterprise Consulting, Design Facilitation, The Resonance Core Framework™ (coaching), Personal Training & Wellness. The five Fluxline offerings are Brand & Experience Design, Web Development & Digital Architecture, Business Strategy & Systems Alignment, The Resonance Core Framework™, Personal Training & Wellness. Report where they differ; do not rename.
5. Proficiency bars ("Design thinking 100%", "Personal & business coaching 98%").
6. Footer line "© 2025-2026 Terence Waters and his awesomeness" (first and third person mix) and the footer tagline "Know who you are and what you stand for!" (the podcast closes without the "!").
7. About text calling the RCF a "31-chapter identity system" without the word "book."
8. Placeholder social links that point to `#`.
9. Author title: "Founder, architect, and coach" vs "Author & Architect" on Fluxline.
10. Glossary or terminology mismatches with core Section 4.

## Acceptance

- Every changed page glosses each framework term once at first use.
- No locked term renamed, re-cased or removed. No new claim, statistic or em dash.
- Metadata, JSON-LD and `llms.txt` match the visible copy.
- PR follows core Section 8 and lists Applied, Held, Left alone and Questions.
