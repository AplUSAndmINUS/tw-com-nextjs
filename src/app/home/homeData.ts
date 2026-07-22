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
    title: 'Architecture & Development',
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
    title: 'Enterprise Consulting',
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
    title: 'Design Facilitation',
    slug: 'facilitation',
    category: 'Service',
    excerpt:
      'Workshops that turn messy problems into shared, buildable direction.',
    blurb:
      'Facilitated workshops that align teams fast — turning ambiguity into a direction everyone can see and build toward.',
    points: [
      'Discovery & alignment workshops',
      'Journey and service mapping',
      'Roadmap facilitation',
      'Design-thinking sessions and critiques',
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
      'Team mentorship and capability building',
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
