/**
 * useFeatureImageLayout
 *
 * Returns layout classes for feature image sidebars with left/right-handed mode support.
 * Matches the StandardPageLayout pattern with fixed positioning and flex centering.
 */

import { useAppTheme } from '@/theme/hooks/useAppTheme';

export function useFeatureImageLayout() {
  const { layoutPreference } = useAppTheme();
  const isLeftHanded = layoutPreference === 'left-handed';

  const imagePaneClasses = isLeftHanded
    ? 'md:fixed md:right-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
    : 'md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden';

  const contentPaneClasses = isLeftHanded
    ? 'flex-1 md:mr-[50%] lg:mr-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'
    : 'flex-1 md:ml-[50%] lg:ml-[33.333333%] md:h-full md:overflow-y-auto flex flex-col';

  return {
    imagePaneClasses,
    contentPaneClasses,
    isLeftHanded,
  };
}
