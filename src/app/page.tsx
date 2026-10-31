import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import type { ContentItem } from '@/content/types';
import HomePageClient, { type HomeCard } from './HomePageClient';
import { episodeToCard, HOME_MEDIA_LIMIT } from './home/contentCards';

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

const TITLE = 'Terence Waters: Author, Architect, and Solopreneur';
const DESCRIPTION =
  'Terence Waters is an author, architect, and solopreneur in Salt Lake City, writing The Resonance Core Framework™ and about making change that holds.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'Terence Waters',
    'Terence Waters author',
    'Resonance Core Framework',
    'Resonance Core Framework book',
    'Fluxline Resonance Group founder',
    'The Resonant Identity podcast',
    'identity system',
    'identity alignment',
    'decision integrity',
    'embodied transformation',
    'Behavioral Gravity',
    'The Decision Integrity Index',
    'systems architect',
    'identity coach',
    'Salt Lake City',
  ],
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
  const [blog, portfolio, podcastFeed] = await Promise.all([
    getAllContent('blog'),
    getAllContent('portfolio'),
    fetchSpreakerEpisodes(),
  ]);

  // Content section: recent writing. Category is normalised to the homepage's
  // filter buckets (Writing / Podcast / Video); blog posts are all Writing.
  const content: HomeCard[] = blog
    .slice(0, 6)
    .map((item) => ({ ...toCard(item, '/blog'), category: 'Writing' }));

  // Podcast filter: latest episodes of The Resonant Identity from Spreaker's
  // RSS feed. Empty when the feed is unreachable at build time — the client
  // then falls back to /api/podcasts. (Videos are client-fetched only; the
  // YouTube feed is an Azure Function, same as /videos.)
  const podcasts: HomeCard[] = podcastFeed.episodes
    .slice(0, HOME_MEDIA_LIMIT)
    .map(episodeToCard);

  // Portfolio section: portfolio pieces. (Case studies live on Fluxline.pro and
  // are reached from the Content Hub drawer, not duplicated here.)
  const portfolioCards: HomeCard[] = portfolio.slice(0, 4).map((item) => ({
    ...toCard(item, '/portfolio'),
    category: item.category ?? 'Portfolio',
  }));

  return (
    // The Person schema (TW-4.1) is emitted once, site-wide, by the root
    // layout — repeating it here would duplicate the entity on this page.
    <HomePageClient
      content={content}
      podcasts={podcasts}
      portfolio={portfolioCards}
    />
  );
}
