import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Footer } from '@/components/Footer';
import styles from './VideoDetail.module.scss';
import { SiteNav } from '@/components/SiteNav';
import { BackLink } from '@/components/BackLink';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Placeholder so the static export can build the route template. Real video
  // IDs are loaded client-side; the listing opens videos in a modal, and this
  // route only serves direct deep-links.
  return [{ id: 'placeholder' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Video — ${id}`,
    metadataBase: new URL('https://terencewaters.com'),
    robots: getRobotsConfig(),
  };
}

export default async function VideoPlayerPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <>
      <SiteNav />
      <main id='main' className={styles.main}>
        <BackLink href='/videos/' label='Back to Videos' />
        <div className={styles.frame}>
          <VideoPlayer youtubeId={id} title={`Video ${id}`} />
        </div>
        <a
          className={styles.watch}
          href={`https://www.youtube.com/watch?v=${id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Watch on YouTube &#8599;
        </a>
      </main>
      <Footer />
    </>
  );
}
