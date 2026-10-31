import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PodcastsDirectoryClient } from './PodcastsDirectoryClient';

const PODCASTS_TITLE = 'Podcasts on Identity and Transformation';
const PODCASTS_DESCRIPTION =
  'Podcasts hosted by Terence Waters, starting with The Resonant Identity: long-form audio on identity, technology, and personal transformation.';

export const metadata: Metadata = {
  title: PODCASTS_TITLE,
  description: PODCASTS_DESCRIPTION,
  keywords: [
    'The Resonant Identity podcast',
    'Terence Waters podcast',
    'identity podcast',
    'identity alignment',
    'personal transformation podcast',
    'Resonance Core Framework',
    'long-form audio',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: `${PODCASTS_TITLE} | Terence Waters`,
    description: PODCASTS_DESCRIPTION,
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
