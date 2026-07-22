'use client';

import React from 'react';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

interface FontScaleProviderProps {
  children: React.ReactNode;
}

const BASE_FONT_SIZE = 16;
const MIN_FONT_SIZE_PX = BASE_FONT_SIZE * 0.8; // corresponds to minFontScale
const MAX_FONT_SIZE_PX = BASE_FONT_SIZE * 1.5; // corresponds to maxFontScale

/**
 * FontScaleProvider
 *
 * Scales the root font size so every rem value in the app follows the user's
 * font-scale preference.
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

  React.useEffect(() => {
    const fontScale =
      typeof preferences.fontScale === 'number' ? preferences.fontScale : 1;
    const newFontSize = BASE_FONT_SIZE * fontScale;
    if (
      isNaN(newFontSize) ||
      newFontSize < MIN_FONT_SIZE_PX ||
      newFontSize > MAX_FONT_SIZE_PX
    )
      return;

    // Capture the original inline style to restore later
    const originalFontSize = document.documentElement.style.fontSize;
    document.documentElement.style.fontSize = `${newFontSize}px`;

    return () => {
      // Restore original inline style (or clear if none existed)
      document.documentElement.style.fontSize = originalFontSize;
    };
  }, [preferences.fontScale]);

  return <>{children}</>;
}

export default FontScaleProvider;
