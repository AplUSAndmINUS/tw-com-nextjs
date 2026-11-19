import React from 'react';
import styles from './TwCredo.module.scss';

export interface TwCredoProps {
  /** The credo itself: "Humans FIRST. AI and Systems SECOND." */
  statement: React.ReactNode;
  /** Supporting line(s) and an optional link, under the credo. */
  children?: React.ReactNode;
  /** Section element by default; use 'div' when nested in another section. */
  as?: 'section' | 'div';
  /**
   * Light lines that drift across the band behind the credo (Home, #285).
   * Decorative: still under reduced motion, gone under reduced
   * transparency and high contrast, like the grid.
   */
  animated?: boolean;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * Credo band: a full-bleed statement moment (DESIGN_BRIEF.md §8.3), reusable
 * on Home, /about and later the footer and /humans-first.
 *
 * Warm Futurism: a dark canvas with a faint light-grid and glowing rules top
 * and bottom; the text itself sits on solid colour so contrast never depends
 * on the glow. High contrast and reduced transparency drop the grid.
 */
/** Five horizontal light traces and two vertical ones, each on its own timing. */
const LINES = ['h1', 'h2', 'h3', 'h4', 'h5', 'v1', 'v2'] as const;

export function TwCredo({
  statement,
  children,
  as: Component = 'section',
  animated = false,
  id,
  className,
  ...rest
}: TwCredoProps) {
  return (
    <Component
      id={id}
      className={[styles.credo, className].filter(Boolean).join(' ')}
      aria-label={rest['aria-label']}
    >
      {animated ? (
        <div className={styles.lines} aria-hidden='true'>
          {LINES.map((line) => (
            <span key={line} className={styles[line]} />
          ))}
        </div>
      ) : null}
      <div className={styles.inner}>
        <p className={styles.statement}>{statement}</p>
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
    </Component>
  );
}

export default TwCredo;
