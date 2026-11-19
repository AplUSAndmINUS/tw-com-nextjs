/**
 * Identity: the single source of who Terence is
 * =============================================
 *
 * Every title, meta description, JSON-LD Person field, llms.txt summary and
 * hero line on Home, /about, /about-me and /contact reads from here. Before
 * the redesign the same facts were written in eight files and disagreed
 * ("author, architect, and solopreneur", "Podcaster · Systems Architect ·
 * Business Consultant", "Systems architect, identity coach, and creative
 * technologist", …). Change a line here and every reader follows.
 *
 * Sources (docs/redesign/):
 *   USER_PERSONA_TERENCE.md §2  Canonical Identity Statement (never paraphrase)
 *   CREATIVE_BRIEF.md §6, §8    role line, credo, approved lines, draft bios
 *   USER_PERSONA_TERENCE.md §4–5  The Human Element, HCSA, values
 */

import { approved, draft, existing } from './copy';

export const PERSON_NAME = 'Terence Waters';
export const LOCATION = 'Salt Lake City, Utah';

/* ── Role line ───────────────────────────────────────────────────────────── */

/** The standard role line, used everywhere a title appears. */
export const ROLE_LINE_PARTS = [
  'Creator',
  'Researcher',
  'Author',
  'Architect of human-centered systems',
] as const;

export const ROLE_LINE = approved(
  'identity.roleLine',
  ROLE_LINE_PARTS.join(' · '),
  'CREATIVE_BRIEF §6; approved by Terence 2026-11-18 (Decision C)'
);

/** Role line as prose, for sentences and schema ("creator, researcher, …"). */
export const ROLE_LINE_PROSE = approved(
  'identity.roleLineProse',
  'creator, researcher, author, and architect of human-centered systems',
  'CREATIVE_BRIEF §6 (role line) / Canonical Statement opening'
);

/** Secondary roles, "where there's room". */
export const SECONDARY_ROLES = [
  draft(
    'identity.secondary.host',
    'Host of The Resonant Identity',
    'CREATIVE_BRIEF §6 (secondary line)'
  ),
  draft(
    'identity.secondary.founder',
    'Founder, Fluxline Resonance Group',
    'CREATIVE_BRIEF §6 (secondary line)'
  ),
  draft(
    'identity.secondary.phd',
    'Ph.D. student',
    'CREATIVE_BRIEF §6 (secondary line)'
  ),
] as const;

/* ── Canonical Identity Statement ────────────────────────────────────────── */

/**
 * One run of the statement. Terence wrote it with bold-italic (`_**…**_`) and
 * italic (`_…_`) emphasis; segments keep that exactly.
 */
export interface StatementSegment {
  text: string;
  strong?: boolean;
  em?: boolean;
}

/**
 * The Canonical Identity Statement, exactly as written (persona §2), in three
 * paragraphs for reading (owner, Checkpoint 3a: "2-3 paragraphs … easy reads
 * instead of a wall of text"). The words and emphasis are unchanged; only the
 * paragraph breaks are added. Never paraphrase. Render with
 * <CanonicalStatement/>.
 *
 *   1. Who he is, and where he came from.
 *   2. The framework, the credo, and "something you return to".
 *   3. The sign-off: a peer, not a guru; he still builds.
 */
export const CANONICAL_PARAGRAPHS: StatementSegment[][] = [
  [
    {
      text: 'Terence Waters is a creator, researcher, author, and architect of human-centered systems who helps people make better decisions by ',
    },
    { text: 'empowering', strong: true, em: true },
    {
      text: ' them in finding and aligning with their true and chosen identity. He grew up in a small town of 4,000 people with his life already scripted for him and has ',
    },
    { text: 'twice', strong: true, em: true },
    {
      text: ' walked away from a path someone else wrote for him: first, the expected one, then a six-figure career track. Each time, he rebuilt through creativity, music, learning, and his own body.',
    },
  ],
  [
    {
      text: 'Through that transformation, The Resonance Core Framework™, his Ph.D. work becoming a book, a podcast, and a business, is what he learned on the way, organized in such a way that encourages others who read and understand it ',
    },
    { text: 'to act on it', strong: true, em: true },
    { text: ', making the framework ' },
    { text: 'a self-action', strong: true, em: true },
    { text: ' series, not a ' },
    { text: 'self no-help series', strong: true, em: true },
    {
      text: '. He holds the credo that "Humans come first. Systems and AI come second," claiming that every decision ',
    },
    {
      text: 'begins in the body and with a human mind to think it through',
      strong: true,
      em: true,
    },
    { text: '. And through that lens, identity becomes something ' },
    { text: 'you return to', em: true },
    { text: ', not something ' },
    { text: 'you perform', em: true },
    { text: '.' },
  ],
  [
    {
      text: "He's a peer, not a guru: nerdy, quirky, blunt, and warm. And he still loves building things, so yes, ",
    },
    {
      text: 'he can help build your idea or identity, too.',
      strong: true,
      em: true,
    },
  ],
];

/** The statement as one run of segments (paragraphs joined by a space). */
export const CANONICAL_STATEMENT: StatementSegment[] =
  CANONICAL_PARAGRAPHS.flatMap((paragraph, i) =>
    i === 0 ? paragraph : [{ text: ' ' }, ...paragraph]
  );

export const CANONICAL_STATEMENT_TEXT = approved(
  'identity.canonicalStatement',
  CANONICAL_STATEMENT.map((s) => s.text).join(''),
  'USER_PERSONA_TERENCE §2 (Terence, verbatim)'
);

/** "I create and improve systems…" (persona §2, his words). */
export const CORE_SELF = approved(
  'identity.coreSelf',
  "I create and improve systems that people need to express their goals and identity, and people's lives become better as a result as I express, teach, and improve them.",
  'USER_PERSONA_TERENCE §2 (core-self statement)'
);

/** The homepage "know" moment, in his words (persona §2). */
export const KNOW_LINE = approved(
  'identity.knowLine',
  "I'm a person who helps people make better decisions and improve their lives through understanding and living their identity through an authentic life.",
  'USER_PERSONA_TERENCE §2 (plain-language version)'
);

/* ── Bios ─────────────────────────────────────────────────────────────────── */

/**
 * The one-line bio is the Canonical Statement's first sentence, word for word
 * (Slice 8: "every bio, meta description, and structured-data record should
 * come from it", CREATIVE_BRIEF §6). It feeds the Person description, the
 * ProfilePage and the llms.txt summary.
 */
export const BIO_ONE_LINE = approved(
  'identity.bio.oneLine',
  CANONICAL_STATEMENT_TEXT.slice(
    0,
    CANONICAL_STATEMENT_TEXT.indexOf('identity.') + 'identity.'.length
  ),
  "USER_PERSONA_TERENCE §2: the Canonical Statement's first sentence, verbatim (Slice 8)"
);

export const BIO_SHORT = draft(
  'identity.bio.short',
  "Terence Waters is a creator, researcher, and architect of human-centered systems based in Salt Lake City. He's the author of The Resonance Core Framework™, host of The Resonant Identity podcast, founder of Fluxline Resonance Group, and a Ph.D. student studying how identity-aligned decisions change the systems around us. His credo: humans first, systems and AI second.",
  'CREATIVE_BRIEF §8.4 (short)'
);

/**
 * Meta description default (≤ 160 characters): the one-line bio trimmed to
 * fit, keeping the full role line and "true and chosen identity". A trim of
 * approved words, so it needs Terence's sign-off (INITIAL_PLAN §8.1).
 */
export const META_DESCRIPTION = draft(
  'identity.metaDescription',
  'Terence Waters, creator, researcher, author, and architect of human-centered systems, helps people make better decisions from their true and chosen identity.',
  "Slice 8: trim of the Canonical Statement's first sentence to fit 160 characters"
);

/* ── Credo, stance, values ───────────────────────────────────────────────── */

export const CREDO = approved(
  'identity.credo',
  'Humans FIRST. AI and Systems SECOND.',
  'CREATIVE_BRIEF §8.1'
);

export const PEER_LINE = approved(
  'identity.peer',
  "I'm just your peer… not this overzealous overlord.",
  'CREATIVE_BRIEF §8.1'
);

export interface Value {
  name: string;
  /** His definition, in his words. */
  text: string;
}

export const VALUES: Value[] = [
  {
    name: approved(
      'identity.value.intellectualism.name',
      'Intellectualism',
      'USER_PERSONA_TERENCE §5'
    ),
    text: approved(
      'identity.value.intellectualism.text',
      'Being truthful and on the right side of factual data-driven decisions even in the face of adversity and naysayers.',
      'USER_PERSONA_TERENCE §5 (his words)'
    ),
  },
  {
    name: approved(
      'identity.value.futurism.name',
      'Futurism',
      'USER_PERSONA_TERENCE §5'
    ),
    text: approved(
      'identity.value.futurism.text',
      'NEVER EVER accepting the status quo as all there is and ALWAYS imagining what is possible. Accept reality for what it is while always IMAGINING and ENVISIONING what is possible for humanity, people, and myself.',
      'USER_PERSONA_TERENCE §5 (his words)'
    ),
  },
  {
    name: approved(
      'identity.value.integrity.name',
      'Integrity',
      'USER_PERSONA_TERENCE §5'
    ),
    text: approved(
      'identity.value.integrity.text',
      'NEVER circumvent my truth, my honesty, and my love and respect of others despite all odds.',
      'USER_PERSONA_TERENCE §5 (his words)'
    ),
  },
];

export const ACCEPTING_LINE = approved(
  'identity.accepting',
  'Accepting people for who they are and who they can become.',
  'CREATIVE_BRIEF §8.1'
);

/* ── The Human Element and HCSA ──────────────────────────────────────────── */

/**
 * The Human Element has two correct descriptions (D14): the book's glossary
 * gloss (formal, first use) and Terence's human description.
 */
export const HUMAN_ELEMENT_GLOSS = approved(
  'identity.humanElement.gloss',
  'the shared layer of emotion, sensation and intuition that shapes how people respond before they think or speak',
  "The book's glossary (USER_PERSONA_TERENCE §4; rcf-voice-core §4)"
);

export const HUMAN_ELEMENT_HUMAN = approved(
  'identity.humanElement.human',
  'Without it, communication and connection are impossible… literally. No one will open up to you when you cannot establish this basic baseline of human connection, safety, and trust.',
  'USER_PERSONA_TERENCE §4 (his words)'
);

export const HCSA_NAME = 'Human-Centered Systemic Architecture';

export const HCSA_QUOTE = approved(
  'identity.hcsa.quote',
  'The HUMAN comes FIRST, and the systems they choose to leverage (and AI also) come SECOND.',
  'USER_PERSONA_TERENCE §4 (his words)'
);

export const ARCHITECT_LINE = approved(
  'identity.architect',
  "[AI] acts as the engineer; I'm the architect.",
  'USER_PERSONA_TERENCE §6 (his words)'
);

/* ── Lines from the interview (✅, CREATIVE_BRIEF §8.1) ───────────────────── */

export const QUOTES = {
  hateSelfHelp: approved(
    'quote.hateSelfHelp',
    'I hate self-help books.',
    'CREATIVE_BRIEF §8.1 (first line of the book)'
  ),
  selfAction: approved(
    'quote.selfAction',
    'A self-action series, not a self no-help series.',
    'CREATIVE_BRIEF §8.1'
  ),
  body: approved(
    'quote.body',
    'Every decision begins in the body and with a human mind to think it through.',
    'CREATIVE_BRIEF §8.1'
  ),
  script: approved(
    'quote.script',
    "I did not want my life to be stuck under someone else's script. I wanted it to be my own.",
    'CREATIVE_BRIEF §8.1'
  ),
  chosen: approved(
    'quote.chosen',
    "Even though I had no idea what my business was going to be, I took the latter as my 'chosen identity'. And I've never been happier…",
    'CREATIVE_BRIEF §8.1'
  ),
  stillBuild: approved(
    'quote.stillBuild',
    'Hey, yes… I STILL love architecting and creating things and can do that for you.',
    'CREATIVE_BRIEF §8.1'
  ),
  music: approved(
    'quote.music',
    "Music is universally understood. It's emotion expressed through sound. And it's inherently human.",
    'CREATIVE_BRIEF §8.1'
  ),
  authorNext: approved(
    'quote.authorNext',
    'Author is just now the next piece being added to who I am.',
    'CREATIVE_BRIEF §8.1'
  ),
  knowWho: existing(
    'quote.knowWho',
    'Know who you are and what you stand for — in line with your true and chosen identity.',
    'Home watermark (CREATIVE_BRIEF §8.2 KEEP; existing punctuation kept)'
  ),
} as const;
