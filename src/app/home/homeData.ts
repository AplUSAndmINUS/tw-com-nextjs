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
 */

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
    title: 'Design & Identity',
    slug: 'design',
    category: 'Service',
    excerpt:
      'Brand systems, design systems, and product UX that make complexity feel calm.',
    blurb:
      'From brand identity through production-ready design systems, I make complex products feel calm, coherent, and unmistakably yours.',
    points: [
      'Brand & visual identity',
      'Design systems & tokens',
      'Product & web UX',
    ],
  },
  {
    title: 'Architecture & Development',
    slug: 'development',
    category: 'Service',
    excerpt:
      'Full-stack and enterprise platform architecture, from data model to deploy.',
    blurb:
      'Full-stack engineering and platform architecture — the structural layer that makes everything above it possible and maintainable.',
    points: [
      'Front-end & full-stack build',
      'Platform & cloud architecture',
      'Performance & accessibility',
    ],
  },
  {
    title: 'Enterprise Consulting',
    slug: 'consulting',
    category: 'Service',
    excerpt:
      'ITSM, systems strategy, and the operating models teams actually keep.',
    blurb:
      'Systems strategy and IT service management for organizations that need clarity across people, process, and technology.',
    points: [
      'ITSM & service design',
      'Systems & process strategy',
      'Technical due diligence',
    ],
  },
  {
    title: 'Design Facilitation',
    slug: 'facilitation',
    category: 'Service',
    excerpt:
      'Workshops that turn messy problems into shared, buildable direction.',
    blurb:
      'Facilitated workshops that align teams fast — turning ambiguity into a direction everyone can see and build toward.',
    points: [
      'Discovery & alignment workshops',
      'Journey & service mapping',
      'Roadmap facilitation',
    ],
  },
  {
    title: 'Identity Coaching',
    slug: 'coaching',
    category: 'Service',
    excerpt:
      'One-on-one work rebuilding the internal systems that shape how you lead.',
    blurb:
      'One-on-one coaching for founders and leaders — rebuilding the internal systems and narratives that shape how you show up.',
    points: ['1:1 identity coaching', 'Narrative & values work', 'Founder support'],
  },
  {
    title: 'Fractional Leadership',
    slug: 'fractional',
    category: 'Service',
    excerpt:
      'Design and technology leadership, embedded with your team for a season.',
    blurb:
      'Embedded design and technology leadership for a season — senior direction without a full-time hire.',
    points: [
      'Fractional design lead',
      'Fractional CTO / architect',
      'Team mentorship',
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
  { name: 'Facebook', icon: 'facebook', href: '#' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'TikTok', icon: 'tiktok', href: '#' },
  { name: 'GitHub', icon: 'github', href: 'https://github.com/AplUSAndmINUS' },
  { name: 'Threads', icon: 'threads', href: '#' },
  { name: 'Email', icon: 'mail', href: 'mailto:terence@terencewaters.com' },
];

/** The wider set shown in the newsletter and contact sections. */
export const wideSocials: HomeSocial[] = [
  { name: 'LinkedIn', icon: 'linkedin', href: '#' },
  { name: 'GitHub', icon: 'github', href: 'https://github.com/AplUSAndmINUS' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'YouTube', icon: 'youtube', href: '#' },
  { name: 'Spotify', icon: 'spotify', href: '#' },
  { name: 'Apple Podcasts', icon: 'apple-podcasts', href: '#' },
  { name: 'Threads', icon: 'threads', href: '#' },
  { name: 'RSS', icon: 'rss', href: '#' },
];
