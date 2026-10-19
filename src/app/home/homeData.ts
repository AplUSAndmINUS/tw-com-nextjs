/**
 * Static homepage data
 * ====================
 *
 * The service catalogue and the social links shown on the homepage. Kept out of
 * the client component so the data reads cleanly and can be reused (the footer
 * and contact section share the social set).
 *
 * Services are delivered through Fluxline Resonance Group, so each links out to
 * fluxline.pro. The homepage opens a summary drawer first (so the visitor stays
 * on TW.com), with the drawer's CTA going to the full service page in a new tab.
 *
 * This catalogue is the whole of it — the standalone /services pages were
 * retired and their copy folded into `blurb` and `points` here, so the drawer
 * is now the canonical on-site description of each offering.
 */

import { SOCIAL_URLS } from '@/lib/socials';

export interface HomeService {
  title: string;
  slug: string;
  category: string;
  /** Short line for the card. */
  excerpt: string;
  /** Fuller summary for the drawer. */
  blurb: string;
  /** "What's included" bullets in the drawer. */
  points: string[];
}

const FLUXLINE_SERVICES = 'https://fluxline.pro/services';

export const homeServices: HomeService[] = [
  {
    title: 'Brand & Experience Design',
    slug: 'design',
    category: 'Service',
    excerpt:
      'Brand systems, design systems, and product UX that make complexity feel calm.',
    blurb:
      'Brand identities and digital experiences that look good and feel aligned with who you are. Every logo, layout, and interface is designed to carry your story — from first launch through legacy.',
    points: [
      'Visual identity & brand architecture',
      'Digital experience design',
      'Modular design systems & tokens',
      'User-centered research and testing',
      'Symbolic, emotionally resonant direction',
      'Cross-platform consistency & responsiveness',
    ],
  },
  {
    title: 'Web Development & Digital Architecture',
    slug: 'development',
    category: 'Service',
    excerpt:
      'Full-stack and enterprise platform architecture, from data model to deploy.',
    blurb:
      'Websites and web apps built for the long run — from a simple site to a full platform. Modern frameworks, clear UX, and infrastructure that stays maintainable after launch.',
    points: [
      'Custom web applications & platforms',
      'Full-stack build with long-term maintainability',
      'Cloud architecture & CI/CD pipelines',
      'API design and third-party integrations',
      'Performance, scalability, and accessibility',
    ],
  },
  {
    title: 'Business Strategy & Systems Alignment',
    slug: 'consulting',
    category: 'Service',
    excerpt:
      'ITSM, systems strategy, and the operating models teams actually keep.',
    blurb:
      'The practical path forward: what to prioritize, what to simplify, and how to align execution with real business outcomes — across people, process, and technology.',
    points: [
      'Strategic systems design & operational optimization',
      'ITSM and service design',
      'Modular frameworks for scalable growth',
      'Tech integration & infrastructure planning',
      'Change management and transformation facilitation',
      'Technical due diligence',
    ],
  },
  {
    title: 'The Resonance Core Framework™',
    slug: 'resonance-core',
    category: 'Coaching',
    excerpt:
      'Identity work for creators and leaders building what they are becoming.',
    blurb:
      'A guided, structured process for decoding your cues, reframing your narratives, and authoring the identity you choose to live from. Not generic coaching — identity work, narrative work, and embodiment work woven into one system.',
    points: [
      'Understand the signals your body and emotions send',
      "Reveal the stories you've been living inside",
      'Name the outdated identities shaping your choices',
      'Update your internal predictions and interpretations',
      "Choose the identity that supports who you're becoming",
      'Take aligned action from that chosen identity',
    ],
  },
  {
    title: 'Personal Training & Wellness',
    slug: 'personal-training',
    category: 'Coaching',
    excerpt:
      'Embodied identity work — strength, mobility, and a practice you keep.',
    blurb:
      'Physical training with emotional intelligence. Whether you are returning to movement, working through chronic pain, or pushing your limits, the program is built around your schedule, your body, and your readiness.',
    points: [
      'Personalized fitness and wellness coaching',
      'Adaptive training systems for all bodies',
      'Movement patterns & chronic pain management',
      'Mindset support and behavioral change',
      'Flexible scheduling and remote options',
    ],
  },
];

/** Full fluxline.pro URL for a service slug. */
export function serviceHref(slug: string): string {
  return `${FLUXLINE_SERVICES}/${slug}`;
}

export interface HomeSocial {
  name: string;
  /** File under /assets/icons (served from public via the icon copy step). */
  icon: string;
  href: string;
}

/** The About-rail social set. */
export const aboutSocials: HomeSocial[] = [
  { name: 'Facebook', icon: 'facebook', href: SOCIAL_URLS.facebook },
  { name: 'Instagram', icon: 'instagram', href: SOCIAL_URLS.instagram },
  { name: 'TikTok', icon: 'tiktok', href: SOCIAL_URLS.tiktok },
  { name: 'Twitch', icon: 'twitch', href: SOCIAL_URLS.twitch },
  { name: 'Reddit', icon: 'reddit', href: SOCIAL_URLS.reddit },
  { name: 'GitHub', icon: 'github', href: SOCIAL_URLS.github },
  { name: 'Threads', icon: 'threads', href: SOCIAL_URLS.threads },
  { name: 'Email', icon: 'mail', href: SOCIAL_URLS.email },
];

/** The wider set shown in the newsletter and contact sections. */
export const wideSocials: HomeSocial[] = [
  { name: 'LinkedIn', icon: 'linkedin', href: SOCIAL_URLS.linkedin },
  { name: 'GitHub', icon: 'github', href: SOCIAL_URLS.github },
  { name: 'Instagram', icon: 'instagram', href: SOCIAL_URLS.instagram },
  { name: 'YouTube', icon: 'youtube', href: SOCIAL_URLS.youtube },
  { name: 'TikTok', icon: 'tiktok', href: SOCIAL_URLS.tiktok },
  { name: 'Twitch', icon: 'twitch', href: SOCIAL_URLS.twitch },
  { name: 'Reddit', icon: 'reddit', href: SOCIAL_URLS.reddit },
  { name: 'Spotify', icon: 'spotify', href: SOCIAL_URLS.spotify },
  {
    name: 'Apple Podcasts',
    icon: 'apple-podcasts',
    href: SOCIAL_URLS.applePodcasts,
  },
  { name: 'Threads', icon: 'threads', href: SOCIAL_URLS.threads },
  { name: 'Podcast RSS feed', icon: 'rss', href: SOCIAL_URLS.podcastRss },
];
