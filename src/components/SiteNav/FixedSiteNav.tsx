'use client';

import { useEffect, useRef } from 'react';
import { SiteNav } from './SiteNav';
import styles from './FixedSiteNav.module.scss';

/**
 * SiteNav for routes still on the legacy layout (/podcasts, /unsubscribe).
 *
 * Those pages expect a fixed header and pad their content by
 * --site-header-height. This renders the one site nav in that fixed slot
 * (redesign Slice 6: one nav on every route) and keeps the variable equal to
 * the nav's real height, which changes with the text size, so nothing is
 * hidden under it and the pages themselves stay untouched.
 */
export function FixedSiteNav() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const measure = () =>
      root.style.setProperty(
        '--site-header-height',
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--site-header-height');
    };
  }, []);

  return (
    <div ref={ref} className={styles.fixed} data-fixed-nav=''>
      <SiteNav />
    </div>
  );
}

export default FixedSiteNav;
