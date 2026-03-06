'use client';

import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobileLandscape, useIsTablet } from '@/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';

interface StandardPageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** If true, renders a more compact layout */
  isCompact?: boolean;
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
 *   - All devices: Normal scrolling layout with standard footer at bottom
 *   - Max-width container for optimal reading experience
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
 * - Tablet portrait: 50% image / 50% content (6:6 ratio)
 * - Desktop: 33% image / 67% content (4:8 ratio)
 */
export function StandardPageLayout({
  children,
  featureImage,
}: StandardPageLayoutProps) {
  const pathname = usePathname();
  const { layoutPreference } = useAppTheme();
  const isLeftHanded = layoutPreference === 'left-handed';
  const isMobileLandscape = useIsMobileLandscape();
  const isTablet = useIsTablet();
  const hideFooterToggleButton = pathname === '/contact' && isTablet;

  // Mobile landscape: 3 cols for image, 9 cols for content (mirrored for left-handed)
  // Otherwise: tablet/desktop proportions (50%/33% for image, 50%/67% for content)
  const imagePaneClasses = isMobileLandscape
    ? isLeftHanded
      ? 'md:fixed md:right-0 md:top-16 md:bottom-0 md:w-1/4 xl:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
      : 'md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/4 xl:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
    : isLeftHanded
      ? 'md:fixed md:right-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
      : 'md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden';

  const contentPaneClasses = isMobileLandscape
    ? isLeftHanded
      ? 'flex-1 md:mr-[25%] xl:mr-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'
      : 'flex-1 md:ml-[25%] xl:ml-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'
    : isLeftHanded
      ? 'flex-1 md:mr-[50%] lg:mr-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'
      : 'flex-1 md:ml-[50%] lg:ml-[33.333333%] md:h-full md:overflow-y-auto flex flex-col';

  // Contained viewport layout with feature image
  if (featureImage) {
    return (
      <SiteLayout showFooter={false}>
        {/* Mobile: normal scrolling with standard footer | Tablet/Desktop: contained viewport with overlay footer */}
        <div className='flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] md:overflow-hidden'>
          {/* Feature image pane - fixed and vertically centered on tablet/desktop */}
          {/* Tablet portrait (md): 50% width (6x6) | Tablet landscape+ (lg): 33% width (4x8) */}
          <aside className={imagePaneClasses}>
            <div className='w-full max-w-md h-[33.33vh] md:h-auto px-4 py-6 md:py-0 overflow-hidden'>
              <ResponsiveFeatureImage
                src={featureImage.src}
                alt={featureImage.alt}
                title={featureImage.title}
              />
            </div>
          </aside>

          {/* Content pane - scrollable independently with responsive mirrored margins */}
          {/* Tablet portrait (md): 50% reserve | Tablet landscape+ (lg): 33% reserve */}
          <div id='content-scroll-pane' className={contentPaneClasses}>
            <div className='flex-1 px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8 md:min-h-full md:flex md:flex-col'>
              <div className='md:w-full md:my-auto'>{children}</div>
            </div>

            {/* Mobile: Standard footer always visible (shown only on mobile) */}
            <div className='md:hidden'>
              <Footer isCompact />
            </div>
          </div>
        </div>

        {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
        <div className='hidden md:block'>
          <FooterOverlay hideButton={hideFooterToggleButton} />
        </div>
      </SiteLayout>
    );
  }

  // Standard scrolling layout without feature image
  return (
    <SiteLayout showFooter={true}>
      {/* manually set the maxwidth here because it needs to stretch the same size as the Navigation content (which is outside of this PageLayout) */}
      <div className='mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8 max-width-content'>
        <div className='w-full max-width-content' style={{ margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </SiteLayout>
  );
}
