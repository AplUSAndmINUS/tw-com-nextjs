import styles from './TwStatCard.module.scss';

/**
 * A single figure with its caption — the unit a stats row is built from.
 *
 * The value is typed as a string rather than a number because these are
 * display figures ("12k", "3.5x", "< 1s"); formatting is the caller's job, and
 * a number prop would only invite it to be done here inconsistently.
 *
 * Markup is <dl>/<dt>/<dd> so the value and its label are programmatically
 * associated. The visual order is value-then-label, which is the reverse of the
 * DOM order a description list wants, so the label is ordered back with flex.
 */

export interface TwStatCardProps {
  value: string;
  label: string;
  /** Optional trailing note — a period, a source, a delta. */
  note?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TwStatCard({
  value,
  label,
  note,
  className,
  style,
}: TwStatCardProps) {
  const classes = [styles.stat, className].filter(Boolean).join(' ');

  return (
    <dl className={classes} style={style}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
      {note ? <dd className={styles.note}>{note}</dd> : null}
    </dl>
  );
}

export default TwStatCard;
