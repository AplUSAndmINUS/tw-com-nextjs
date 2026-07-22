import { TwChip } from '../TwChip';
import styles from './TwArticleCard.module.scss';

/**
 * The workhorse content card — blog posts, case studies, episodes.
 *
 * When `href` is given the whole card is clickable, but the anchor wraps only
 * the title and is stretched over the card with a `::after` overlay. Wrapping
 * the entire card in an <a> instead would swallow the category chip and the
 * date into the link text, so a screen reader would announce the whole card as
 * one run-on link name.
 *
 * The date is Roboto Mono because metadata reads as data in this system, and a
 * fixed-width column of dates lines up.
 */

export interface TwArticleCardProps {
  title: React.ReactNode;
  excerpt?: React.ReactNode;
  category?: string;
  /** Display date. Already formatted — this component does no date maths. */
  date?: string;
  /** Machine-readable date for <time datetime>, e.g. '2026-07-21'. */
  dateTime?: string;
  href?: string;
  /** When true, the card link opens in a new tab (used for external targets). */
  external?: boolean;
  image?: string;
  imageAlt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TwArticleCard({
  title,
  excerpt,
  category,
  date,
  dateTime,
  href,
  external,
  image,
  imageAlt,
  className,
  style,
}: TwArticleCardProps) {
  const classes = [
    styles.card,
    href ? styles.interactive : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes} style={style}>
      {image ? (
        <figure className={styles.media}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image
              adds no value under `output: 'export'` with images.unoptimized,
              and would force this server component to take a fixed size. */}
          <img
            className={`${styles.image} tw-media`}
            src={image}
            alt={imageAlt ?? ''}
            loading='lazy'
            decoding='async'
          />
        </figure>
      ) : null}

      <div className={styles.content}>
        {category || date ? (
          <div className={styles.meta}>
            {category ? <TwChip size='sm'>{category}</TwChip> : null}
            {date ? (
              <time className={styles.date} dateTime={dateTime}>
                {date}
              </time>
            ) : null}
          </div>
        ) : null}

        <h3 className={styles.title}>
          {href ? (
            <a
              className={styles.link}
              href={href}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
      </div>
    </article>
  );
}

export default TwArticleCard;
