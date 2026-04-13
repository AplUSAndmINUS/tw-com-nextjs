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
  /**
   * Tailwind breakpoint at which the layout switches from stacked to split.
   * Use 'md' when the caller detects mobile-landscape (needs split at 768 px).
   * Defaults to 'lg' (1024 px) for all standard desktop views.
   */
  breakpoint?: 'md' | 'lg';
}

export function useFeatureImageLayout({
  containerClasses,
  paneLeadingClasses = '',
  paneSizeClasses,
  contentRightOffsetClasses,
  contentLeftOffsetClasses,
  breakpoint = 'lg',
}: FeatureImageLayoutOptions = {}) {
  const { layoutPreference, isHydrated } = useAppTheme();
  const resolvedLayoutPreference = isHydrated
    ? layoutPreference
    : defaultUserPreferences.layoutPreference;
  const isLeftHanded = resolvedLayoutPreference === 'left-handed';

  const isMdBreak = breakpoint === 'md';

  // All classes that vary by breakpoint are written as full literal strings so
  // Tailwind's static scanner includes them in the bundle.
  const resolvedContainerClasses =
    containerClasses ??
    (isMdBreak
      ? 'flex flex-col md:flex-row min-h-[calc(100vh-var(--site-header-height))] md:h-[calc(100vh-var(--site-header-height))] md:overflow-hidden md:relative md:mx-auto md:w-full max-width-content'
      : 'flex flex-col lg:flex-row min-h-[calc(100vh-var(--site-header-height))] lg:h-[calc(100vh-var(--site-header-height))] lg:overflow-hidden lg:relative lg:mx-auto lg:w-full max-width-content');

  const resolvedPaneSizeClasses =
    paneSizeClasses ?? (isMdBreak ? 'md:w-1/4' : 'lg:w-1/4');
  const resolvedContentRightOffsetClasses =
    contentRightOffsetClasses ?? (isMdBreak ? 'md:mr-[25%]' : 'lg:mr-[25%]');
  const resolvedContentLeftOffsetClasses =
    contentLeftOffsetClasses ?? (isMdBreak ? 'md:ml-[25%]' : 'lg:ml-[25%]');

  const fixedPaneSideClasses = isLeftHanded
    ? isMdBreak
      ? 'md:right-0'
      : 'lg:right-0'
    : isMdBreak
      ? 'md:left-0'
      : 'lg:left-0';

  const fixedContentOffsetClasses = isLeftHanded
    ? resolvedContentRightOffsetClasses
    : resolvedContentLeftOffsetClasses;

  const splitAbsoluteClasses = isMdBreak
    ? 'md:absolute md:top-0 md:bottom-0'
    : 'lg:absolute lg:top-0 lg:bottom-0';

  const splitPaneInnerClasses = isMdBreak
    ? 'md:p-4 md:overflow-hidden'
    : 'lg:p-4 lg:overflow-hidden';

  const contentScrollClasses = isMdBreak
    ? 'md:h-full md:w-full md:overflow-y-auto'
    : 'lg:h-full lg:w-full lg:overflow-y-auto';

  const imagePaneClasses = [
    paneLeadingClasses,
    'flex items-center justify-center',
    splitAbsoluteClasses,
    fixedPaneSideClasses,
    resolvedPaneSizeClasses,
    splitPaneInnerClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const contentPaneClasses = [
    'hide-scrollbar flex-1 flex flex-col',
    contentScrollClasses,
    fixedContentOffsetClasses,
  ].join(' ');

  return {
    containerClasses: resolvedContainerClasses,
    imagePaneClasses,
    contentPaneClasses,
    isLeftHanded,
  };
}
