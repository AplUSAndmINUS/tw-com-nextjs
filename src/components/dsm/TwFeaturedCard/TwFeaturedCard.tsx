import Link from 'next/link';
import { TwChip } from '../TwChip';
import styles from './TwFeaturedCard.module.scss';

/**
 * The lead card at the top of a listing: same data as TwArticleCard, given
 * more room, the feature gradient and the larger 20px radius.
 *
 * It is a separate component rather than a `size` prop on TwArticleCard
 * because the layout genuinely differs — above a certain width the media moves
 * beside the copy instead of above it, and folding that into the article card
 * would put two layouts behind one boolean.
 *
 * `featured` controls the gold badge only. A card can be the visual lead
 * without being editorially featured, and often is.
 */

export interface TwFeaturedCardProps {
  title: React.ReactNode;
  excerpt?: React.ReactNode;
  category?: string;
  /** Display date. Already formatted. */
  date?: string;
  /** Machine-readable date for <time datetime>. */
  dateTime?: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  /** Shows the gold "Featured" badge. */
  featured?: boolean;
  /** Overrides the badge text. */
  featuredLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TwFeaturedCard({
  title,
  excerpt,
  category,
  date,
  dateTime,
  href,
  image,
  imageAlt,
  featured = false,
  featuredLabel = 'Featured',
  className,
  style,
}: TwFeaturedCardProps) {
  const classes = [
    styles.card,
    href ? styles.interactive : undefined,
    image ? styles.hasMedia : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes} style={style}>
      {image ? (
        <figure className={styles.media}>
          {/* eslint-disable-next-line @next/next/no-img-element -- see
              TwArticleCard: static export, images.unoptimized. */}
          <img
            className={`${styles.image} tw-media`}
            src={image}
            alt={imageAlt ?? ''}
            decoding='async'
          />
        </figure>
      ) : null}

      <div className={styles.content}>
        <div className={styles.meta}>
          {featured ? (
            <TwChip variant='featured' size='sm'>
              {featuredLabel}
            </TwChip>
          ) : null}
          {category ? (
            <TwChip variant='teal' size='sm'>
              {category}
            </TwChip>
          ) : null}
          {date ? (
            <time className={styles.date} dateTime={dateTime}>
              {date}
            </time>
          ) : null}
        </div>

        <h2 className={styles.title}>
          {href ? (
            <Link className={styles.link} href={href}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>

        {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
      </div>
    </article>
  );
}

export default TwFeaturedCard;
