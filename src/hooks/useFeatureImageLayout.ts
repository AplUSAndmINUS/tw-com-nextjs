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
  containerClasses = 'flex flex-col lg:flex-row min-h-[calc(100vh-var(--site-header-height))] lg:h-[calc(100vh-var(--site-header-height))] lg:overflow-hidden lg:relative lg:mx-auto lg:w-full max-width-content',
  paneLeadingClasses = '',
  paneSizeClasses = 'lg:w-1/4',
  contentRightOffsetClasses = 'lg:mr-[25%]',
  contentLeftOffsetClasses = 'lg:ml-[25%]',
}: FeatureImageLayoutOptions = {}) {
  const { layoutPreference, isHydrated } = useAppTheme();
  const resolvedLayoutPreference = isHydrated
    ? layoutPreference
    : defaultUserPreferences.layoutPreference;
  const isLeftHanded = resolvedLayoutPreference === 'left-handed';

  const fixedPaneSideClasses = isLeftHanded ? 'lg:right-0' : 'lg:left-0';
  const fixedContentOffsetClasses = isLeftHanded
    ? contentRightOffsetClasses
    : contentLeftOffsetClasses;

  const imagePaneClasses = [
    paneLeadingClasses,
    'flex items-center justify-center',
    'lg:absolute lg:top-0 lg:bottom-0',
    fixedPaneSideClasses,
    paneSizeClasses,
    'lg:p-4 lg:overflow-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  const contentPaneClasses = [
    'hide-scrollbar flex-1 lg:h-full lg:w-full lg:overflow-y-auto flex flex-col',
    fixedContentOffsetClasses,
  ].join(' ');

  return {
    containerClasses,
    imagePaneClasses,
    contentPaneClasses,
    isLeftHanded,
  };
}
