import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import type { PodcastEpisode } from '@/content/types';
import type { SpreakerFeedResult } from '@/lib/spreaker';

vi.mock('next/navigation', () => ({
  usePathname: () => '/podcasts/x/',
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const feed = vi.hoisted(() => ({ current: null as unknown }));
vi.mock('@/lib/spreaker', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/spreaker')>()),
  fetchSpreakerEpisodes: async () => feed.current,
}));

import { PodcastPlayerProvider } from '@/components/PodcastPlayer';
import { SPREAKER_SHOW_URL } from '@/lib/spreaker';
import EpisodePage, { generateMetadata, generateStaticParams } from './page';

const EPISODE: PodcastEpisode = {
  slug: 'the-quiet-rebuild--12345678',
  title: 'The Quiet Rebuild',
  description: 'First paragraph.\n\nSecond paragraph.',
  audioUrl: 'https://example.test/quiet.mp3',
  publishedDate: '2026-10-04',
  duration: '2880',
  tags: [],
  category: 'Podcast',
  imageUrl: 'https://example.test/quiet.jpg',
  spreakerEpisodeId: '12345678',
};

const LIVE: SpreakerFeedResult = {
  episodes: [EPISODE],
  showTitle: 'The Resonant Identity',
  showDescription: '',
  showImageUrl: '',
  available: true,
};
const DOWN: SpreakerFeedResult = { ...LIVE, episodes: [], available: false };

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

async function render(result: SpreakerFeedResult, slug: string) {
  feed.current = result;
  const page = await EpisodePage(params(slug));
  const html = renderToStaticMarkup(
    <PodcastPlayerProvider>{page}</PodcastPlayerProvider>
  );
  return new JSDOM(html).window.document;
}

describe('/podcasts/[slug] static params and metadata', () => {
  it('builds every feed episode plus the placeholder', async () => {
    feed.current = LIVE;
    expect(await generateStaticParams()).toEqual([
      { slug: EPISODE.slug },
      { slug: 'coming-soon' },
    ]);
  });

  it('still builds the placeholder when the feed is down', async () => {
    feed.current = DOWN;
    expect(await generateStaticParams()).toEqual([{ slug: 'coming-soon' }]);
  });

  it('keeps the metadata title', async () => {
    feed.current = LIVE;
    expect((await generateMetadata(params(EPISODE.slug))).title).toBe(
      'The Quiet Rebuild — Podcast'
    );
    feed.current = DOWN;
    expect((await generateMetadata(params('coming-soon'))).title).toBe(
      'Podcast Episode — coming-soon'
    );
  });
});

describe('/podcasts/[slug] for an episode', () => {
  it('reads like a blog post: back link, meta, one h1, player, show notes', async () => {
    const doc = await render(LIVE, EPISODE.slug);
    const main = doc.querySelector('main#main')!;
    expect(main).not.toBe(null);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe('The Quiet Rebuild');
    expect(main.textContent).toContain('Podcast Episode');
    expect(main.textContent).toContain('2026.10.04 · 48 min');

    const back = main.querySelector('a')!;
    expect(back.getAttribute('href')).toBe('/podcasts/theresonantid/');
    expect(back.textContent).toContain('Back to The Resonant Identity');

    const play = main.querySelector('button')!;
    expect(play.getAttribute('aria-label')).toBe(
      'Play episode: The Quiet Rebuild'
    );
    expect(main.querySelector('img')?.getAttribute('src')).toBe(
      EPISODE.imageUrl
    );

    const paragraphs = Array.from(main.querySelectorAll('.tw-prose > p')).map(
      (p) => p.textContent
    );
    expect(paragraphs).toEqual(['First paragraph.', 'Second paragraph.']);
  });

  it('plays through the shared player only, with no second Spreaker embed', async () => {
    const doc = await render(LIVE, EPISODE.slug);
    expect(doc.querySelector('iframe')).toBe(null);
  });

  it('404s for a slug that is not in the feed', async () => {
    feed.current = LIVE;
    await expect(EpisodePage(params('no-such-episode'))).rejects.toThrow(
      'NEXT_NOT_FOUND'
    );
  });
});

describe('/podcasts/[slug] placeholder', () => {
  it('says the podcast is unavailable when the feed is down', async () => {
    const doc = await render(DOWN, 'coming-soon');
    expect(doc.querySelector('h1')?.textContent).toBe('Podcasts Coming Soon');
    const main = doc.querySelector('main')!;
    expect(main.textContent).toContain(
      'This podcast is currently unavailable.'
    );
    expect(main.textContent).toContain('Full episode details coming soon.');
    const spreaker = main.querySelector(`a[href="${SPREAKER_SHOW_URL}"]`)!;
    expect(spreaker.getAttribute('target')).toBe('_blank');
    expect(main.querySelectorAll('button')).toHaveLength(0);
  });

  it('points to the show page when the feed is up', async () => {
    const doc = await render(LIVE, 'coming-soon');
    expect(
      doc.querySelector('main .tw-prose a[href="/podcasts/theresonantid/"]')
    ).not.toBe(null);
  });
});
