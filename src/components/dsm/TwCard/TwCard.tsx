import styles from './TwCard.module.scss';

/**
 * The base surface every other card in the system is built on: 1px hairline,
 * no shadow at rest. Separation comes from the border, not from elevation —
 * the shadow is reserved for the lift on hover so that it means something.
 *
 * `as` exists because a card is a surface, not a semantic: a listing item wants
 * <article>, a form section wants <section>, a plain container wants <div>.
 */

export interface TwCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Element or component to render. Defaults to 'div'. */
  as?: React.ElementType;
  /** Applies the lift-and-brighten hover treatment and makes the card focusable. */
  interactive?: boolean;
  /** Standard card padding. Turn off when the card's own children own the edges. */
  padded?: boolean;
  /** Uses the smaller 14px radius — for dense lists and compact cards. */
  compact?: boolean;
  children?: React.ReactNode;
}

export function TwCard({
  as,
  interactive = false,
  padded = true,
  compact = false,
  children,
  className,
  ...rest
}: TwCardProps) {
  const Component: React.ElementType = as ?? 'div';

  const classes = [
    styles.card,
    padded ? styles.padded : undefined,
    compact ? styles.compact : undefined,
    interactive ? styles.interactive : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Only reach for tabIndex when the caller has not rendered something already
  // focusable (an <a> or <button> via `as`), which would otherwise get a
  // redundant tab stop.
  const needsTabStop =
    interactive && Component !== 'a' && Component !== 'button';

  return (
    <Component
      className={classes}
      tabIndex={needsTabStop ? 0 : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default TwCard;
