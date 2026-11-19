import { afterEach, describe, expect, it, vi } from 'vitest';
import { SOCIAL_URLS } from './socials';
import {
  INSTAGRAM_FETCH_LIMIT,
  INSTAGRAM_HANDLE,
  INSTAGRAM_MAX_LIMIT,
  INSTAGRAM_POST_LIMIT,
  INSTAGRAM_PROFILE_URL,
  clampInstagramLimit,
  fetchInstagramPosts,
  isInstagramMockEnabled,
  loadInstagramPosts,
  INSTAGRAM_CLIENT_TIMEOUT_MS,
  normalizeInstagramFeed,
  pickVisiblePosts,
} from './instagram';
import { createMockInstagramFeed, withHttpsImages } from './instagram.mock';
import { isInstagramMockBuild } from './instagramMockMode';

/**
 * The Instagram data layer, tested against Faker mock feeds only. Nothing here
 * touches the network: fetch is always a stub, and the mock images are
 * in-memory data: URIs.
 */

/** A fetch stub that answers once with `body` and records what it was asked. */
function stubFetch(body: unknown, status = 200) {
  return vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
  );
}

/**
 * Faker's images are data: URIs, which only mock builds accept. Tests that
 * exercise the normaliser directly say so explicitly; tests that go through
 * the production fetch path use withHttpsImages() instead.
 */
const MOCK = { allowDataImages: true } as const;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('the Instagram account', () => {
  it('comes from the socials list, so the handle lives in one place', () => {
    expect(INSTAGRAM_PROFILE_URL).toBe(SOCIAL_URLS.instagram);
    expect(INSTAGRAM_HANDLE).toBe('aplusinflux');
  });

  it('shows a 4 x 3 grid, fetched with 4 spares', () => {
    expect(INSTAGRAM_POST_LIMIT).toBe(12);
    expect(INSTAGRAM_FETCH_LIMIT).toBe(16);
    expect(INSTAGRAM_FETCH_LIMIT).toBeLessThanOrEqual(INSTAGRAM_MAX_LIMIT);
  });
});

describe('createMockInstagramFeed', () => {
  it('is deterministic for a seed, and varies between seeds', () => {
    expect(createMockInstagramFeed()).toEqual(createMockInstagramFeed());
    expect(createMockInstagramFeed(12, 1)).not.toEqual(
      createMockInstagramFeed(12, 2)
    );
  });

  it('returns newest first, with every media type and a caption-less post', () => {
    const { data } = createMockInstagramFeed();
    const times = data.map((item) => Date.parse(item.timestamp ?? ''));
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(new Set(data.map((item) => item.media_type))).toEqual(
      new Set(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'])
    );
    expect(data.some((item) => !item.caption)).toBe(true);
  });

  it('never points an image at a real server', () => {
    for (const item of createMockInstagramFeed(INSTAGRAM_MAX_LIMIT).data) {
      const image =
        item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
      expect(image).toMatch(/^data:image\/svg\+xml/);
    }
  });

  /**
   * The Azure Function's tests (api/instagram/instagram.test.js) read this
   * file. api/ has no dependencies by design, so it can't import Faker; this
   * snapshot keeps its fixture in step with the factory. After changing the
   * factory or upgrading Faker, refresh it with `yarn test -u`.
   */
  it('matches the fixture the Azure Function tests use', async () => {
    await expect(
      `${JSON.stringify(createMockInstagramFeed(), null, 2)}\n`
    ).toMatchFileSnapshot('../../api/instagram/fixtures/nocodeapi-feed.json');
  });
});

describe('normalizeInstagramFeed', () => {
  it('turns a mock feed into grid posts, in order', () => {
    const feed = createMockInstagramFeed();
    const posts = normalizeInstagramFeed(feed, INSTAGRAM_POST_LIMIT, MOCK);

    expect(posts).toHaveLength(INSTAGRAM_POST_LIMIT);
    expect(posts.map((p) => p.id)).toEqual(
      feed.data.slice(0, INSTAGRAM_POST_LIMIT).map((item) => item.id)
    );
  });

  it('shows a video by its thumbnail, never its video file', () => {
    const feed = createMockInstagramFeed();
    const posts = normalizeInstagramFeed(feed, INSTAGRAM_FETCH_LIMIT, MOCK);

    feed.data.forEach((item, i) => {
      if (item.media_type === 'VIDEO') {
        expect(posts[i].imageUrl).toBe(item.thumbnail_url);
      } else {
        expect(posts[i].imageUrl).toBe(item.media_url);
      }
    });
  });

  it('keeps carousel posts, which the original component dropped', () => {
    const posts = normalizeInstagramFeed(createMockInstagramFeed(), 12, MOCK);
    expect(posts.some((p) => p.mediaType === 'CAROUSEL_ALBUM')).toBe(true);
  });

  it('gives a caption-less post an empty caption, not undefined', () => {
    const posts = normalizeInstagramFeed(createMockInstagramFeed(), 12, MOCK);
    expect(posts.every((p) => typeof p.caption === 'string')).toBe(true);
    expect(posts.some((p) => p.caption === '')).toBe(true);
  });

  it('drops items that could not be shown safely', () => {
    const [good] = createMockInstagramFeed(1).data;
    const bad = [
      { ...good, id: 'a', permalink: 'javascript:alert(1)' },
      { ...good, id: 'b', permalink: 'https://evil.example/p/x/' },
      { ...good, id: 'c', permalink: 'http://www.instagram.com/p/x/' },
      { ...good, id: 'd', media_type: 'IMAGE', media_url: 'http://cdn/x.jpg' },
      { ...good, id: 'e', media_type: 'IMAGE', media_url: 'javascript:x' },
      { ...good, id: 'f', media_type: 'VIDEO', thumbnail_url: undefined },
      { ...good, id: 'g', media_type: 'STORY' },
      { ...good, id: '' },
      null,
      'not an item',
    ];

    const posts = normalizeInstagramFeed({ data: [...bad, good] }, 12, MOCK);
    expect(posts.map((p) => p.id)).toEqual([good.id]);
  });

  it('accepts data: images only in mock builds (PROD gets https only)', () => {
    const feed = createMockInstagramFeed();

    // Default outside a mock build: Faker's data: images are rejected.
    expect(normalizeInstagramFeed(feed)).toEqual([]);
    expect(
      normalizeInstagramFeed(feed, 12, { allowDataImages: false })
    ).toEqual([]);
    // The same posts as https CDN links are fine.
    expect(normalizeInstagramFeed(withHttpsImages(feed))).toHaveLength(12);

    // In a mock build the default flips.
    vi.stubEnv('TW_INSTAGRAM_MOCK_BUILD', 'true');
    expect(normalizeInstagramFeed(feed)).toHaveLength(12);
  });

  it('skips a repeated id', () => {
    const [post] = createMockInstagramFeed(1).data;
    expect(
      normalizeInstagramFeed({ data: [post, post] }, 12, MOCK)
    ).toHaveLength(1);
  });

  it('returns nothing for a payload without a data array', () => {
    for (const payload of [null, undefined, 'x', {}, { data: 'x' }]) {
      expect(normalizeInstagramFeed(payload)).toEqual([]);
    }
  });

  it('stops at the limit', () => {
    const feed = createMockInstagramFeed(INSTAGRAM_MAX_LIMIT);
    expect(normalizeInstagramFeed(feed, 5, MOCK)).toHaveLength(5);
    expect(normalizeInstagramFeed(feed, 500, MOCK)).toHaveLength(
      INSTAGRAM_MAX_LIMIT
    );
  });
});

describe('pickVisiblePosts (backfill)', () => {
  const pool = normalizeInstagramFeed(
    createMockInstagramFeed(),
    INSTAGRAM_FETCH_LIMIT,
    MOCK
  );
  const ids = (posts: { id: string }[]) => posts.map((p) => p.id);

  it('shows the first 12 of the pool when nothing has failed', () => {
    expect(ids(pickVisiblePosts(pool, new Set()))).toEqual(
      ids(pool.slice(0, 12))
    );
  });

  it('fills each failed post’s place from the spares, keeping feed order', () => {
    const failed = new Set([pool[0].id, pool[5].id, pool[11].id]);
    const visible = pickVisiblePosts(pool, failed);

    expect(visible).toHaveLength(12);
    expect(ids(visible)).toEqual(
      ids(pool.filter((p) => !failed.has(p.id)).slice(0, 12))
    );
    expect(ids(visible)).toContain(pool[14].id);
    expect(ids(visible)).not.toContain(pool[15].id);
  });

  it('stays full with up to 4 failures, and only then comes up short', () => {
    const failFirst = (n: number) => new Set(ids(pool.slice(0, n)));
    expect(pickVisiblePosts(pool, failFirst(4))).toHaveLength(12);
    expect(pickVisiblePosts(pool, failFirst(5))).toHaveLength(11);
    expect(pickVisiblePosts(pool, new Set(ids(pool)))).toEqual([]);
  });

  it('ignores failures for posts that are not in the pool', () => {
    expect(pickVisiblePosts(pool, new Set(['not-a-post']))).toHaveLength(12);
  });
});

describe('clampInstagramLimit', () => {
  it('keeps the count within 1..24, defaulting to 12', () => {
    expect(clampInstagramLimit(0)).toBe(1);
    expect(clampInstagramLimit(7.9)).toBe(7);
    expect(clampInstagramLimit(99)).toBe(INSTAGRAM_MAX_LIMIT);
    expect(clampInstagramLimit(Number.NaN)).toBe(INSTAGRAM_POST_LIMIT);
  });
});

describe('fetchInstagramPosts', () => {
  it('asks the Azure Function for the grid’s worth of posts', async () => {
    const fetchImpl = stubFetch(withHttpsImages(createMockInstagramFeed()));

    const posts = await fetchInstagramPosts({ fetchImpl });

    expect(posts).toHaveLength(INSTAGRAM_POST_LIMIT);
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/instagram?limit=12');
  });

  it('cancels the request when the caller aborts (the grid unmounting)', async () => {
    const fetchImpl = stubFetch(withHttpsImages(createMockInstagramFeed()));
    const controller = new AbortController();

    await fetchInstagramPosts({ fetchImpl, signal: controller.signal });
    const requestSignal = fetchImpl.mock.calls[0][1]?.signal;
    expect(requestSignal?.aborted).toBe(false);

    const hanging = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          );
        })
    );
    const pending = fetchInstagramPosts({
      fetchImpl: hanging,
      signal: controller.signal,
    });
    controller.abort();
    await expect(pending).rejects.toThrow(/Abort/);
  });

  it('gives up after its timeout if the function never answers', async () => {
    vi.useFakeTimers();
    try {
      const hanging = vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError'))
            );
          })
      );
      const pending = fetchInstagramPosts({ fetchImpl: hanging });
      const settled = expect(pending).rejects.toThrow(/Abort/);

      await vi.advanceTimersByTimeAsync(INSTAGRAM_CLIENT_TIMEOUT_MS - 1);
      expect(hanging.mock.calls[0][1]?.signal?.aborted).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      await settled;
    } finally {
      vi.useRealTimers();
    }
  });

  it('waits longer than the function’s own worst case (about 9 s)', () => {
    expect(INSTAGRAM_CLIENT_TIMEOUT_MS).toBeGreaterThan(9_000);
  });

  it('asks for the pool of 16 when the grid wants spares', async () => {
    const fetchImpl = stubFetch(withHttpsImages(createMockInstagramFeed()));

    const posts = await fetchInstagramPosts({
      fetchImpl,
      limit: INSTAGRAM_FETCH_LIMIT,
    });

    expect(posts).toHaveLength(INSTAGRAM_FETCH_LIMIT);
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/instagram?limit=16');
  });

  it('throws when the function is not configured (503)', async () => {
    const fetchImpl = stubFetch({ error: 'not configured' }, 503);
    await expect(fetchInstagramPosts({ fetchImpl })).rejects.toThrow(/503/);
  });
});

describe('isInstagramMockBuild (decided per build in next.config.ts)', () => {
  it.each([
    ['dev', true],
    ['development', true],
    ['DEV', true],
    ['test', true],
    ['prod', false],
    ['', false],
    [undefined, false],
  ])('with the flag on, environment %j -> %s', (environment, expected) => {
    expect(
      isInstagramMockBuild({
        NEXT_PUBLIC_INSTAGRAM_MOCK: 'true',
        NEXT_PUBLIC_ENVIRONMENT: environment,
      })
    ).toBe(expected);
  });

  it('is off without the flag, whatever the environment', () => {
    for (const flag of [undefined, '', 'false', '1', 'TRUE']) {
      expect(
        isInstagramMockBuild({
          NEXT_PUBLIC_INSTAGRAM_MOCK: flag,
          NEXT_PUBLIC_ENVIRONMENT: 'dev',
        })
      ).toBe(false);
    }
  });
});

describe('loadInstagramPosts (mock mode)', () => {
  it('uses the Faker feed in a mock build, with no fetch', async () => {
    vi.stubEnv('TW_INSTAGRAM_MOCK_BUILD', 'true');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    expect(isInstagramMockEnabled()).toBe(true);
    const posts = await loadInstagramPosts({ limit: INSTAGRAM_FETCH_LIMIT });

    expect(posts).toEqual(
      normalizeInstagramFeed(
        createMockInstagramFeed(),
        INSTAGRAM_FETCH_LIMIT,
        MOCK
      )
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('calls the API in any other build (PROD always gets this)', async () => {
    vi.stubEnv('TW_INSTAGRAM_MOCK_BUILD', 'false');
    const fetchSpy = stubFetch(createMockInstagramFeed(3));
    vi.stubGlobal('fetch', fetchSpy);

    expect(isInstagramMockEnabled()).toBe(false);
    await loadInstagramPosts();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});
