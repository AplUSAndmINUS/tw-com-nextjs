/**
 * Small presentation helpers shared by the three /podcasts pages.
 */
import type { PodcastEpisode } from '@/content/types';
import { formatDotDate, formatDuration } from '@/app/home/contentFormat';

export const PODCASTS_PATH = '/podcasts/';
export const TRI_SHOW_PATH = '/podcasts/theresonantid/';
export const TRI_SHOW_NAME = 'The Resonant Identity';

/** The show's square cover art, served from /public. */
export const TRI_LOGO_SRC = '/images/ResonantIdentity_logo.png';

/** Slug of the placeholder episode shown before (or without) a live feed. */
export const PLACEHOLDER_SLUG = 'coming-soon';

/** An episode's detail page, with the site's trailing slash. */
export function episodeHref(slug: string): string {
  return `/podcasts/${slug}/`;
}

/** "2026.10.04 · 48 min" — whichever parts the feed provides. */
export function episodeMeta(episode: PodcastEpisode): string {
  return [
    formatDotDate(episode.publishedDate),
    formatDuration(episode.duration),
  ]
    .filter(Boolean)
    .join(' · ');
}

/** "S1 · E3", "Episode 3", or "Podcast" when the feed has no numbering. */
export function episodeLabel(episode: PodcastEpisode): string {
  if (episode.season !== undefined && episode.episode !== undefined) {
    return `S${episode.season} · E${episode.episode}`;
  }
  if (episode.episode !== undefined) return `Episode ${episode.episode}`;
  return 'Podcast';
}

/**
 * Split a feed description into paragraphs. The parser (htmlToText in
 * src/lib/spreaker.ts) puts each paragraph, line break and list item on its
 * own line.
 */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
