import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { ContentDetailNav } from '@/components/ContentDetailNav';
import { SpreakerPlayer } from '@/components/SpreakerPlayer';
import { fetchSpreakerEpisodes, SPREAKER_SHOW_ID } from '@/lib/spreaker';
import { PodcastEpisodeLabel } from './PodcastEpisodeLabel';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Slug used for the placeholder episode page shown before real episodes exist */
const PLACEHOLDER_SLUG = 'coming-soon';

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

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;

  if (!slug) notFound();

  // Look up the episode from the RSS feed so we can render metadata and a
  // scoped Spreaker player (episode-specific when we have the episode ID,
  // show-level otherwise).
  const feed = await fetchSpreakerEpisodes();
  const episode = feed.episodes.find((ep) => ep.slug === slug);

  // If the episode is not in the feed and it's not the placeholder, return 404.
  if (!episode && slug !== PLACEHOLDER_SLUG) {
    notFound();
  }

  const episodeId = episode?.spreakerEpisodeId;
  const feedAvailable = feed.available;

  return (
    <PageLayout>
      <div className='max-w-3xl mx-auto px-4 py-12'>
        <ContentDetailNav
          prevHref='/podcasts'
          listingPath='/podcasts'
          listingLabel='Podcasts'
        />
        <PodcastEpisodeLabel />

        {episode ? (
          <>
            <h1 className='text-3xl font-bold mt-2 mb-2'>{episode.title}</h1>
            {episode.publishedDate && (
              <time
                dateTime={episode.publishedDate}
                className='block text-sm mb-4'
                style={{ opacity: 0.6 }}
              >
                {new Date(episode.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            )}
            {episode.description && (
              <p className='mb-6 leading-relaxed'>{episode.description}</p>
            )}
          </>
        ) : (
          <h1 className='text-3xl font-bold mt-2 mb-6'>
            {slug === PLACEHOLDER_SLUG ? 'Podcasts Coming Soon' : `Episode: ${slug}`}
          </h1>
        )}

        {/* Spreaker player — episode-specific when possible, show-level otherwise */}
        <div className='mb-8'>
          <SpreakerPlayer
            showId={SPREAKER_SHOW_ID}
            episodeId={episodeId}
            available={feedAvailable}
            height='200px'
            theme='dark'
          />
        </div>

        {!feedAvailable && (
          <p className='mt-4' style={{ opacity: 0.5, fontSize: '0.875rem' }}>
            Full episode details coming soon.
          </p>
        )}
      </div>
    </PageLayout>
  );
}
