/**
 * The Shifts
 * ==========
 *
 * Terence's life told as a series of Shifts (an RCF construct, always
 * capitalized). Each Shift ADDS roles; nothing is replaced
 * (USER_PERSONA_TERENCE.md §3, CREATIVE_BRIEF.md §5.2).
 *
 * Read by the Shift Track teaser on Home and the full telling on /about.
 *
 * Story boundaries (CREATIVE_BRIEF.md §11) apply to every line here:
 *   - hometown: "a small town of 4,000 people", never named
 *   - church upbringing and coming out: brief mention only
 *   - health: only "significant health issues that nearly cost me my life"
 *   - leaving the career: "shifting roles and more work that didn't align with
 *     who I truly wanted to become"; no mechanics
 *   - no politics; no humor next to these beats
 *
 * The tellings are first-person drafts built from the persona's public
 * wording (Decision J: Terence approves each Shift). Roles come from the
 * persona's "Roles it added" column.
 */

import { approved, draft } from './copy';
import { QUOTES } from './identity';

export interface Shift {
  /** Anchor id on /about (`/about/#shift-build`). */
  id: string;
  /** "Shift 1", or empty for the unnumbered dark middle. */
  number: string;
  title: string;
  /** One line for the Home teaser. */
  short: string;
  /** The fuller telling for /about. Paragraphs. */
  story: string[];
  /** A line in his own words, if one belongs here. */
  quote?: string;
  /** Roles this Shift added. They accumulate in the Shift Track. */
  roles: string[];
}

const src =
  'CREATIVE_BRIEF §5.2 + USER_PERSONA_TERENCE §3 (first-person draft)';
/** Titles and one-liners are shown on Home, approved there. */
const homeOk = `CREATIVE_BRIEF §5.2 + USER_PERSONA_TERENCE §3; approved by Terence at Checkpoint 2a (2026-11-18)`;
const roleSrc = 'USER_PERSONA_TERENCE §3 (roles it added)';

export const SHIFTS: Shift[] = [
  {
    id: 'shift-exit',
    number: 'Shift 0',
    title: approved('shifts.exit.title', 'The exit', homeOk),
    short: approved(
      'shifts.exit.short',
      'A small town, a life already scripted. I chose my own.',
      homeOk
    ),
    story: [
      draft(
        'shifts.exit.story.1',
        'I grew up in a small town of 4,000 people with my life already scripted for me: church, mission, marriage, kids.',
        src
      ),
      draft(
        'shifts.exit.story.2',
        'I saw people differently than the people around me did. I came out, and I chose my own life.',
        src
      ),
    ],
    quote: QUOTES.script,
    roles: [approved('shifts.exit.role.1', 'Myself', roleSrc)],
  },
  {
    id: 'shift-middle',
    number: '',
    title: approved('shifts.middle.title', 'The dark middle', homeOk),
    short: approved(
      'shifts.middle.short',
      'I rebuilt by choosing to live my life creatively.',
      homeOk
    ),
    story: [
      draft(
        'shifts.middle.story.1',
        'I dealt with significant health issues that nearly cost me my life.',
        'CREATIVE_BRIEF §11 (approved health wording, first person)'
      ),
      draft(
        'shifts.middle.story.2',
        'I rebuilt by choosing to live my life creatively: design, music, learning, and my own body.',
        src
      ),
    ],
    roles: [
      approved('shifts.middle.role.1', 'Creator', roleSrc),
      approved('shifts.middle.role.2', 'Musician', roleSrc),
      approved('shifts.middle.role.3', 'Learner', roleSrc),
    ],
  },
  {
    id: 'shift-build',
    number: 'Shift 1',
    title: approved('shifts.build.title', 'The build', homeOk),
    short: approved(
      'shifts.build.short',
      'From nothing to designer, developer, then solutions architect.',
      homeOk
    ),
    story: [
      draft(
        'shifts.build.story.1',
        'From nothing to graphic designer, then web developer, then solutions architect. Everything that I wanted.',
        src
      ),
      draft(
        'shifts.build.story.2',
        'Along the way I taught web development as an adjunct professor.',
        'USER_PERSONA_TERENCE §3 (Teacher, adjunct professor) + fact sheet'
      ),
    ],
    roles: [
      approved('shifts.build.role.1', 'Designer', roleSrc),
      approved('shifts.build.role.2', 'Developer', roleSrc),
      approved('shifts.build.role.3', 'Architect', roleSrc),
      approved('shifts.build.role.4', 'Teacher', roleSrc),
    ],
  },
  {
    id: 'shift-refusal',
    number: 'Shift 2',
    title: approved('shifts.refusal.title', 'The refusal', homeOk),
    short: approved(
      'shifts.refusal.short',
      'At a fork, I chose the unknown on purpose.',
      homeOk
    ),
    story: [
      draft(
        'shifts.refusal.story.1',
        "Then I reached a fork: shifting roles and more work that didn't align with who I truly wanted to become.",
        'CREATIVE_BRIEF §11 (approved career wording, first person)'
      ),
      draft(
        'shifts.refusal.story.2',
        'I chose the unknown as my chosen identity: Ph.D. student, solopreneur, founder, author.',
        src
      ),
    ],
    quote: QUOTES.chosen,
    roles: [
      approved('shifts.refusal.role.1', 'Scholar', roleSrc),
      approved('shifts.refusal.role.2', 'Researcher', roleSrc),
      approved('shifts.refusal.role.3', 'Solopreneur', roleSrc),
      approved('shifts.refusal.role.4', 'Founder', roleSrc),
      approved('shifts.refusal.role.5', 'Coach', roleSrc),
      approved('shifts.refusal.role.6', 'Mentor', roleSrc),
    ],
  },
  {
    id: 'shift-launch',
    number: 'Shift 3',
    title: approved('shifts.launch.title', 'The launch', homeOk),
    short: approved(
      'shifts.launch.short',
      '1,200+ pages in under two months. Now: author.',
      homeOk
    ),
    story: [
      draft(
        'shifts.launch.story.1',
        'I wrote a 1,200+ page manuscript in under two months. It became The Resonance Core Framework™, now open for pre-order.',
        'CREATIVE_BRIEF §11 (book speed) + fact sheet'
      ),
      draft(
        'shifts.launch.story.2',
        'Next in the series: The Resonant Body, because every decision begins in the body.',
        'USER_PERSONA_TERENCE §1, §4; draft'
      ),
    ],
    quote: QUOTES.authorNext,
    roles: [approved('shifts.launch.role.1', 'Author', roleSrc)],
  },
];

/** Every role, in the order it was added. The Shift Track stacks these. */
export const ALL_ROLES = SHIFTS.flatMap((s) => s.roles);
