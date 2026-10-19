# RCF voice and terminology core (shared by all three site prompts)

Copy this file into each site's repo (suggested path: `.github/rcf-voice-core.md`). Each site prompt tells Copilot to read it first. The book is **not** in these repos, so everything Copilot needs from the book is written out below. Do not look for it elsewhere and do not invent definitions.

Owner: Terence Waters, Fluxline Resonance Group, LLC. Audit date: 2026-10-11. Audit file: `Website_Review_2026-10-11.md` (v3).

---

## 1. Scope

- This is a **copy and link pass**. Do not change layout, design tokens, routes, behavior, or build config except where a copy change forces it (a card that no longer fits, an empty heading). If a change needs a new UI component, **stop and flag it** instead of building one.
- Never publish. Open a PR to `develop` and stop. A human reviews and merges.
- Apply the **Apply** list in your site prompt. For every **Hold** item, change nothing and list every place it appears (file path, line, current text) in the PR description.

## 2. Decisions the owner has made (apply)

1. **Marks.** Use ™ on The Resonance Core Framework™. Never ®. Put ™ on the first use on each page and in the page title, H1, Open Graph and Twitter text. After that use RCF. Do not sprinkle ™ on every mention. **Scope (owner, 2026-10-19):** ™ is for public-facing digital only (websites, social, posts). Every book edition (print, eBook, Kindle) uses ®, so don't flag ® in the book.
2. **Book date.** Replace "Late Fall 2026" everywhere with **"targeted for Q1 2027"** (or "forthcoming"). Never name a month. Use "targeted" for any future date.
3. **Experience.** The figure is **20+ years in design, development, architecture, and product management, and 3+ years in consulting.** The old 15+ figure is retired. Do not write "20+ years of consulting."
4. **"Be notified at launch."** Every such link goes to `https://fluxline.pro/contact`.
5. **Behavioral Gravity** means the pull a regulated, steady person has on the people around them (the book glossary meaning). It does **not** mean the pull of habits on you. Use the gloss in Section 4 verbatim.
6. **Loops.** "Identity Distortion Loop" becomes **Judgment Loop**. "Identity Alignment Loop" becomes **Data Loop**. Remove any "(book name: …)" aside once renamed.
7. **DRIVE.** Stages are Spark, Coherence, Activation, Momentum, Endurance, **Embodiment**. Never "Expansion." Expand DRIVE once per page at first use. Use **DRIVE Model** for the six-stage model, **DRIVE** or **DRIVEs** for the pattern itself. Retire "DRIVE System."
8. **DAS.** Keep Decision Alignment Score (DAS). Where SSI, EROI or SI appear, expand them once at first use, or leave them out of the gloss.
9. **Offerings.** There are **five**: The Resonance Core Framework™, Brand & Experience Design, Web Development & Digital Architecture, Business Strategy & Systems Alignment, Personal Training & Wellness. **Fractional Leadership is not an offering.** Remove it from cards, lists and copy. Leave its route file in place (see Hold).
10. **Claims.** Remove "research-backed," "proven," "tested," "clinically," and similar. Replacements are given in the site prompts.

## 3. Locked terms: never rename, re-case, translate, or remove

- The Resonance Core Framework™ (first use), then RCF.
- Six core values: Embodied Awareness, Modular Precision, Resilient Alignment, Somatic Discipline, Creative Truth, Strategic Innovation. (Identity Alignment is a construct. Legacy Resonance, Systemic Coherence and Embodied Integration are Meta-Values. Never mix the three.)
- DRIVE (Directional, Repeatable, Identity-Aligned Virtuous Expressions).
- Judgment Loop, Data Loop, Behavioral Gravity, Identity Coherence, Window of Choice, Distortion, Truth, the First Gate, Cues (a synonym for Signals), Guardrails.
- Decision Integrity Index (DII), Self-State Integrity (SSI), Emotional Return on Investment (EROI), System Impact / Shadow Index (SI), Decision Alignment Score (DAS), Resonance Integrity Score (RIS), Threshold Integrity Score (TIS). Always "Decision Integrity Index."
- Fluxline, "Structure the Shift", "Modular by design. Resonant by nature.", "Resonance, not force."
- Mission line approved for reuse: "Fluxline builds systems that work, brands that connect, and practices that last."
- Fluxline Ecosystem: "a workflow of apps, services, and frameworks based off The Resonant Identity Podcast and The Resonance Core Framework™ to support human growth, transformation, and data-driven decision-making."

You may add a one-sentence gloss beside a locked term. You may not change the term.

## 4. Approved first-use glosses

Use these wording choices. Add one gloss at the **first use on each page**, then use the term normally. If a term is not in this table, **do not invent a gloss**; flag it.

| Term                           | Gloss                                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| The Resonance Core Framework™  | A practical system for making change that holds, built on alignment rather than force.                                                          |
| Resonance                      | Alignment between your identity, values, feelings, and actions.                                                                                 |
| Behavioral Gravity             | The pull a steady, regulated person has on the people around them, drawing others toward calm, presence, and clarity through how they show up.  |
| Identity Coherence             | When your values, expression, and behavior agree.                                                                                               |
| Window of Choice               | The space between a trigger and your response where a conscious, identity-aligned choice becomes possible.                                      |
| DRIVE                          | Directional, Repeatable, Identity-Aligned Virtuous Expressions: repeatable actions that move you toward the person you are becoming.            |
| DRIVE Model                    | Six stages (Spark, Coherence, Activation, Momentum, Endurance, Embodiment) that carry a DRIVE from first spark to lived identity.               |
| Judgment Loop                  | The cycle where judgments about yourself and others reinforce a distorted view of identity.                                                     |
| Data Loop                      | The practice of treating Cues as information: notice them, trace where they come from, test whether they are true, then decide.                 |
| Cues                           | The thoughts, emotions, and body signals you read as information.                                                                               |
| The First Gate                 | Your body and nervous system, where Cues start and reality gets formed.                                                                         |
| Decision Integrity Index (DII) | The RCF's way of checking whether a decision lines up with your identity and values.                                                            |
| Decision Alignment Score (DAS) | The score a single decision earns inside the DII.                                                                                               |
| The Human Element              | The shared layer of emotion, sensation and intuition that shapes how people respond before they think or speak.                                 |
| Attunement                     | Meeting another person's cues with presence and steadiness, staying rooted in your own resonance instead of absorbing or mirroring their state. |
| Somatic Discipline             | Reading and regulating your Somatic and Emotional Cues in real time, so you respond from alignment instead of reactivity.                       |
| Whole-Brain Listening          | Listening with cognitive clarity, emotional attunement and somatic awareness at once, so you hear what is meant as well as what is said.        |

**Do not add** any DII scale, scoring formula, or number meaning. Existing mentions of "1 to 5" are Hold items.

## 5. Voice

- Precise, calm, human, a little architectural. Short sentences, one idea each. Say what the thing is, then what it does for the reader.
- Concrete over abstract. Smart reader, new to the framework. Do not talk down and do not over-explain.
- No hype or filler: unlock, leverage, supercharge, game-changing, "in today's fast-paced world."
- Headings name the thing ("What we build for you"). They do not tease.
- Mythic or architectural imagery (gates, structure, compass) is welcome sparingly in a framing line, never in place of a plain statement.
- **No em dashes in anything you write.** Use a period, comma, or colon. Do not rewrite existing em dashes unless a Hold or Apply item touches that sentence.
- Site register stays different on purpose: Fluxline is calm and structural, TerenceWaters.com is warm and first person, TheResonantIdentity.com is invitational and second person. Keep each. Do not homogenise them.

## 6. Hard constraints

- **Trade secrets.** Do not name any unreleased app, code name or internal system, and do not describe how an unreleased product works. The only allowed description is generic: the Fluxline Ecosystem supports SMART goal-setting, journaling, and DII scoring tied to the RCF. No technology choices, feature lists or security mechanics.
- **No unsupported claims.** No new statistics, outcomes, testimonials or superlatives. No medical, therapeutic or clinical claims. The RCF is a decision and identity framework, and life coaching is not therapy.
- **No** "WCAG certified" and **no** "official Microsoft partner."
- **No personal narrative.** No health or personal-life anecdotes in marketing copy. Leave case studies marked as personal narratives alone.
- **Out of scope:** anything under `/legal`, and the Glossary page. Note any mismatch you see between the Glossary page and this file in the PR description.
- Keep metadata in sync with any copy you change: page titles, descriptions, Open Graph and Twitter text, JSON-LD, `llms.txt`, sitemap labels.

## 7. Shared cross-sell block (add to each site's footer, same order)

Reuse the existing footer link list or nav. Do not build a new component. On the site you are already on, that line is plain text, not a link.

```
Listen: The Resonant Identity Podcast. Where the Framework is spoken.   -> https://theresonantidentity.com/start-here/
Read: The Resonance Core Framework™. Where the Framework is mapped.     -> https://fluxline.pro/resonance-core-framework/
Work: Fluxline. Fluxline builds systems that work, brands that connect, and practices that last.  -> https://fluxline.pro/
By Terence Waters.                                                       -> https://terencewaters.com/about/
```

## 8. Repo and PR standards (FRG-ENG-STD-001)

- Branch off `develop`: `docs/voice-congruence-pass`. Open the PR to `develop`. Never commit to `main`, `test` or `develop`.
- Conventional Commits, imperative, 72 characters or fewer, e.g. `docs(copy): replace Late Fall 2026 with targeted Q1 2027`. One commit per concern.
- Update `CHANGELOG.md` under `## Unreleased`. Update `copilot-instructions.md` only if you change a pattern.
- No hard-coded hex, pixel or font values. Copy only; if a copy change needs styling, stop and flag.
- Build, lint, type-check and tests must pass. Update snapshots only where the diff is a copy change, and explain each snapshot diff in the PR.
- PR description must include: **What Changed, Why, How, Testing, Screenshots/Preview, CHANGELOG entry, DoD checklist**, plus:
  - **Applied:** every file changed.
  - **Held:** every Hold item with file, line and current text.
  - **Left alone:** every file deliberately untouched, with the reason.
  - **Questions for the owner:** anything you could not trace to this file.
- This PR is AI-generated and needs human review before merge.

## 9. Do not decide

If any of these come up, leave the text as is and list it for the owner: a claim, number or date you cannot trace to this file; a rewrite that would change the meaning of a framework term; a page where the best fix is structural; a term that needs a tooltip or glossary link instead of an inline gloss.
