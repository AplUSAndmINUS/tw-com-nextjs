/**
 * /about copy: the full story
 * ===========================
 *
 * The page's job (DESIGN_BRIEF.md §7.2): the whole person, told in Shifts.
 * Order: the short version (the Canonical Identity Statement, as written,
 * in one paragraph) → the Shifts in depth → learning to play by feel (music
 * and the body) → what I stand for → how I work → what I do now and "I still
 * build" → experience → credentials → closing. Each numbered section carries
 * a one-word category (owner, #294).
 *
 * Story boundaries (CREATIVE_BRIEF.md §11) apply to every line. The
 * neurodivergence and mental-health "process" wording is `[TW]` (Terence
 * supplies it), so it is simply absent here.
 *
 * Factual lists (timeline, projects, skills, degrees, certifications) stay in
 * src/app/about/aboutData.ts. Search wording is a placeholder until Slice 8.
 */

import { approved, draft, existing } from './copy';

const brief = (s: string) => `DESIGN_BRIEF §7.2 (${s}); draft`;
const aboutPage = 'Existing /about copy (aboutData.ts)';
const keep = 'CREATIVE_BRIEF §8.2 (KEEP)';

export const ABOUT = {
  /** "01 · Intro" and so on: the one-word category beside each number. */
  sections: {
    intro: draft(
      'about.section.intro',
      'Intro',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    shifts: draft(
      'about.section.shifts',
      'Story',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    byFeel: draft(
      'about.section.byFeel',
      'Music',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    body: draft(
      'about.section.body',
      'Body',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    values: draft(
      'about.section.values',
      'Values',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    how: draft(
      'about.section.how',
      'Method',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    build: draft(
      'about.section.build',
      'Build',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    experience: draft(
      'about.section.experience',
      'Experience',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
    credentials: draft(
      'about.section.credentials',
      'Credentials',
      'One-word section category (owner asked for one per section, #294); draft'
    ),
  },

  hero: {
    eyebrow: existing('about.hero.eyebrow', 'About', aboutPage),
    body: existing(
      'about.hero.body',
      "Most people don't need more information. We need clarity, structure, and a way back to ourselves.",
      keep
    ),
  },

  intro: {
    title: existing(
      'about.intro.title',
      'The short version',
      'Existing /about section label'
    ),
    season: existing(
      'about.intro.season',
      'If you are here, you are probably in a season of becoming. You are in the right place.',
      keep
    ),
  },

  shifts: {
    title: approved(
      'about.shifts.title',
      'The Shifts',
      'Home section title (approved at Checkpoint 2a)'
    ),
    lede: draft(
      'about.shifts.lede',
      "Here's the longer version, one Shift at a time. Each one is still part of me.",
      brief('the Shifts, in depth')
    ),
    rolesLabel: approved(
      'about.shifts.rolesLabel',
      'Roles added',
      'Home UI label (approved at Checkpoint 2a)'
    ),
  },

  byFeel: {
    title: approved(
      'about.byFeel.title',
      'Learning to play by feel',
      'CREATIVE_BRIEF §5.3 (✅ approved motif)'
    ),
    music: [
      draft(
        'about.byFeel.music.1',
        "I've played piano since I was a kid, and by ten I was playing well past my age. I compose and improvise, and through high school and college I played in symphonic band, orchestra, jazz ensemble, and percussion ensemble.",
        'USER_PERSONA_TERENCE §7 (music facts), first person'
      ),
      draft(
        'about.byFeel.music.2',
        'I learned it the technical way first: every note exactly as written. Then I learned to play by feel and by ear. That is how I learned to trust my intuition, and it is how The Resonance Core Framework™ and Fluxline were built: structure first, then feel.',
        'USER_PERSONA_TERENCE §7 + CREATIVE_BRIEF §5.3 (the metaphor)'
      ),
    ],
    bodyTitle: draft('about.byFeel.bodyTitle', 'The body', brief('the body')),
    /** The photo that replaces the callout (owner, #294). */
    bodyImageAlt: draft(
      'about.byFeel.bodyImageAlt',
      'Terence Waters, shirtless in the studio, showing the build he made through heavy lifting',
      'Alt text for the personal-training portrait (from fluxline.pro /services/personal-training); draft'
    ),
    body: [
      draft(
        'about.byFeel.body.1',
        'In 2012 I weighed 120 pounds. Today I am almost 195, built through heavy lifting.',
        'Fact sheet (120 lbs in 2012 → almost 195 lbs in 2026)'
      ),
      draft(
        'about.byFeel.body.2',
        'I argue in my book that every decision starts in the body, and my next one, The Resonant Body, is about exactly that.',
        'USER_PERSONA_TERENCE §4, §8 ("all decisions begin in the body"; The Resonant Body, 2027)'
      ),
    ],
  },

  values: {
    title: approved(
      'about.values.title',
      'What I stand for',
      'Home section title (approved at Checkpoint 2a)'
    ),
    /**
     * "In the book…" and "In plain words…" as one (owner, #294). `strongEm`
     * parts are bold italic. "intuition" stands where his message repeated
     * "emotion", matching the book's gloss (emotion, sensation, intuition).
     */
    humanNeeds: [
      {
        text: approved(
          'about.values.humanNeeds.1',
          'In the book, ',
          'Owner, 2026-11-18 (/about spec, #294)'
        ),
      },
      {
        text: approved(
          'about.values.humanNeeds.2',
          'every person has the same basic needs.',
          'Owner, 2026-11-18 (/about spec, #294)'
        ),
        strongEm: true,
      },
      {
        text: draft(
          'about.values.humanNeeds.3',
          " Shelter, food and water, being heard, feeling safe and trusted. And it's through that shared layer of emotion, sensation, and intuition that ",
          'Owner, 2026-11-18 (#294), with "intuition" for his repeated "emotion" (the book\'s gloss); awaiting his OK'
        ),
      },
      {
        text: approved(
          'about.values.humanNeeds.4',
          'shapes how people respond to us and make relationships in our world',
          'Owner, 2026-11-18 (/about spec, #294)'
        ),
        strongEm: true,
      },
      {
        text: approved(
          'about.values.humanNeeds.5',
          '.',
          'Owner, 2026-11-18 (/about spec, #294)'
        ),
      },
    ],
    beliefsTitle: existing(
      'about.values.beliefsTitle',
      'Three things I keep coming back to',
      aboutPage
    ),
  },

  how: {
    title: existing(
      'about.how.title',
      'How I work',
      'Existing /about section label'
    ),
    lede: existing(
      'about.how.lede',
      'I see patterns quickly, translate complexity into clarity, and build the thing that helps someone feel more like themselves.',
      aboutPage
    ),
    pullQuote: existing(
      'about.how.pullQuote',
      'Your job is to find your resonant identity. My job is to help you get there and express it.',
      keep
    ),
    intuitionTitle: draft(
      'about.how.intuitionTitle',
      'Intuition, checked by logic',
      'USER_PERSONA_TERENCE §6 (trait); draft'
    ),
    intuitionQuote: approved(
      'about.how.intuitionQuote',
      "Those words just… came to me. I'm intuitive by nature, and when something just 'feels' right and has logical backing… I use it.",
      'USER_PERSONA_TERENCE §4 (his words)'
    ),
    hcsaTitle: approved(
      'about.how.hcsaTitle',
      'Humans First. AI Second.',
      'Owner, 2026-11-18 (Checkpoint 3b)'
    ),
    /** The callout's one line (owner: "consolidating the text… simplified", #294). */
    hcsaBody: draft(
      'about.how.hcsaBody',
      "I call it Human-Centered Systemic Architecture (HCSA). The human comes first, and the systems they choose, AI included, come second. AI is the engineer; I'm the architect.",
      'Consolidates the HCSA intro + HCSA_QUOTE + ARCHITECT_LINE (owner asked for one simplified callout, #294); draft'
    ),
    aside: draft(
      'about.how.aside',
      '(Yes, that includes this website. I directed it; AI helped build it.)',
      'DESIGN_BRIEF §7.5 ("how this site was built"), as an aside; draft'
    ),
  },

  build: {
    title: draft('about.build.title', 'What I do now', brief('what I do now')),
    stillBuildTitle: draft(
      'about.build.stillBuildTitle',
      'I still build',
      brief('"I still build"')
    ),
    qualitiesLabel: existing(
      'about.build.qualitiesLabel',
      'Everything I build is',
      aboutPage
    ),
    fluxlineLink: existing(
      'about.build.fluxlineLink',
      'See the coaching and consulting services on Fluxline.pro',
      aboutPage
    ),
  },

  experience: {
    title: existing(
      'about.experience.title',
      'Where the reps came from',
      aboutPage
    ),
    lede: existing(
      'about.experience.lede',
      'Enterprise healthcare, higher education, and two companies of my own.',
      aboutPage
    ),
    projectsTitle: existing(
      'about.experience.projectsTitle',
      'Selected projects',
      aboutPage
    ),
    portfolioLink: existing(
      'about.experience.portfolioLink',
      'View the full portfolio',
      aboutPage
    ),
  },

  credentials: {
    title: existing(
      'about.credentials.title',
      'Skills, degrees, and certifications',
      aboutPage
    ),
    lede: existing(
      'about.credentials.lede',
      'The short list. Depth by category, then the paper.',
      aboutPage
    ),
    proficiency: existing(
      'about.credentials.proficiency',
      'Proficiency',
      aboutPage
    ),
    degrees: existing('about.credentials.degrees', 'Degrees', aboutPage),
    certifications: existing(
      'about.credentials.certifications',
      'Certifications',
      aboutPage
    ),
  },

  closing: {
    kicker: existing('about.closing.kicker', 'If you got this far', aboutPage),
    title: existing(
      'about.closing.title',
      "You're probably navigating a transition",
      aboutPage
    ),
    body: existing(
      'about.closing.body',
      "Personal, professional, creative, or internal. You don't need it figured out — you need somewhere to think and rebuild with intention. I'd be honored to walk with you.",
      keep
    ),
    message: existing('about.closing.message', 'Send a message', aboutPage),
  },
} as const;

/** "Three things I keep coming back to" (existing; two are KEEP lines). */
export const BELIEFS = [
  {
    title: existing(
      'about.belief.1.title',
      'Identity is a frequency, not a mask',
      keep
    ),
    text: existing(
      'about.belief.1.text',
      'It is not something you perform. It is something you return to.',
      keep
    ),
  },
  {
    title: existing(
      'about.belief.2.title',
      'Transformation is architectural',
      keep
    ),
    text: existing(
      'about.belief.2.text',
      'Not force, not hustle — the slow re-alignment of the internal systems that shape how you think and move.',
      keep
    ),
  },
  {
    title: existing('about.belief.3.title', 'The goal is resonance', aboutPage),
    text: existing(
      'about.belief.3.text',
      'Not the version of you that you were taught to be. The version you actually are.',
      aboutPage
    ),
  },
];

/** How I work (existing three, kept; the KEEP line "Complexity is fine…"). */
export const APPROACH = [
  {
    title: existing(
      'about.approach.1.title',
      'See the pattern first',
      aboutPage
    ),
    text: existing(
      'about.approach.1.text',
      'Before anything gets built, I map what is actually going on underneath the symptom.',
      aboutPage
    ),
  },
  {
    title: existing(
      'about.approach.2.title',
      'Translate, then simplify',
      aboutPage
    ),
    text: existing(
      'about.approach.2.text',
      'Complexity is fine. Confusion is not. The deliverable is always clarity someone can act on.',
      keep
    ),
  },
  {
    title: existing(
      'about.approach.3.title',
      'Frameworks around people',
      aboutPage
    ),
    text: existing(
      'about.approach.3.text',
      'I do not force people into a method. The method gets designed around the person or team in front of me.',
      aboutPage
    ),
  },
];

/** Non-negotiables for anything I ship (existing chips). */
export const BUILD_QUALITIES = [
  'Human-centered',
  'Emotionally intelligent',
  'Technically sound',
  'Scalable',
  'Accessible',
  'Deeply resonant',
].map((q, i) => existing(`about.quality.${i + 1}`, q, aboutPage));
