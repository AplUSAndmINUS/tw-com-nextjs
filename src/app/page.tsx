import { Metadata } from 'next';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { getPersonSchema } from '@/utils/structuredData';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getAllContent } from '@/lib/content';
import type { ContentItem } from '@/content/types';
import HomePageClient, { type HomeCard } from './HomePageClient';

/**
 * Map a loaded ContentItem to the minimal card the homepage needs, dropping the
 * full markdown body so it never ships to the client.
 */
function toCard(item: ContentItem, basePath: string): HomeCard {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    // Cards show a year for portfolio/case studies, a full date for writing.
    date: item.date || undefined,
    href: `${basePath}/${item.slug}`,
  };
}

export const metadata: Metadata = {
  title: 'Terence Waters - Author, Technologist, Creative Thinker',
  description:
    'Welcome to the personal website of Terence Waters, an author, technologist, and creative thinker. Explore his blog, portfolio, and case studies.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Terence Waters - Author, Technologist, Creative Thinker',
    description:
      'Welcome to the personal website of Terence Waters, an author, technologist, and creative thinker. Explore his blog, portfolio, and case studies.',
    url: 'https://terencewaters.com',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

// Static export: content is read from disk at build time.
export default async function HomePage() {
  const personSchema = getPersonSchema('https://terencewaters.com');

  const [blog, portfolio] = await Promise.all([
    getAllContent('blog'),
    getAllContent('portfolio'),
  ]);

  // Content section: recent writing. Category is normalised to the homepage's
  // filter buckets (Writing / Podcast / Video); blog posts are all Writing.
  const content: HomeCard[] = blog
    .slice(0, 6)
    .map((item) => ({ ...toCard(item, '/blog'), category: 'Writing' }));

  // Portfolio section: portfolio pieces. (Case studies live on Fluxline.pro and
  // are reached from the Content Hub drawer, not duplicated here.)
  const portfolioCards: HomeCard[] = portfolio
    .slice(0, 4)
    .map((item) => ({
      ...toCard(item, '/portfolio'),
      category: item.category ?? 'Portfolio',
    }));

  return (
    <>
      <Script
        id='homepage-person-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <HomePageClient content={content} portfolio={portfolioCards} />
    </>
  );
}
