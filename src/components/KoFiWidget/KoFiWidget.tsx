'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, string>) => void;
    };
  }
}

/** Ko-Fi profile username */
const KOFI_USERNAME = 'terencewaters';

/** Ko-Fi widget CDN script URL */
const KOFI_SCRIPT_SRC =
  'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';

/** Mobile viewport width threshold in pixels */
const MOBILE_BREAKPOINT = 768;

/** Distance from page bottom (px) at which the widget hides on mobile */
const BOTTOM_THRESHOLD = 150;

/**
 * Ko-Fi widget configuration.
 * Colors are Ko-Fi brand values; the widget API only accepts hex strings so
 * these cannot be derived from the Fluent UI theme token system.
 */
const KOFI_WIDGET_OPTIONS: Record<string, string> = {
  type: 'floating-chat',
  'floating-chat.donateButton.text': 'Tip Me',
  'floating-chat.donateButton.background-color': '#00b9fe',
  'floating-chat.donateButton.text-color': '#fff',
};

/** Pages on which the Ko-Fi widget should not be shown */
const EXCLUDED_PATHS = [
  '/',
  '/blog',
  '/case-studies',
  '/contact',
  '/portfolio',
  '/services',
  '/services/consulting',
  '/services/design',
  '/services/development',
  '/services/resonance-core',
  '/services/personal-training',
];

/**
 * Cached reference to the Ko-Fi overlay element. Populated on first successful
 * lookup after the external script injects the element into the DOM.
 */
let widgetCache: HTMLElement | null = null;

/** Pending requestAnimationFrame handle, used to coalesce rapid scroll/resize events. */
let rafId: number | null = null;

/**
 * Returns the Ko-Fi overlay container element injected by the external script.
 * Result is cached after the first successful lookup since the element is
 * injected once and never recreated.
 */
function getKofiWidget(): HTMLElement | null {
  if (!widgetCache) {
    widgetCache = document.querySelector('#kofi-widget-overlay');
  }
  return widgetCache;
}

/**
 * Shows or hides the Ko-Fi widget based on the current viewport and scroll
 * position. On mobile, hides the widget when the user is near the page bottom
 * so it doesn't overlap the footer.
 */
function updateWidgetVisibility(): void {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const distanceFromBottom =
    document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  const shouldHide = isMobile && distanceFromBottom < BOTTOM_THRESHOLD;

  const widget = getKofiWidget();
  if (widget) {
    widget.style.visibility = shouldHide ? 'hidden' : '';
  }
}

/**
 * Schedules a visibility update on the next animation frame.
 * Coalesces multiple rapid scroll/resize events into a single update per frame.
 */
function scheduleVisibilityUpdate(): void {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    updateWidgetVisibility();
  });
}

/**
 * KoFiWidget
 *
 * Renders the Ko-Fi floating "Tip Me!" chat widget in the bottom-right corner
 * of every page except those listed in EXCLUDED_PATHS.
 *
 * The external Ko-Fi overlay script is loaded lazily (afterInteractive) so it
 * does not block the initial render. Once loaded, `kofiWidgetOverlay.draw()`
 * is called to initialise the widget.
 *
 * On mobile viewports, the widget is hidden when the user scrolls near the
 * bottom of the page to avoid overlapping the footer.
 */
export function KoFiWidget() {
  const pathname = usePathname();

  // Always holds the latest pathname so the onLoad closure is never stale.
  // (The script loads once; the component may re-render before it fires.)
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const isExcluded = EXCLUDED_PATHS.includes(pathname);

    if (isExcluded) {
      const widget = getKofiWidget();
      if (widget) widget.style.visibility = 'hidden';
      return;
    }

    // If the script loaded while on an excluded page, draw() was skipped.
    // Initialize the widget now on the first visit to a non-excluded route.
    if (window.kofiWidgetOverlay && !getKofiWidget()) {
      window.kofiWidgetOverlay.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
    }

    // Sync visibility immediately on navigation to a non-excluded page
    updateWidgetVisibility();

    window.addEventListener('scroll', scheduleVisibilityUpdate, {
      passive: true,
    });
    window.addEventListener('resize', scheduleVisibilityUpdate, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', scheduleVisibilityUpdate);
      window.removeEventListener('resize', scheduleVisibilityUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [pathname]);

  return (
    <Script
      src={KOFI_SCRIPT_SRC}
      strategy='afterInteractive'
      onLoad={() => {
        if (!EXCLUDED_PATHS.includes(pathnameRef.current)) {
          window.kofiWidgetOverlay?.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
        }
      }}
    />
  );
}
