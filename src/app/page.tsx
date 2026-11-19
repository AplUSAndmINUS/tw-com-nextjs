import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import type { ContentItem } from '@/content/types';
import HomePageClient, { type HomeCard } from './HomePageClient';
import {
  episodeToCard,
  HOME_CONTENT_CARDS,
  mergeHomeCards,
} from './home/contentCards';

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
    date: item.date || undefined,
    href: `${basePath}/${item.slug}`,
    image: item.imageUrl,
    imageAlt: item.imageAlt,
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
  const [blog, podcastFeed] = await Promise.all([
    getAllContent('blog'),
    fetchSpreakerEpisodes(),
  ]);

  // Content Hub cards: the newest writing and podcast episodes together, three
  // in all (owner, #285), each with its cover or episode art as a preview.
  // The podcast feed is read from Spreaker at build time; when it is
  // unreachable the cards are writing only.
  const content = mergeHomeCards(
    blog
      .slice(0, HOME_CONTENT_CARDS)
      .map((item) => ({ ...toCard(item, '/blog'), category: 'Writing' })),
    podcastFeed.episodes.slice(0, HOME_CONTENT_CARDS).map(episodeToCard)
  );

  return (
    // The Person schema (TW-4.1) is emitted once, site-wide, by the root
    // layout — repeating it here would duplicate the entity on this page.
    <HomePageClient content={content} />
  );
}
