import { describe, expect, it } from 'vitest';
import { episodeToCard, videoToCard } from './contentCards';

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

describe('videoToCard', () => {
  it('deep-links to YouTube as an external card', () => {
    const card = videoToCard({
      id: 'abc123',
      title: 'Studio notes',
      description: 'Short.',
      thumbnailUrl: 'https://i.ytimg.com/vi/abc123/hq.jpg',
      publishedAt: '2026-08-20T15:00:00Z',
      type: 'video',
    });
    expect(card.href).toBe('https://www.youtube.com/watch?v=abc123');
    expect(card.external).toBe(true);
    expect(card.category).toBe('Video');
    expect(card.date).toBe('2026-08-20');
    expect(card.excerpt).toBe('Short.');
  });
});
