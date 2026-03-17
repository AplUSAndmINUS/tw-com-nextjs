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
 * Returns the Ko-Fi overlay container element injected by the external script.
 * The overlay widget always renders inside `#kofi-widget-overlay`.
 */
function getKofiWidget(): HTMLElement | null {
  return document.querySelector('#kofi-widget-overlay');
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

  useEffect(() => {
    const isExcluded = EXCLUDED_PATHS.includes(pathname);

    if (isExcluded) {
      const widget = getKofiWidget();
      if (widget) widget.style.visibility = 'hidden';
      return;
    }

    // Sync visibility immediately on navigation to a non-excluded page
    updateWidgetVisibility();

    window.addEventListener('scroll', updateWidgetVisibility, {
      passive: true,
    });
    window.addEventListener('resize', updateWidgetVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateWidgetVisibility);
      window.removeEventListener('resize', updateWidgetVisibility);
    };
  }, [pathname]);

  return (
    <Script
      src={KOFI_SCRIPT_SRC}
      strategy='afterInteractive'
      onLoad={() => {
        window.kofiWidgetOverlay?.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
      }}
    />
  );
}
