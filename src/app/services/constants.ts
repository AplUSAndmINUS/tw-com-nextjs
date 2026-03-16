import { type OfferItem } from '@/components/WhatWeOffer';
import RCFLogo from '@/assets/images/RCF_logo.jpeg';
import PortfolioPortrait from '@/assets/images/Portfolio1280x1815.jpg';
import GitHubPortrait from '@/assets/images/GitHubPortrait.jpg';
import CoachingPortrait from '@/assets/images/EducationTrainingPortrait.jpg';
import PersonalTrainingPortrait from '@/assets/images/PersonalTrainingPortrait.jpg';

export type ServiceConfig = {
  title: string;
  heroDescription: string;
  blurb: string;
  seoDescription: string;
  offers: OfferItem[];
  icon: string;
  image: {
    src: string;
    alt: string;
    title: string;
  };
  fluxlineUrl?: string;
};

export const SERVICES: Record<string, ServiceConfig> = {
  design: {
    title: 'Design',
    heroDescription:
      'Design direction for digital products and content systems that need both clarity and impact.',
    seoDescription:
      'Visual identity and user experience design for brands that need clarity, impact, and authentic alignment with your story.',
    blurb:
      "I create brand identities and digital experiences that look good and feel aligned with who you are. Every logo, layout, and interface is designed to reflect your story and connect with your audience. \nWhether you're launching, scaling, or building your legacy, I design with care, precision, and strategic thinking.",
    offers: [
      { text: 'Visual identity and brand architecture' },
      { text: 'Digital experience design' },
      { text: 'Modular design systems' },
      { text: 'Symbolic and emotionally resonant design' },
      { text: 'User-centered design methodologies and thinking' },
      { text: 'Cross-platform consistency and responsiveness' },
    ],
    icon: 'DesignIdeasFilled',
    image: {
      src: PortfolioPortrait.src,
      alt: 'Design service',
      title: 'Design',
    },
    fluxlineUrl: 'https://fluxline.pro/services/design',
  },
  development: {
    title: 'Web & App Development',
    heroDescription:
      'Modern web development support focused on delivery quality, maintainability, and long-term velocity.',
    seoDescription:
      'Custom web development for platforms that are fast, secure, and built to scale with intuitive interfaces and reliable infrastructure.',
    blurb:
      "Design and build your website or web app, from simple sites to full platforms. \nI create custom web applications with intuitive interfaces and reliable infrastructure. Whether you're launching an MVP, scaling a full-stack platform, or building a custom app, our development process combines clear user experience with long-term maintainability. \nI use modern frameworks and best practices to ensure your product is fast, secure, and built to grow with your vision.",
    offers: [
      { text: 'Custom web applications and digital platforms' },
      { text: 'Full-stack development with long-term maintainability' },
      { text: 'Intuitive UX and resilient infrastructure' },
      { text: 'CI/CD pipelines and cloud architecture' },
      { text: 'API design and third-party integrations' },
      { text: 'Performance optimization and scalability solutions' },
    ],
    icon: 'CodeFilled',
    image: {
      src: GitHubPortrait.src,
      alt: 'Development service',
      title: 'Development',
    },
    fluxlineUrl: 'https://fluxline.pro/services/development',
  },
  consulting: {
    title: 'IT & Business Consulting',
    heroDescription:
      'Strategic consulting for founders and teams making high-stakes product and technical decisions.',
    seoDescription:
      'Strategic consulting for founders and teams navigating product, technical, and operational complexity with actionable guidance.',
    blurb:
      'Together, we will focus on the practical path forward: what to prioritize, what to simplify, and how to align execution with real business outcomes. \nMy consulting services provide actionable insights and strategic guidance to help you navigate complex challenges and make informed decisions that drive growth and success.',
    offers: [
      { text: 'Strategic systems design and operational optimization' },
      { text: 'Modular frameworks for scalable growth' },
      { text: 'Tech integration and infrastructure planning' },
      { text: 'Business soul alignment and values-driven strategy' },
      { text: 'Change management and transformation facilitation' },
      { text: 'Leadership coaching and team dynamics' },
    ],
    icon: 'PeopleCommunityRegular',
    image: {
      src: CoachingPortrait.src,
      alt: 'Consulting service',
      title: 'Consulting',
    },
    fluxlineUrl: 'https://fluxline.pro/services/consulting',
  },
  'resonance-core': {
    title: 'The Resonance Core Framework™',
    heroDescription:
      'Identity-centered guidance for creators and leaders building work that reflects who they are becoming.',
    seoDescription:
      'Transform your life through the Resonance Core Framework™—identity work, narrative reframing, and embodied alignment for creators and leaders.',
    blurb:
      "A transformational system for decoding your cues, reframing your narratives, and authoring the identity you choose to live from. \nThe Resonance Core Framework™ is a guided, structured process that helps you understand the patterns shaping your life — somatic, emotional, narrative, and identity based. Through archetypal mapping, reflective inquiry, and identity recalibration, you learn to align your inner world with the life, work, and relationships you're trying to build. \nThis isn't generic coaching — this is identity work, narrative work, and embodiment work — woven into a single, coherent system.",
    offers: [
      { text: 'Understand the signals your body and emotions send' },
      { text: "Reveal the stories you've been living inside" },
      { text: 'Name the outdated identities shaping your choices' },
      { text: 'Update your internal predictions and interpretations' },
      { text: "Choose the identity that supports who you're becoming" },
      { text: 'Take aligned action from your chosen identity' },
    ],
    icon: 'HeartFilled',
    image: {
      src: RCFLogo.src,
      alt: 'The Resonance Core Framework™',
      title: '',
    },
    fluxlineUrl: 'https://fluxline.pro/services/resonance-core',
  },
  'personal-training': {
    title: 'Personal Training & Wellness',
    heroDescription: 'Embodied identity work through physical transformation.',
    seoDescription:
      'Physical training with emotional intelligence—build strength, reduce pain, and create a sustainable practice tailored to your goals, body, and life.',
    blurb:
      "Physical training with emotional intelligence—build strength, reduce pain, and create a sustainable practice. Whether you're returning to movement, working through chronic pain, or pushing your physical limits, your training path is designed with care and precision. \nThis is embodied identity work—training that aligns your physical practice with who you're becoming. Every program is tailored to your schedule, body type, and readiness, working with all bodies, all backgrounds, and all starting points.",
    offers: [
      { text: 'Personalized fitness and wellness coaching' },
      { text: 'Adaptive training systems for all bodies' },
      { text: 'Movement patterns and chronic pain management' },
      { text: 'Emotional intelligence in physical transformation' },
      { text: 'Mindset support and behavioral change strategies' },
      { text: 'Flexible scheduling and remote coaching options' },
    ],
    icon: 'AccessibilityRegular',
    image: {
      src: PersonalTrainingPortrait.src,
      alt: 'Personal Training & Wellness',
      title: 'Personal Training & Wellness',
    },
    fluxlineUrl: 'https://fluxline.pro/services/personal-training',
  },
};
