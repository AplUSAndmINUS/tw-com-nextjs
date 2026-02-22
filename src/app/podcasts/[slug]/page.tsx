import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { AudioPlayer } from '@/components/AudioPlayer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Episodes are loaded dynamically via the Azure Function.
  // Return the placeholder slug so the static export doesn't error.
  return [{ slug: 'coming-soon' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Podcast Episode — ${slug}`,
    metadataBase: new URL('https://terencewaters.com'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  // Placeholder page until real episodes are created via the Azure Function.
  return (
    <PageLayout>
      <div className='max-w-3xl mx-auto px-4 py-12'>
        <span className='text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide'>
          Podcast Episode
        </span>
        <h1 className='text-3xl font-bold mt-2 mb-6'>Episode: {slug}</h1>
        <AudioPlayer
          audioUrl=''
          title={`Episode: ${slug}`}
        />
        <p className='mt-8 text-gray-500 dark:text-gray-400'>
          Full episode details coming soon.
        </p>
      </div>
    </PageLayout>
  );
}
