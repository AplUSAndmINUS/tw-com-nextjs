/**
 * Home page copy
 * ==============
 *
 * The homepage's job (DESIGN_BRIEF.md §7.1): "Hey, this is me, and this is
 * what I do." The big picture in one scroll, in the message order of
 * CREATIVE_BRIEF.md §6: who → the hook → the Shifts → what I stand for →
 * what I'm building → latest → let's talk.
 *
 * Identity, values, quotes and the Shifts come from identity.ts and
 * shifts.ts; only the words that belong to this page live here. Search-result
 * wording (title, description) is a placeholder until Slice 8.
 */

import { approved, draft, existing } from './copy';

const brief = (s: string) =>
  `DESIGN_BRIEF §7.1 (${s}); approved by Terence at Checkpoint 2a (2026-11-18)`;

export const HOME = {
  meta: {
    title: draft(
      'home.meta.title',
      'Terence Waters: Creator, Researcher, Author',
      'INITIAL_PLAN §8.1 candidate, kept in Slice 8 (owns "Terence Waters")'
    ),
  },

  hero: {
    eyebrow: existing(
      'home.hero.eyebrow',
      "Hi there 👋 I'm",
      'Home hero (CREATIVE_BRIEF §8.3: keep the warmth)'
    ),
    preorder: existing(
      'home.hero.preorder',
      'Pre-order the book',
      'Existing pre-order button label'
    ),
    readStory: existing(
      'home.hero.readStory',
      'Read my full story',
      'Existing /about-me button label'
    ),
  },

  hook: {
    kicker: approved(
      'home.hook.kicker',
      'MY RCF BOOK',
      'Owner, 2026-11-18 (home spec, #285)'
    ),
    heading: approved(
      'home.hook.heading',
      'I wrote this book to help people act on their identity, not just read about it.',
      'Owner, 2026-11-18 (Checkpoint 2a)'
    ),
    subtitle: approved(
      'home.hook.subtitle',
      '"Because I hate self-help books."',
      'Owner, 2026-11-18 (home spec, #285)'
    ),
    why: approved(
      'home.hook.why',
      'That\'s why I wrote The Resonance Core Framework™ to be a "self-action" book, not a "self no-help" one. Because I want you to succeed in making yourself the best version of yourself.',
      'Owner, 2026-11-18 (home spec, #285)'
    ),
    promise: approved(
      'home.hook.promise',
      'And my book will help you get there.',
      'Owner, 2026-11-18 (Checkpoint 2a)'
    ),
    preorderLabel: existing(
      'home.hook.preorderLabel',
      'Now open for pre-order',
      'Home pre-order callout'
    ),
    preorderHeading: existing(
      'home.hook.preorderHeading',
      'Pre-order my book on the Fluxline Store.',
      'Home pre-order callout'
    ),
    preorderBody: existing(
      'home.hook.preorderBody',
      'Release is targeted for Q1 2027.',
      'Home pre-order callout'
    ),
    preview: existing(
      'home.hook.preview',
      'Preview the Framework',
      'Home book section button'
    ),
  },

  shifts: {
    title: approved('home.shifts.title', 'The Shifts', brief('The Shifts')),
    lede: draft(
      'home.shifts.lede',
      'Each Shift added to who I am. Nothing got replaced.',
      'Shortened from the Checkpoint 2a lede, as the owner asked (home spec, #285); awaiting approval'
    ),
    /** From the old home page's "Hi! I'm Terence" section (owner: move them here). */
    story: [
      existing(
        'home.shifts.story.1',
        'My work sits at the intersection of architecture, identity, and transformation. I help people understand the systems they run on — and rebuild the ones that no longer serve them.',
        'Old home About section, paragraph 1'
      ),
      existing(
        'home.shifts.story.2',
        "I'm a systems architect by training, a designer by instinct, and a coach by necessity. For 20+ years I've worked across design, development, architecture, and product management, and I've been consulting for 3+ years, translating complexity into clarity for founders and mission-driven teams.",
        'Old home About section, paragraph 2'
      ),
    ],
    quote: existing(
      'home.shifts.quote',
      'Structure. Clarity. A way to understand who I was becoming and why.',
      'Old home About section; the owner made it the blockquote (#285)'
    ),
    rolesLabel: approved(
      'home.shifts.rolesLabel',
      'Roles added',
      'UI label for each Shift’s role list; approved by Terence at Checkpoint 2a (2026-11-18)'
    ),
    stackLabel: approved(
      'home.shifts.stackLabel',
      'So far',
      'UI label for the running total of roles; approved by Terence at Checkpoint 2a (2026-11-18)'
    ),
    more: existing(
      'home.shifts.more',
      'Read the full story',
      'Existing /about-me button label'
    ),
  },

  standFor: {
    title: approved(
      'home.standFor.title',
      'What I stand for',
      brief('What I stand for')
    ),
    humanElementLead: approved(
      'home.standFor.humanElementLead',
      'It all starts with The Human Element:',
      'Lead-in for the approved gloss (DESIGN_BRIEF §7.1); approved by Terence at Checkpoint 2a (2026-11-18)'
    ),
    more: approved(
      'home.standFor.more',
      'More on what I stand for',
      brief('link to /about#values')
    ),
  },

  building: {
    title: approved(
      'home.building.title',
      "What I'm building",
      brief("What I'm building")
    ),
    book: {
      text: approved(
        'home.building.book',
        '31 chapters in three parts, written to be acted on, not just read.',
        'RCF_BOOK.structure + CREATIVE_BRIEF §8.1; approved by Terence at Checkpoint 2a (2026-11-18)'
      ),
    },
    podcast: {
      title: existing(
        'home.building.podcast.title',
        'The Resonant Identity',
        'Podcast name'
      ),
      text: existing(
        'home.building.podcast.text',
        'Where the framework gets talked through out loud, episode by episode, for people in a season of becoming.',
        '/about-me podcast role card (moves here; the card is retired in Slice 4)'
      ),
      link: existing(
        'home.building.podcast.link',
        'Browse episodes',
        'Existing /about-me button label'
      ),
    },
    research: {
      title: approved(
        'home.building.research.title',
        'The research',
        brief('research')
      ),
      text: approved(
        'home.building.research.text',
        'My Ph.D. work studies how identity-aligned decisions change the systems around us.',
        'CREATIVE_BRIEF §8.4 short bio, first person; approved by Terence at Checkpoint 2a (2026-11-18)'
      ),
    },
    teaching: {
      title: approved(
        'home.building.teaching.title',
        'Speaking and teaching',
        brief('speaking')
      ),
      text: approved(
        'home.building.teaching.text',
        'Workshops, courses, and mentoring now, with keynotes to come.',
        'USER_PERSONA_TERENCE §8; approved by Terence at Checkpoint 2a (2026-11-18)'
      ),
    },
    stillBuildLink: approved(
      'home.building.stillBuildLink',
      "See what I'm building now",
      'Owner, 2026-11-18 (Checkpoint 2a)'
    ),
  },

  contentHub: {
    cta: approved(
      'home.contentHub.cta',
      "See what I've been building",
      'Owner, 2026-11-18 (home spec, #285)'
    ),
  },

  latest: {
    title: approved('home.latest.title', 'Latest', brief('Latest')),
    hubLink: existing(
      'home.latest.hubLink',
      'Explore the full Content Hub',
      'Existing home link label'
    ),
  },

  talk: {
    title: approved('home.talk.title', "Let's talk", brief("Let's talk")),
    newsletterTitle: existing(
      'home.talk.newsletterTitle',
      'Get new writing in your inbox',
      'Existing home newsletter heading'
    ),
  },
} as const;
