/**
 * Mappers from the podcast and video feeds to the homepage's Content Hub card.
 *
 * Kept free of server-only imports so the same mapping serves both the
 * build-time Spreaker read in page.tsx and the client-side fallbacks in
 * HomePageClient (the /api/podcasts and /api/youtube Azure Functions).
 */
import type { PodcastEpisode } from '@/content/types';
import type { YouTubeVideo } from '@/app/videos/types';
import type { HomeCard } from '@/app/HomePageClient';

/** How many podcast / video cards the homepage shows per filter. */
export const HOME_MEDIA_LIMIT = 4;

const EXCERPT_MAX = 180;

/** Trim feed descriptions (often several paragraphs) to a card-sized excerpt. */
function toExcerpt(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= EXCERPT_MAX) return flat;
  return `${flat.slice(0, EXCERPT_MAX).replace(/\s+\S*$/, '')}…`;
}

export function episodeToCard(episode: PodcastEpisode): HomeCard {
  return {
    slug: `podcast-${episode.slug}`,
    title: episode.title,
    excerpt: toExcerpt(episode.description),
    category: 'Podcast',
    date: episode.publishedDate || undefined,
    href: `/podcasts/${episode.slug}`,
    image: episode.imageUrl,
  };
}

export function videoToCard(video: YouTubeVideo): HomeCard {
  return {
    slug: `video-${video.id}`,
    title: video.title,
    excerpt: toExcerpt(video.description),
    category: 'Video',
    date: video.publishedAt ? video.publishedAt.slice(0, 10) : undefined,
    // /videos/[id] only pre-renders a placeholder in the static export, so
    // deep-link straight to YouTube instead.
    href: `https://www.youtube.com/watch?v=${video.id}`,
    image: video.thumbnailUrl,
    external: true,
  };
}
