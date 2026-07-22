import styles from './TwCallout.module.scss';

/**
 * An aside pulled out of the flow of body copy: a note, a caveat, a warning.
 *
 * The variant sets colour only. It deliberately does not set `role="alert"` or
 * any live-region semantics — a callout is static prose that happens to be
 * tinted, and announcing it as an alert would interrupt the reader for
 * something that was already there when the page loaded. Pass `role` yourself
 * if the content really is a runtime notification.
 */

export type TwCalloutVariant =
  | 'accent'
  | 'subtle'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error';

const VARIANT_CLASS: Record<TwCalloutVariant, string> = {
  accent: styles.accent,
  subtle: styles.subtle,
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
};

export interface TwCalloutProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant?: TwCalloutVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export function TwCallout({
  variant = 'accent',
  title,
  children,
  className,
  ...rest
}: TwCalloutProps) {
  const classes = [styles.callout, VARIANT_CLASS[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={classes} {...rest}>
      {title ? <p className={styles.title}>{title}</p> : null}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export default TwCallout;
