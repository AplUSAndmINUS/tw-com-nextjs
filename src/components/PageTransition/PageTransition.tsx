'use client';

import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LEAVE_MS,
  animatePage,
  getTransitionHref,
  prefersReducedMotion,
} from './routeTransition';

interface PageTransitionProps {
  children: ReactNode;
}

/** How long to wait on a slow navigation before showing the old page again. */
const LEAVE_RESTORE_MS = 1500;

/**
 * PageTransition — site-wide fade-out / fade-in between pages.
 *
 * Mounted once, around all page content, in app/providers.tsx. It persists
 * across client navigations (it lives above the page segment), so nothing is
 * remounted and no page state is lost.
 *
 *   Leave: a capturing click listener catches plain left clicks on in-app
 *   links, fades the current page out (LEAVE_MS) and then navigates with the
 *   router. next/link skips its own navigation when the click is already
 *   defaultPrevented, so there is no double navigation.
 *
 *   Enter: when the pathname changes, a layout effect (before paint) fades the
 *   wrapper back in and cascades the sections that are in view; sections below
 *   the fold fade in as they scroll into view. See routeTransition.ts.
 *
 *   First load: CSS fades the wrapper in from the server HTML
 *   ([data-route-init] in effects.css) and below-fold sections scroll-reveal.
 *
 * Motion is CSS only (opacity on the wrapper; opacity + a short rise on
 * sections, no layout properties), so it causes no layout shift. With reduced
 * motion — OS setting or the in-app toggle — clicks navigate immediately and
 * nothing is hidden; the stylesheet also forces everything visible as a
 * backstop. Without JavaScript nothing is hidden at all.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const lastPathname = useRef<string | null>(null);
  const restoreTimer = useRef<number | undefined>(undefined);
  // Pending router.push for a clicked link. Held in a ref so a newer
  // navigation (back/forward, or a pathname change from elsewhere) can cancel
  // it before it fires and overrides that navigation with a stale link.
  const navigateTimer = useRef<number | undefined>(undefined);

  // ----- Leave -----
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const wrapper = ref.current;
      if (!wrapper) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = getTransitionHref(anchor, event, window.location);
      if (!href || prefersReducedMotion()) return;

      event.preventDefault();
      router.prefetch(href);
      wrapper.dataset.route = 'leaving';
      window.clearTimeout(navigateTimer.current);
      window.clearTimeout(restoreTimer.current);

      navigateTimer.current = window.setTimeout(() => {
        router.push(href);
        // If the destination is slow (or never arrives), do not leave the
        // visitor staring at a blank page; the new page still fades in when
        // it lands.
        restoreTimer.current = window.setTimeout(() => {
          if (wrapper.dataset.route === 'leaving') delete wrapper.dataset.route;
        }, LEAVE_RESTORE_MS);
      }, LEAVE_MS);
    };

    // Back/forward during the leave fade wins over the clicked link.
    const onPopState = () => {
      window.clearTimeout(navigateTimer.current);
      const wrapper = ref.current;
      if (wrapper?.dataset.route === 'leaving') delete wrapper.dataset.route;
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      window.clearTimeout(navigateTimer.current);
      window.clearTimeout(restoreTimer.current);
    };
  }, [router]);

  // ----- Enter -----
  useLayoutEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    window.clearTimeout(restoreTimer.current);
    // A navigation already landed; a pending push from an earlier click is stale.
    window.clearTimeout(navigateTimer.current);

    // First load, or the same path again (React Strict Mode re-runs effects
    // in development): nothing to transition from.
    const previous = lastPathname.current;
    lastPathname.current = pathname;
    const firstLoad = previous === null || previous === pathname;

    if (prefersReducedMotion()) {
      delete wrapper.dataset.route;
      return;
    }

    if (firstLoad) {
      return animatePage(wrapper, { stagger: false });
    }

    // The CSS first-load fade has long finished; drop its hook so it cannot
    // replay when data-route is cleared below.
    wrapper.removeAttribute('data-route-init');
    wrapper.dataset.route = 'entering';
    const cleanupPage = animatePage(wrapper, { stagger: true });
    const enterTimer = window.setTimeout(() => {
      if (wrapper.dataset.route === 'entering') delete wrapper.dataset.route;
    }, 600);

    return () => {
      window.clearTimeout(enterTimer);
      cleanupPage();
    };
  }, [pathname]);

  return (
    <div ref={ref} className='tw-route' data-route-init=''>
      {children}
    </div>
  );
}
