import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { TwPageNav, TwListingView, type TwListingItem } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate } from '@/app/home/contentFormat';
import { BLOG_NAV_LINKS } from './blogNav';

export const metadata: Metadata = {
  title: 'The Blog',
  description: 'Thoughts on technology, creativity, and the human experience.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'The Blog | Terence Waters',
    description:
      'Thoughts on technology, creativity, and the human experience.',
    url: 'https://terencewaters.com/blog',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default async function BlogPage() {
  const posts = await getAllContent('blog');

  const items: TwListingItem[] = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: formatDotDate(post.date),
    image: post.imageUrl ?? post.featuredImage,
    imageAlt: post.imageAlt ?? post.title,
    href: `/blog/${post.slug}`,
  }));

  return (
    <>
      <TwPageNav
        back={{ label: 'Back to Content Hub', href: '/content-hub' }}
        links={BLOG_NAV_LINKS}
      />
      <main>
        <TwListingView
          kicker='Writing'
          title='The Blog'
          lede="Long-form thinking on resonance, identity architecture, and building a life that embodies it all. Filter by topic below."
          items={items}
          emptyMessage='No posts yet — the first one is coming soon.'
        />
      </main>
      <Footer />
    </>
  );
}
