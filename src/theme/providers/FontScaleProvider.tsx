'use client';

import React from 'react';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';
import { useColorVisionFilter } from '@/hooks/useColorVisionFilter';

interface FontScaleProviderProps {
  children: React.ReactNode;
}

const BASE_FONT_SIZE = 16;
const MIN_FONT_SIZE_PX = BASE_FONT_SIZE * 0.8; // corresponds to minFontScale
const MAX_FONT_SIZE_PX = BASE_FONT_SIZE * 1.5; // corresponds to maxFontScale

/**
 * FontScaleProvider
 *
 * Applies global font scaling and color vision CSS filter to the document.
 * - Font scaling: adjusts root element's font size so all rem values scale.
 * - Color vision filter: applies a CSS filter via a wrapper div (NOT body) so that
 *   position:fixed elements (like the Header) are never inside a filtered ancestor,
 *   which would create a containing block and break viewport-fixed positioning.
 */
export function FontScaleProvider({ children }: FontScaleProviderProps) {
  const { preferences } = useUserPreferencesStore();
  const { filter } = useColorVisionFilter();

  // Apply font scale to root element
  React.useEffect(() => {
    const fontScale =
      typeof preferences.fontScale === 'number' ? preferences.fontScale : 1;
    const newFontSize = BASE_FONT_SIZE * fontScale;
    if (isNaN(newFontSize) || newFontSize < MIN_FONT_SIZE_PX || newFontSize > MAX_FONT_SIZE_PX) return;
    
    // Capture the original inline style to restore later
    const originalFontSize = document.documentElement.style.fontSize;
    document.documentElement.style.fontSize = `${newFontSize}px`;
    
    return () => {
      // Restore original inline style (or clear if none existed)
      document.documentElement.style.fontSize = originalFontSize;
    };
  }, [preferences.fontScale]);

  // Apply color vision filter via a wrapper div, NOT document.body.
  // Setting filter on body (or any ancestor of a position:fixed element) creates
  // a containing block that breaks fixed positioning — the header would scroll
  // with the page instead of staying fixed to the viewport.
  return (
    <div style={filter !== 'none' ? { filter } : undefined}>
      {children}
    </div>
  );
}

export default FontScaleProvider;
