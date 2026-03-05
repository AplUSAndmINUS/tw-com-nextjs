import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import EducationPortrait from '@/assets/images/EducationTrainingPortrait.jpg';

export const metadata: Metadata = {
  title: 'Coaching',
  description:
    'Resonance Core coaching for creators, founders, and leaders seeking aligned growth.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Coaching | Terence Waters',
    description:
      'Resonance Core coaching for creators, founders, and leaders seeking aligned growth.',
    url: 'https://terencewaters.com/coaching',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default function CoachingPage() {
  return (
    <PageLayout
      featureImage={{
        src: EducationPortrait.src,
        alt: 'Terence Waters coaching',
        title: 'Coaching & Offerings',
      }}
    >
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title='Resonance Core Coaching'
          iconName='Person24Regular'
          description='Identity-centered coaching for creators and leaders who want to align their work with who they are becoming.'
        />

        <section className='mt-8 mb-12'>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed'
          >
            This coaching path is built for moments of reinvention. Whether
            you&apos;re shifting direction, clarifying your voice, or rebuilding
            momentum, Resonance Core sessions help you turn insight into a
            practical plan you can act on immediately.
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
            If this resonates with what you&apos;re navigating, let&apos;s talk
            through your goals and map the right next step together.
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
