import Link from 'next/link';
import { TwChip } from '../TwChip';
import { CardImage } from './CardImage';
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
        <CardImage src={image} alt={imageAlt ?? ''} />
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
            external ? (
              <a
                className={styles.link}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
              >
                {title}
              </a>
            ) : (
              <Link className={styles.link} href={href}>
                {title}
              </Link>
            )
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
