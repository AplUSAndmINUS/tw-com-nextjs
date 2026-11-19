import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { TwSectionHeading } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import VideosClient from './VideosClient';
import styles from './page.module.scss';
import { SiteNav } from '@/components/SiteNav';

const VIDEOS_TITLE = 'Videos: Talks, Live Streams and Studio Notes';
const VIDEOS_DESCRIPTION =
  'Talks, live streams, studio notes, and short films on building with intention, from the @TerenceRWaters and @theresonantidentity YouTube channels.';

export const metadata: Metadata = {
  title: VIDEOS_TITLE,
  description: VIDEOS_DESCRIPTION,
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: `${VIDEOS_TITLE} | Terence Waters`,
    description: VIDEOS_DESCRIPTION,
    url: 'https://terencewaters.com/videos',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * Videos — the list is client-fetched from YouTube (see VideosClient), so this
 * server component only supplies the chrome and heading.
 */
export default function VideosPage() {
  return (
    <>
      <SiteNav />
      <main id='main'>
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
