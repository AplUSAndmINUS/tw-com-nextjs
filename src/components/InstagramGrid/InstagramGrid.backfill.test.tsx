// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INSTAGRAM_FETCH_LIMIT, normalizeInstagramFeed } from '@/lib/instagram';
import { createMockInstagramFeed, withHttpsImages } from '@/lib/instagram.mock';
import { InstagramGrid } from './InstagramGrid';

/**
 * Backfill, end to end through React: the grid is mounted in jsdom (this file
 * opts in with the docblock above; the rest of the suite server-renders in
 * Node, see vitest.config.ts), the API is a stubbed fetch answering with the
 * Faker feed, and images "fail" by dispatching real `error` events, exactly
 * what a browser fires when an image can't load. jsdom never loads images
 * itself, so nothing fails unless a test says so.
 */

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// The production path: the grid fetches and normalises as PROD does, so the
// feed carries https image links (PROD rejects Faker's data: images).
const FEED = withHttpsImages(createMockInstagramFeed());
const POOL = normalizeInstagramFeed(FEED, INSTAGRAM_FETCH_LIMIT);
const permalinks = (posts: { permalink: string }[]) =>
  posts.map((p) => p.permalink);

let container: HTMLDivElement;
let root: Root;
let fetchSpy: ReturnType<typeof vi.fn>;

async function mountGrid() {
  await act(async () => {
    root.render(<InstagramGrid />);
  });
  // Let the fetch promise and the state update settle.
  await act(async () => {
    await Promise.resolve();
  });
}

const shown = () =>
  Array.from(container.querySelectorAll('ul a[href]')).map((a) =>
    a.getAttribute('href')
  );

/** Fires the browser's image `error` event on the tile for `permalink`. */
function failImage(permalink: string) {
  const img = container.querySelector(`a[href="${permalink}"] img`);
  if (!img) throw new Error(`no tile for ${permalink}`);
  act(() => {
    img.dispatchEvent(new Event('error'));
  });
}

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

describe('InstagramGrid backfill', () => {
  it('fetches a pool of 16 and shows the first 12', async () => {
    await mountGrid();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/instagram?limit=16');
    expect(shown()).toEqual(permalinks(POOL.slice(0, 12)));
  });

  it('replaces images that fail to load with the next posts, in order', async () => {
    await mountGrid();

    failImage(POOL[0].permalink);
    failImage(POOL[6].permalink);
    failImage(POOL[11].permalink);

    const failed = new Set([0, 6, 11]);
    expect(shown()).toHaveLength(12);
    expect(shown()).toEqual(
      permalinks(POOL.filter((_, i) => !failed.has(i)).slice(0, 12))
    );
  });

  it('promotes a spare that fails too', async () => {
    await mountGrid();

    failImage(POOL[2].permalink);
    failImage(POOL[12].permalink); // the first spare fails as soon as it shows

    expect(shown()).toHaveLength(12);
    expect(shown()).not.toContain(POOL[12].permalink);
    expect(shown()).toContain(POOL[13].permalink);
  });

  it('counts an image that errors twice as one failure', async () => {
    await mountGrid();

    const img = container.querySelector(`a[href="${POOL[3].permalink}"] img`);
    act(() => {
      img?.dispatchEvent(new Event('error'));
      img?.dispatchEvent(new Event('error'));
    });

    expect(shown()).toEqual(
      permalinks(POOL.filter((_, i) => i !== 3).slice(0, 12))
    );
  });

  it('comes up short only after more than 4 failures', async () => {
    await mountGrid();

    for (const post of POOL.slice(0, 4)) failImage(post.permalink);
    expect(shown()).toHaveLength(12);

    failImage(POOL[4].permalink);
    expect(shown()).toHaveLength(11);
  });

  it('reloads for a new limit, showing placeholders meanwhile, with failures cleared', async () => {
    await mountGrid();
    failImage(POOL[0].permalink);
    expect(shown()).not.toContain(POOL[0].permalink);

    // New limit: until the new pool arrives, the old result reads as loading.
    let resolveFetch: (value: Response) => void = () => {};
    fetchSpy.mockImplementationOnce(
      () => new Promise<Response>((resolve) => (resolveFetch = resolve))
    );
    await act(async () => {
      root.render(<InstagramGrid limit={8} />);
    });
    expect(shown()).toEqual([]);
    expect(container.querySelectorAll('li[class*="skeleton"]')).toHaveLength(8);

    await act(async () => {
      resolveFetch(new Response(JSON.stringify(FEED), { status: 200 }));
      await Promise.resolve();
    });
    // The new pool starts with no failures, so #1 is back.
    expect(shown()).toEqual(permalinks(POOL.slice(0, 8)));
  });

  it('falls back to the Instagram line if every image fails', async () => {
    await mountGrid();

    // Fail whatever is on screen until nothing is left to promote.
    for (
      let guard = 0;
      guard < INSTAGRAM_FETCH_LIMIT && shown().length;
      guard++
    ) {
      failImage(shown()[0] as string);
    }

    expect(shown()).toEqual([]);
    expect(container.querySelector('[role="status"]')?.textContent).toMatch(
      /latest posts are on Instagram/
    );
  });
});
