import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
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

        {entries.length === 0 ? (
          <Typography variant='p' className='text-gray-500 dark:text-gray-400'>
            Portfolio entries coming soon.
          </Typography>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {entries.map((entry) => (
              <Link key={entry.slug} href={`/portfolio/${entry.slug}`} className='block group'>
                <Card className='h-full hover:shadow-md transition-shadow group-hover:border-blue-300 dark:group-hover:border-blue-700'>
                  {entry.tags.length > 0 && (
                    <div className='flex gap-2 flex-wrap mb-3'>
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className='text-xs uppercase tracking-wide font-semibold text-blue-600 dark:text-blue-400'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Typography
                    variant='h3'
                    className='text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                  >
                    {entry.title}
                  </Typography>
                  {entry.excerpt && (
                    <Typography
                      variant='p'
                      className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3'
                    >
                      {entry.excerpt}
                    </Typography>
                  )}
                  <span className='text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline'>
                    View Project →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

