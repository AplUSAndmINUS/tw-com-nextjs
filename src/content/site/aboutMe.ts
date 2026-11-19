/**
 * /about-me copy: the link-in-bio page
 * ====================================
 *
 * The page's job (DESIGN_BRIEF.md §7.3): Terence in 60 seconds for social
 * traffic. Mobile-first, fast, thumb-friendly. It's the one link he hands out,
 * so it stays out of the site nav and sends people to /about (the full story)
 * as a call to action (owner, Checkpoint 1).
 *
 * Order (owner, 2026-11-18, #288): hero → quick links → in 60 seconds
 * (blurb, quick facts, role cards, stats) → the book and the podcast →
 * everything I'm making (Content Hub tiles) → some of the work (portfolio) →
 * off the page (Instagram) → talent bars + I still build → socials → closing.
 *
 * Search wording is a placeholder until Slice 8.
 */

import { approved, draft, existing } from './copy';
import { RCF_PREORDERS_OPEN } from '@/lib/rcf';

const page = 'Existing /about-me copy';

export const ABOUT_ME = {
  hero: {
    eyebrow: existing('aboutMe.hero.eyebrow', "Hi, I'm", page),
  },

  links: {
    label: draft(
      'aboutMe.links.label',
      'Start here',
      'Accessible name for the link stack (DESIGN_BRIEF §8.3); draft'
    ),
    /** The gold pre-order row at the top of the link stack (owner, Checkpoint 4). */
    preorder: approved(
      'aboutMe.links.preorder',
      'Pre-order my book!',
      'Owner, 2026-11-18 (Checkpoint 4)'
    ),
    fullStory: existing('aboutMe.links.fullStory', 'Read my full story', page),
    podcast: existing('aboutMe.links.podcast', 'Listen to the podcast', page),
    instagram: existing(
      'aboutMe.links.instagram',
      'Instagram',
      'Social network name'
    ),
  },

  /** "In 60 seconds": a short blurb and quick facts (owner, Checkpoint 4a). */
  short: {
    eyebrow: approved(
      'aboutMe.short.eyebrow',
      'Three roles, one system',
      'Owner, 2026-11-18 (/about-me spec, #288)'
    ),
    title: existing(
      'aboutMe.short.title',
      'In 60 seconds',
      'Existing /about-me section label'
    ),
    blurb: draft(
      'aboutMe.short.blurb',
      "I'm a creator, researcher, author, and architect of human-centered systems, based in Salt Lake City. I've walked away from a life someone else scripted for me twice, and rebuilt each time through creativity, music, learning, and my own body. Everything I make now, from the book to the podcast to my Ph.D. research, is about helping people act on who they really are.",
      'USER_PERSONA_TERENCE §2 (Canonical Statement facts), first person; draft'
    ),
    factsLabel: draft(
      'aboutMe.short.factsLabel',
      'Quick facts',
      'UI label; draft'
    ),
    facts: [
      // The pre-order claim follows the site-wide switch (#273).
      draft(
        'aboutMe.fact.author',
        RCF_PREORDERS_OPEN
          ? 'Author of The Resonance Core Framework™ (pre-orders open; release targeted for Q1 2027)'
          : 'Author of The Resonance Core Framework™ (release targeted for Q1 2027)',
        'Fact sheet'
      ),
      draft(
        'aboutMe.fact.host',
        'Host of The Resonant Identity podcast',
        'Fact sheet'
      ),
      draft(
        'aboutMe.fact.founder',
        'Founder & Chief Architect, Fluxline Resonance Group',
        'Fact sheet'
      ),
      draft(
        'aboutMe.fact.phd',
        'Ph.D. student, Technology Information Management (National University)',
        'Fact sheet'
      ),
      existing(
        'aboutMe.fact.years',
        '20+ years in design, development, architecture & product management',
        'Existing stat (/about, Home)'
      ),
      draft(
        'aboutMe.fact.teacher',
        'Former adjunct professor, Salt Lake Community College',
        'Fact sheet (2016–2021)'
      ),
      draft(
        'aboutMe.fact.music',
        'Pianist since childhood, and a NASM Certified Personal Trainer',
        'USER_PERSONA_TERENCE §7 + certifications'
      ),
    ],
  },

  projects: {
    title: existing('aboutMe.projects.title', 'Some of the work', page),
    lede: existing(
      'aboutMe.projects.lede',
      'Platforms and systems I architected, led, or built.',
      page
    ),
    more: existing('aboutMe.projects.more', 'View the full portfolio', page),
  },

  photos: {
    title: draft(
      'aboutMe.photos.title',
      'Off the page',
      'DESIGN_BRIEF §7.3 ("the body" + Instagram set); draft'
    ),
    follow: draft(
      'aboutMe.photos.follow',
      'Follow along on Instagram',
      'DESIGN_BRIEF §7.3; draft'
    ),
  },

  buildingTitle: existing(
    'aboutMe.building.title',
    'The book and the podcast',
    page
  ),

  book: {
    label: existing('aboutMe.book.label', 'The book', page),
    badge: existing('aboutMe.book.badge', 'Pre-orders open', page),
    preorder: existing('aboutMe.book.preorder', 'Pre-order the book', page),
    explore: existing('aboutMe.book.explore', 'Explore the framework', page),
  },

  podcast: {
    label: existing('aboutMe.podcast.label', 'The podcast', page),
    title: existing(
      'aboutMe.podcast.title',
      'The Resonant Identity',
      'Podcast name'
    ),
    meta: existing('aboutMe.podcast.meta', 'Hosted by Terence Waters', page),
    text: existing(
      'aboutMe.podcast.text',
      'Identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity. Built on The Resonance Core Framework™, for people in a season of becoming.',
      page
    ),
    listenOn: existing('aboutMe.podcast.listenOn', 'Listen on', page),
    listen: existing('aboutMe.podcast.listen', 'Listen to the podcast', page),
    browse: existing('aboutMe.podcast.browse', 'Browse episodes', page),
  },

  talents: {
    title: existing('aboutMe.talents.title', 'What I bring to the table', page),
    more: existing(
      'aboutMe.talents.more',
      'All skills, degrees & certifications',
      page
    ),
  },

  stillBuild: {
    title: draft(
      'aboutMe.stillBuild.title',
      'I still build',
      'Same title as /about#build; draft'
    ),
    link: approved(
      'aboutMe.stillBuild.link',
      "See what I'm building now",
      'Owner, 2026-11-18 (Home, Checkpoint 2a)'
    ),
    /** Under the callout (owner, #288). `emphasis` parts are bold italic. */
    more: [
      {
        text: approved(
          'aboutMe.stillBuild.more.1',
          'I build, create, design, and architect ',
          'Owner, 2026-11-18 (/about-me spec, #288)'
        ),
      },
      {
        text: approved(
          'aboutMe.stillBuild.more.2',
          'because I love doing so!',
          'Owner, 2026-11-18 (/about-me spec, #288)'
        ),
        emphasis: true,
      },
      {
        text: approved(
          'aboutMe.stillBuild.more.3',
          " Seeing a unique identity unfold in story, build, design, and apps brings about a system's Identity Coherence into a tangible asset. ",
          'Owner, 2026-11-18 (/about-me spec, #288)'
        ),
      },
      {
        text: approved(
          'aboutMe.stillBuild.more.4',
          "That's what I do.",
          'Owner, 2026-11-18 (/about-me spec, #288)'
        ),
        emphasis: true,
      },
    ],
  },

  socials: {
    title: existing('aboutMe.socials.title', 'Find me online', page),
  },

  closing: {
    kicker: existing(
      'aboutMe.closing.kicker',
      'That was the short version',
      page
    ),
    title: existing('aboutMe.closing.title', 'Want to go deeper?', page),
    body: existing(
      'aboutMe.closing.body',
      'Read the full story, start a conversation, or dig into the framework behind all of it.',
      page
    ),
  },
} as const;

/**
 * Portfolio entries that match the projects on /about (owner, Checkpoint 4a):
 * Fluxline Resonance Group 2.0, MyIntermountain Unified Intranet, MyHealth+.
 */
export const ABOUT_ME_PROJECT_SLUGS = [
  'fluxline-pro-website',
  'myintermountain-sharepoint-intranet',
  'myhealth-2-0-patient-portal',
] as const;
