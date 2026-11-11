/**
 * About Hook page content
 * ========================
 *
 * The short, hook-first version of /about. It exists for one job: it's the
 * page other sites in the ecosystem (starting with
 * theresonantidentity.com/start-here) point to when they refer someone to
 * "more about Terence." So it leads with the hook, explains the three things
 * he's building (Fluxline, the RCF, The Resonant Identity) in one breath each,
 * and hands off to /about for anyone who wants the long version.
 *
 * Content is drawn from the existing /about copy (aboutData.ts) and from the
 * approved press-kit bio at wonderfish.app/terence-waters, converted to the
 * site's first-person voice. No facts invented here — see those two sources.
 */

export const HOOK_QUOTE =
  'I rejected the mission, marriage, children, and six-figure career expected of me in a town of 4,000 people.';

export const HOOK_BODY =
  'That choice looked rocky, and it was looked down upon. It also aligned me with who I am instead of who I was supposed to become. Now I help people in a season of becoming read their own nervous system as information, not instruction, and turn that information into decisions they can live inside.';

export const INTRO_PARAGRAPHS = [
  'I help people and organizations rebuild the parts of themselves they thought were permanent.',
  "I'm a systems architect by training, a designer by instinct, and a coach by necessity. Twenty-plus years across design, development, architecture, and product management, the last few spent consulting full-time and translating complexity into clarity.",
];

/** Same figures as /about — accurate, not re-derived. */
export const STATS = [
  {
    value: '20+',
    label: 'Years in design, development, architecture & product management',
  },
  { value: '4', label: 'Degrees & certifications tracks' },
  { value: '2', label: 'Companies founded or led' },
];

export interface Pillar {
  label: string;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}

export const PILLARS: Pillar[] = [
  {
    label: 'The company',
    title: 'Fluxline Resonance Group',
    text: 'Consulting, systems architecture, and brand identity for founders and teams who need less noise and more structure.',
    href: 'https://www.fluxline.pro',
    linkLabel: 'Visit Fluxline.pro',
  },
  {
    label: 'The book',
    title: 'The Resonance Core Framework™',
    text: 'A structured identity system built on alignment over force: Behavioral Gravity, Identity Coherence, the Window of Choice, The Decision Integrity Index. Targeted for Q1 2027.',
    href: '/resonance-core-framework',
    linkLabel: 'Read about the RCF',
  },
  {
    label: 'The podcast',
    title: 'The Resonant Identity',
    text: "Where the framework gets talked through out loud, episode by episode, for people in a season of becoming.",
    href: 'https://theresonantidentity.com',
    linkLabel: 'Listen to The Resonant Identity',
  },
];

/** Core RCF ideas, as a quick-scan chip row — not the full glossary. */
export const BUILT_ON = [
  'Behavioral Gravity',
  'Identity Coherence',
  'Window of Choice',
  'The Decision Integrity Index (The DII)',
  'Somatic Discipline',
];
