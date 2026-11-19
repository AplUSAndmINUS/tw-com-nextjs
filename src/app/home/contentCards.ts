/**
 * Mapper from the podcast feed to the homepage's Content Hub card.
 *
 * Used by page.tsx at build time.
 */
import type { PodcastEpisode } from '@/content/types';
import type { HomeCard } from '@/app/HomePageClient';

/**
 * How many Content Hub cards the home page shows (owner, #285). Here rather
 * than in HomePageClient: a server module that imports a value from a
 * 'use client' file gets a client reference, not the number.
 */
export const HOME_CONTENT_CARDS = 3;

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

const time = (card: HomeCard) => {
  const t = card.date ? Date.parse(card.date) : NaN;
  return Number.isNaN(t) ? 0 : t;
};

/**
 * The home page's Content Hub cards: writing and podcast episodes together,
 * newest first, HOME_CONTENT_CARDS in all. Undated (or unparseable) items
 * sort last; with no podcast feed the cards are writing only.
 */
export function mergeHomeCards(
  posts: HomeCard[],
  episodes: HomeCard[]
): HomeCard[] {
  return [...posts, ...episodes]
    .sort((a, b) => time(b) - time(a))
    .slice(0, HOME_CONTENT_CARDS);
}
