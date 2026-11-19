/**
 * /about-me content: the one-page, "link in bio" version of /about
 * ================================================================
 *
 * A landing page you can read in about a minute. It says who Terence is
 * (podcaster, systems architect, business consultant), shows what he's
 * building (The Resonance Core Framework™ and The Resonant Identity), and
 * offers proof (skills, projects, recent writing). Then it hands off to /about
 * for the long version.
 *
 * Nothing here is new copy. Every line is drawn from content already in the
 * repo, and cited per block:
 *   - /about           → src/app/about/aboutData.ts
 *   - skill scores     → src/content/aboutSkills.ts (the same meters /about shows)
 *   - the book         → src/lib/rcf.ts
 *   - the podcast      → src/lib/spreaker.ts + /podcasts/theresonantid
 *   - social links     → src/lib/socials.ts
 *
 * Blog posts and portfolio entries are not listed here. page.tsx loads them
 * from the content system at build time, so the page stays current without
 * edits.
 */

import type { ContentItem } from '@/content/types';
import { ABOUT_SKILLS, type AboutSkill } from '@/content/aboutSkills';
import { SOCIAL_URLS } from '@/lib/socials';
import { serviceHref, type HomeSocial } from '@/app/home/homeData';
import { formatDotDate } from '@/app/home/contentFormat';

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const ROLES_LINE = 'Podcaster · Systems Architect · Business Consultant';

/** From aboutData INTRO_PARAGRAPHS[0], prefixed with the authorship line. */
export const HERO_BODY =
  'Author of The Resonance Core Framework™. I help people and organizations rebuild the parts of themselves they thought were permanent.';

/** Press-kit hook, unchanged from the previous version of this page. */
export const HOOK_QUOTE =
  'I rejected the mission, marriage, children, and six-figure career expected of me in a town of 4,000 people.';

/* ── In 60 seconds ────────────────────────────────────────────────────────── */

export type RoleIcon = 'mic' | 'code' | 'people';

export interface Role {
  icon: RoleIcon;
  label: string;
  title: string;
  text: string;
  /** Two or three short proof points, rendered as chips. */
  points: string[];
  href: string;
  linkLabel: string;
}

export const ROLES: Role[] = [
  {
    icon: 'mic',
    label: 'The podcaster',
    title: 'Host, The Resonant Identity',
    text: 'Where the framework gets talked through out loud, episode by episode, for people in a season of becoming.',
    points: ['Identity', 'Alignment', 'Transitions'],
    href: '#podcast',
    linkLabel: 'About the show',
  },
  {
    icon: 'code',
    label: 'The systems architect',
    title: '20+ years building platforms',
    text: 'Enterprise healthcare platforms, intranets, and cloud delivery on Azure, M365, and Next.js. Complexity turned into something people can run.',
    points: ['IT architecture', 'Azure & M365', 'Design systems'],
    href: '/portfolio',
    linkLabel: 'See the portfolio',
  },
  {
    icon: 'people',
    label: 'The business consultant',
    title: 'Founder, Fluxline Resonance Group',
    text: 'Consulting, systems architecture, and brand identity for founders and teams who need less noise and more structure.',
    points: ['Strategy', 'Systems alignment', 'Brand identity'],
    href: serviceHref('consulting'),
    linkLabel: 'Consulting on Fluxline.pro',
  },
];

/** Same figures as /about (aboutData STATS), kept short for the landing page. */
export const STATS = [
  { value: '20+', label: 'Years in design, development & architecture' },
  { value: '4', label: 'Degrees & certification tracks' },
  { value: '2', label: 'Companies founded or led' },
];

/* ── Talent bars ──────────────────────────────────────────────────────────── */

/**
 * The skills that back up the three roles, picked by name from ABOUT_SKILLS so
 * the scores always match the meters on /about. Listed in descending score,
 * as /about orders them.
 *
 * The names must match aboutSkills.ts exactly. aboutMeData.test.ts fails if
 * one is renamed there, so a bar can't drop off this page unnoticed.
 */
export const TALENT_SKILL_NAMES = [
  'Design thinking',
  'Oral & written communication',
  'Personal & business coaching',
  'Cloud & hybrid solutions',
  'Cross-functional leadership',
  'Systems architecture',
  'IT strategy & consulting',
  'Business structuring',
] as const;

/** Resolve the names above against ABOUT_SKILLS, keeping the order given. */
export function pickSkills(
  names: readonly string[],
  skills: AboutSkill[] = ABOUT_SKILLS
): AboutSkill[] {
  return names.flatMap((name) => {
    const skill = skills.find((s) => s.name === name);
    return skill ? [skill] : [];
  });
}

/* ── Writing ──────────────────────────────────────────────────────────────── */

/**
 * The meta line on a writing card: "2026.11.14 · 6 min read". Joins only the
 * parts that exist, so a post with a missing or invalid date reads "6 min read"
 * rather than " · 6 min read".
 */
export function formatPostMeta(date: string | undefined, read: string): string {
  return [formatDotDate(date), read].filter(Boolean).join(' · ');
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

/**
 * Portfolio entries to show, by slug, in display order: one for each side of
 * the work (business platform, enterprise architecture, the RCF's decision
 * tooling). If a slug goes missing, pickProjects tops the list back up from
 * the newest featured entries.
 */
export const PROJECT_SLUGS = [
  'fluxline-pro-website',
  'myintermountain-sharepoint-intranet',
  'enterprise-dashboard',
] as const;

export const PROJECT_LIMIT = 3;

/**
 * Curated slugs first, in order. Any gaps are then filled from featured
 * entries (the input is already newest first from getAllContent), and last of
 * all from anything else.
 */
export function pickProjects(
  items: ContentItem[],
  slugs: readonly string[] = PROJECT_SLUGS,
  limit: number = PROJECT_LIMIT
): ContentItem[] {
  const picked: ContentItem[] = [];
  const add = (item: ContentItem | undefined) => {
    if (item && picked.length < limit && !picked.includes(item)) {
      picked.push(item);
    }
  };

  slugs.forEach((slug) => add(items.find((item) => item.slug === slug)));
  items.filter((item) => item.featured).forEach(add);
  items.forEach(add);
  return picked;
}

/* ── Writing ──────────────────────────────────────────────────────────────── */

export const POST_LIMIT = 3;

/* ── Get in touch ─────────────────────────────────────────────────────────── */

/** Free consultation booking, the same link /about's closing band uses. */
export const BOOKING_URL = 'https://tidycal.com/terencewaters';
export const EMAIL_ADDRESS = SOCIAL_URLS.email.replace(/^mailto:/, '');

/**
 * The icon row at the bottom of the page: every profile that has an icon in
 * /assets/icons, grouped as contact, then professional, then social, then the
 * podcast platforms. (Xbox is in SOCIAL_URLS but has no icon there, so it is
 * left out.)
 */
export const ABOUT_ME_SOCIALS: HomeSocial[] = [
  { name: 'Email', icon: 'mail', href: SOCIAL_URLS.email },
  { name: 'LinkedIn', icon: 'linkedin', href: SOCIAL_URLS.linkedin },
  { name: 'GitHub', icon: 'github', href: SOCIAL_URLS.github },
  { name: 'Instagram', icon: 'instagram', href: SOCIAL_URLS.instagram },
  { name: 'Facebook', icon: 'facebook', href: SOCIAL_URLS.facebook },
  { name: 'Threads', icon: 'threads', href: SOCIAL_URLS.threads },
  { name: 'YouTube', icon: 'youtube', href: SOCIAL_URLS.youtube },
  { name: 'TikTok', icon: 'tiktok', href: SOCIAL_URLS.tiktok },
  { name: 'Twitch', icon: 'twitch', href: SOCIAL_URLS.twitch },
  { name: 'Spotify', icon: 'spotify', href: SOCIAL_URLS.spotify },
  {
    name: 'Apple Podcasts',
    icon: 'apple-podcasts',
    href: SOCIAL_URLS.applePodcasts,
  },
  { name: 'Podcast RSS feed', icon: 'rss', href: SOCIAL_URLS.podcastRss },
];

/** Where to listen: the subset shown on the podcast card. */
/**
 * Short facts under the podcast blurb, mirroring the book card's fact list so
 * the two cards balance on desktop. Each is the podcast page's own wording:
 * the first two come from its hero description ("a living extension of the
 * Resonance Core Framework™ where identity becomes practice and is formed
 * through coherence"), the third from the platforms in PODCAST_PLATFORMS
 * (lib/spreaker.ts).
 */
export const PODCAST_FACTS = [
  'A living extension of The Resonance Core Framework™',
  'Where identity becomes practice and is formed through coherence',
  'On Spotify, Apple Podcasts, Amazon Music, and more',
] as const;

export const PODCAST_SOCIALS: HomeSocial[] = [
  { name: 'Spotify', icon: 'spotify', href: SOCIAL_URLS.spotify },
  {
    name: 'Apple Podcasts',
    icon: 'apple-podcasts',
    href: SOCIAL_URLS.applePodcasts,
  },
  { name: 'YouTube', icon: 'youtube', href: SOCIAL_URLS.youtube },
  { name: 'Podcast RSS feed', icon: 'rss', href: SOCIAL_URLS.podcastRss },
];
