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
  const widget = document.querySelector<HTMLElement>(
    '[id^="kofi-widget-overlay"]'
  );
  if (widget) {
    console.log('[KoFi] Found widget element:', widget.id);
  }
  return widget;
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

  console.log(
    '[KoFi] enforceOverlayDisplayState — hasVisibleClass:',
    hasVisibleClass,
    '| setting display:',
    shouldDisplay ? 'block' : 'none'
  );

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
  if (overlayObserver) {
    console.log('[KoFi] startOverlayObserver — already observing');
    return;
  }

  console.log('[KoFi] startOverlayObserver — creating new observer');

  overlayObserver = new MutationObserver((mutations) => {
    console.log(
      '[KoFi] observer callback fired — mutations:',
      mutations.length
    );

    // Log any added nodes with 'kofi' in class/id to see what Ko-Fi creates
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const id = node.id || '';
            const classes = node.className || '';
            if (
              id.toLowerCase().includes('kofi') ||
              classes.toLowerCase().includes('kofi')
            ) {
              console.log(
                '[KoFi] Ko-Fi element added — id:',
                id,
                '| classes:',
                classes,
                '| tag:',
                node.tagName
              );
            }
          }
        });
      }
    });

    const overlay = getKofiWidget();
    console.log('[KoFi] overlay exists in callback:', !!overlay);
    if (overlay) {
      console.log('[KoFi] observer detected overlay injection/modification');
      enforceOverlayDisplayState();
    }
  });

  overlayObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
  console.log('[KoFi] observer now watching document.body');
}

function stopOverlayObserver(): void {
  if (overlayObserver) {
    console.log('[KoFi] stopOverlayObserver — disconnecting');
    overlayObserver.disconnect();
    overlayObserver = null;
  }
}

export function KoFiWidget({ pathname }: { pathname: string }) {
  const isAllowed = ALLOWED_PATHS.includes(pathname);

  console.log('[KoFi] render — pathname:', pathname, '| isAllowed:', isAllowed);

  useEffect(() => {
    console.log(
      '[KoFi] effect — pathname:',
      pathname,
      '| isAllowed:',
      isAllowed
    );

    if (isAllowed) {
      document.body.classList.add('kofi-visible');
      console.log('[KoFi] added kofi-visible class to body');
    } else {
      document.body.classList.remove('kofi-visible');
      console.log('[KoFi] removed kofi-visible class from body');
    }

    // Start observing for overlay injection if not already observing
    startOverlayObserver();

    // If overlay already exists, enforce its display state immediately
    enforceOverlayDisplayState();

    const overlayEl = document.querySelector('#kofi-widget-overlay');
    console.log('[KoFi] #kofi-widget-overlay exists:', !!overlayEl);
    if (overlayEl) {
      const computed = window.getComputedStyle(overlayEl);
      console.log(
        '[KoFi] overlay computed display:',
        computed.display,
        '| inline display:',
        (overlayEl as HTMLElement).style.display
      );
    }
    console.log('[KoFi] body classes:', document.body.className);

    if (!isAllowed) return;

    // On an allowed page: draw if the widget hasn't been created yet, then
    // sync mobile-scroll visibility.
    if (!getKofiWidget() && window.kofiWidgetOverlay) {
      console.log('[KoFi] drawing widget (lazy init)');
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
      console.log('[KoFi] cleanup — removing kofi-visible class');
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
        console.log(
          '[KoFi] onLoad fired — pathname at load:',
          window.location.pathname
        );
        console.log(
          '[KoFi] kofiWidgetOverlay exists:',
          !!window.kofiWidgetOverlay
        );
        window.kofiWidgetOverlay?.draw(KOFI_USERNAME, KOFI_WIDGET_OPTIONS);
        console.log('[KoFi] draw() called.');
        // Observer will catch the overlay when Ko-Fi injects it
        startOverlayObserver();
        enforceOverlayDisplayState();
      }}
    />
  );
}
