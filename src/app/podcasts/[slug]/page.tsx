import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { TwArticleView } from '@/components/dsm';
import { BackLink } from '@/components/BackLink';
import { Footer } from '@/components/Footer';
import { NewTabHint } from '@/components/NewTabHint';
import { SiteNav } from '@/components/SiteNav';
import { fetchSpreakerEpisodes, SPREAKER_SHOW_URL } from '@/lib/spreaker';
import {
  PLACEHOLDER_SLUG,
  TRI_SHOW_NAME,
  TRI_SHOW_PATH,
  episodeMeta,
  toParagraphs,
} from '../podcastFormat';
import { EpisodePlayer } from '../components/EpisodePlayer';
import styles from './page.module.scss';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Try to pre-render each episode from the live RSS feed.
  // Always include the placeholder slug so the static export never errors.
  const feed = await fetchSpreakerEpisodes();
  const slugs = feed.available
    ? feed.episodes.map((ep) => ({ slug: ep.slug }))
    : [];

  const hasPlaceholder = slugs.some((s) => s.slug === PLACEHOLDER_SLUG);
  if (!hasPlaceholder) {
    slugs.push({ slug: PLACEHOLDER_SLUG });
  }

  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Attempt to look up the episode title for a richer meta title
  const feed = await fetchSpreakerEpisodes();
  const episode = feed.episodes.find((ep) => ep.slug === slug);
  const title = episode
    ? `${episode.title} — Podcast`
    : `Podcast Episode — ${slug}`;

  return {
    title,
    metadataBase: new URL('https://terencewaters.com'),
    robots: getRobotsConfig(),
  };
}

/**
 * An episode page, laid out like a blog post: the episode's meta, title and
 * player, then its show notes. The player drives the site's shared audio
 * element, so the episode keeps playing in the mini-player after the visitor
 * moves on. The placeholder slug (built when the feed is unavailable) keeps
 * the route in the static export.
 */
export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  // Look up the episode from the RSS feed so we can render its details and
  // hand it to the player.
  const feed = await fetchSpreakerEpisodes();
  const episode = feed.episodes.find((ep) => ep.slug === slug);

  // If the episode is not in the feed and it's not the placeholder, return 404.
  if (!episode && slug !== PLACEHOLDER_SLUG) {
    notFound();
  }

  const title = episode
    ? episode.title
    : slug === PLACEHOLDER_SLUG
      ? 'Podcasts Coming Soon'
      : `Episode: ${slug}`;

  return (
    <>
      <SiteNav />
      <main id='main' className={styles.main}>
        <BackLink href={TRI_SHOW_PATH} label={`Back to ${TRI_SHOW_NAME}`} />
        <TwArticleView
          category='Podcast Episode'
          date={episode ? episodeMeta(episode) : undefined}
          title={title}
          backHref={TRI_SHOW_PATH}
          backLabel='All episodes'
        >
          {episode?.audioUrl ? (
            <EpisodePlayer episode={episode} />
          ) : feed.available ? (
            <p>
              Every episode is on the{' '}
              <Link href={TRI_SHOW_PATH}>{TRI_SHOW_NAME} show page</Link>.
            </p>
          ) : (
            <p>
              This podcast is currently unavailable.{' '}
              <a
                href={SPREAKER_SHOW_URL}
                target='_blank'
                rel='noopener noreferrer'
              >
                Visit on Spreaker
                <NewTabHint />
              </a>
            </p>
          )}

          {episode
            ? toParagraphs(episode.description).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))
            : null}

          {!feed.available ? <p>Full episode details coming soon.</p> : null}
        </TwArticleView>
      </main>
      <Footer />
    </>
  );
}
