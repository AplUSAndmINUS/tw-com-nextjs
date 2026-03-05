import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import ContentPortrait from '@/assets/images/Content1280x1815.jpg';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { ContentHubClient } from './ContentHubClient';

export const metadata: Metadata = {
  title: 'Content Hub',
  description:
    "All of Terence Waters' content in one place — articles, videos, podcasts, and more.",
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Content Hub | Terence Waters',
    description:
      "All of Terence Waters' content in one place — articles, videos, podcasts, and more.",
    url: 'https://terencewaters.com/content-hub',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default function ContentHubPage() {
  return (
    <PageLayout
      featureImage={{
        src: ContentPortrait.src,
        alt: 'Content by Terence Waters',
        title: 'Content Hub',
      }}
    >
      <div className='max-width-content pt-0 pb-8 md:py-8 mb-0 md:mb-8'>
        {/* Header */}
        <Hero
          title='Content Hub'
          iconName='Search24Regular'
          description='Everything I create — all in one place. Articles, videos, podcasts, and deep dives into the ideas and work that matter most.'
        />

        {/* Browse by Category */}
        <section className='mt-8'>
          <Typography variant='h2' className='text-2xl font-bold mb-4'>
            Browse by Category
          </Typography>
          <ContentHubClient />
        </section>
      </div>
    </PageLayout>
  );
}
