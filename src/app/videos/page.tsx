import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { VideoListingClientWrapper } from '@/components/VideoListingClientWrapper';
import { VideoItem } from '@/content/types';
import VideoImage from '@/assets/images/Video1200x2150.jpg';

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Video content exploring technology, creativity, and the human experience.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Videos | Terence Waters',
    description:
      'Video content exploring technology, creativity, and the human experience.',
    url: 'https://terencewaters.com/videos',
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
    <PageLayout
      featureImage={{
        src: VideoImage.src,
        alt: 'Videos',
        title: 'Videos',
      }}
    >
      <VideoListingClientWrapper initialVideos={PLACEHOLDER_VIDEOS} />
    </PageLayout>
  );
}
