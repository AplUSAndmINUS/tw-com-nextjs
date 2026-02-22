import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { VideoListingClient } from '@/components/VideoListingClient';
import { VideoItem } from '@/content/types';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch videos from Terence Waters on technology, creativity, and personal development.',
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
 * Static placeholder videos — replaced at runtime by the Azure Function
 * (api/videos) once the YouTube API key is configured.
 */
const PLACEHOLDER_VIDEOS: VideoItem[] = [
  {
    id: 'placeholder-1',
    youtubeId: '',
    title: 'Videos Coming Soon',
    description:
      'Subscribe to @terencewaters on YouTube to be notified when new videos are published.',
    thumbnailUrl: '',
    publishedAt: '2026-01-01',
    tags: [],
    category: 'Announcement',
    duration: '',
  },
];

export default function VideosPage() {
  return (
    <PageLayout>
      <VideoListingClient videos={PLACEHOLDER_VIDEOS} />
    </PageLayout>
  );
}
