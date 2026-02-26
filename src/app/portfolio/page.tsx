import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { PortfolioListingClientWrapper } from '@/components/PortfolioListingClientWrapper';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected creative and technical work by Terence Waters.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Portfolio | Terence Waters',
    description: 'Selected creative and technical work by Terence Waters.',
    url: 'https://terencewaters.com/portfolio',
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

export default async function PortfolioPage() {
  const entries = await getAllContent('portfolio');

  // Strip content field to reduce payload size
  const entriesWithoutContent = entries.map(({ content, ...rest }) => ({
    ...rest,
    content: '',
  }));

  return (
    <PageLayout>
      <PortfolioListingClientWrapper initialEntries={entriesWithoutContent} />
    </PageLayout>
  );
}
