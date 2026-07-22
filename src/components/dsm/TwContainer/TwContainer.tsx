import styles from './TwContainer.module.scss';

/**
 * The centred content column.
 *
 * Three widths: `default` is the 1220px page column, `article` the 760px
 * measure for long-form prose, `full` keeps the gutters but drops the cap for
 * bands and full-bleed sections.
 *
 * It also establishes a CSS container, which is what the type scale sizes
 * against — the tokens use cqi rather than vw so text responds to the column it
 * is in, not the window.
 */

export type TwContainerWidth = 'default' | 'article' | 'full';

const WIDTH_CLASS: Record<TwContainerWidth, string> = {
  default: styles.default,
  article: styles.article,
  full: styles.full,
};

export interface TwContainerProps extends React.HTMLAttributes<HTMLElement> {
  width?: TwContainerWidth;
  as?: React.ElementType;
  /** Adds the standard vertical section rhythm. */
  section?: boolean;
  children?: React.ReactNode;
}

export function TwContainer({
  width = 'default',
  as,
  section = false,
  children,
  className,
  ...rest
}: TwContainerProps) {
  const Component: React.ElementType = as ?? 'div';

  const classes = [
    styles.container,
    WIDTH_CLASS[width],
    section ? styles.section : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

export default TwContainer;
