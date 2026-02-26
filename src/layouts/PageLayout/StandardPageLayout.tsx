import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';

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
 * StandardPageLayout — Server component for standard (non-homepage) pages
 *
 * Behavior:
 * - With featureImage: Contained viewport (Fluxline.pro style)
 *   - Mobile: Normal scrolling with standard footer
 *   - Tablet/Desktop: Contained viewport, left image centered, right content scrollable
 *   - Footer: Overlay with show/hide button (client component) on tablet/desktop only
 * - Without featureImage: Normal scrolling layout
 *
 * Performance: Layout structure is server-rendered. Interactive footer overlay
 * is a separate client component, minimizing JavaScript bundle size.
 */
export function StandardPageLayout({
  children,
  featureImage,
}: StandardPageLayoutProps) {
  // Contained viewport layout with feature image
  if (featureImage) {
    return (
      <SiteLayout>
        {/* Mobile: normal scrolling with standard footer | Tablet/Desktop: contained viewport with overlay footer */}
        <div className='h-full flex flex-col md:flex-row md:overflow-hidden'>
          {/* Left image pane - fixed and vertically centered on tablet/desktop */}
          {/* Tablet portrait (md): 50% width (6x6) | Tablet landscape+ (lg): 33% width (4x8) */}
          <aside className='md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'>
            <div className='w-full max-w-md px-4 py-6 md:py-0'>
              <ResponsiveFeatureImage
                src={featureImage.src}
                alt={featureImage.alt}
                title={featureImage.title}
              />
            </div>
          </aside>

          {/* Right content pane - scrollable independently with responsive margins */}
          {/* Tablet portrait (md): 50% left margin | Tablet landscape+ (lg): 33% left margin */}
          <div className='flex-1 md:ml-[50%] lg:ml-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'>
            <div className='flex-1 px-4 sm:px-6 lg:px-8 py-8'>{children}</div>

            {/* Mobile: Standard footer always visible (shown only on mobile) */}
            <div className='md:hidden'>
              <Footer isCompact />
            </div>
          </div>
        </div>

        {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
        <div className='hidden md:block'>
          <FooterOverlay />
        </div>
      </SiteLayout>
    );
  }

  // Standard scrolling layout without feature image
  return (
    <SiteLayout>
      {/* manually set the maxwidth here because it needs to stretch the same size as the Navigation content (which is outside of this PageLayout) */}
      <div className='mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 max-width-content'>
        <div className='w-full max-width-content' style={{ margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </SiteLayout>
  );
}
