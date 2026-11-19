import { PlayIcon } from '@/components/icons';
import { INSTAGRAM_HANDLE } from '@/lib/instagram';
import {
  describeInstagramPost,
  type InstagramGridState,
} from './InstagramGridView';
import styles from './InstagramGrid.module.scss';

/** One lead tile and four squares: the /about-me "Off the page" set (#288). */
export const INSTAGRAM_FEATURE_LIMIT = 5;

export interface InstagramFeatureViewProps {
  state: InstagramGridState;
  /** Called with a post's id when its image fails, so the next one fills in. */
  onImageError?: (postId: string) => void;
  className?: string;
}

/**
 * The newest posts in the user-copy photo layout (owner, #288): the newest
 * post large (full width on phones, a 2 x 2 tile from tablet up), the next
 * four as squares. Every image fills its tile; Reels are pinned to the top so
 * the subject and any title stay in view.
 *
 * Stateless and server-renderable; InstagramGrid (layout 'feature') owns the
 * loading and the backfill. The loading state keeps the same shape, so
 * nothing below moves when the posts arrive.
 */
export function InstagramFeatureView({
  state,
  onImageError,
  className,
}: InstagramFeatureViewProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');
  const tileClass = (i: number) =>
    i === 0 ? styles.featureLead : styles.featureTile;

  if (state.status === 'loading') {
    return (
      <div className={rootClass} aria-busy='true'>
        <span className={styles.srOnly} role='status'>
          Loading Instagram posts
        </span>
        <ul className={styles.feature} aria-hidden='true'>
          {Array.from({ length: INSTAGRAM_FEATURE_LIMIT }, (_, i) => (
            <li key={i} className={`${tileClass(i)} ${styles.skeleton}`} />
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
        className={styles.feature}
        aria-label={`Latest Instagram posts from @${INSTAGRAM_HANDLE}`}
      >
        {state.posts.slice(0, INSTAGRAM_FEATURE_LIMIT).map((post, i) => (
          <li key={post.id} className={tileClass(i)}>
            <a
              href={post.permalink}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.featureLink}
              aria-label={describeInstagramPost(post)}
              data-media-type={post.mediaType}
            >
              {/* eslint-disable-next-line @next/next/no-img-element --
                  static export with images.unoptimized, and the URLs are
                  Instagram's CDN (or data: URIs in mock mode); see TwHero. */}
              <img
                className={`${styles.featureImage} tw-media`}
                src={post.imageUrl}
                alt=''
                width={640}
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

export default InstagramFeatureView;
