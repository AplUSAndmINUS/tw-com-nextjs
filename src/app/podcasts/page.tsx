import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { PodcastListingClient } from '@/components/PodcastListingClient';
import { PodcastEpisode } from '@/content/types';

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Listen to podcast episodes on technology, creativity, personal growth, and the human experience.',
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

/**
 * Static placeholder episodes — replaced at runtime by the Azure Function
 * (api/podcasts) once the Azure Storage account is configured.
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

export default function PodcastsPage() {
  return (
    <PageLayout>
      <PodcastListingClient episodes={PLACEHOLDER_EPISODES} />
    </PageLayout>
  );
}
