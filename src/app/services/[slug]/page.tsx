import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { WhatWeOffer, type OfferItem } from '@/components/WhatWeOffer';
import { ConsultationCTA } from '@/app/services/ConsultationCTA';
import RCFLogo from '@/assets/images/RCF_logo.jpeg';
import PortfolioPortrait from '@/assets/images/Portfolio1280x1815.jpg';
import GitHubPortrait from '@/assets/images/GitHubPortrait.jpg';
import CoachingPortrait from '@/assets/images/EducationTrainingPortrait.jpg';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

type ServiceConfig = {
  title: string;
  heroDescription: string;
  blurb: string;
  seoDescription: string;
  offers: OfferItem[];
  image: {
    src: string;
    alt: string;
    title: string;
  };
};

const SERVICES: Record<string, ServiceConfig> = {
  design: {
    title: 'Design Service',
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
    image: {
      src: PortfolioPortrait.src,
      alt: 'Design service',
      title: 'Design',
    },
  },
  development: {
    title: 'Development Service',
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
    image: {
      src: GitHubPortrait.src,
      alt: 'Development service',
      title: 'Development',
    },
  },
  consulting: {
    title: 'Consulting Service',
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
    image: {
      src: CoachingPortrait.src,
      alt: 'Consulting service',
      title: 'Consulting',
    },
  },
  'resonance-core': {
    title: 'Resonance Core Service',
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
    image: {
      src: RCFLogo.src,
      alt: 'Resonance Core service',
      title: '',
    },
  },
};

export async function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES[slug];

  if (!service) {
    return {
      title: 'Service Not Found',
      metadataBase: new URL('https://terencewaters.com'),
      robots: getRobotsConfig(),
    };
  }

  return {
    title: service.title,
    description: service.seoDescription,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${service.title} | Terence Waters`,
      description: service.seoDescription,
      url: `https://terencewaters.com/services/${slug}`,
      siteName: 'Terence Waters',
      type: 'website',
    },
    robots: getRobotsConfig(),
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES[slug];

  if (!service) {
    notFound();
  }

  const paragraphs = service.blurb.split('\n');

  return (
    <PageLayout featureImage={service.image}>
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title={service.title}
          iconName='Settings24Regular'
          backArrow
          backArrowPath='/services'
          description={service.heroDescription}
        />

        <section className='mt-8 mb-12'>
          <div className='space-y-4'>
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={index}
                variant='body'
                className='text-gray-600 dark:text-gray-400 leading-relaxed'
              >
                {paragraph}
              </Typography>
            ))}
          </div>
        </section>

        <section className='mt-12 mb-12'>
          <WhatWeOffer items={service.offers} />
        </section>

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
