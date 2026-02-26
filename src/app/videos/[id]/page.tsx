import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ContentDetailNav } from '@/components/ContentDetailNav';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Return a placeholder so the static export can build the route template.
  // Real video IDs are loaded client-side via the /api/videos Azure Function.
  return [{ id: 'placeholder' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Video — ${id}`,
    metadataBase: new URL('https://terencewaters.com'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function VideoPlayerPage({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  // In production the Azure Function at /api/videos returns YouTube video data.
  // For the static build we render a YouTube embed using the id directly.
  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <ContentDetailNav
          prevHref='/videos'
          hubHref='/content-hub'
        />
        <VideoPlayer youtubeId={id} title={`Video ${id}`} />
        <div className='mt-6'>
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
          >
            Watch on YouTube ↗
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
