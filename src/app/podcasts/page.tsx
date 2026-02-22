import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { PodcastListingClient } from '@/components/PodcastListingClient';
import { PodcastEpisode } from '@/content/types';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';

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

const shows = [
  {
    title: 'The TW Podcast',
    description:
      'Conversations with creators, technologists, and thinkers on the ideas and tools shaping how we build and communicate.',
    frequency: 'Bi-weekly',
    icon: '🎙️',
    status: 'Coming Soon',
  },
  {
    title: 'Build Notes',
    description:
      "Short, focused episodes on what I'm building, learning, and thinking about each week. Honest, unpolished, and practical.",
    frequency: 'Weekly',
    icon: '📓',
    status: 'Coming Soon',
  },
];

export default function PodcastsPage() {
  return (
    <PageLayout>
      <div className='max-w-5xl mx-auto py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Podcasts
          </Typography>
          <Typography
            variant='p'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            Long-form conversations and short dispatches on technology,
            creativity, and what it means to build with intention.
          </Typography>
        </header>

        {/* Podcast Episodes from Azure Function */}
        <section className='mb-12'>
          <PodcastListingClient episodes={PLACEHOLDER_EPISODES} />
        </section>

        {/* Podcast Shows */}
        <section className='mb-12'>
          <Typography variant='h2' className='text-2xl font-semibold mb-6'>
            Shows
          </Typography>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {shows.map((show) => (
              <Card key={show.title}>
                <div className='flex items-center gap-3 mb-3'>
                  <span className='text-4xl'>{show.icon}</span>
                  <div>
                    <Typography variant='h3' className='text-xl font-semibold'>
                      {show.title}
                    </Typography>
                    <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                      {show.frequency}
                    </span>
                  </div>
                </div>
                <Typography
                  variant='p'
                  className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3'
                >
                  {show.description}
                </Typography>
                <span className='inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full'>
                  {show.status}
                </span>
              </Card>
            ))}
          </div>
        </section>

        {/* Stay Tuned Section */}
        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            Stay Tuned
          </Typography>
          <Typography
            variant='p'
            className='text-gray-600 dark:text-gray-400 mb-2'
          >
            Podcasts are launching soon. Subscribe to the newsletter or follow
            on social media to be notified when new episodes drop.
          </Typography>
          <Typography
            variant='p'
            className='text-sm text-gray-500 dark:text-gray-500'
          >
            Episodes will be available on Spotify, Apple Podcasts, and all major
            podcast platforms.
          </Typography>
        </section>
      </div>
    </PageLayout>
  );
}
