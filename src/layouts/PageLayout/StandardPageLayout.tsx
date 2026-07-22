'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';
import {
  useIsMobileLandscape,
  useIsShortLandscape,
  useIsSquare,
  useIsLargePortrait,
} from '@/hooks/useMediaQuery';
import {
  useFeatureImageLayout,
  type FeatureImageLayoutOptions,
} from '@/hooks/useFeatureImageLayout';
import styles from './StandardPageLayout.module.scss';
import featureStyles from './featureImageLayout.module.scss';

interface StandardPageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** Optional custom media pane rendered in place of the default feature image. */
  mediaPane?: ReactNode;
  /** Forces the contained split-pane shell even if the custom media pane prop is not stable during hydration. */
  hasMediaPane?: boolean;
  /** Optional layout overrides for the contained split-pane view. */
  layoutOptions?: FeatureImageLayoutOptions;
}

/**
 * StandardPageLayout — Client component for standard (non-homepage) pages
 *
 * Layout Behavior:
 * ----------------
 * WITH featureImage:
 *   - Mobile: Normal scrolling with image above content, standard footer at bottom
 *   - Tablet/Desktop: Contained viewport with fixed side-by-side panes
 *     • Image pane: Fixed position, vertically centered (50% width on tablet, 33% on desktop)
 *     • Content pane: Independent scrolling (mirrored margins based on layout preference)
 *     • Footer: Interactive overlay with show/hide button (hidden on mobile)
 *
 * WITHOUT featureImage:
 *   - All devices: Normal scrolling layout with max-width container for optimal reading experience
 *   - Mobile: Standard inline footer always visible at bottom
 *   - Tablet/Desktop: Interactive FooterOverlay with show/hide button (inline footer hidden)
 *
 * Layout Mirroring:
 * -----------------
 * Respects user's layout preference (left-handed vs right-handed) by:
 *   - Positioning image pane on preferred side
 *   - Adjusting content pane margins to match
 *   - This creates a comfortable experience for both left and right-handed users
 *
 * Responsive Breakpoints:
 * -----------------------
 * - Mobile landscape: 25% image / 75% content (3:9 ratio)
 * - Tablet portrait large: 50% image / 50% content (6:6 ratio)
 * - Desktop: 25% image / 75% content (3:9 ratio)
 */
export function StandardPageLayout({
  children,
  featureImage,
  mediaPane,
  hasMediaPane = false,
  layoutOptions,
}: StandardPageLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldCenterContainedContent, setShouldCenterContainedContent] =
    useState(false);
  const contentPaneRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);
  const isMobileLandscapeHook = useIsMobileLandscape();
  const isShortLandscapeHook = useIsShortLandscape();
  const isSquareHook = useIsSquare();
  const isLargePortraitHook = useIsLargePortrait();

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isMobileLandscape = isMounted ? isMobileLandscapeHook : false;
  const isShortLandscape = isMounted ? isShortLandscapeHook : false;
  const isSquare = isMounted ? isSquareHook : false;
  const isLargePortrait = isMounted ? isLargePortraitHook : false;
  // Square and large-portrait viewports use a wider 33% image pane
  const useWiderPane = isSquare || isLargePortrait;
  const usesMediaPaneLayout =
    hasMediaPane || Boolean(featureImage || mediaPane);
  const { containerClasses, contentPaneClasses, imagePaneClasses } =
    useFeatureImageLayout({
      // Mobile landscape: split activates at md (768 px) with a xl step-up.
      // All other views: split activates at lg (1024 px).
      breakpoint: isMobileLandscape ? 'md' : 'lg',
      paneSizeClasses: isMobileLandscape
        ? featureStyles.paneSizeMdXl
        : useWiderPane
          ? featureStyles.paneSizeLgWide
          : undefined,
      contentRightOffsetClasses: isMobileLandscape
        ? featureStyles.contentRightOffsetMdXl
        : useWiderPane
          ? featureStyles.contentRightOffsetLgWide
          : undefined,
      contentLeftOffsetClasses: isMobileLandscape
        ? featureStyles.contentLeftOffsetMdXl
        : useWiderPane
          ? featureStyles.contentLeftOffsetLgWide
          : undefined,
      ...layoutOptions,
    });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!usesMediaPaneLayout || !isMounted) {
      setShouldCenterContainedContent(false);
      return;
    }

    const paneElement = contentPaneRef.current;
    const innerElement = contentInnerRef.current;

    if (!paneElement || !innerElement) {
      return;
    }

    const measureLayout = () => {
      const paneHeight = paneElement.clientHeight;
      const contentHeight = innerElement.scrollHeight;

      // Keep content top-aligned when it needs scrolling; center it only when it fits.
      setShouldCenterContainedContent(contentHeight <= paneHeight);
    };

    measureLayout();

    const resizeObserver = new ResizeObserver(() => {
      measureLayout();
    });

    const mutationObserver = new MutationObserver(() => {
      measureLayout();
    });

    // Async pages such as /videos can start with a short loading state, then
    // expand after data arrives without changing the observed pane box size.
    // Re-measure on subtree mutations so the layout drops out of centered mode
    // as soon as the content becomes scrollable.
    resizeObserver.observe(paneElement);
    resizeObserver.observe(innerElement);
    mutationObserver.observe(innerElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    window.addEventListener('resize', measureLayout);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', measureLayout);
    };
  }, [isMounted, usesMediaPaneLayout, children]);

  // Contained viewport layout with feature image
  if (usesMediaPaneLayout) {
    return (
      <SiteLayout showFooter={false} isContainedView>
        <div className={containerClasses} suppressHydrationWarning>
          <aside className={imagePaneClasses} suppressHydrationWarning>
            {mediaPane ??
              (featureImage ? (
                <div className={styles.featureImageWrap}>
                  <ResponsiveFeatureImage
                    src={featureImage.src}
                    alt={featureImage.alt}
                    title={featureImage.title}
                  />
                </div>
              ) : null)}
          </aside>

          <div
            id='content-scroll-pane'
            className={contentPaneClasses}
            ref={contentPaneRef}
            suppressHydrationWarning
          >
            <div
              ref={contentInnerRef}
              className={`${styles.contentInner} ${
                isShortLandscape ? styles.padShort : styles.padDefault
              } ${
                shouldCenterContainedContent
                  ? styles.justifyCenterLg
                  : styles.justifyStartLg
              } max-width-content`}
            >
              <div
                className={`${styles.innerBlock}${
                  isShortLandscape || !shouldCenterContainedContent
                    ? ''
                    : ` ${styles.innerBlockPad}`
                }`}
              >
                {children}
              </div>
            </div>

            <div className={styles.hideAtLg}>
              <Footer isCompact />
            </div>
          </div>
        </div>

        <div className={styles.showAtLg}>
          <FooterOverlay />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout showFooter={false}>
      <div
        className={`${styles.normalContainer} ${
          isShortLandscape ? styles.padShort : styles.padDefault
        } max-width-content`}
      >
        <div
          className={`${styles.fullWidth} max-width-content`}
          style={{ margin: '0 auto' }}
        >
          {children}
        </div>
      </div>
      <div className={styles.hideAtMd}>
        <Footer isCompact />
      </div>
      <div className={styles.showAtMd}>
        <FooterOverlay />
      </div>
    </SiteLayout>
  );
}
