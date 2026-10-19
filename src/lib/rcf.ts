/**
 * The Resonance Core Framework™ — shared copy for TerenceWaters.com.
 *
 * The homepage book section, the About bio, and /resonance-core-framework all
 * describe the same framework, so the language lives here once.
 *
 * Source of truth: fluxline.pro/resonance-core-framework holds the complete,
 * canonical framework reference. This site keeps the author/book angle and
 * short summaries that link there for more.
 */

export const RCF_PATH = '/resonance-core-framework';
export const RCF_TRADEMARK = 'The Resonance Core Framework™';

/** Owned sister sites (linked with rel="me"). */
export const TRI_URL = 'https://theresonantidentity.com';
export const TRI_FRAMEWORK_URL = 'https://theresonantidentity.com/framework/';
export const FLUXLINE_URL = 'https://www.fluxline.pro';
export const FLUXLINE_RCF_URL =
  'https://www.fluxline.pro/resonance-core-framework';

/** Where every "Be notified at launch" CTA points: the launch sign-up on the RCF page. */
export const RCF_NOTIFY_HREF =
  'https://fluxline.pro/resonance-core-framework/#notify';

export const RCF_BOOK = {
  title: 'The Resonance Core Framework™',
  publisher: 'Fluxline Resonance Group',
  publicationDate: 'Targeted for Q1 2027',
  preorders: 'Opening in early November 2026',
  formats: ['Hardcover', 'eBook', 'Audiobook'],
  structure: '31 chapters across four parts',
};

/** One-line book date for book-focused passages: launch plus preorders. */
export const RCF_BOOK_DATE_LINE =
  'The book is targeted for Q1 2027, with preorders opening in early November 2026.';

/**
 * Canonical RCF paragraph, TW variant ("written by…", targeted for Q1 2027).
 * It opens the Overview on /resonance-core-framework, so it points to the Core
 * Concepts section instead of naming concepts before they are glossed.
 */
export const RCF_CANONICAL_PARAGRAPH =
  'The Resonance Core Framework™ is a structured identity system built on the principle that sustainable change requires alignment, not force. Written by Terence Waters and developed through Fluxline Resonance Group, the RCF maps three dimensions of identity (inner signal, outward expression, and systemic impact) and provides named conceptual tools, each defined in one sentence under Core Concepts below. It is the foundation of The Resonant Identity podcast and of the book, targeted for Q1 2027.';

/** Homepage book section body (TW-1.3). */
export const RCF_BOOK_BLURB =
  'The book that maps what the podcast has been building toward. The Resonance Core Framework is a structured identity system, 31 chapters across four parts, exploring how identity shapes decisions. It covers Behavioral Gravity (the pull a steady, regulated person has on the people around them, drawing others toward calm, presence, and clarity through how they show up), the Judgment Loop (the cycle where judgments about yourself and others reinforce a distorted view of identity), and The Decision Integrity Index (The DII), which gives you a repeatable way to score the alignment of any decision. For individuals, founders, and leaders who need more than motivation. They need architecture.';

/**
 * Core concepts — one-line summaries only. The full, canonical definitions
 * live on fluxline.pro/resonance-core-framework (the RCF's single source of
 * truth); `id` matches the anchor there, so each summary links to its
 * definition.
 */
export const RCF_CONCEPTS: { id: string; name: string; summary: string }[] = [
  {
    id: 'behavioral-gravity',
    name: 'Behavioral Gravity',
    summary:
      'The pull a steady, regulated person has on the people around them, drawing others toward calm, presence, and clarity through how they show up.',
  },
  {
    id: 'identity-coherence',
    name: 'Identity Coherence',
    summary:
      'When your values, expression, and behavior agree. Not perfection — alignment.',
  },
  {
    id: 'window-of-choice',
    name: 'Window of Choice',
    summary:
      'The range of choices you can see and act on — wide when present, narrow under stress.',
  },
  // Keeps the old "drive-system" slug: it is the anchor on fluxline.pro.
  {
    id: 'drive-system',
    name: 'The DRIVE Model',
    summary:
      'DRIVE stands for Directional, Repeatable, Identity-Aligned Virtuous Expressions: repeatable actions that move you toward the person you are becoming. The model has six stages (Spark, Coherence, Activation, Momentum, Endurance, Embodiment) that carry a DRIVE from first spark to lived identity.',
  },
  // The two loop ids keep their old slugs because they are anchors on
  // fluxline.pro/resonance-core-framework. Change them when that page does.
  {
    id: 'identity-distortion-loop',
    name: 'Judgment Loop',
    summary:
      'The cycle where judgments about yourself and others reinforce a distorted view of identity.',
  },
  {
    id: 'identity-alignment-loop',
    name: 'Data Loop',
    summary:
      'The practice of treating Cues as information: notice them, trace where they come from, test whether they are true, then decide.',
  },
  {
    id: 'dii-protocol',
    name: 'The Decision Integrity Index (The DII)',
    summary: 'A 1–5 way to score how well a decision aligns with who you are.',
  },
  {
    id: 'decision-alignment-score',
    name: 'Decision Alignment Score (DAS)',
    summary:
      'The score a single decision earns inside The DII, drawn from Self-State Integrity (SSI), Emotional Return on Investment (EROI), and System Impact / Shadow Index (SI).',
  },
];

/**
 * Concepts whose full definition lives under a different anchor on the
 * source-of-truth page. Creative Truth is a Core Value, not a framework
 * concept (owner, 2026-10-19), so it is not listed here or in RCF_CONCEPTS.
 */
const RCF_CONCEPT_ANCHORS: Record<string, string> = {};

/** Link to a concept's full definition on the source-of-truth page. */
export const rcfConceptHref = (id: string) =>
  `${FLUXLINE_RCF_URL}#${RCF_CONCEPT_ANCHORS[id] ?? id}`;
