import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { Typography } from '@/components/Typography';
import BlogPortrait from '@/assets/images/Blog1280x1815.jpg';
import { BlogIndexClient } from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on technology, creativity, and the human experience.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Blog | Terence Waters',
    description:
      'Thoughts on technology, creativity, and the human experience.',
    url: 'https://terencewaters.com/blog',
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

export default async function BlogPage() {
  const posts = await getAllContent('blog');
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <PageLayout
      featureImage={{
        src: BlogPortrait.src,
        alt: 'Blog by Terence Waters',
        title: 'Blog',
      }}
    >
      <div className='py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Blog
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Thoughts on technology, creativity, and the human experience.
          </Typography>
        </header>

        <BlogIndexClient posts={posts} allTags={allTags} />
      </div>
    </PageLayout>
  );
}

