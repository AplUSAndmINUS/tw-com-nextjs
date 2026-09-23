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

/** Where "Be notified at launch" points until a dedicated waitlist exists. */
export const RCF_NOTIFY_HREF = '/#newsletter';

export const RCF_BOOK = {
  title: 'The Resonance Core Framework',
  publisher: 'Fluxline Resonance Group',
  publicationDate: 'Fall 2026',
  formats: ['Hardcover', 'eBook', 'Audiobook'],
  structure: '31 chapters across four parts',
};

/** Canonical RCF paragraph — TW variant ("written by…, publishing Fall 2026"). */
export const RCF_CANONICAL_PARAGRAPH =
  'The Resonance Core Framework™ is a structured identity system built on the principle that sustainable change requires alignment, not force. Written by Terence Waters and developed through Fluxline Resonance Group, the RCF maps three dimensions of identity — inner signal, outward expression, and systemic impact — and provides named conceptual tools: Behavioral Gravity, Identity Coherence, the Window of Choice, the DRIVE System, Creative Truth, and the DII Protocol. It is the foundation of The Resonant Identity podcast and of the book, publishing Fall 2026.';

/** Homepage book section body (TW-1.3). */
export const RCF_BOOK_BLURB =
  'The book that maps what the podcast has been building toward. The Resonance Core Framework is a structured identity system — 31 chapters across four parts — exploring how identity shapes decisions, how Behavioral Gravity creates invisible pull, how the Identity Distortion Loop erodes coherence, and how the DII Protocol gives you a repeatable way to score the alignment of any decision. For individuals, founders, and leaders who need more than motivation. They need architecture.';

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
      "The unconscious pull toward what feels identity-consistent — even when it no longer fits who you're becoming.",
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
  {
    id: 'drive-system',
    name: 'The DRIVE System',
    summary:
      'How identity-rooted goals become self-sustaining instead of running on willpower.',
  },
  {
    id: 'identity-distortion-loop',
    name: 'Identity Distortion Loop',
    summary: 'The cycle that erodes coherence. In the book: The Judgment Loop.',
  },
  {
    id: 'identity-alignment-loop',
    name: 'Identity Alignment Loop',
    summary: 'The cycle that rebuilds coherence. In the book: The Data Loop.',
  },
  {
    id: 'creative-truth',
    name: 'Creative Truth',
    summary:
      'Expressing your truth without needing others to receive or confirm it.',
  },
  {
    id: 'dii-protocol',
    name: 'DII Protocol (Decision Integrity Index)',
    summary: 'A 1–5 way to score how well a decision aligns with who you are.',
  },
  {
    id: 'decision-alignment-score',
    name: 'Decision Alignment Score (DAS)',
    summary:
      'The DII’s composite view of a decision, from SSI, EROI, and the Shadow Index.',
  },
];

/** Link to a concept's full definition on the source-of-truth page. */
export const rcfConceptHref = (id: string) => `${FLUXLINE_RCF_URL}#${id}`;
