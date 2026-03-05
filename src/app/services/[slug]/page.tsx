import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import ConsultingPortrait from '@/assets/images/ConsultingPortrait.jpg';
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
    blurb:
      "Visual identity and user experience design so your brand feels cohesive and clear. I create brand identities and digital experiences that look good and feel aligned with who you are. Every logo, layout, and interface is designed to reflect your story and connect with your audience. Whether you're launching, scaling, or building your legacy, I design with care, precision, and strategic thinking.",
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
    blurb:
      "Design and build your website or web app, from simple sites to full platforms. I create custom web applications with intuitive interfaces and reliable infrastructure. Whether you're launching an MVP, scaling a full-stack platform, or building a custom app, our development process combines clear user experience with long-term maintainability. I use modern frameworks and best practices to ensure your product is fast, secure, and built to grow with your vision.",
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
    blurb:
      "Together, we will focus on the practical path forward: what to prioritize, what to simplify, and how to align execution with real business outcomes. My consulting services provide actionable insights and strategic guidance to help you navigate complex challenges and make informed decisions that drive growth and success.",
    image: {
      src: ConsultingPortrait.src,
      alt: 'Consulting service',
      title: 'Consulting',
    },
  },
  'resonance-core': {
    title: 'Resonance Core Service',
    heroDescription:
      'Identity-centered guidance for creators and leaders building work that reflects who they are becoming.',
    blurb:
      "A transformational system for decoding your cues, reframing your narratives, and authoring the identity you choose to live from.The Resonance Core Framework™ is a guided, structured process that helps you understand the patterns shaping your life — somatic, emotional, narrative, and identity based.Through archetypal mapping, reflective inquiry, and identity recalibration, you learn to align your inner world with the life, work, and relationships you're trying to build. This isn't generic coaching. This is identity work, narrative work, and embodiment work — woven into a single, coherent system.",
    image: {
      src: CoachingPortrait.src,
      alt: 'Resonance Core service',
      title: 'Resonance Core',
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
    description: service.blurb,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${service.title} | Terence Waters`,
      description: service.blurb,
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

  return (
    <PageLayout featureImage={service.image}>
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title={service.title}
          iconName='Settings24Regular'
          description={service.heroDescription}
        />

        <section className='mt-8 mb-12'>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed'
          >
            {service.blurb}
          </Typography>
        </section>

        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            CTA Callout: Book a consultation
          </Typography>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 mb-6 max-w-xl'
          >
            If this service fits where you are right now, we can start with a
            focused consultation and define your next best move.
          </Typography>
          <Link
            href='/contact'
            className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            Book a consultation
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
