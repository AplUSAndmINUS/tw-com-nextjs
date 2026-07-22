import React from 'react';
import styles from './TwGrid.module.scss';

export interface TwGridProps {
  /** Columns at desktop width (>=1024px container). Default 3. */
  cols?: number;
  /** Columns at tablet width (>=768px container). Default 2. */
  tabletCols?: number;
  /**
   * Minimum track width. When set, the grid auto-fills tracks of at least this
   * size and `cols`/`tabletCols` are ignored — useful when the item count is
   * unknown and even columns matter more than a fixed count.
   */
  min?: string;
  /** Grid gap. Defaults to --tw-grid-gap. */
  gap?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The base grid for every card layout.
 *
 * Mobile is always one column; tablet and desktop counts are configurable. The
 * breakpoints are container queries rather than media queries, so a grid placed
 * in a narrow column lays out for that column rather than for the window.
 *
 * The design system prototype generated a unique class per instance with
 * `useId()` and injected a `<style>` tag. That works in a prototype but ships a
 * stylesheet per grid on the page and cannot be statically extracted, so this
 * version drives everything through custom properties on one static class.
 */
export function TwGrid({
  cols = 3,
  tabletCols = 2,
  min,
  gap,
  children,
  className,
  style,
}: TwGridProps) {
  const gridStyle = {
    '--tw-grid-cols': cols,
    '--tw-grid-cols-tablet': tabletCols,
    ...(min ? { '--tw-grid-min': min } : {}),
    ...(gap ? { gap } : {}),
    ...style,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <div
        className={[styles.grid, min ? styles.auto : '', className]
          .filter(Boolean)
          .join(' ')}
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  );
}

export default TwGrid;
