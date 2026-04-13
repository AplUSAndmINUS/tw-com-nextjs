'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';
import {
  useIsMobileLandscape,
  useIsTablet,
  useIsShortLandscape,
} from '@/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';
import {
  useFeatureImageLayout,
  type FeatureImageLayoutOptions,
} from '@/hooks/useFeatureImageLayout';

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
  const pathname = usePathname();
  const isMobileLandscapeHook = useIsMobileLandscape();
  const isTabletHook = useIsTablet();
  const isShortLandscapeHook = useIsShortLandscape();

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isMobileLandscape = isMounted ? isMobileLandscapeHook : false;
  const isTablet = isMounted ? isTabletHook : false;
  const isShortLandscape = isMounted ? isShortLandscapeHook : false;
  const hideFooterToggleButton = pathname === '/contact' && isTablet;
  const usesMediaPaneLayout =
    hasMediaPane || Boolean(featureImage || mediaPane);
  const { containerClasses, contentPaneClasses, imagePaneClasses } =
    useFeatureImageLayout({
      // Mobile landscape: split activates at md (768 px) with a xl step-up.
      // All other views: split activates at lg (1024 px).
      breakpoint: isMobileLandscape ? 'md' : 'lg',
      paneSizeClasses: isMobileLandscape ? 'md:w-1/4 xl:w-1/3' : undefined,
      contentRightOffsetClasses: isMobileLandscape
        ? 'md:mr-[25%] xl:mr-[33.333333%]'
        : undefined,
      contentLeftOffsetClasses: isMobileLandscape
        ? 'md:ml-[25%] xl:ml-[33.333333%]'
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
                <div className='w-full max-w-md h-[33.33vh] lg:h-auto px-4 py-6 lg:py-0 overflow-hidden'>
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
              className={`flex-1 px-4 sm:px-6 lg:px-8 pt-0 lg:min-h-full lg:flex lg:flex-col max-width-content${
                isShortLandscape ? ' pb-4 md:py-4' : ' pb-8 md:py-8'
              }${shouldCenterContainedContent ? ' lg:justify-center' : ' lg:justify-start'}`}
            >
              <div
                className={`lg:w-full${
                  isShortLandscape || !shouldCenterContainedContent
                    ? ''
                    : ' lg:pb-12'
                }`}
              >
                {children}
              </div>
            </div>

            <div className='lg:hidden'>
              <Footer isCompact />
            </div>
          </div>
        </div>

        <div className='hidden lg:block'>
          <FooterOverlay hideButton={hideFooterToggleButton} />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout showFooter={false}>
      <div
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 max-width-content${isShortLandscape ? ' pb-4 md:py-4' : ' pb-8 md:py-8'}`}
      >
        <div className='w-full max-width-content' style={{ margin: '0 auto' }}>
          {children}
        </div>
      </div>
      <div className='md:hidden'>
        <Footer isCompact />
      </div>
      <div className='hidden md:block'>
        <FooterOverlay />
      </div>
    </SiteLayout>
  );
}
