'use client';

import Script from 'next/script';
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
const EXCLUDED_PATHS = ['/contact'];

/**
 * KoFiWidget
 *
 * Renders the Ko-Fi floating "Tip Me!" chat widget in the bottom-right corner
 * of every page except those listed in EXCLUDED_PATHS.
 *
 * The external Ko-Fi overlay script is loaded lazily (afterInteractive) so it
 * does not block the initial render. Once loaded, `kofiWidgetOverlay.draw()`
 * is called to initialise the widget.
 */
export function KoFiWidget() {
  const pathname = usePathname();

  if (EXCLUDED_PATHS.includes(pathname)) {
    return null;
  }

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
