/**
 * useFeatureImageLayout
 *
 * Returns layout classes for feature image sidebars with left/right-handed mode support.
 * Supports the shared split-pane pattern used by standard content layouts and
 * page-specific stacked variants like the About page.
 */

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { defaultUserPreferences } from '@/store/userPreferencesStore';
import styles from '@/layouts/PageLayout/featureImageLayout.module.scss';

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

  // Each breakpoint variant is a distinct CSS Modules class. `max-width-content`
  // stays a global class (defined in globals.css) appended alongside the module.
  const resolvedContainerClasses =
    containerClasses ??
    `${isMdBreak ? styles.containerMd : styles.containerLg} max-width-content`;

  const resolvedPaneSizeClasses =
    paneSizeClasses ?? (isMdBreak ? styles.paneSizeMd : styles.paneSizeLg);
  const resolvedContentRightOffsetClasses =
    contentRightOffsetClasses ??
    (isMdBreak ? styles.contentRightOffsetMd : styles.contentRightOffsetLg);
  const resolvedContentLeftOffsetClasses =
    contentLeftOffsetClasses ??
    (isMdBreak ? styles.contentLeftOffsetMd : styles.contentLeftOffsetLg);

  const fixedPaneSideClasses = isLeftHanded
    ? isMdBreak
      ? styles.paneRightMd
      : styles.paneRightLg
    : isMdBreak
      ? styles.paneLeftMd
      : styles.paneLeftLg;

  const fixedContentOffsetClasses = isLeftHanded
    ? resolvedContentRightOffsetClasses
    : resolvedContentLeftOffsetClasses;

  const splitAbsoluteClasses = isMdBreak
    ? styles.splitAbsoluteMd
    : styles.splitAbsoluteLg;

  const splitPaneInnerClasses = isMdBreak
    ? styles.splitInnerMd
    : styles.splitInnerLg;

  const contentScrollClasses = isMdBreak
    ? styles.contentScrollMd
    : styles.contentScrollLg;

  const imagePaneClasses = [
    paneLeadingClasses,
    styles.imagePaneBase,
    splitAbsoluteClasses,
    fixedPaneSideClasses,
    resolvedPaneSizeClasses,
    splitPaneInnerClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const contentPaneClasses = [
    `hide-scrollbar ${styles.contentPaneBase}`,
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
