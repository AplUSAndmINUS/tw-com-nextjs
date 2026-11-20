import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { fetchSpreakerEpisodes } from '@/lib/spreaker';
import Link from 'next/link';
import {
  TwArticleCard,
  TwButton,
  TwCTABand,
  TwContentGrid,
  TwHero,
  TwReveal,
  TwSectionHeading,
} from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import { toExcerpt } from '@/app/home/contentCards';
import { TRI_LINKS } from './constants';
import {
  TRI_LOGO_SRC,
  TRI_SHOW_NAME,
  episodeHref,
  episodeLabel,
  episodeMeta,
} from '../podcastFormat';
import { EpisodePlayButton } from '../components/EpisodePlayButton';
import { ListenOn } from '../components/ListenOn';
import { TriVideos } from '../components/TriVideos';
import styles from './page.module.scss';

const TRI_DESCRIPTION =
  'The Resonant Identity, hosted by Terence Waters: identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity.';

export const metadata: Metadata = {
  title: 'The Resonant Identity Podcast',
  description: TRI_DESCRIPTION,
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'The Resonant Identity Podcast | Terence Waters',
    description: TRI_DESCRIPTION,
    url: 'https://terencewaters.com/podcasts/theresonantid',
    siteName: 'Terence Waters',
    images: [
      {
        url: 'https://terencewaters.com/images/ResonantIdentity_logo.png',
        alt: 'The Resonant Identity Podcast',
      },
    ],
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * The Resonant Identity Podcast Home Page
 * URL: /podcasts/theresonantid/
 *
 * Hero with the most recent episode, the platforms to follow it on, every
 * episode as a card (each links to its episode page and plays in the site's
 * persistent mini-player), the show's YouTube videos, and a link out to
 * theresonantidentity.com. A server component with client islands for the
 * play buttons, the platform logos and the runtime-fetched videos.
 *
 * The episode cards are text-only: the feed gives every episode the show's
 * square cover, which the cards' 16:9 frame cropped. The cover sits beside
 * the platforms instead.
 */
export default async function TheResonantIdentityPodcastPage() {
  // Fetch live episode data from the Spreaker RSS feed at build time. When it
  // is unavailable the page says so instead of listing episodes.
  const feed = await fetchSpreakerEpisodes();
  const episodes = feed.episodes;
  const latest = feed.available ? episodes[0] : undefined;

  return (
    <div className={styles.page}>
      <SiteNav />
      <main id='main'>
        <TwHero
          eyebrow='Podcast'
          title='The Resonant Identity Podcast'
          body='The Resonant Identity is a podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention. It is a living extension of The Resonance Core Framework™ where identity becomes practice and is formed through coherence.'
          compact
        >
          {latest ? (
            <div className={styles.latest}>
              <p className={styles.latestLabel}>Most recent episode</p>
              <p className={styles.latestTitle}>
                <Link href={episodeHref(latest.slug)}>{latest.title}</Link>
              </p>
              {episodeMeta(latest) ? (
                <p className={styles.latestMeta}>{episodeMeta(latest)}</p>
              ) : null}
              <div className={styles.latestAction}>
                <EpisodePlayButton
                  episode={latest}
                  variant='primary'
                  size='md'
                  label='Play now'
                />
              </div>
            </div>
          ) : null}
        </TwHero>

        {/* ===== Follow the show ===== */}
        <section
          id='listen'
          className={styles.sectionAlt}
          aria-labelledby='tri-listen-title'
        >
          <div className={`${styles.container} ${styles.listen}`}>
            {/* eslint-disable-next-line @next/next/no-img-element --
                output:'export' + images.unoptimized, so next/image adds nothing. */}
            <img
              className={`tw-media ${styles.logo}`}
              src={TRI_LOGO_SRC}
              alt='The Resonant Identity podcast logo'
              width={2048}
              height={2048}
              loading='lazy'
              decoding='async'
            />
            <div>
              <TwSectionHeading
                kicker='Subscribe'
                title={
                  <span id='tri-listen-title'>
                    Subscribe on your favorite platform
                  </span>
                }
              />
              <ListenOn />
            </div>
          </div>
        </section>

        {/* ===== Episodes ===== */}
        <section
          id='episodes'
          className={styles.section}
          aria-labelledby='tri-episodes-title'
        >
          <div className={styles.container}>
            <TwSectionHeading
              kicker='Episodes'
              title={
                <span id='tri-episodes-title'>
                  {feed.available
                    ? `Episodes (${episodes.length})`
                    : 'Episodes'}
                </span>
              }
            />
            <div className={styles.episodes}>
              {!feed.available ? (
                <p className={styles.empty}>
                  Episodes are loading or temporarily unavailable.
                </p>
              ) : episodes.length === 0 ? (
                <p className={styles.empty}>
                  No episodes available yet. Check back soon!
                </p>
              ) : (
                <TwContentGrid cols={3} tabletCols={2}>
                  {episodes.map((episode) => (
                    <TwArticleCard
                      key={episode.slug}
                      title={episode.title}
                      excerpt={toExcerpt(episode.description)}
                      category={episodeLabel(episode)}
                      date={episodeMeta(episode)}
                      dateTime={episode.publishedDate || undefined}
                      href={episodeHref(episode.slug)}
                      actions={<EpisodePlayButton episode={episode} />}
                    />
                  ))}
                </TwContentGrid>
              )}
            </div>
          </div>
        </section>

        <TriVideos />

        {/* ===== About the show, on its own site ===== */}
        <section id='about-the-show' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker={TRI_SHOW_NAME}
                title='About The Resonant Identity Podcast'
                body='Learn more about the philosophy, community, and mission behind The Resonant Identity Podcast.'
              >
                <TwButton href={TRI_LINKS.about} target='_blank' rel='noopener'>
                  About {TRI_SHOW_NAME}
                </TwButton>
              </TwCTABand>
            </TwReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
