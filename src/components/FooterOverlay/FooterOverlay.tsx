'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FooterContent } from '@/components/Footer/FooterContent';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useSlideInOut } from '@/hooks';

interface FooterOverlayProps {
  /** If true, hides the "Show Footer" button (e.g., on article pages where footer should not overlay content) */
  hideButton?: boolean;
  /** If true, the footer is always visible on desktop — no show/hide toggle (used on homepage) */
  alwaysVisible?: boolean;
}

/**
 * FooterOverlay — Client component for interactive footer overlay
 *
 * Used on tablet/desktop viewports for hover-triggered footer display.
 * Separated from StandardPageLayout to keep the layout server-rendered.
 */
export function FooterOverlay({
  hideButton = false,
  alwaysVisible = false,
}: FooterOverlayProps) {
  const { theme, themeMode, reducedTransparency } = useAppTheme();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: 0.3,
    distance: 100,
  });

  useEffect(() => {
    setIsMounted(true);
    if (alwaysVisible) setIsFooterVisible(true);
  }, [alwaysVisible]);

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

  if (!isMounted) return null;

  return (
    <>
      {/* Show Footer button - hidden when footer is visible or when hideButton is true */}
      <AnimatePresence>
        {!hideButton && !isFooterVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return;
              setIsFooterVisible(true);
            }}
            onClick={() => setIsFooterVisible(true)}
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
          <>
            {/* Transparent backdrop — dismisses footer on click or touch outside (not shown when alwaysVisible) */}
            {!alwaysVisible && (
              <div
                className='fixed inset-0 z-[49]'
                aria-hidden='true'
                onClick={() => setIsFooterVisible(false)}
                onTouchStart={() => setIsFooterVisible(false)}
              />
            )}
            <motion.footer
              {...animationProps}
              onPointerLeave={(e) => {
                if (alwaysVisible) return;
                if (e.pointerType !== 'mouse') return;
                setIsFooterVisible(false);
              }}
              id='footer-content'
              className='fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto shadow-2xl'
              role='contentinfo'
              style={{
                borderTop: footerBorderTop,
                backgroundColor: footerBg,
                backdropFilter: footerBackdropFilter,
                WebkitBackdropFilter: footerBackdropFilter,
              }}
            >
              <FooterContent isCompact={false} />
            </motion.footer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
