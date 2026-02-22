import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { Typography } from '@/components/Typography';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'In-depth explorations of projects, challenges, and lessons learned.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Case Studies | Terence Waters',
    description: 'In-depth explorations of projects, challenges, and lessons learned.',
    url: 'https://terencewaters.com/case-studies',
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

export default async function CaseStudiesPage() {
  const caseStudies = await getAllContent('case-studies');
  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Case Studies
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Deep dives into specific projects — what I built, the challenges I
            faced, and what I learned.
          </Typography>
        </header>

        {caseStudies.length === 0 ? (
          <Typography variant='p' className='text-gray-500 dark:text-gray-400'>
            Case studies coming soon.
          </Typography>
        ) : (
          <div className='space-y-8'>
            {caseStudies.map((cs) => (
              <article key={cs.slug} className='border-b pb-8'>
                <div className='flex items-center gap-3 mb-2'>
                  {cs.tags.length > 0 && cs.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-xs uppercase tracking-wide font-semibold text-blue-600 dark:text-blue-400'
                    >
                      {tag}
                    </span>
                  ))}
                  {cs.date && (
                    <time dateTime={cs.date} className='text-sm text-gray-500 dark:text-gray-400'>
                      {cs.date}
                    </time>
                  )}
                </div>
                <Link href={`/case-studies/${cs.slug}`}>
                  <Typography
                    variant='h2'
                    className='text-2xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {cs.title}
                  </Typography>
                </Link>
                {cs.excerpt && (
                  <Typography
                    variant='p'
                    className='mt-3 text-gray-600 dark:text-gray-400'
                  >
                    {cs.excerpt}
                  </Typography>
                )}
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className='inline-block mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Read case study →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

