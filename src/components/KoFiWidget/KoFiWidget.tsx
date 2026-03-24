'use client';

import Script from 'next/script';
import { useEffect } from 'react';

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

/** MutationObserver watching for Ko-Fi overlay injection */
let overlayObserver: MutationObserver | null = null;

/**
 * Query the DOM for the Ko-fi overlay element.
 * Ko-Fi creates elements with id="kofi-widget-overlay-{GUID}"
 * so we need to match any id that starts with "kofi-widget-overlay"
 */
function getKofiWidget(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[id^="kofi-widget-overlay"]');
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
 * Enforces display state on the Ko-Fi overlay based on whether the body has
 * the `kofi-visible` class. Called whenever the overlay is created or modified.
 */
function enforceOverlayDisplayState(): void {
  const overlay = getKofiWidget();
  if (!overlay) return;

  const hasVisibleClass = document.body.classList.contains('kofi-visible');
  const shouldDisplay = hasVisibleClass;

  // Use !important to override any inline styles Ko-Fi may have injected
  overlay.style.setProperty(
    'display',
    shouldDisplay ? 'block' : 'none',
    'important'
  );
}

/**
 * Starts observing for the Ko-Fi overlay element being injected or modified.
 */
function startOverlayObserver(): void {
  if (overlayObserver) return;

  overlayObserver = new MutationObserver(() => {
    const overlay = getKofiWidget();
    if (overlay) {
      enforceOverlayDisplayState();
    }
  });

  overlayObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
}

function stopOverlayObserver(): void {
  if (overlayObserver) {
    overlayObserver.disconnect();
    overlayObserver = null;
  }
}

export function KoFiWidget({ pathname }: { pathname: string }) {
  const isAllowed = ALLOWED_PATHS.includes(pathname);

  useEffect(() => {
    if (isAllowed) {
      document.body.classList.add('kofi-visible');
    } else {
      document.body.classList.remove('kofi-visible');
    }

    // Start observing for overlay injection if not already observing
    startOverlayObserver();

    // If overlay already exists, enforce its display state immediately
    enforceOverlayDisplayState();

    if (!isAllowed) return;

    // On an allowed page: draw if the widget hasn't been created yet, then
    // sync mobile-scroll visibility.
    if (!getKofiWidget() && window.kofiWidgetOverlay) {
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
      document.body.classList.remove('kofi-visible');
      stopOverlayObserver();
      window.removeEventListener('scroll', scheduleVisibilityUpdate);
      window.removeEventListener('resize', scheduleVisibilityUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [isAllowed, pathname]);

  return (
    <Script
      src={KOFI_SCRIPT_SRC}
      strategy='afterInteractive'
      onLoad={() => {
        window.kofiWidgetOverlay?.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
        // Observer will catch the overlay when Ko-Fi injects it
        startOverlayObserver();
        enforceOverlayDisplayState();
      }}
    />
  );
}
