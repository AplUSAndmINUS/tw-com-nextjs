import { Metadata } from 'next';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { getServicesItemListSchema } from '@/utils/structuredData';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { ServicesClient } from './ServicesClient';
import ConsultingPortrait from '@/assets/images/ConsultingPortrait.jpg';
import { ConsultationCTA } from './ConsultationCTA';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore service offerings across design, development, consulting, personal training, and Resonance Core coaching.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Services | Terence Waters',
    description:
      'Explore service offerings across design, development, consulting, personal training, and Resonance Core coaching.',
    url: 'https://terencewaters.com/services',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default function ServicesPage() {
  const servicesSchema = getServicesItemListSchema();

  return (
    <PageLayout
      featureImage={{
        src: ConsultingPortrait.src,
        alt: 'Terence Waters consulting',
        title: 'Services',
      }}
    >
      <Script
        id='services-itemlist-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(servicesSchema) }}
      />
      <div className={styles.page}>
        <Hero
          title='Services'
          iconName='Settings24Regular'
          description='Explore five focused service tracks designed to help you build better products, stronger systems, and clearer direction.'
        />

        <div className={styles.sectionHeadingWrap}>
          <Typography variant='h2' className={styles.sectionHeading}>
            Service Areas
          </Typography>
        </div>

        <div className={styles.servicesWrap}>
          <ServicesClient />
        </div>

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
