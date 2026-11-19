import styles from './TwRipple.module.scss';

export interface TwRippleProps {
  /** Number of rings around the centre point. */
  rings?: number;
  className?: string;
}

/**
 * The ripple (CREATIVE_BRIEF.md §5.3): one aligned decision sends rings
 * outward into the systems around it. Decorative only (aria-hidden), drawn in
 * the accent line colour, so it follows every theme mode. The outer rings
 * breathe very slowly; still under reduced motion.
 */
export function TwRipple({ rings = 5, className }: TwRippleProps) {
  const radii = Array.from({ length: rings }, (_, i) => 14 + i * (86 / rings));
  return (
    <svg
      className={[styles.ripple, className].filter(Boolean).join(' ')}
      viewBox='0 0 200 200'
      aria-hidden='true'
      focusable='false'
    >
      {radii.map((r, i) => (
        <circle
          key={r}
          cx='100'
          cy='100'
          r={r}
          className={styles.ring}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      <circle cx='100' cy='100' r='5' className={styles.core} />
    </svg>
  );
}

export default TwRipple;
