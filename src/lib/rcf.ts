/**
 * The Resonance Core Framework™ — shared copy for TerenceWaters.com.
 *
 * The homepage book section, the About bio, and /resonance-core-framework all
 * describe the same framework, so the language lives here once. The same core
 * definitions appear on theresonantidentity.com/framework and
 * fluxline.pro/resonance-core-framework; keeping them consistent across the
 * three sites is what builds search and AI topical authority.
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

/** Core concepts, briefly. `id` doubles as the on-page anchor. */
export const RCF_CONCEPTS: { id: string; name: string; body: string }[] = [
  {
    id: 'behavioral-gravity',
    name: 'Behavioral Gravity',
    body: "The unconscious pull toward behaviors, environments, and relationships that feel identity-consistent — even when they're no longer aligned with who you're becoming.",
  },
  {
    id: 'identity-coherence',
    name: 'Identity Coherence',
    body: 'The state in which your inner values, outer expression, and behavioral patterns are in agreement. Not perfection — alignment.',
  },
  {
    id: 'window-of-choice',
    name: 'Window of Choice',
    body: 'The often-brief moment within a threshold event where you have genuine agency to respond from your current identity rather than react from a previous one.',
  },
  {
    id: 'drive-system',
    name: 'The DRIVE System',
    body: 'The motivation architecture of the RCF: how identity-rooted goals become self-sustaining rather than dependent on willpower.',
  },
  {
    id: 'identity-distortion-loop',
    name: 'Identity Distortion Loop',
    body: 'The cycle that erodes identity coherence: Dissonance Spike → Reactance → Confirmation Bias → Distorted Alignment → Identity Erosion.',
  },
  {
    id: 'identity-alignment-loop',
    name: 'Identity Alignment Loop',
    body: 'The counterpart to the Distortion Loop — the cycle that rebuilds coherence, where each honest, identity-rooted choice makes the next one easier.',
  },
  {
    id: 'creative-truth',
    name: 'Creative Truth',
    body: 'Expressing your inner truth without requiring others to receive or confirm it — the highest form of Identity Coherence in outward expression.',
  },
  {
    id: 'dii-protocol',
    name: 'DII Protocol (Decision Integrity Index)',
    body: 'A structured way to score how well a decision aligns with your identity, anchored to six core values: Embodied Awareness, Modular Precision, Legacy Resonance, Somatic Discipline, Creative Truth, and Strategic Innovation.',
  },
  {
    id: 'decision-alignment-score',
    name: 'Decision Alignment Score (DAS)',
    body: 'The composite result of the DII Protocol, drawing on three sub-scores — SSI, EROI (Emotional ROI), and the Shadow Index — for a single view of a decision’s alignment.',
  },
];
