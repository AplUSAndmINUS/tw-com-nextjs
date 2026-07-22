import styles from './TwRailLayout.module.scss';

/**
 * Two-column layout: main content plus a sidebar rail.
 *
 * The rail comes *after* the main content in the DOM and is moved back into
 * the first column with grid placement on wide viewports. That way the reading
 * order — and the stacking order once it collapses to one column below 768px —
 * puts the content first, which is what someone on a phone or a screen reader
 * wants; the visual left-hand position is presentation only.
 *
 * Sticky offset accounts for the fixed nav, so the rail parks below it rather
 * than under it.
 */

export interface TwRailLayoutProps extends React.HTMLAttributes<HTMLElement> {
  rail: React.ReactNode;
  children?: React.ReactNode;
  /** CSS length for the rail column. Defaults to the --tw-rail-width token. */
  railWidth?: string;
  sticky?: boolean;
  /** Places the rail on the right instead of the left. */
  railSide?: 'start' | 'end';
  as?: React.ElementType;
}

export function TwRailLayout({
  rail,
  children,
  railWidth,
  sticky = true,
  railSide = 'start',
  as,
  className,
  style,
  ...rest
}: TwRailLayoutProps) {
  const Component: React.ElementType = as ?? 'div';

  const classes = [
    styles.layout,
    railSide === 'end' ? styles.railEnd : styles.railStart,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Fed through a custom property so the override lands on the grid template
  // without a second inline style on the rail element itself.
  const layoutStyle = railWidth
    ? ({ ...style, '--tw-rail-width-local': railWidth } as React.CSSProperties)
    : style;

  return (
    <Component className={classes} style={layoutStyle} {...rest}>
      <div className={styles.main}>{children}</div>
      <aside className={sticky ? `${styles.rail} ${styles.sticky}` : styles.rail}>
        {rail}
      </aside>
    </Component>
  );
}

export default TwRailLayout;
