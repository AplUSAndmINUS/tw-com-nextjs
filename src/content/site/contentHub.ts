/**
 * Content Hub tiles
 * =================
 *
 * The tiles for everything Terence publishes. One source for the Content Hub
 * (/content-hub/) and the "Everything I'm making" tiles on /about-me (owner,
 * Checkpoint 4a). Copy is the Content Hub's existing wording.
 */

import { existing } from './copy';

export type HubTileKey =
  | 'podcasts'
  | 'blog'
  | 'portfolio'
  | 'github'
  | 'videos';

export interface HubTile {
  key: HubTileKey;
  title: string;
  description: string;
  cta: string;
  href: string;
}

const hub = 'Content Hub tile (existing)';

export const HUB_HEADING = existing(
  'hub.heading',
  "Everything I'm making",
  'Content Hub title (existing)'
);

/** Podcasts first (the featured tile), then the four section tiles. */
export const HUB_TILES: HubTile[] = [
  {
    key: 'podcasts',
    title: existing('hub.podcasts.title', 'Podcasts', hub),
    description: existing(
      'hub.podcasts.description',
      'The Resonant Identity — conversations on rebuilding yourself with intention.',
      hub
    ),
    cta: existing('hub.podcasts.cta', 'Listen now', hub),
    href: '/podcasts/',
  },
  {
    key: 'blog',
    title: existing('hub.blog.title', 'Blog', hub),
    description: existing(
      'hub.blog.description',
      'Long-form writing on resonance, identity architecture, and the work in progress.',
      hub
    ),
    cta: existing('hub.blog.cta', 'Read articles', hub),
    href: '/blog/',
  },
  {
    key: 'portfolio',
    title: existing('hub.portfolio.title', 'Portfolio', hub),
    description: existing(
      'hub.portfolio.description',
      'Selected product, platform, and brand work — from concept through launch.',
      hub
    ),
    cta: existing('hub.portfolio.cta', 'View work', hub),
    href: '/portfolio/',
  },
  {
    key: 'github',
    title: existing('hub.github.title', 'GitHub', hub),
    description: existing(
      'hub.github.description',
      'Open-source projects, experiments, and the code behind the work.',
      hub
    ),
    cta: existing('hub.github.cta', 'Explore code', hub),
    href: '/github/',
  },
  {
    key: 'videos',
    title: existing('hub.videos.title', 'Videos', hub),
    description: existing(
      'hub.videos.description',
      'Talks, studio notes, and short films on building with intention.',
      hub
    ),
    cta: existing('hub.videos.cta', 'Watch videos', hub),
    href: '/videos/',
  },
];

/** The four section tiles (everything except the featured Podcasts tile). */
export const HUB_SECTION_TILES = HUB_TILES.filter((t) => t.key !== 'podcasts');
