import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { ServicesClient } from './ServicesClient';
import ConsultingPortrait from '@/assets/images/ConsultingPortrait.jpg';
import { ConsultationCTA } from './ConsultationCTA';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore service offerings across design, development, consulting, and Resonance Core coaching.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Services | Terence Waters',
    description:
      'Explore service offerings across design, development, consulting, and Resonance Core coaching.',
    url: 'https://terencewaters.com/services',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default function ServicesPage() {
  return (
    <PageLayout
      featureImage={{
        src: ConsultingPortrait.src,
        alt: 'Terence Waters consulting',
        title: 'Services',
      }}
    >
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title='Services'
          iconName='Settings24Regular'
          description='Explore four focused service tracks designed to help you build better products, stronger systems, and clearer direction.'
        />

        <div className='mt-8'>
          <Typography variant='h2' className='text-2xl font-bold mb-4'>
            Service Areas
          </Typography>
        </div>

        <div className='mt-4 mb-12'>
          <ServicesClient />
        </div>

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
