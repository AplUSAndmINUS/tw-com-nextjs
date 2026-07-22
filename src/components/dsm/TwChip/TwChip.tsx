import styles from './TwChip.module.scss';

/**
 * A pill-shaped label: category tags, "Featured" badges, metadata flags.
 *
 * Presentational only — it renders a <span> and never takes a click handler.
 * A chip you can press is a filter toggle, which is TwFilterChips.
 */

export type TwChipVariant = 'default' | 'featured' | 'teal';
export type TwChipSize = 'sm' | 'md';

const VARIANT_CLASS: Record<TwChipVariant, string> = {
  default: styles.default,
  featured: styles.featured,
  teal: styles.teal,
};

const SIZE_CLASS: Record<TwChipSize, string> = {
  sm: styles.sm,
  md: styles.md,
};

export interface TwChipProps {
  variant?: TwChipVariant;
  size?: TwChipSize;
  children?: React.ReactNode;
  /** Optional leading glyph — an icon or a dot. Rendered aria-hidden. */
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TwChip({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  style,
}: TwChipProps) {
  const classes = [
    styles.chip,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} style={style}>
      {icon ? (
        <span className={styles.icon} aria-hidden='true'>
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export default TwChip;
