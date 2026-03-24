/**
 * useFeatureImageLayout
 *
 * Returns layout classes for feature image sidebars with left/right-handed mode support.
 * Supports the shared split-pane pattern used by standard content layouts and
 * page-specific stacked variants like the About page.
 */

import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface FeatureImageLayoutOptions {
  isStacked?: boolean;
  stackedContainerClasses?: string;
  fixedContainerClasses?: string;
  stackedImagePaneClasses?: string;
  stackedContentPaneClasses?: string;
  fixedPaneLeadingClasses?: string;
  fixedPaneSizeClasses?: string;
  fixedContentRightOffsetClasses?: string;
  fixedContentLeftOffsetClasses?: string;
}

export function useFeatureImageLayout({
  isStacked = false,
  stackedContainerClasses = 'flex flex-col min-h-[calc(100vh-var(--site-header-height))]',
  fixedContainerClasses = 'flex flex-col md:flex-row min-h-[calc(100vh-var(--site-header-height))] md:h-[calc(100vh-var(--site-header-height))] md:overflow-hidden',
  stackedImagePaneClasses = '',
  stackedContentPaneClasses = 'flex-1 flex flex-col',
  fixedPaneLeadingClasses = '',
  fixedPaneSizeClasses = 'md:w-1/2 lg:w-1/3',
  fixedContentRightOffsetClasses = 'md:mr-[50%] lg:mr-[33.333333%]',
  fixedContentLeftOffsetClasses = 'md:ml-[50%] lg:ml-[33.333333%]',
}: FeatureImageLayoutOptions = {}) {
  const { layoutPreference } = useAppTheme();
  const isLeftHanded = layoutPreference === 'left-handed';

  const containerClasses = isStacked
    ? stackedContainerClasses
    : fixedContainerClasses;

  const fixedPaneSideClasses = isLeftHanded ? 'md:right-0' : 'md:left-0';
  const fixedContentOffsetClasses = isLeftHanded
    ? fixedContentRightOffsetClasses
    : fixedContentLeftOffsetClasses;

  const imagePaneClasses = isStacked
    ? stackedImagePaneClasses
    : [
        fixedPaneLeadingClasses,
        'md:fixed md:top-[var(--site-header-height)] md:bottom-0',
        fixedPaneSideClasses,
        fixedPaneSizeClasses,
        'md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden',
      ]
        .filter(Boolean)
        .join(' ');

  const contentPaneClasses = isStacked
    ? stackedContentPaneClasses
    : [
        'hide-scrollbar flex-1 md:h-full md:overflow-y-auto flex flex-col',
        fixedContentOffsetClasses,
      ].join(' ');

  return {
    containerClasses,
    imagePaneClasses,
    contentPaneClasses,
    isLeftHanded,
  };
}
