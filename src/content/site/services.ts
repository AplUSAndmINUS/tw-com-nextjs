/**
 * What I do now, and "I still build"
 * ==================================
 *
 * The redesign moves services off the homepage (no service grid, no drawers)
 * and into short on-site summaries on /about#build, with a two-line version on
 * /about-me (DESIGN_BRIEF.md §7.2–7.3, decision C4 in INITIAL_PLAN.md).
 *
 * Names and one-liners are the existing offering copy (they were the homepage
 * service cards), so they keep matching fluxline.pro. The long drawer copy
 * described Fluxline's packages and is not carried over.
 *
 * Order follows USER_PERSONA_TERENCE.md §8: steady work first, then the work
 * he still offers but is handing more of to AI-assisted delivery.
 */

import { draft, existing } from './copy';

const FLUXLINE_SERVICES = 'https://www.fluxline.pro/services';

/** Full fluxline.pro URL for a service slug (trailing slash, as fluxline.pro serves it). */
export function serviceHref(slug = ''): string {
  return slug ? `${FLUXLINE_SERVICES}/${slug}/` : `${FLUXLINE_SERVICES}/`;
}

export interface BuildService {
  slug: string;
  name: string;
  summary: string;
}

const svc = 'Existing homepage service card (homeData.ts)';

export const BUILD_SERVICES: BuildService[] = [
  {
    slug: 'consulting',
    name: existing(
      'services.consulting.name',
      'Business Strategy & Systems Alignment',
      svc
    ),
    summary: existing(
      'services.consulting.summary',
      'ITSM, systems strategy, and the operating models teams actually keep.',
      svc
    ),
  },
  {
    slug: 'development',
    name: existing(
      'services.development.name',
      'Web Development & Digital Architecture',
      svc
    ),
    summary: existing(
      'services.development.summary',
      'Full-stack and enterprise platform architecture, from data model to deploy.',
      svc
    ),
  },
  {
    slug: 'design',
    name: existing('services.design.name', 'Brand & Experience Design', svc),
    summary: existing(
      'services.design.summary',
      'Brand systems, design systems, and product UX that make complexity feel calm.',
      svc
    ),
  },
  {
    slug: 'personal-training',
    name: existing(
      'services.training.name',
      'Personal Training & Wellness',
      svc
    ),
    summary: existing(
      'services.training.summary',
      'Embodied identity work — strength, mobility, and a practice you keep.',
      svc
    ),
  },
];

/** "Hey, yes… I STILL love architecting and creating things…" lives in identity QUOTES. */

/**
 * The work that's growing (persona §8, "⬆️ Growing"). Shown on /about as
 * "What I do now" and summarized on Home's "What I'm building".
 */
export interface GrowingWork {
  /** Stable key (the page picks an icon by it). */
  key:
    | 'coaching'
    | 'podcast'
    | 'writing'
    | 'research'
    | 'speaking'
    | 'teaching'
    | 'founders';
  text: string;
}

const growth = 'USER_PERSONA_TERENCE §8';

export const GROWING_WORK: GrowingWork[] = [
  {
    key: 'coaching',
    text: draft(
      'services.growing.coaching',
      'Coaching with The Resonance Core Framework™',
      growth
    ),
  },
  {
    key: 'podcast',
    text: draft(
      'services.growing.podcast',
      'Podcasting, on my show and as a guest on yours',
      growth
    ),
  },
  {
    key: 'writing',
    text: draft('services.growing.writing', 'Writing', growth),
  },
  {
    key: 'research',
    text: draft('services.growing.research', 'Research (the Ph.D.)', growth),
  },
  {
    key: 'speaking',
    text: draft('services.growing.speaking', 'Speaking', growth),
  },
  {
    key: 'teaching',
    text: draft(
      'services.growing.teaching',
      'Teaching: workshops, courses, and mentoring',
      growth
    ),
  },
  {
    key: 'founders',
    text: draft(
      'services.growing.founders',
      'Founder and business networking',
      growth
    ),
  },
];
