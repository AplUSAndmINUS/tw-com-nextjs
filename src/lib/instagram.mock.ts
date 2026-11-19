/**
 * Mock Instagram feed, built with Faker, for tests and mock mode.
 *
 * It returns the same raw `{ data: [...] }` shape NoCodeAPI does, extra fields
 * included, so everything downstream (the Azure Function's field picking, the
 * normaliser, the grid) is exercised as it would be against the live feed.
 *
 * No network, ever:
 *   - Images are `faker.image.dataUri()` SVGs generated in memory. Faker's
 *     photo helpers (`image.url`, `urlPicsumPhotos`, `urlLoremFlickr`) point at
 *     third-party servers, so they are deliberately not used.
 *   - Permalinks have the real instagram.com/p/<code>/ shape so the permalink
 *     check is tested, but nothing fetches them. They only open if clicked.
 *
 * Deterministic: a seeded Faker instance and a fixed reference date, so the
 * same seed always gives the same feed. The Azure Function's test fixture is
 * a file snapshot of this output (see instagram.test.ts).
 */

import { Faker, en } from '@faker-js/faker';
import {
  INSTAGRAM_FETCH_LIMIT,
  INSTAGRAM_HANDLE,
  type InstagramFeedResponse,
  type InstagramMediaItem,
  type InstagramMediaType,
} from './instagram';

export const INSTAGRAM_MOCK_SEED = 20261123;

/** Posts are dated in the 90 days before this, newest first. */
export const INSTAGRAM_MOCK_REF_DATE = '2026-11-18T12:00:00.000Z';

/**
 * Image sizes in Instagram's real shapes, at half their 1080px upload width,
 * so mock mode shows how the grid crops them. Reels have 9:16 covers; feed
 * posts are mostly square, with some 4:5 portraits (the owner's mix; he
 * avoids landscape).
 */
const REEL_COVER = { width: 540, height: 960 } as const; // 9:16
const FEED_SHAPES = [
  { weight: 8, value: { width: 540, height: 540 } }, // 1:1
  { weight: 2, value: { width: 540, height: 675 } }, // 4:5
];

/** Fields NoCodeAPI returns that the grid doesn't use. The proxy drops them. */
export interface MockInstagramMediaItem extends InstagramMediaItem {
  username: string;
}

export interface MockInstagramFeed extends InstagramFeedResponse {
  data: MockInstagramMediaItem[];
  paging: { cursors: { before: string; after: string } };
}

/**
 * A mock NoCodeAPI response with `count` posts, newest first: mostly photos,
 * some videos and carousels, and a few posts with no caption (so the grid's
 * fallback labels get tested).
 */
export function createMockInstagramFeed(
  count: number = INSTAGRAM_FETCH_LIMIT,
  seed: number = INSTAGRAM_MOCK_SEED
): MockInstagramFeed {
  const faker = new Faker({ locale: [en] });
  faker.seed(seed);

  const dates = faker.date
    .betweens({
      from: new Date(Date.parse(INSTAGRAM_MOCK_REF_DATE) - 90 * 86_400_000),
      to: INSTAGRAM_MOCK_REF_DATE,
      count,
    })
    .reverse();

  const data = dates.map((date): MockInstagramMediaItem => {
    const mediaType = faker.helpers.weightedArrayElement<InstagramMediaType>([
      { weight: 6, value: 'IMAGE' },
      { weight: 4, value: 'VIDEO' },
      { weight: 2, value: 'CAROUSEL_ALBUM' },
    ]);
    const size =
      mediaType === 'VIDEO'
        ? REEL_COVER
        : faker.helpers.weightedArrayElement(FEED_SHAPES);
    const image = faker.image.dataUri({
      ...size,
      color: faker.color.rgb(),
      type: 'svg-uri',
    });
    const caption = faker.helpers.maybe(
      () =>
        `${faker.lorem.sentence({ min: 4, max: 14 })} #${faker.word.noun()} #${faker.word.adjective()}`,
      { probability: 0.85 }
    );
    const code = faker.string.alphanumeric(11);

    return {
      id: faker.string.numeric(17),
      caption,
      media_type: mediaType,
      // A video's media_url is the .mp4 file; the grid must use the thumbnail.
      media_url:
        mediaType === 'VIDEO'
          ? `https://video.cdninstagram.invalid/${code}.mp4`
          : image,
      thumbnail_url: mediaType === 'VIDEO' ? image : undefined,
      permalink: `https://www.instagram.com/${mediaType === 'VIDEO' ? 'reel' : 'p'}/${code}/`,
      timestamp: date.toISOString(),
      username: INSTAGRAM_HANDLE,
    };
  });

  return {
    data,
    paging: {
      cursors: {
        before: faker.string.alphanumeric(24),
        after: faker.string.alphanumeric(24),
      },
    },
  };
}

/**
 * The same feed as production would receive it: every image is an https CDN
 * link instead of a data: URI (production builds reject data: images). The
 * links use the reserved `.invalid` domain, so nothing can ever load them;
 * tests run in Node/jsdom, where images aren't fetched anyway.
 */
export function withHttpsImages(feed: MockInstagramFeed): MockInstagramFeed {
  const toHttps = (id: string, url: string | undefined) =>
    url?.startsWith('data:')
      ? `https://scontent.cdninstagram.invalid/t51/${id}.jpg`
      : url;
  return {
    ...feed,
    data: feed.data.map((item) => ({
      ...item,
      media_url: toHttps(item.id, item.media_url),
      thumbnail_url: toHttps(item.id, item.thumbnail_url),
    })),
  };
}
