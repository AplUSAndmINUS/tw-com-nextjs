import { Metadata } from 'next';
import { VideoListingClientWrapper } from '@/components/VideoListingClientWrapper';
import { VideoItem } from '@/content/types';

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
  return <VideoListingClientWrapper initialVideos={PLACEHOLDER_VIDEOS} />;
}

const series = [
  {
    title: 'Build in Public',
    description:
      "Behind-the-scenes looks at how I build products, systems, and creative projects — with full transparency on what works and what doesn't.",
    episodeCount: 'Coming Soon',
    icon: '🏗️',
  },
  {
    title: 'Tech & Tools',
    description:
      'Deep dives into the tools, frameworks, and workflows I use. Practical, opinionated, and honest.',
    episodeCount: 'Coming Soon',
    icon: '🛠️',
  },
  {
    title: 'Conversations',
    description:
      'Long-form interviews with builders, writers, and thinkers who are shaping the future in interesting ways.',
    episodeCount: 'Coming Soon',
    icon: '🎬',
  },
];

export default function VideosPage() {
  return (
    <PageLayout>
      <div className='max-w-5xl mx-auto py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Videos
          </Typography>
          <Typography
            variant='body'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Exploring technology, creativity, and what it means to build
            something meaningful — on camera, in real time.
          </Typography>
        </header>

        {/* Video List from Azure Function */}
        <section className='mb-12'>
          <VideoListingClient videos={PLACEHOLDER_VIDEOS} />
        </section>

        {/* Video Series */}
        <section className='mb-12'>
          <Typography variant='h2' className='text-2xl font-semibold mb-6'>
            Series
          </Typography>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {series.map((s) => (
              <Card key={s.title}>
                <div className='text-4xl mb-3'>{s.icon}</div>
                <Typography variant='h3' className='text-lg font-semibold mb-2'>
                  {s.title}
                </Typography>
                <Typography
                  variant='body'
                  className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3'
                >
                  {s.description}
                </Typography>
                <span className='text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide'>
                  {s.episodeCount}
                </span>
              </Card>
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            Subscribe
          </Typography>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 mb-2'
          >
            New videos are published regularly. Subscribe on YouTube to get
            notified when new content is live.
          </Typography>
          <a
            href='https://youtube.com/@terencewaters'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
          >
            Subscribe on YouTube
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
