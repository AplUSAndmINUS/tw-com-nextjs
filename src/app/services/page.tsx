import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';
import ConsultingPortrait from '@/assets/images/ConsultingPortrait.jpg';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Professional services in consulting, content strategy, and technical advisory.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Services | Terence Waters',
    description:
      'Professional services in consulting, content strategy, and technical advisory.',
    url: 'https://terencewaters.com/services',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const services = [
  {
    title: 'Technical Consulting',
    description:
      'Strategic and hands-on guidance for engineering teams building modern platforms — cloud architecture, developer experience, and technical leadership.',
    icon: '⚙️',
    cta: { label: 'Learn More', href: '/contact' },
  },
  {
    title: 'Content Strategy',
    description:
      'Helping individuals and organizations clarify their message, build an audience, and create content that connects — across formats and platforms.',
    icon: '✍️',
    cta: { label: 'Learn More', href: '/contact' },
  },
  {
    title: 'Product Advisory',
    description:
      'Early-stage product thinking, roadmap development, and user experience strategy for founders and product teams.',
    icon: '🗺️',
    cta: { label: 'Learn More', href: '/contact' },
  },
  {
    title: 'Speaking & Workshops',
    description:
      'Keynotes, workshops, and facilitated sessions on technology, creativity, leadership, and building in public.',
    icon: '🎤',
    cta: { label: 'Book a Session', href: '/contact' },
  },
];

export default function ServicesPage() {
  return (
    <PageLayout
      featureImage={{
        src: ConsultingPortrait.src,
        alt: 'Terence Waters consulting',
        title: 'Services',
      }}
    >
      <div className='py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Services
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            I partner with teams, founders, and creators to build better
            products, clearer strategies, and more meaningful content.
          </Typography>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12'>
          {services.map((service) => (
            <Card key={service.title}>
              <div className='text-3xl mb-3'>{service.icon}</div>
              <Typography variant='h3' className='text-xl font-semibold mb-2'>
                {service.title}
              </Typography>
              <Typography
                variant='p'
                className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'
              >
                {service.description}
              </Typography>
              <Link
                href={service.cta.href}
                className='text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline'
              >
                {service.cta.label} →
              </Link>
            </Card>
          ))}
        </div>

        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            Work With Me
          </Typography>
          <Typography
            variant='p'
            className='text-gray-600 dark:text-gray-400 mb-6 max-w-xl'
          >
            Whether you need a thought partner, a technical advisor, or a
            content collaborator — I&apos;d love to hear about what you&apos;re building.
          </Typography>
          <Link
            href='/contact'
            className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            Start a Conversation
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
