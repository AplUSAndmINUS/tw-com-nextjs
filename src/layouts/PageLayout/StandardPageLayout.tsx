'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteLayout } from '@/layouts/SiteLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { FooterContent } from '@/components/Footer/FooterContent';
import { Footer } from '@/components/Footer';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useSlideInOut, useIsMobile } from '@/hooks';

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
 * Behavior:
 * - With featureImage: Contained viewport (Fluxline.pro style)
 *   - Mobile: Normal scrolling
 *   - Tablet/Desktop: Contained viewport, left image centered, right content scrollable
 *   - Footer: Overlay with show/hide button on all viewport sizes
 * - Without featureImage: Normal scrolling layout
 */
export function StandardPageLayout({
  children,
  featureImage,
}: StandardPageLayoutProps) {
  const { theme } = useAppTheme();
  const isMobile = useIsMobile();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: 0.3,
    distance: 100,
  });

  // Contained viewport layout with feature image
  if (featureImage) {
    return (
      <SiteLayout isContainedView={!isMobile}>
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

            {/* Mobile: Standard footer always visible */}
            {isMobile && <Footer isCompact />}
          </div>
        </div>

        {/* Tablet/Desktop: Fixed Show Footer button at bottom center */}
        {!isMobile && (
          <AnimatePresence>
            {!isFooterVisible && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onMouseEnter={() => setIsFooterVisible(true)}
                className='hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-2 rounded-lg transition-all font-medium items-center justify-center'
                style={{
                  border: `2px solid ${theme.semanticColors.border.emphasis}`,
                  color: theme.semanticColors.text.primary,
                  backgroundColor: theme.semanticColors.background.base,
                  boxShadow: theme.shadows.button,
                  fontFamily: theme.typography.fonts.body.fontFamily,
                }}
                aria-label='Show footer navigation'
              >
                Show Footer
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* Tablet/Desktop: Animated footer overlay */}
        {!isMobile && (
          <AnimatePresence>
            {isFooterVisible && (
              <motion.footer
                {...animationProps}
                onMouseLeave={() => setIsFooterVisible(false)}
                id='footer-content'
                className='fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto border-t backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80 border-gray-200 dark:border-gray-700 shadow-2xl'
                role='contentinfo'
              >
                <FooterContent isCompact={false} />
              </motion.footer>
            )}
          </AnimatePresence>
        )}
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
