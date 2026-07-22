import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { VideoPlayer } from '@/components/VideoPlayer';
import { TwPageNav } from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import styles from './VideoDetail.module.scss';

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

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub', active: true },
  { label: 'Portfolio', href: '/portfolio' },
];

export default async function VideoPlayerPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <>
      <TwPageNav back={{ label: 'Back to Videos', href: '/videos' }} links={NAV_LINKS} />
      <main className={styles.main}>
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
