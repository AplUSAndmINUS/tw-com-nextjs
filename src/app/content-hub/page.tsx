import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';
import { ContentHubClient } from '@/components/ContentHubClient';
import { getAllContent } from '@/lib/content';
import ContentPortrait from '@/assets/images/Content1280x1815.jpg';

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

const contentCategories = [
  {
    title: 'Blog',
    description:
      'Long-form articles on technology, creativity, and the human experience.',
    icon: '✍️',
    href: '/blog',
    cta: 'Read Articles',
  },
  {
    title: 'Videos',
    description:
      "In-depth videos, tutorials, and behind-the-scenes looks at what I'm building.",
    icon: '🎬',
    href: '/videos',
    cta: 'Watch Videos',
  },
  {
    title: 'Podcasts',
    description:
      'Audio conversations with creators, technologists, and thinkers.',
    icon: '🎙️',
    href: '/podcasts',
    cta: 'Listen Now',
  },
  {
    title: 'Portfolio',
    description: 'Selected creative work and technical projects.',
    icon: '🗂️',
    href: '/portfolio',
    cta: 'View Work',
  },
  {
    title: 'Case Studies',
    description:
      "Deep dives into specific projects — what worked, what didn't, and what I learned.",
    icon: '🔬',
    href: '/case-studies',
    cta: 'Read Case Studies',
  },
];

export default async function ContentHubPage() {
  // Fetch all content types
  const blogPosts = await getAllContent('blog');
  const portfolioItems = await getAllContent('portfolio');
  const caseStudies = await getAllContent('case-studies');

  // Combine all content
  const allContent = [...blogPosts, ...portfolioItems, ...caseStudies];
  return (
    <PageLayout
      featureImage={{
        src: ContentPortrait.src,
        alt: 'Content by Terence Waters',
        title: 'Content Hub',
      }}
    >
      <div className='py-8'>
        {/* Header */}
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Content Hub
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Everything I create — all in one place. Articles, videos, podcasts,
            and deep dives into the ideas and work that matter most.
          </Typography>
        </header>

        {/* Quick Links Section */}
        <section className='mb-12'>
          <Typography variant='h2' className='text-2xl font-bold mb-4'>
            Browse by Category
          </Typography>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {contentCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className='block group'
              >
                <Card className='h-full hover:shadow-md transition-shadow group-hover:border-blue-300 dark:group-hover:border-blue-700'>
                  <div className='text-4xl mb-3'>{category.icon}</div>
                  <Typography
                    variant='h3'
                    className='text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                  >
                    {category.title}
                  </Typography>
                  <Typography
                    variant='p'
                    className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4'
                  >
                    {category.description}
                  </Typography>
                  <span className='text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline'>
                    {category.cta} →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Unified Content Browser */}
        <section>
          <Typography variant='h2' className='text-2xl font-bold mb-4'>
            All Content
          </Typography>
          <ContentHubClient allContent={allContent} />
        </section>
      </div>
    </PageLayout>
  );
}
