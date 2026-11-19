/**
 * Instagram feed: the types, the account, and the client for /api/instagram.
 *
 * Ported from the open-source `embed-instagram-feed` web component
 * (instagram/embed-instagram-feed, MIT, NoCodeAPI). That component fetched a
 * NoCodeAPI URL straight from the browser and rendered whatever came back. This
 * version keeps its data contract (NoCodeAPI's `{ data: [...] }`, which is the
 * Instagram Graph API's media shape) but:
 *
 *   - calls the `api/instagram` Azure Function instead, so the NoCodeAPI URL
 *     (which carries the account's token) stays in Azure app settings and never
 *     ships in the static bundle;
 *   - validates every item before it reaches the page. Only https image URLs
 *     (or local data: images, for mock mode) are used, and links must point at
 *     instagram.com;
 *   - keeps carousel posts, which the original silently dropped (it rendered
 *     only IMAGE and VIDEO, leaving holes in the grid).
 *
 * In mock mode (`NEXT_PUBLIC_INSTAGRAM_MOCK=true` on a DEV or TEST build) the
 * feed comes from the Faker factory in `instagram.mock.ts` and goes through the
 * same normaliser, so the UI exercises the real code path without any network
 * call. PROD builds don't contain the mock or Faker at all; see
 * `instagramMockMode.ts`.
 */

import { getApiBaseUrl } from './environment';
import { SOCIAL_URLS } from './socials';

/* ── Account ──────────────────────────────────────────────────────────────── */

/** The profile the grid links to. Comes from the one list of socials. */
export const INSTAGRAM_PROFILE_URL = SOCIAL_URLS.instagram;

/** "aplusinflux", taken from the profile URL so the handle can't drift. */
export const INSTAGRAM_HANDLE = new URL(INSTAGRAM_PROFILE_URL).pathname
  .split('/')
  .filter(Boolean)[0];

/** A 4 x 3 grid on desktop, 3 x 4 on phones and tablets. */
export const INSTAGRAM_POST_LIMIT = 12;

/**
 * How many posts the grid fetches: the 12 it shows plus 4 spares. A post that
 * can't be shown (no cover image, unsafe URL, or an image that fails to load
 * in the browser) is replaced by the next spare, in feed order, so the grid
 * stays full. Up to 4 broken posts are covered; see pickVisiblePosts().
 */
export const INSTAGRAM_FETCH_LIMIT = 16;

/** Same ceiling the Azure Function enforces. */
export const INSTAGRAM_MAX_LIMIT = 24;

/** Relative to getApiBaseUrl(); Azure SWA routes /api to the Functions app. */
export const INSTAGRAM_FEED_PATH = '/api/instagram';

/**
 * Whether /about-me shows the "Off the page" Instagram feed. Off for now
 * (owner, 2026-11-19): connecting the account through Facebook/NoCodeAPI
 * fails, so the section would only show its fallback. Set true once
 * INSTAGRAM_FEED_URL is configured; the quick link to the profile stays.
 */
export const INSTAGRAM_FEED_ENABLED = false;

/**
 * How long the browser waits for /api/instagram before showing the fallback
 * line. Above the function's own worst case (about 9 s: 4 s per attempt, one
 * retry), so the function's answer, including its cached fallback, normally
 * arrives first. This only matters if the function itself never answers.
 */
export const INSTAGRAM_CLIENT_TIMEOUT_MS = 12_000;

/* ── Types ────────────────────────────────────────────────────────────────── */

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

/**
 * One media item as NoCodeAPI (and the Instagram Graph API under it) returns
 * it. These are the fields the Azure Function passes through.
 */
export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: InstagramMediaType;
  /** The photo, the first photo of a carousel, or a video file. */
  media_url?: string;
  /** Cover image. Only set for VIDEO. */
  thumbnail_url?: string;
  permalink: string;
  /** ISO 8601. */
  timestamp?: string;
}

export interface InstagramFeedResponse {
  data: InstagramMediaItem[];
}

/** One tile in the grid: validated, with the right image picked. */
export interface InstagramPost {
  id: string;
  /** Empty string when the post has no caption. */
  caption: string;
  mediaType: InstagramMediaType;
  /** The image to show. A video's thumbnail, never its video file. */
  imageUrl: string;
  permalink: string;
  timestamp?: string;
}

/* ── Validation ───────────────────────────────────────────────────────────── */

const MEDIA_TYPES: readonly InstagramMediaType[] = [
  'IMAGE',
  'VIDEO',
  'CAROUSEL_ALBUM',
];

const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export interface NormalizeOptions {
  /**
   * Accept `data:image/` URLs, which only the Faker mock produces. Defaults
   * to the build's mock setting, so PROD builds accept https images only.
   */
  allowDataImages?: boolean;
}

/**
 * https images from the CDN. In a mock build (or when allowed explicitly),
 * also the local data: images the Faker mock generates.
 */
export function isSafeImageUrl(
  value: unknown,
  allowDataImages: boolean = isInstagramMockEnabled()
): value is string {
  if (typeof value !== 'string') return false;
  if (value.startsWith('data:image/')) return allowDataImages;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Links open Instagram and nothing else. */
export function isInstagramPermalink(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && INSTAGRAM_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * One raw item to a grid post, or null if it can't be shown safely. A video
 * uses its thumbnail (its media_url is an .mp4 an <img> can't render).
 */
export function toInstagramPost(
  item: unknown,
  { allowDataImages = isInstagramMockEnabled() }: NormalizeOptions = {}
): InstagramPost | null {
  if (!isRecord(item)) return null;

  const id = optionalString(item.id);
  const mediaType = MEDIA_TYPES.find((type) => type === item.media_type);
  if (!id || !mediaType || !isInstagramPermalink(item.permalink)) return null;

  const imageUrl = mediaType === 'VIDEO' ? item.thumbnail_url : item.media_url;
  if (!isSafeImageUrl(imageUrl, allowDataImages)) return null;

  return {
    id,
    caption: optionalString(item.caption)?.trim() ?? '',
    mediaType,
    imageUrl,
    permalink: item.permalink,
    timestamp: optionalString(item.timestamp),
  };
}

/** Clamp a requested count to 1..INSTAGRAM_MAX_LIMIT. */
export function clampInstagramLimit(limit: number): number {
  if (!Number.isFinite(limit)) return INSTAGRAM_POST_LIMIT;
  return Math.min(Math.max(Math.trunc(limit), 1), INSTAGRAM_MAX_LIMIT);
}

/**
 * A `{ data: [...] }` payload to at most `limit` posts, in feed order (newest
 * first), skipping anything invalid and any repeated id.
 */
export function normalizeInstagramFeed(
  payload: unknown,
  limit: number = INSTAGRAM_POST_LIMIT,
  options: NormalizeOptions = {}
): InstagramPost[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  const max = clampInstagramLimit(limit);
  const seen = new Set<string>();
  const posts: InstagramPost[] = [];

  for (const item of payload.data) {
    const post = toInstagramPost(item, options);
    if (!post || seen.has(post.id)) continue;
    seen.add(post.id);
    posts.push(post);
    if (posts.length === max) break;
  }
  return posts;
}

/**
 * The posts to show: the first `limit` posts of the pool, in feed order,
 * skipping any whose image failed to load. A failed post's place goes to the
 * next one in the pool, so the grid only comes up short if more posts fail
 * than there are spares.
 */
export function pickVisiblePosts(
  pool: readonly InstagramPost[],
  failedIds: ReadonlySet<string>,
  limit: number = INSTAGRAM_POST_LIMIT
): InstagramPost[] {
  const visible: InstagramPost[] = [];
  for (const post of pool) {
    if (visible.length === limit) break;
    if (!failedIds.has(post.id)) visible.push(post);
  }
  return visible;
}

/* ── Loading ──────────────────────────────────────────────────────────────── */

export interface LoadInstagramOptions {
  limit?: number;
  signal?: AbortSignal;
  /** Give up after this long. Defaults to INSTAGRAM_CLIENT_TIMEOUT_MS. */
  timeoutMs?: number;
  /** Injected by tests. Defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * Reads the feed from the Azure Function. Throws on a non-2xx response (the
 * function answers 503 until INSTAGRAM_FEED_URL is configured), and on a
 * timeout, so the grid can fall back to its "see it on Instagram" message.
 *
 * The timeout covers reading the body as well as the response headers. The
 * caller's `signal` (the grid aborts on unmount) still cancels immediately.
 */
export async function fetchInstagramPosts({
  limit = INSTAGRAM_POST_LIMIT,
  signal,
  timeoutMs = INSTAGRAM_CLIENT_TIMEOUT_MS,
  fetchImpl = fetch,
}: LoadInstagramOptions = {}): Promise<InstagramPost[]> {
  const count = clampInstagramLimit(limit);
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, timeoutMs);
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });

  try {
    const res = await fetchImpl(
      `${getApiBaseUrl()}${INSTAGRAM_FEED_PATH}?limit=${count}`,
      { signal: controller.signal, headers: { Accept: 'application/json' } }
    );
    if (!res.ok) {
      throw new Error(`Instagram feed request failed (HTTP ${res.status})`);
    }
    return normalizeInstagramFeed(await res.json(), count);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

/**
 * Mock mode: on only for DEV and TEST builds that set
 * NEXT_PUBLIC_INSTAGRAM_MOCK=true. next.config.ts decides this per build
 * (isInstagramMockBuild) and compiles it in as TW_INSTAGRAM_MOCK_BUILD.
 */
export function isInstagramMockEnabled(): boolean {
  return process.env.TW_INSTAGRAM_MOCK_BUILD === 'true';
}

/**
 * What the grid calls. In mock mode it loads the Faker factory on demand and
 * runs its output through the same normaliser the live feed uses.
 *
 * The guard reads `process.env.TW_INSTAGRAM_MOCK_BUILD` directly, rather than
 * calling isInstagramMockEnabled(), on purpose: the bundler can only see a
 * literal. In a PROD build it is `'false' === 'true'`, so this branch and
 * the `import()` inside it are removed, and the mock module and Faker are
 * never bundled.
 */
export async function loadInstagramPosts(
  options: LoadInstagramOptions = {}
): Promise<InstagramPost[]> {
  if (process.env.TW_INSTAGRAM_MOCK_BUILD === 'true') {
    const count = clampInstagramLimit(options.limit ?? INSTAGRAM_POST_LIMIT);
    const { createMockInstagramFeed } = await import('./instagram.mock');
    return normalizeInstagramFeed(createMockInstagramFeed(count), count);
  }
  return fetchInstagramPosts(options);
}
