import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import type { PodcastEpisode } from '@/content/types';
import type { SpreakerFeedResult } from '@/lib/spreaker';

vi.mock('next/navigation', () => ({
  usePathname: () => '/podcasts/theresonantid/',
}));

const feed = vi.hoisted(() => ({ current: null as unknown }));
vi.mock('@/lib/spreaker', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/spreaker')>()),
  fetchSpreakerEpisodes: async () => feed.current,
}));

import { PodcastPlayerProvider } from '@/components/PodcastPlayer';
import { PODCAST_PLATFORMS } from '@/lib/spreaker';
import ShowPage, { metadata } from './page';
import { TRI_LINKS } from './constants';

const episode = (n: number): PodcastEpisode => ({
  slug: `episode-${n}--1000000${n}`,
  title: `Episode ${n} title`,
  description: `Notes for episode ${n}.`,
  audioUrl: `https://example.test/ep${n}.mp3`,
  publishedDate: `2026-10-0${n}`,
  duration: '2880',
  tags: [],
  category: 'Podcast',
  imageUrl: `https://example.test/ep${n}.jpg`,
  episode: n,
  season: 1,
});

const liveFeed = (episodes: PodcastEpisode[]): SpreakerFeedResult => ({
  episodes,
  showTitle: 'The Resonant Identity',
  showDescription: '',
  showImageUrl: '',
  available: episodes.length > 0,
});

async function render(result: SpreakerFeedResult) {
  feed.current = result;
  const page = await ShowPage();
  const html = renderToStaticMarkup(
    <PodcastPlayerProvider>{page}</PodcastPlayerProvider>
  );
  return new JSDOM(html).window.document;
}

describe('/podcasts/theresonantid with a live feed', () => {
  let doc: Document;
  beforeEach(async () => {
    doc = await render(liveFeed([episode(3), episode(2), episode(1)]));
  });

  it('renders on the design system: main#main and one h1', () => {
    expect(doc.querySelector('main#main')).not.toBe(null);
    expect(doc.querySelector('#main-content')).toBe(null);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe(
      'The Resonant Identity Podcast'
    );
  });

  it('puts the most recent episode in the hero, linked and playable', () => {
    const hero = doc.querySelector('main#main > section')!;
    expect(hero.textContent).toContain('Most recent episode');
    expect(
      hero.querySelector('a[href="/podcasts/episode-3--10000003/"]')
        ?.textContent
    ).toBe('Episode 3 title');
    expect(hero.textContent).toContain('2026.10.03 · 48 min');
    const play = hero.querySelector('button')!;
    expect(play.textContent).toBe('Play now');
    expect(play.getAttribute('aria-label')).toBe('Play now: Episode 3 title');
  });

  it('lists every episode as a card linking to its page, with a play button', () => {
    const cards = Array.from(doc.querySelectorAll('#episodes article'));
    expect(cards).toHaveLength(3);
    expect(doc.querySelector('#tri-episodes-title')?.textContent).toBe(
      'Episodes (3)'
    );
    cards.forEach((card, i) => {
      const n = 3 - i;
      expect(card.querySelector('h3 a')?.getAttribute('href')).toBe(
        `/podcasts/episode-${n}--1000000${n}/`
      );
      expect(card.textContent).toContain(`S1 · E${n}`);
      expect(card.textContent).toContain(`Notes for episode ${n}.`);
      expect(card.querySelector('button')?.getAttribute('aria-label')).toBe(
        `Play episode: Episode ${n} title`
      );
    });
  });

  it('links every platform in a new tab, plus the RSS feed', () => {
    const links = Array.from(doc.querySelectorAll('#listen a'));
    const hrefs = links.map((a) => a.getAttribute('href'));
    for (const url of Object.values(PODCAST_PLATFORMS)) {
      expect(hrefs).toContain(url);
    }
    expect(hrefs).toContain('/api/podcasts/rss');
    // Every one opens a new tab, the RSS feed included: as a same-tab link
    // PageTransition would client-navigate to the Function route.
    links.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.textContent).toContain('(opens in a new tab)');
    });
  });

  it('closes with About The Resonant Identity, in a new tab with the referrer', () => {
    const about = doc.querySelector(
      `#about-the-show a[href="${TRI_LINKS.about}"]`
    )!;
    expect(about.getAttribute('target')).toBe('_blank');
    expect(about.getAttribute('rel')).toBe('noopener');
  });

  it('has no duplicate ids and trailing slashes on internal page links', () => {
    const ids = Array.from(doc.querySelectorAll('[id]')).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const hrefs = Array.from(doc.querySelectorAll('main a'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('/') && !h.startsWith('/api/'));
    for (const h of hrefs) expect(h.split('#')[0].endsWith('/'), h).toBe(true);
  });
});

describe('/podcasts/theresonantid without a feed', () => {
  it('says episodes are unavailable and offers nothing to play', async () => {
    const doc = await render({ ...liveFeed([]), available: false });
    expect(doc.querySelector('#episodes')?.textContent).toContain(
      'Episodes are loading or temporarily unavailable.'
    );
    expect(doc.querySelectorAll('#episodes article')).toHaveLength(0);
    expect(doc.querySelector('main')?.textContent).not.toContain(
      'Most recent episode'
    );
    expect(doc.querySelectorAll('main button')).toHaveLength(0);
  });
});

describe('/podcasts/theresonantid metadata', () => {
  it('is unchanged', () => {
    expect(metadata.title).toBe('The Resonant Identity Podcast');
    expect(metadata.openGraph?.url).toBe(
      'https://terencewaters.com/podcasts/theresonantid'
    );
  });
});
