import styles from './Spinner.module.scss';

/** Mirrors Fluent's size scale so existing `spinnerSize` props keep working. */
export type SpinnerSize =
  | 'tiny'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'huge';

const SIZE_CLASS: Record<SpinnerSize, string> = {
  tiny: styles.tiny,
  'extra-small': styles.extraSmall,
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
  'extra-large': styles.extraLarge,
  huge: styles.huge,
};

export interface SpinnerProps {
  size?: SpinnerSize;
  /**
   * Accessible label. Omit when an ancestor already carries role="status" and a
   * label, which is the case inside LoadingImage — announcing twice is worse
   * than not announcing here.
   */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Indeterminate loading spinner.
 *
 * Replaces Fluent's `<Spinner>`, the only Fluent component mounted anywhere in
 * the app. Removing it is what let @fluentui/react-components leave
 * package.json entirely.
 */
export function Spinner({
  size = 'small',
  label,
  className,
  style,
}: SpinnerProps) {
  const classes = [styles.spinner, SIZE_CLASS[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      style={style}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

export default Spinner;
