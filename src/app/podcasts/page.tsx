import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { PodcastListingClientWrapper } from '@/components/PodcastListingClientWrapper';
import { PodcastEpisode } from '@/content/types';

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
      <PodcastListingClientWrapper initialEpisodes={PLACEHOLDER_EPISODES} />
    </PageLayout>
  );
}
