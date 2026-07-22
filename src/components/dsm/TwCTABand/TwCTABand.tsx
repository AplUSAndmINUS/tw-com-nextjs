import styles from './TwCTABand.module.scss';

/**
 * The full-width call-to-action band that closes a page.
 *
 * `.tw-grain` is a global class from tokens/effects.css rather than a module
 * class — the noise wash is a shared surface treatment used by the hero and
 * feature cards too, and duplicating its data-URI per module would ship the
 * same SVG several times over.
 *
 * Children are the actions. The band takes no `href`/`onClick` of its own: a
 * band-sized click target with buttons inside it is a nesting problem, and the
 * buttons are the affordance anyway.
 */

export interface TwCTABandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  kicker?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Action buttons. */
  children?: React.ReactNode;
  as?: 'section' | 'aside' | 'div';
}

export function TwCTABand({
  kicker,
  title,
  body,
  children,
  as: Component = 'section',
  className,
  ...rest
}: TwCTABandProps) {
  const classes = [styles.band, 'tw-grain', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      <div className={styles.inner}>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {body ? <p className={styles.body}>{body}</p> : null}
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </Component>
  );
}

export default TwCTABand;
