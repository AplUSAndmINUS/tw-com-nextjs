'use client';

import styles from './TwFilterChips.module.scss';

/**
 * A horizontal row of filter toggles.
 *
 * These are <button>s in a role="group" with aria-pressed, not a radiogroup or
 * a tablist. Both of those imply roving tabindex — arrow keys move selection,
 * Tab skips the group — which is wrong here: the row is a set of independent
 * toggles whose current state happens to be exclusive, and every option should
 * be reachable with Tab.
 *
 * `value === null` means "no filter", rendered as the leading All chip. The
 * All chip passes null rather than a sentinel string so the caller never has to
 * special-case a magic value.
 */

export interface TwFilterOption {
  label: string;
  value: string;
}

export interface TwFilterChipsProps {
  options: TwFilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel?: string;
  /** Hide the leading "All" chip when the caller wants a mandatory selection. */
  showAll?: boolean;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TwFilterChips({
  options,
  value,
  onChange,
  allLabel = 'All',
  showAll = true,
  label = 'Filter',
  className,
  style,
}: TwFilterChipsProps) {
  const classes = [styles.group, className].filter(Boolean).join(' ');

  const chipClass = (active: boolean) =>
    [styles.chip, active ? styles.active : undefined].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} role='group' aria-label={label}>
      {showAll ? (
        <button
          type='button'
          className={chipClass(value === null)}
          aria-pressed={value === null}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>
      ) : null}

      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          className={chipClass(value === option.value)}
          aria-pressed={value === option.value}
          // Re-pressing the active chip clears it, which matches what the All
          // chip does and is what people try first.
          onClick={() =>
            onChange(value === option.value ? null : option.value)
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TwFilterChips;
