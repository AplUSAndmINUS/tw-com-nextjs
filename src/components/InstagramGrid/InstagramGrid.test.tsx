import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import {
  INSTAGRAM_HANDLE,
  normalizeInstagramFeed,
  type InstagramPost,
} from '@/lib/instagram';
import { createMockInstagramFeed } from '@/lib/instagram.mock';
import { InstagramGrid } from './InstagramGrid';
import {
  InstagramGridView,
  describeInstagramPost,
  type InstagramGridState,
} from './InstagramGridView';
import styles from './InstagramGrid.module.scss';

/**
 * Server-rendered in Node and parsed with jsdom, like the other component
 * tests (see vitest.config.ts). Posts come from the Faker mock feed, so the
 * grid is tested with realistic data and no network.
 */

// Rendered straight into the view, so Faker's data: images are allowed here
// explicitly (production builds only accept https images).
const POSTS = normalizeInstagramFeed(createMockInstagramFeed(), 12, {
  allowDataImages: true,
});

function render(state: InstagramGridState, limit?: number): Document {
  const markup = renderToStaticMarkup(
    <InstagramGridView state={state} limit={limit} />
  );
  return new JSDOM(markup).window.document;
}

const tiles = (doc: Document) =>
  Array.from(doc.querySelectorAll<HTMLAnchorElement>(`a.${styles.tile}`));

describe('InstagramGridView, with posts', () => {
  const doc = render({ status: 'ready', posts: POSTS });

  it('renders one tile per post, in feed order', () => {
    expect(tiles(doc).map((a) => a.href)).toEqual(
      POSTS.map((p) => p.permalink)
    );
  });

  it('labels the list with the account', () => {
    expect(doc.querySelector('ul')?.getAttribute('aria-label')).toBe(
      `Latest Instagram posts from @${INSTAGRAM_HANDLE}`
    );
  });

  it('opens each post on Instagram in a new tab, safely', () => {
    for (const tile of tiles(doc)) {
      expect(tile.getAttribute('target')).toBe('_blank');
      expect(tile.getAttribute('rel')).toBe('noopener noreferrer');
      expect(tile.getAttribute('aria-label')).toMatch(
        /\(opens Instagram in a new tab\)$/
      );
    }
  });

  it('shows each post’s image lazily, as decorative photographic media', () => {
    const images = Array.from(doc.querySelectorAll('img'));
    expect(images.map((img) => img.getAttribute('src'))).toEqual(
      POSTS.map((p) => p.imageUrl)
    );
    for (const img of images) {
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.classList.contains('tw-media')).toBe(true);
    }
  });

  it('marks videos, and only videos, with a play badge', () => {
    for (const tile of tiles(doc)) {
      const isVideo = tile.dataset.mediaType === 'VIDEO';
      expect(Boolean(tile.querySelector(`.${styles.badge}`))).toBe(isVideo);
    }
    expect(doc.querySelectorAll(`.${styles.badge}`).length).toBe(
      POSTS.filter((p) => p.mediaType === 'VIDEO').length
    );
  });
});

describe('InstagramGridView, loading and unavailable', () => {
  it('holds the grid’s space with one hidden placeholder per post', () => {
    const doc = render({ status: 'loading' }, 12);
    const root = doc.body.firstElementChild;

    expect(root?.getAttribute('aria-busy')).toBe('true');
    expect(doc.querySelector('ul')?.getAttribute('aria-hidden')).toBe('true');
    expect(doc.querySelectorAll(`li.${styles.skeleton}`)).toHaveLength(12);
    expect(doc.querySelector('[role="status"]')?.textContent).toBe(
      'Loading Instagram posts'
    );
    expect(doc.querySelectorAll('a')).toHaveLength(0);
  });

  it.each<InstagramGridState>([
    { status: 'error' },
    { status: 'ready', posts: [] },
  ])('says the feed is unavailable ($status)', (state) => {
    const doc = render(state);
    expect(doc.querySelector('[role="status"]')?.textContent).toMatch(
      /latest posts are on Instagram/
    );
    expect(doc.querySelectorAll('img')).toHaveLength(0);
  });
});

describe('InstagramGrid', () => {
  it('server-renders its loading state, so the static page reserves the grid', () => {
    const markup = renderToStaticMarkup(<InstagramGrid />);
    const doc = new JSDOM(markup).window.document;
    expect(doc.querySelectorAll(`li.${styles.skeleton}`)).toHaveLength(12);
  });
});

describe('describeInstagramPost', () => {
  const base: InstagramPost = {
    id: '1',
    caption: '',
    mediaType: 'IMAGE',
    imageUrl: 'https://cdn.example/1.jpg',
    permalink: 'https://www.instagram.com/p/1/',
    timestamp: '2026-11-14T10:00:00.000Z',
  };

  it('leads with the media type and the caption', () => {
    expect(
      describeInstagramPost({ ...base, mediaType: 'VIDEO', caption: 'Hi' })
    ).toBe('Video: Hi (opens Instagram in a new tab)');
  });

  it('cuts a long caption at a word, and flattens line breaks', () => {
    const caption = `Line one\n\n${'word '.repeat(40)}`;
    const label = describeInstagramPost({ ...base, caption });
    const text = label.replace(' (opens Instagram in a new tab)', '');

    expect(text.startsWith('Photo: Line one word')).toBe(true);
    expect(text.endsWith('word…')).toBe(true);
    expect(text.length).toBeLessThanOrEqual('Photo: '.length + 101);
  });

  it('falls back to the date, then to the platform, without a caption', () => {
    expect(
      describeInstagramPost({ ...base, mediaType: 'CAROUSEL_ALBUM' })
    ).toBe('Carousel posted 2026.11.14 (opens Instagram in a new tab)');
    expect(describeInstagramPost({ ...base, timestamp: undefined })).toBe(
      'Photo on Instagram (opens Instagram in a new tab)'
    );
  });
});
