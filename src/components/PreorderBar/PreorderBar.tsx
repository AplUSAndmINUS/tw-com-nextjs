'use client';

import React from 'react';
import { RCF_EXPECTED_RELEASE, RCF_PREORDER_HREF } from '@/lib/rcf';
import styles from './PreorderBar.module.scss';

export interface PreorderBarProps {
  /**
   * Set on routes built on the legacy layout (fixed Header, content padded by
   * --site-header-height). The bar then sits directly under that header
   * instead of being hidden behind it.
   */
  belowFixedHeader?: boolean;
}

/**
 * Height of the fixed legacy Header. It is taller than --site-header-height
 * on desktop and settles after hydration, so it is observed rather than read
 * from the variable. Until it is known the CSS falls back to the variable.
 */
function useFixedHeaderHeight(enabled: boolean): number | null {
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const header = document.querySelector('nav[role="banner"]');
    if (!header) return;
    const measure = () =>
      setHeight(Math.round(header.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? height : null;
}

/**
 * The slim book pre-order bar at the top of every page. It sits in normal
 * flow above the sticky DSM nav, so it scrolls away and the nav takes the top.
 * Transparent, with Mythic Gold trim: the label, the link and the bottom rule.
 */
export function PreorderBar({ belowFixedHeader = false }: PreorderBarProps) {
  const headerHeight = useFixedHeaderHeight(belowFixedHeader);

  return (
    <aside
      aria-label='Book pre-order'
      className={[styles.bar, belowFixedHeader && styles.belowFixedHeader]
        .filter(Boolean)
        .join(' ')}
      style={headerHeight !== null ? { marginTop: headerHeight } : undefined}
    >
      <p className={styles.inner}>
        <strong className={styles.label}>
          Pre-order for the RCF book now open
        </strong>
        <span className={styles.dot} aria-hidden='true'>
          •
        </span>
        <span>Expected release: {RCF_EXPECTED_RELEASE}</span>
        <a href={RCF_PREORDER_HREF} className={styles.link}>
          Go to Store <span aria-hidden='true'>→</span>
        </a>
      </p>
    </aside>
  );
}

export default PreorderBar;
