'use client';

import React from 'react';
import {
  clampFontScale,
  useUserPreferencesStore,
} from '@/store/userPreferencesStore';

interface FontScaleProviderProps {
  children: React.ReactNode;
}

const BASE_FONT_SIZE = 16;

/**
 * The root font-size for a text-size preference, in px. Out-of-range values
 * are clamped to 80%–150% rather than ignored.
 */
export function rootFontSizeFor(scale: unknown): number {
  return BASE_FONT_SIZE * clampFontScale(scale);
}

/**
 * FontScaleProvider
 *
 * Scales the root font size so every rem value in the app follows the user's
 * font-scale preference (80% to 150%). Only rem-based sizes follow it, which is
 * why the redesigned pages and DSM use rem tokens rather than px.
 *
 * This provider used to do a second job: apply a colour-vision CSS filter
 * (grayscale / hue-rotate) through a wrapper <div>. That is gone. The
 * colourblind and grayscale modes are now real palettes in
 * styles/tokens/colors-modes.css, selected by data-theme, which is both more
 * accurate — the old code ran a purpose-built dichromacy palette through a hue
 * rotation, scrambling its own contrast decisions — and removes a wrapper that
 * was actively breaking layout.
 *
 * Why the wrapper was a problem: any `filter` creates a containing block for
 * descendant `position: fixed` elements. Everything rendered inside it
 * (CookieBanner, Modal, NewsletterDrawer) anchored to the wrapper rather than
 * the viewport in any non-light mode. The Header had to be hoisted out of the
 * provider tree entirely to escape it.
 *
 * Nothing here creates a containing block now, so fixed positioning works
 * normally throughout.
 */
export function FontScaleProvider({ children }: FontScaleProviderProps) {
  const { preferences } = useUserPreferencesStore();
  const persistApi = useUserPreferencesStore.persist;
  const [hydrated, setHydrated] = React.useState(false);

  // The store skips hydration (CLAUDE.md §7.6), so until StoreHydrator runs,
  // `preferences` holds the defaults. The pre-paint theme script has already
  // set the stored size on <html>; applying the default here first would snap
  // the page back to 100% and then jump again. Wait for the real value.
  React.useEffect(() => {
    const unsub = persistApi.onFinishHydration(() => setHydrated(true));
    setHydrated(persistApi.hasHydrated());
    return unsub;
  }, [persistApi]);

  React.useEffect(() => {
    if (!hydrated) return;
    const newFontSize = rootFontSizeFor(preferences.fontScale);

    // Capture the original inline style to restore later
    const originalFontSize = document.documentElement.style.fontSize;
    document.documentElement.style.fontSize = `${newFontSize}px`;

    return () => {
      // Restore original inline style (or clear if none existed)
      document.documentElement.style.fontSize = originalFontSize;
    };
  }, [hydrated, preferences.fontScale]);

  return <>{children}</>;
}

export default FontScaleProvider;
