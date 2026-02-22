import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { BlogListingClient } from '@/components/BlogListingClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on technology, creativity, and the human experience.',
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

export default async function BlogPage() {
  const posts = await getAllContent('blog');
  return (
    <PageLayout>
      <BlogListingClient posts={posts} />
    </PageLayout>
  );
}
