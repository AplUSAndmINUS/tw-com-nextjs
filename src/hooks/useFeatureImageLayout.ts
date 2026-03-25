/**
 * useFeatureImageLayout
 *
 * Returns layout classes for feature image sidebars with left/right-handed mode support.
 * Supports the shared split-pane pattern used by standard content layouts and
 * page-specific stacked variants like the About page.
 */

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { defaultUserPreferences } from '@/store/userPreferencesStore';

export interface FeatureImageLayoutOptions {
  containerClasses?: string;
  paneLeadingClasses?: string;
  paneSizeClasses?: string;
  contentRightOffsetClasses?: string;
  contentLeftOffsetClasses?: string;
}

export function useFeatureImageLayout({
  containerClasses = 'flex flex-col md:flex-row min-h-[calc(100vh-var(--site-header-height))] md:h-[calc(100vh-var(--site-header-height))] md:overflow-hidden md:relative md:mx-auto md:w-full max-width-content',
  paneLeadingClasses = '',
  paneSizeClasses = 'md:w-1/2 lg:w-1/3',
  contentRightOffsetClasses = 'md:mr-[50%] lg:mr-[33.333333%]',
  contentLeftOffsetClasses = 'md:ml-[50%] lg:ml-[33.333333%]',
}: FeatureImageLayoutOptions = {}) {
  const { layoutPreference, isHydrated } = useAppTheme();
  const resolvedLayoutPreference = isHydrated
    ? layoutPreference
    : defaultUserPreferences.layoutPreference;
  const isLeftHanded = resolvedLayoutPreference === 'left-handed';

  const fixedPaneSideClasses = isLeftHanded ? 'md:right-0' : 'md:left-0';
  const fixedContentOffsetClasses = isLeftHanded
    ? contentRightOffsetClasses
    : contentLeftOffsetClasses;

  const imagePaneClasses = [
    paneLeadingClasses,
    'md:absolute md:top-0 md:bottom-0',
    fixedPaneSideClasses,
    paneSizeClasses,
    'md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  const contentPaneClasses = [
    'hide-scrollbar flex-1 md:h-full md:w-full md:overflow-y-auto flex flex-col',
    fixedContentOffsetClasses,
  ].join(' ');

  return {
    containerClasses,
    imagePaneClasses,
    contentPaneClasses,
    isLeftHanded,
  };
}
