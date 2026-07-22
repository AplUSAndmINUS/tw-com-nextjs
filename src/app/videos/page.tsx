import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { TwPageNav, TwSectionHeading } from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import VideosClient from './VideosClient';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch videos from the @TerenceRWaters and @theresonantidentity YouTube channels — tutorials, live streams, playlists, and more.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Videos | Terence Waters',
    description:
      'Watch videos from the @TerenceRWaters and @theresonantidentity YouTube channels — tutorials, live streams, playlists, and more.',
    url: 'https://terencewaters.com/videos',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub', active: true },
  { label: 'Portfolio', href: '/portfolio' },
];

/**
 * Videos — the list is client-fetched from YouTube (see VideosClient), so this
 * server component only supplies the chrome and heading.
 */
export default function VideosPage() {
  return (
    <>
      <TwPageNav back={{ label: 'Back to Content Hub', href: '/content-hub' }} links={NAV_LINKS} />
      <main>
        <section className={styles.head}>
          <div className={styles.headGlow} aria-hidden='true' />
          <div className={styles.container}>
            <TwSectionHeading
              as='h1'
              kicker='Watch'
              title='Videos'
              lede='Talks, studio notes, live streams, and short films on building with intention — from the YouTube channels.'
            />
          </div>
        </section>
        <section className={styles.body}>
          <div className={styles.container}>
            <VideosClient />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
