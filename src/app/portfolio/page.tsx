import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { PortfolioListingClient } from '@/components/PortfolioListingClient';
import { Typography } from '@/components/Typography';
import PortfolioPortrait from '@/assets/images/Portfolio1280x1815.jpg';

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
  return (
    <PageLayout
      featureImage={{
        src: PortfolioPortrait.src,
        alt: 'Portfolio by Terence Waters',
        title: 'Portfolio',
      }}
    >
      <div className='py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Portfolio
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Selected creative and technical work — projects I&apos;ve built,
            led, or contributed to.
          </Typography>
        </header>

        <PortfolioListingClient entries={entries} />
      </div>
    </PageLayout>
  );
}
