import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { WhatWeOffer } from '@/components/WhatWeOffer';
import { ConsultationCTA } from '@/app/services/ConsultationCTA';
import { SERVICES } from '@/app/services/constants';
import styles from './page.module.scss';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

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
      <div className={styles.page}>
        <Hero
          title={service.title}
          iconName={service.icon}
          backArrow
          backArrowPath='/services'
          description={service.heroDescription}
        />

        <section className={styles.blurbSection}>
          <div className={styles.paragraphs}>
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={index}
                variant='body'
                className={styles.paragraph}
              >
                {paragraph}
              </Typography>
            ))}
          </div>
          {service.fluxlineUrl && (
            <div className={styles.fluxlineLinkWrap}>
              <a
                href={service.fluxlineUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.fluxlineLink}
              >
                More info available on Fluxline.pro ↗
              </a>
            </div>
          )}
        </section>

        <section className={styles.offersSection}>
          <WhatWeOffer items={service.offers} />
        </section>

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
