import styles from './TwButton.module.scss';

/**
 * The system's only button.
 *
 * Renders an <a> when `href` is present and a <button> otherwise, because a
 * thing that navigates must be a link — middle-click, copy-link and the status
 * bar all depend on it, and no amount of ARIA recovers them.
 *
 * Hover / active / disabled are plain CSS selectors. The design-system
 * prototype tracked those in React state, which meant a re-render per pointer
 * event and no styling at all before hydration; the browser already knows how
 * to do this.
 */

export type TwButtonVariant = 'primary' | 'outline' | 'quiet';
export type TwButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<TwButtonVariant, string> = {
  primary: styles.primary,
  outline: styles.outline,
  quiet: styles.quiet,
};

const SIZE_CLASS: Record<TwButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

interface TwButtonBaseProps {
  variant?: TwButtonVariant;
  size?: TwButtonSize;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stretches to the full width of the container — useful in cards and forms. */
  fullWidth?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export interface TwButtonProps extends TwButtonBaseProps {
  href?: string;
  /** Only meaningful alongside `href`. */
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: 'button' | 'submit' | 'reset';
}

export function TwButton({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  children,
  className,
  style,
  ...rest
}: TwButtonProps) {
  const classes = [
    styles.button,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? styles.fullWidth : undefined,
    disabled ? styles.isDisabled : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href !== undefined) {
    // A disabled link is not a thing in HTML. Drop the href so it leaves the
    // tab order entirely, and mark it disabled for assistive tech.
    return (
      <a
        className={classes}
        style={style}
        href={disabled ? undefined : href}
        target={target}
        rel={
          rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
        }
        aria-disabled={disabled || undefined}
        onClick={
          disabled
            ? (event) => event.preventDefault()
            : (onClick as React.MouseEventHandler<HTMLAnchorElement>)
        }
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      style={style}
      type={type}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </button>
  );
}

export default TwButton;
