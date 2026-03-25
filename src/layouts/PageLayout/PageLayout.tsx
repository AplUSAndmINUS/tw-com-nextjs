'use client';

import { ReactNode } from 'react';
import { HomePageLayout } from './HomePageLayout';
import { StandardPageLayout } from './StandardPageLayout';
import { type FeatureImageLayoutOptions } from '@/hooks/useFeatureImageLayout';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** Optional custom media pane rendered in place of the default feature image. */
  mediaPane?: ReactNode;
  /** Optional layout overrides for the contained split-pane view. */
  layoutOptions?: FeatureImageLayoutOptions;

  // If true, applies special layout/styling for the homepage (full-height contained view)
  isHomePage?: boolean;
}

/**
 * PageLayout — Client-side layout router
 *
 * Intelligently delegates to specialized layout components based on page type:
 *
 * → HomePageLayout (isHomePage = true):
 *     Client component with:
 *     - Contained full-viewport layout
 *     - Window resize listeners for responsive behavior
 *     - Hero section with dynamic scaling
 *     - Special animations and interactions
 *
 * → StandardPageLayout (isHomePage = false, default):
 *     Client layout shell used by server-rendered route pages with:
 *     - Normal or contained viewport based on featureImage
 *     - Standard scrolling behavior
 *     - Optional feature image with fixed positioning
 *     - Standard footer placement
 *
 * Performance Benefits:
 * ---------------------
 * Route pages can remain server components for SSG/metadata/SEO while this
 * client-side router handles viewport-specific layout behavior. Splitting the
 * homepage and standard page shells also avoids pulling homepage-only behavior
 * into the standard page path.
 *
 * Usage:
 * ------
 * ```tsx
 * // Homepage (special layout with contained viewport)
 * <PageLayout isHomePage featureImage={...}>
 *   <HeroSection />
 * </PageLayout>
 *
 * // Standard page (normal scrolling)
 * <PageLayout>
 *   <Article />
 * </PageLayout>
 *
 * // Standard page with fixed feature image
 * <PageLayout featureImage={...}>
 *   <AboutContent />
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  featureImage,
  mediaPane,
  layoutOptions,
  isHomePage = false,
}: PageLayoutProps) {
  return isHomePage ? (
    <HomePageLayout featureImage={featureImage}>{children}</HomePageLayout>
  ) : (
    <StandardPageLayout
      featureImage={featureImage}
      mediaPane={mediaPane}
      layoutOptions={layoutOptions}
    >
      {children}
    </StandardPageLayout>
  );
}
