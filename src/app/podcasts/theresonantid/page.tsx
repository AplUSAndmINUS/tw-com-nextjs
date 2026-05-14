import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import type { PodcastEpisode } from '@/content/types';
import { TheResonantIdentityPageClient } from './TheResonantIdentityPageClient';

export const metadata: Metadata = {
  title: 'The Resonant Identity Podcast',
  description:
    'The Resonant Identity — a podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'The Resonant Identity Podcast | Terence Waters',
    description:
      'A podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention.',
    url: 'https://terencewaters.com/podcasts/theresonantid',
    siteName: 'Terence Waters',
    images: [
      {
        url: 'https://terencewaters.com/images/ResonantIdentity_logo.png',
        alt: 'The Resonant Identity Podcast',
      },
    ],
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * Static placeholder episodes shown when the Spreaker RSS feed is unavailable
 * at build time.
 */
const PLACEHOLDER_EPISODES: PodcastEpisode[] = [
  {
    slug: 'coming-soon',
    title: 'Podcasts Coming Soon',
    description:
      'New podcast episodes from The Resonant Identity are coming soon. Stay tuned!',
    audioUrl: '',
    publishedDate: '2026-01-01',
    tags: [],
    category: 'Announcement',
  },
];

/**
 * The Resonant Identity Podcast Home Page
 * URL: /podcasts/theresonantid
 * Shows episodes, player, and platform links
 */
export default async function TheResonantIdentityPodcastPage() {
  // Attempt to fetch live episode data from the Spreaker RSS feed at build time.
  // Falls back gracefully to placeholder episodes if the feed is unavailable.
  const feed = await fetchSpreakerEpisodes();
  const episodes = feed.available ? feed.episodes : PLACEHOLDER_EPISODES;

  return (
    <TheResonantIdentityPageClient
      episodes={episodes}
      feedAvailable={feed.available}
    />
  );
}
