import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { PortfolioListingClientWrapper } from '@/components/PortfolioListingClientWrapper';
import PortfolioImage from '@/assets/images/Portfolio1280x1815.jpg';

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
  robots: getRobotsConfig(),
};

export default async function PortfolioPage() {
  const entries = await getAllContent('portfolio');

  // Strip content field to reduce payload size
  const entriesWithoutContent = entries.map(({ content, ...rest }) => ({
    ...rest,
    content: '',
  }));

  return (
    <PageLayout
      featureImage={{
        src: PortfolioImage.src,
        alt: 'Portfolio',
        title: 'Portfolio',
      }}
    >
      <PortfolioListingClientWrapper initialEntries={entriesWithoutContent} />
    </PageLayout>
  );
}
