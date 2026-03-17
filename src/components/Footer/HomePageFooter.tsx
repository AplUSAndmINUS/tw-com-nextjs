'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useSlideInOut } from '@/hooks';
import { useIsMobileLandscape } from '@/hooks/useMediaQuery';
import { FooterContent } from './FooterContent';

/**
 * HomePageFooter — Footer with glassmorphism styling, mobile toggle, and desktop always-visible
 *
 * Behavior:
 * - Desktop (lg+): Always visible, no animation
 * - Mobile: Shows "Show Footer" button when hidden, animated slide-in overlay when visible
 * - Mobile Landscape: Hidden (no toggle button) to preserve vertical space
 */
export function HomePageFooter({ isCompact = false }: { isCompact?: boolean }) {
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
      : 'rgba(255, 255, 255, 0.35)'
    : reducedTransparency
      ? theme.semanticColors.background.elevated
      : 'rgba(10, 10, 10, 0.45)';

  const footerBackdropFilter = reducedTransparency
    ? 'none'
    : 'blur(24px) saturate(180%)';

  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: 0.3,
    distance: 100,
  });

  // Mobile hide button (rendered inside footer overlay)
  const mobileHideButton = (
    <div
      className='lg:hidden flex justify-center py-4'
      style={{
        borderBottom: `1px solid ${theme.semanticColors.border.default}`,
      }}
    >
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
          backdropFilter: footerBackdropFilter,
          WebkitBackdropFilter: footerBackdropFilter,
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 0.2s ease-in',
        }}
      >
        <FooterContent isCompact={isCompact} />
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
              backdropFilter: footerBackdropFilter,
              WebkitBackdropFilter: footerBackdropFilter,
            }}
          >
            <FooterContent
              isCompact={isCompact}
              headerContent={mobileHideButton}
            />
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  );
}
