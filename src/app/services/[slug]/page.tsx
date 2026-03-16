import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { WhatWeOffer } from '@/components/WhatWeOffer';
import { ConsultationCTA } from '@/app/services/ConsultationCTA';
import { SERVICES } from '@/app/services/constants';

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
          {service.fluxlineUrl && (
            <div className='mt-6'>
              <a
                href={service.fluxlineUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 hover:text-gray-500 dark:hover:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 transition-colors'
              >
                Also available on Fluxline.pro ↗
              </a>
            </div>
          )}
        </section>

        <section className='mt-12 mb-12'>
          <WhatWeOffer items={service.offers} />
        </section>

        <ConsultationCTA />
      </div>
    </PageLayout>
  );
}
