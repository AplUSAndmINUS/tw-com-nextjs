import { describe, expect, it } from 'vitest';
import { HUB_SECTION_TILES, HUB_TILES } from './contentHub';

describe('Content Hub tiles (shared by /content-hub and /about-me)', () => {
  it('lists the podcast first, then the four sections', () => {
    expect(HUB_TILES.map((t) => t.key)).toEqual([
      'podcasts',
      'blog',
      'portfolio',
      'github',
      'videos',
    ]);
    expect(HUB_SECTION_TILES.map((t) => t.key)).toEqual([
      'blog',
      'portfolio',
      'github',
      'videos',
    ]);
  });

  it('uses trailing slashes on every target', () => {
    for (const tile of HUB_TILES) expect(tile.href.endsWith('/')).toBe(true);
  });
});
