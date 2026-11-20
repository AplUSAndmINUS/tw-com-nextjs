import { describe, expect, it } from 'vitest';
import { episodeToCard, mergeHomeCards } from './contentCards';
import type { HomeCard } from '@/app/HomePageClient';

describe('episodeToCard', () => {
  it('links to the on-site episode page and trims long descriptions', () => {
    const card = episodeToCard({
      slug: 'the-quiet-rebuild--12345678',
      title: 'The Quiet Rebuild',
      description: 'word '.repeat(100),
      audioUrl: 'https://example.com/a.mp3',
      publishedDate: '2026-09-01',
      tags: [],
      imageUrl: 'https://example.com/cover.jpg',
    });
    expect(card.href).toBe('/podcasts/the-quiet-rebuild--12345678');
    expect(card.category).toBe('Podcast');
    expect(card.date).toBe('2026-09-01');
    expect(card.image).toBe('https://example.com/cover.jpg');
    expect(card.excerpt.length).toBeLessThanOrEqual(181);
    expect(card.excerpt.endsWith('…')).toBe(true);
  });
});

const card = (slug: string, date?: string): HomeCard => ({
  slug,
  title: slug,
  excerpt: '',
  href: `/${slug}`,
  date,
});

describe('mergeHomeCards', () => {
  it('mixes writing and episodes, newest first, three in all', () => {
    const merged = mergeHomeCards(
      [card('post-a', '2026-11-02'), card('post-b', '2026-10-01')],
      [card('ep-a', '2026-11-16'), card('ep-b', '2026-11-09')]
    );
    expect(merged.map((c) => c.slug)).toEqual(['ep-a', 'ep-b', 'post-a']);
  });

  it('is writing only when the podcast feed is empty', () => {
    const merged = mergeHomeCards(
      [
        card('a', '2026-11-02'),
        card('b', '2026-11-01'),
        card('c', '2026-10-01'),
        card('d', '2026-09-01'),
      ],
      []
    );
    expect(merged.map((c) => c.slug)).toEqual(['a', 'b', 'c']);
  });

  it('puts undated or unparseable items last', () => {
    const merged = mergeHomeCards(
      [card('none'), card('bad', 'soon'), card('dated', '2026-01-01')],
      []
    );
    expect(merged[0].slug).toBe('dated');
  });
});
