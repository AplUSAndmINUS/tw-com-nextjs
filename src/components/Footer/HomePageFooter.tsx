'use client';

import { useState, useEffect } from 'react';
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
  const { theme, themeMode, reducedTransparency } = useAppTheme();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobileLandscape = useIsMobileLandscape();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accentColor = theme.palette.themePrimary;
  const isLightFamily =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';

  const footerBorderTop = isLightFamily
    ? `1px solid ${theme.semanticColors.border.default}`
    : `4px solid ${accentColor}`;

  const footerBg = isLightFamily
    ? reducedTransparency
      ? theme.semanticColors.background.muted
      : 'rgba(248, 248, 248, 0.78)'
    : reducedTransparency
      ? theme.semanticColors.background.elevated
      : 'rgba(18, 18, 18, 0.85)';

  const footerBackdropFilter = reducedTransparency
    ? 'none'
    : 'blur(20px) saturate(200%)';

  const footerGradient =
    isLightFamily && !reducedTransparency
      ? `linear-gradient(160deg, ${accentColor}18 0%, transparent 48%)`
      : 'none';

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
        className='hidden lg:block mt-auto mb-0'
        role='contentinfo'
        style={{
          borderTop: footerBorderTop,
          backgroundColor: footerBg,
          backgroundImage: footerGradient,
          backdropFilter: footerBackdropFilter,
          WebkitBackdropFilter: footerBackdropFilter,
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 0.2s ease-in',
        }}
      >
        <FooterContent isCompact={false} />
      </footer>

      {/* Mobile footer (animated slide in/out) */}
      <AnimatePresence>
        {isFooterVisible && (
          <motion.footer
            {...animationProps}
            id='footer-content'
            className='lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto shadow-2xl'
            role='contentinfo'
            style={{
              borderTop: footerBorderTop,
              backgroundColor: footerBg,
              backgroundImage: footerGradient,
              backdropFilter: footerBackdropFilter,
              WebkitBackdropFilter: footerBackdropFilter,
            }}
          >
            <FooterContent isCompact={false} headerContent={mobileHideButton} />
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  );
}
