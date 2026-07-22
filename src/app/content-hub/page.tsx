import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import { TwPageNav, TwSectionHeading } from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import ContentHubClient from './ContentHubClient';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Content Hub',
  description:
    'Everything Terence Waters publishes — writing, the podcast, portfolio work, videos, and code. Explore by format.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Content Hub | Terence Waters',
    description:
      'Writing, the podcast, portfolio work, videos, and code — all in one place.',
    url: 'https://terencewaters.com/content-hub',
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

// Static export: the latest episode is resolved from the Spreaker feed at build
// time. If the feed is unavailable the page still renders; the podcast drawer
// links out instead of offering in-page playback.
export default async function ContentHubPage() {
  const feed = await fetchSpreakerEpisodes();
  const latestEpisode =
    feed.available && feed.episodes.length > 0 ? feed.episodes[0] : null;

  return (
    <>
      <TwPageNav back={{ label: 'Back to Home', href: '/' }} links={NAV_LINKS} />
      <main>
        <section className={styles.head}>
          <div className={styles.headGlow} aria-hidden='true' />
          <div className={styles.container}>
            <TwSectionHeading
              as='h1'
              kicker='Content Hub'
              title="Everything I'm making"
              lede='Writing, the podcast, portfolio work, videos, and code — one place to find all of it. Pick where you want to go.'
            />
          </div>
        </section>
        <section className={styles.body}>
          <div className={styles.container}>
            <ContentHubClient latestEpisode={latestEpisode} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
