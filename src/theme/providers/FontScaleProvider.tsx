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
 * - Color vision filter: applies a CSS filter to <body> for colorblindness/grayscale modes.
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
    document.documentElement.style.fontSize = `${newFontSize}px`;
    return () => {
      document.documentElement.style.fontSize = `${BASE_FONT_SIZE}px`;
    };
  }, [preferences.fontScale]);

  // Apply color vision filter to body
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.filter = filter === 'none' ? '' : filter;
    return () => {
      document.body.style.filter = '';
    };
  }, [filter]);

  return <>{children}</>;
}

export default FontScaleProvider;
