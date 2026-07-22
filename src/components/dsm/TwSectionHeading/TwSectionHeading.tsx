import styles from './TwSectionHeading.module.scss';

/**
 * The standard header block above a page section: kicker, title, optional
 * subhead and lede.
 *
 * `as` is separate from the visual size on purpose. Heading level is a document
 * -structure decision (a section heading is usually h2, but the first one on a
 * page may be the h1) and it should never be traded away to get the right type
 * size.
 */

export interface TwSectionHeadingProps {
  /** Uppercase tracked label above the title. */
  kicker?: string;
  title: React.ReactNode;
  /** A second line under the title, still in the heading voice. */
  subhead?: React.ReactNode;
  /** Body-copy introduction. Sentence case — never all-caps. */
  lede?: React.ReactNode;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
}

export function TwSectionHeading({
  kicker,
  title,
  subhead,
  lede,
  align = 'start',
  as: Heading = 'h2',
  className,
  style,
}: TwSectionHeadingProps) {
  const classes = [
    styles.heading,
    align === 'center' ? styles.center : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <Heading className={styles.title}>{title}</Heading>
      {subhead ? <p className={styles.subhead}>{subhead}</p> : null}
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </div>
  );
}

export default TwSectionHeading;
