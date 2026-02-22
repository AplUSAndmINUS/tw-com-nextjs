import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';
import { getAllContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Past articles, projects, and writing from across the years.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Archive | Terence Waters',
    description: 'Past articles, projects, and writing from across the years.',
    url: 'https://terencewaters.com/archive',
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

export default async function ArchivePage() {
  const [posts, portfolioEntries, caseStudies] = await Promise.all([
    getAllContent('blog'),
    getAllContent('portfolio'),
    getAllContent('case-studies'),
  ]);

  const allItems = [
    ...posts.map((p) => ({ ...p, type: 'Blog', href: `/blog/${p.slug}` })),
    ...portfolioEntries.map((p) => ({ ...p, type: 'Portfolio', href: `/portfolio/${p.slug}` })),
    ...caseStudies.map((c) => ({ ...c, type: 'Case Study', href: `/case-studies/${c.slug}` })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const typeColor: Record<string, string> = {
    Blog: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    Portfolio: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    'Case Study': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  };

  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Archive
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3'
          >
            A complete archive of articles, projects, and case studies — sorted
            by most recent.
          </Typography>
        </header>

        {allItems.length === 0 ? (
          <Typography variant='p' className='text-gray-500 dark:text-gray-400'>
            No archived content yet. Check back soon.
          </Typography>
        ) : (
          <div className='space-y-6'>
            {allItems.map((item) => (
              <article
                key={`${item.type}-${item.slug}`}
                className='flex gap-4 items-start border-b pb-6'
              >
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-1'>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeColor[item.type] ?? ''}`}
                    >
                      {item.type}
                    </span>
                    {item.date && (
                      <time
                        dateTime={item.date}
                        className='text-sm text-gray-500 dark:text-gray-400'
                      >
                        {item.date}
                      </time>
                    )}
                  </div>
                  <Link href={item.href}>
                    <Typography
                      variant='h3'
                      className='text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    >
                      {item.title}
                    </Typography>
                  </Link>
                  {item.excerpt && (
                    <Typography
                      variant='p'
                      className='mt-1 text-sm text-gray-600 dark:text-gray-400'
                    >
                      {item.excerpt}
                    </Typography>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
