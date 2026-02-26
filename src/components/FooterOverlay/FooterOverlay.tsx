'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FooterContent } from '@/components/Footer/FooterContent';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useSlideInOut } from '@/hooks';

/**
 * FooterOverlay — Client component for interactive footer overlay
 *
 * Used on tablet/desktop viewports for hover-triggered footer display.
 * Separated from StandardPageLayout to keep the layout server-rendered.
 */
export function FooterOverlay() {
  const { theme } = useAppTheme();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: 0.3,
    distance: 100,
  });

  return (
    <>
      {/* Show Footer button - hidden when footer is visible */}
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

      {/* Animated footer overlay */}
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
    </>
  );
}
