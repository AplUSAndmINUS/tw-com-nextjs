import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { VideoListingClientWrapper } from '@/components/VideoListingClientWrapper';
import VideoImage from '@/assets/images/Video1200x2150.jpg';

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch videos from the @aplusinflux YouTube channel — tutorials, live streams, playlists, and more.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Videos | Terence Waters',
    description:
      'Watch videos from the @aplusinflux YouTube channel — tutorials, live streams, playlists, and more.',
    url: 'https://terencewaters.com/videos',
    siteName: 'Terence Waters',
    images: [
      {
        url: VideoImage.src,
        width: 1200,
        height: 2150,
        alt: 'Terence Waters Videos',
      },
    ],
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * Videos Page - Server Component
 * Renders the video listing client component that fetches from YouTube API
 */
export default function VideosPage() {
  return (
    <PageLayout
      featureImage={{
        src: VideoImage.src,
        alt: 'Videos',
        title: 'Videos',
      }}
    >
      <VideoListingClientWrapper />
    </PageLayout>
  );
}
