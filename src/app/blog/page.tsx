import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { TwPageNav, TwListingView, type TwListingItem } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate } from '@/app/home/contentFormat';
import { BLOG_NAV_LINKS } from './blogNav';

const BLOG_TITLE = 'Blog on Identity and Personal Transformation';
const BLOG_DESCRIPTION =
  'Essays by Terence Waters on identity, personal transformation, and The Resonance Core Framework™, plus notes from building systems, sites, and a book in public.';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  keywords: [
    'Terence Waters blog',
    'Resonance Core Framework',
    'Behavioral Gravity',
    'The Decision Integrity Index',
    'identity alignment',
    'identity transformation',
    'personal growth',
    'personal transformation',
    'self-discovery',
    'intentional living',
    'decision-making framework',
    'building a book in public',
    'systems thinking',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: `${BLOG_TITLE} | Terence Waters`,
    description: BLOG_DESCRIPTION,
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
          lede='Long-form thinking on resonance, identity architecture, personal transformation, and building a life that embodies it all. Filter by topic below.'
          items={items}
          emptyMessage='No posts yet — the first one is coming soon.'
        />
      </main>
      <Footer />
    </>
  );
}
