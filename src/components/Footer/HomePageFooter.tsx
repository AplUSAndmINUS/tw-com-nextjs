'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useSlideInOut } from '@/hooks';
import { useIsMobileLandscape } from '@/hooks/useMediaQuery';
import { FooterContent } from './FooterContent';

/**
 * HomePageFooter — Complex footer for homepage with mobile toggle and desktop always-visible
 *
 * Behavior:
 * - Desktop (lg+): Always visible, no animation
 * - Mobile: Shows "Show Footer" button when hidden, animated slide-in overlay when visible
 * - Mobile Landscape: Hidden (no toggle button) to preserve vertical space
 */
export function HomePageFooter() {
  const { theme } = useAppTheme();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isMobileLandscape = useIsMobileLandscape();

  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: 0.3,
    distance: 100,
  });

  // Mobile hide button (rendered inside footer overlay)
  const mobileHideButton = (
    <div className='lg:hidden flex justify-center py-4 border-b border-gray-300 dark:border-gray-600'>
      <button
        onClick={() => setIsFooterVisible(false)}
        className='px-6 py-2 rounded-lg transition-all font-medium'
        style={{
          border: `2px solid ${theme.semanticColors.border.emphasis}`,
          color: theme.semanticColors.text.primary,
          backgroundColor: 'transparent',
          boxShadow: theme.shadows.button,
          fontFamily: theme.typography.fonts.body.fontFamily,
        }}
        aria-label='Hide footer navigation'
      >
        Hide Footer
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile-only toggle button (when footer is hidden) */}
      {!isFooterVisible && !isMobileLandscape && (
        <div className='lg:hidden flex justify-center py-6'>
          <button
            onClick={() => setIsFooterVisible(true)}
            className='px-6 py-2 rounded-lg transition-all font-medium'
            style={{
              border: `2px solid ${theme.semanticColors.border.emphasis}`,
              color: theme.semanticColors.text.primary,
              backgroundColor: 'transparent',
              boxShadow: theme.shadows.button,
              fontFamily: theme.typography.fonts.body.fontFamily,
            }}
            aria-label='Show footer navigation'
          >
            Show Footer
          </button>
        </div>
      )}

      {/* Desktop footer (always visible, no animation) */}
      <footer
        className='hidden lg:block border-t backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80 border-gray-200 dark:border-gray-700 mt-auto mb-0'
        role='contentinfo'
      >
        <FooterContent isCompact={false} />
      </footer>

      {/* Mobile footer (animated slide in/out) */}
      <AnimatePresence>
        {isFooterVisible && (
          <motion.footer
            {...animationProps}
            id='footer-content'
            className='lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto border-t backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80 border-gray-200 dark:border-gray-700 shadow-2xl'
            role='contentinfo'
          >
            <FooterContent isCompact={false} headerContent={mobileHideButton} />
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  );
}
