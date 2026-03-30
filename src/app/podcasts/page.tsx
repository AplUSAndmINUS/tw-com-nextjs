import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { PodcastListingClientWrapper } from '@/components/PodcastListingClientWrapper';
import type { PodcastEpisode } from '@/content/types';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import PodcastImage from '@/assets/images/Podcasts1400x1875.jpg';

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Audio conversations on technology, creativity, and building meaningful things.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Podcasts | Terence Waters',
    description:
      'Audio conversations on technology, creativity, and building meaningful things.',
    url: 'https://terencewaters.com/podcasts',
    siteName: 'Terence Waters',
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
      'New podcast episodes from Terence Waters are coming soon. Stay tuned!',
    audioUrl: '',
    publishedDate: '2026-01-01',
    tags: [],
    category: 'Announcement',
  },
];

export default async function PodcastsPage() {
  // Attempt to fetch live episode data from the Spreaker RSS feed at build time.
  // Falls back gracefully to placeholder episodes if the feed is unavailable.
  const feed = await fetchSpreakerEpisodes();
  const episodes = feed.available ? feed.episodes : PLACEHOLDER_EPISODES;

  return (
    <PageLayout
      featureImage={{
        src: PodcastImage.src,
        alt: 'Podcasts',
        title: 'Podcasts',
      }}
    >
      <PodcastListingClientWrapper
        initialEpisodes={episodes}
        feedAvailable={feed.available}
      />
    </PageLayout>
  );
}
