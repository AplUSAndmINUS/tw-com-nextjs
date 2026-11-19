import React from 'react';
import styles from './TwMeter.module.scss';

export interface TwMeterProps {
  /** What is being scored, e.g. "Systems architecture". */
  label: string;
  /** Score, 0 to `max`. */
  value: number;
  max?: number;
  className?: string;
}

/**
 * One talent bar: a self-rated score drawn as a luminous line.
 *
 * Replaces the meter markup that /about and /about-me each defined for
 * themselves. Numbers here describe skills, never people (CREATIVE_BRIEF.md
 * §7.3 rule 8), and the group caption says they're self-rated.
 *
 * Accessible as role="meter" with a spoken label ("Systems architecture: 95
 * out of 100"), so the number isn't conveyed by the bar's length alone.
 * Server component; no motion.
 */
export function TwMeter({ label, value, max = 100, className }: TwMeterProps) {
  const clamped = Math.min(max, Math.max(0, value));
  return (
    <div className={[styles.meter, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <span className={styles.name}>{label}</span>
        <span className={styles.value} aria-hidden='true'>
          {clamped}
          <span className={styles.max}> / {max}</span>
        </span>
      </div>
      <div
        className={styles.track}
        role='meter'
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${clamped} out of ${max}`}
      >
        <span
          className={styles.fill}
          style={{ '--tw-meter-pct': clamped / max } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export interface TwMeterGroupProps {
  /** Caption under the list, e.g. the "self-rated" note. */
  caption?: React.ReactNode;
  /** Two columns from mobile-lg up. */
  columns?: 1 | 2;
  children: React.ReactNode;
  className?: string;
}

/** A list of TwMeter with an optional caption. */
export function TwMeterGroup({
  caption,
  columns = 2,
  children,
  className,
}: TwMeterGroupProps) {
  return (
    <figure className={[styles.group, className].filter(Boolean).join(' ')}>
      <ul className={columns === 2 ? styles.listTwo : styles.list}>
        {React.Children.map(children, (child) =>
          child ? <li>{child}</li> : null
        )}
      </ul>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default TwMeter;
