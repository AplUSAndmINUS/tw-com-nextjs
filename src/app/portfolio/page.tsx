import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { PortfolioListingClient } from '@/components/PortfolioListingClient';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected work and projects.',
  metadataBase: new URL('https://terencewaters.com'),
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

export default async function PortfolioPage() {
  const entries = await getAllContent('portfolio');
  return (
    <PageLayout>
      <PortfolioListingClient entries={entries} />
    </PageLayout>
  );
}
