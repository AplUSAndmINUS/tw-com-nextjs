'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  INSTAGRAM_FETCH_LIMIT,
  INSTAGRAM_POST_LIMIT,
  loadInstagramPosts,
  pickVisiblePosts,
  type InstagramPost,
} from '@/lib/instagram';
import {
  InstagramGridView,
  type InstagramGridState,
} from './InstagramGridView';
import {
  INSTAGRAM_FEATURE_LIMIT,
  InstagramFeatureView,
} from './InstagramFeatureView';

export interface InstagramGridProps {
  /** Posts to show. 12 makes the 4 x 3 (desktop) / 3 x 4 (mobile) grid. */
  limit?: number;
  /**
   * 'grid' (default): the portrait 3:4 grid. 'feature': one lead tile and
   * four squares, the /about-me "Off the page" layout (#288); `limit` is 5.
   */
  layout?: 'grid' | 'feature';
  className?: string;
}

/**
 * What has been loaded, and for which `limit`. A result for a different
 * `limit` reads as loading, so nothing needs resetting when the prop changes.
 * Image failures live here too, so they belong to the pool they came from.
 */
type PoolState =
  | { status: 'loading' }
  | {
      status: 'ready';
      forLimit: number;
      pool: InstagramPost[];
      failedIds: ReadonlySet<string>;
    }
  | { status: 'error'; forLimit: number };

/**
 * The latest Instagram posts as a portrait-tile grid, like the one on a
 * Linktree. A React port of the open-source `embed-instagram-feed` web
 * component (instagram/embed-instagram-feed, MIT, NoCodeAPI).
 *
 * Fetched at runtime, like the videos page, rather than at build time: the
 * image URLs Instagram returns are signed and expire, so a feed baked into the
 * static export would break between deploys. The server render is the loading
 * state, which reserves the grid's height.
 *
 * Backfill: it fetches a pool of INSTAGRAM_FETCH_LIMIT (16) posts and shows
 * the first `limit` (12) that work. Posts the normaliser rejects never enter
 * the pool. If an image then fails to load in the browser, that post is
 * dropped and the next one in the pool takes its place, in feed order. Up to
 * 4 broken posts are covered before the grid comes up short.
 *
 * Data comes from `loadInstagramPosts()` (src/lib/instagram.ts): the
 * `/api/instagram` Azure Function, or the Faker mock feed in a DEV/TEST mock
 * build.
 */
export function InstagramGrid({
  limit: limitProp,
  layout = 'grid',
  className,
}: InstagramGridProps) {
  const limit =
    layout === 'feature'
      ? INSTAGRAM_FEATURE_LIMIT
      : (limitProp ?? INSTAGRAM_POST_LIMIT);
  const [state, setState] = useState<PoolState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    loadInstagramPosts({
      limit: Math.max(limit, INSTAGRAM_FETCH_LIMIT),
      signal: controller.signal,
    })
      .then((pool) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'ready',
          forLimit: limit,
          pool,
          failedIds: new Set(),
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', forLimit: limit });
        }
      });

    return () => controller.abort();
  }, [limit]);

  const handleImageError = useCallback((postId: string) => {
    setState((previous) =>
      previous.status !== 'ready' || previous.failedIds.has(postId)
        ? previous
        : {
            ...previous,
            failedIds: new Set(previous.failedIds).add(postId),
          }
    );
  }, []);

  const viewState: InstagramGridState =
    state.status === 'loading' || state.forLimit !== limit
      ? { status: 'loading' }
      : state.status === 'error'
        ? { status: 'error' }
        : {
            status: 'ready',
            posts: pickVisiblePosts(state.pool, state.failedIds, limit),
          };

  if (layout === 'feature') {
    return (
      <InstagramFeatureView
        state={viewState}
        onImageError={handleImageError}
        className={className}
      />
    );
  }

  return (
    <InstagramGridView
      state={viewState}
      limit={limit}
      onImageError={handleImageError}
      className={className}
    />
  );
}

export default InstagramGrid;
