import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import EducationPortrait from '@/assets/images/EducationTrainingPortrait.jpg';
import { ConsultationCTA } from '@/app/services/ConsultationCTA';

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

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
