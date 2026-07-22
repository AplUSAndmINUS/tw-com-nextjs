import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import EducationPortrait from '@/assets/images/EducationTrainingPortrait.jpg';
import { ConsultationCTA } from '@/app/services/ConsultationCTA';
import styles from './page.module.scss';

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
      <div className={styles.page}>
        <Hero
          title='Resonance Core Coaching'
          iconName='Person24Regular'
          description='Identity-centered coaching for creators and leaders who want to align their work with who they are becoming.'
        />

        <section className={styles.intro}>
          <Typography
            variant='body'
            className={styles.introText}
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
