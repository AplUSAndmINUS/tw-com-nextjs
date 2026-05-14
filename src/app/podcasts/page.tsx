import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PodcastsDirectoryClient } from './PodcastsDirectoryClient';

export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    'Long-form audio exploring identity, technology, and transformation. Discover The Resonant Identity podcast and more.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Podcasts | Terence Waters',
    description:
      'Long-form audio exploring identity, technology, and transformation. Discover The Resonant Identity podcast and more.',
    url: 'https://terencewaters.com/podcasts',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * Podcasts Directory Page - Server Component
 * Shows all available podcasts as cards
 */
export default function PodcastsPage() {
  return <PodcastsDirectoryClient />;
}
