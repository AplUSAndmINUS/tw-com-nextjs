import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
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

const TITLE =
  'Terence Waters — Author of The Resonance Core Framework™ | Founder, Fluxline Resonance Group';
const DESCRIPTION =
  'Terence Waters is the author of The Resonance Core Framework™ — a structured identity system for alignment, decision integrity, and embodied transformation. Founder of Fluxline Resonance Group.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  metadataBase: new URL('https://terencewaters.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://terencewaters.com',
    siteName: 'Terence Waters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@TerenceWaters',
  },
  robots: getRobotsConfig(),
};

// Static export: content is read from disk at build time.
export default async function HomePage() {
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
  const portfolioCards: HomeCard[] = portfolio.slice(0, 4).map((item) => ({
    ...toCard(item, '/portfolio'),
    category: item.category ?? 'Portfolio',
  }));

  return (
    // The Person schema (TW-4.1) is emitted once, site-wide, by the root
    // layout — repeating it here would duplicate the entity on this page.
    <HomePageClient content={content} portfolio={portfolioCards} />
  );
}
