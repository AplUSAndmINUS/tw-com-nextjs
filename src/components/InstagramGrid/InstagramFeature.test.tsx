// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  INSTAGRAM_FETCH_LIMIT,
  normalizeInstagramFeed,
  type InstagramPost,
} from '@/lib/instagram';
import { createMockInstagramFeed, withHttpsImages } from '@/lib/instagram.mock';
import { InstagramGrid } from './InstagramGrid';
import { InstagramFeatureView } from './InstagramFeatureView';
import styles from './InstagramGrid.module.scss';

/**
 * The /about-me "Off the page" layout (#288): one lead tile and four squares,
 * fed by InstagramGrid's pool and backfill.
 */

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const FEED = withHttpsImages(createMockInstagramFeed());
const POOL = normalizeInstagramFeed(FEED, INSTAGRAM_FETCH_LIMIT);

const view = (state: Parameters<typeof InstagramFeatureView>[0]['state']) => {
  const host = document.createElement('div');
  host.innerHTML = renderToStaticMarkup(<InstagramFeatureView state={state} />);
  return host;
};

describe('InstagramFeatureView', () => {
  it('holds the lead-plus-four shape while loading', () => {
    const host = view({ status: 'loading' });
    const tiles = host.querySelectorAll('ul[aria-hidden="true"] li');
    expect(tiles).toHaveLength(5);
    expect(tiles[0].classList.contains(styles.featureLead)).toBe(true);
    expect(host.querySelector('[role="status"]')?.textContent).toBe(
      'Loading Instagram posts'
    );
  });

  it('shows the fallback line on an error or an empty feed', () => {
    for (const state of [
      { status: 'error' as const },
      { status: 'ready' as const, posts: [] as InstagramPost[] },
    ]) {
      expect(view(state).querySelector('[role="status"]')?.textContent).toMatch(
        /can’t be shown right now/
      );
    }
  });

  it('shows five posts at most, the first as the lead, videos badged', () => {
    const posts = POOL.slice(0, 8);
    const host = view({ status: 'ready', posts });
    const items = Array.from(host.querySelectorAll('ul > li'));
    expect(items).toHaveLength(5);
    expect(
      items.map((li) => li.classList.contains(styles.featureLead))
    ).toEqual([true, false, false, false, false]);
    const links = host.querySelectorAll('a');
    expect(Array.from(links).map((a) => a.getAttribute('href'))).toEqual(
      posts.slice(0, 5).map((p) => p.permalink)
    );
    for (const [i, a] of Array.from(links).entries()) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(!!a.querySelector(`.${styles.badge}`)).toBe(
        posts[i].mediaType === 'VIDEO'
      );
    }
  });
});

describe('InstagramGrid layout="feature"', () => {
  let container: HTMLDivElement;
  let root: Root;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn(
      async () =>
        new Response(JSON.stringify(FEED), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    vi.stubGlobal('fetch', fetchSpy);
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  const shown = () =>
    Array.from(container.querySelectorAll('ul a[href]')).map((a) =>
      a.getAttribute('href')
    );

  it('still fetches the 16-post pool, shows five, and ignores `limit`', async () => {
    await act(async () => {
      root.render(<InstagramGrid layout='feature' limit={12} />);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/instagram?limit=16');
    expect(shown()).toEqual(POOL.slice(0, 5).map((p) => p.permalink));
  });

  it('replaces a post whose image fails with the next one', async () => {
    await act(async () => {
      root.render(<InstagramGrid layout='feature' />);
    });
    await act(async () => {
      await Promise.resolve();
    });
    const second = POOL[1].permalink;
    act(() => {
      container
        .querySelector(`a[href="${second}"] img`)!
        .dispatchEvent(new Event('error'));
    });
    expect(shown()).toEqual(
      [POOL[0], POOL[2], POOL[3], POOL[4], POOL[5]].map((p) => p.permalink)
    );
  });
});
