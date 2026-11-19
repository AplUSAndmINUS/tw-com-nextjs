import { PlayIcon } from '@/components/icons';
import { formatDotDate } from '@/app/home/contentFormat';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_POST_LIMIT,
  type InstagramMediaType,
  type InstagramPost,
} from '@/lib/instagram';
import styles from './InstagramGrid.module.scss';

export type InstagramGridState =
  | { status: 'loading' }
  | { status: 'ready'; posts: InstagramPost[] }
  | { status: 'error' };

export interface InstagramGridViewProps {
  state: InstagramGridState;
  /** How many placeholder tiles to show while loading. */
  limit?: number;
  /**
   * Called with a post's id when its image fails to load, so the owner of the
   * state can swap in the next post (InstagramGrid does this).
   */
  onImageError?: (postId: string) => void;
  className?: string;
}

const MEDIA_LABELS: Record<InstagramMediaType, string> = {
  IMAGE: 'Photo',
  VIDEO: 'Video',
  CAROUSEL_ALBUM: 'Carousel',
};

/** Long captions are cut at a word boundary for the link's accessible name. */
const CAPTION_LABEL_MAX = 100;

function truncateCaption(caption: string, max = CAPTION_LABEL_MAX): string {
  const flat = caption.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * The tile link's accessible name: the media type, then the caption (or the
 * date when there is no caption), then where it goes.
 * "Video: Morning light over the Wasatch… (opens Instagram in a new tab)"
 */
export function describeInstagramPost(post: InstagramPost): string {
  const kind = MEDIA_LABELS[post.mediaType];
  const date = formatDotDate(post.timestamp);
  const what = post.caption
    ? `${kind}: ${truncateCaption(post.caption)}`
    : date
      ? `${kind} posted ${date}`
      : `${kind} on Instagram`;
  return `${what} (opens Instagram in a new tab)`;
}

/**
 * The Instagram grid's markup for each state. Stateless and server-renderable.
 * `InstagramGrid` owns the loading.
 *
 * - loading: `limit` pulsing portrait (3:4) placeholders. They hold the
 *   grid's full height, so nothing below shifts when the posts arrive.
 * - ready: one portrait (3:4) tile per post, linking to it on Instagram (new
 *   tab).
 *   Videos carry a play badge, as in the original component.
 * - error, or no posts: one line pointing to Instagram. The page's "Follow"
 *   link sits right under the grid.
 */
export function InstagramGridView({
  state,
  limit = INSTAGRAM_POST_LIMIT,
  onImageError,
  className,
}: InstagramGridViewProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  if (state.status === 'loading') {
    return (
      <div className={rootClass} aria-busy='true'>
        <span className={styles.srOnly} role='status'>
          Loading Instagram posts
        </span>
        <ul className={styles.grid} aria-hidden='true'>
          {Array.from({ length: limit }, (_, i) => (
            <li key={i} className={`${styles.tile} ${styles.skeleton}`} />
          ))}
        </ul>
      </div>
    );
  }

  if (state.status === 'error' || state.posts.length === 0) {
    return (
      <div className={rootClass}>
        <p className={styles.status} role='status'>
          The feed can’t be shown right now. The latest posts are on Instagram.
        </p>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <ul
        className={styles.grid}
        aria-label={`Latest Instagram posts from @${INSTAGRAM_HANDLE}`}
      >
        {state.posts.map((post) => (
          <li key={post.id}>
            <a
              href={post.permalink}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.tile}
              aria-label={describeInstagramPost(post)}
              data-media-type={post.mediaType}
            >
              {/* eslint-disable-next-line @next/next/no-img-element --
                  static export with images.unoptimized, and the URLs are
                  Instagram's CDN (or data: URIs in mock mode); see TwHero. */}
              <img
                className={`${styles.image} tw-media`}
                src={post.imageUrl}
                alt=''
                width={480}
                height={640}
                loading='lazy'
                decoding='async'
                onError={onImageError ? () => onImageError(post.id) : undefined}
              />
              {post.mediaType === 'VIDEO' ? (
                <span className={styles.badge}>
                  <PlayIcon size={14} filled />
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstagramGridView;
