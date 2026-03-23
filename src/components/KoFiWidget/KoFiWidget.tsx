'use client';

import Script from 'next/script';
import { useEffect } from 'react';
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

/**
 * Pages on which the Ko-Fi widget should be shown.
 * Paths include trailing slashes to match what usePathname() returns when
 * next.config.ts has trailingSlash: true.
 */
const ALLOWED_PATHS = [
  '/contact/',
  '/about/',
  '/github/',
  '/videos/',
  '/content-hub/',
];

/** Pending requestAnimationFrame handle, used to coalesce rapid scroll/resize events. */
let rafId: number | null = null;

/**
 * Returns the Ko-Fi overlay container element injected by the external script.
 * Always queries the DOM fresh to avoid stale references if Ko-Fi recreates
 * the element (e.g. when draw() is called more than once).
 */
function getKofiWidget(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#kofi-widget-overlay');
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
 * Renders the Ko-Fi floating "Tip Me!" chat widget in the bottom-left corner
 * only on pages listed in ALLOWED_PATHS (/contact, /about, /github, /videos,
 * /content-hub). On all other routes the widget is hidden.
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

  useEffect(() => {
    const isAllowed = ALLOWED_PATHS.includes(pathname);

    if (!isAllowed) {
      const widget = getKofiWidget();
      if (widget) widget.style.display = 'none';
      return;
    }

    // On an allowed page: restore display if the widget was hidden while on a
    // non-allowed page, then sync mobile-scroll visibility. If the widget
    // hasn't been created yet (e.g. onLoad hasn't fired), draw it now.
    const widget = getKofiWidget();
    if (widget) {
      widget.style.display = '';
    } else if (window.kofiWidgetOverlay) {
      window.kofiWidgetOverlay.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
    }

    // Sync visibility immediately on navigation to an allowed page
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

  // The Script is always rendered so it is only ever loaded once and onLoad
  // never fires on re-mount. Visibility is controlled entirely via the effect.
  return (
    <Script
      src={KOFI_SCRIPT_SRC}
      strategy='afterInteractive'
      onLoad={() => {
        window.kofiWidgetOverlay?.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
        // If the script finished loading while the user is on a non-allowed
        // path, hide the widget immediately.
        if (!ALLOWED_PATHS.includes(window.location.pathname)) {
          const widget = getKofiWidget();
          if (widget) widget.style.display = 'none';
        }
      }}
    />
  );
}
