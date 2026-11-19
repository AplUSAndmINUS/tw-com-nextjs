'use client';

import { useState, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { usePathname } from 'next/navigation';
import { FooterContent, FooterNewsletter } from './FooterContent';
import styles from './FooterContent.module.scss';

/**
 * HomePageFooter — Footer with glassmorphism styling, always visible inline on all breakpoints.
 *
 * Behavior:
 * - All viewports: Always visible inline as part of the page scroll (no toggle)
 * - Used on the homepage, standard listing pages, and as the mobile footer on detail pages
 * - On detail pages (tablet/desktop), interactive overlay behavior is provided by FooterOverlay
 */
export function HomePageFooter({ isCompact = false }: { isCompact?: boolean }) {
  const { theme, themeMode, reducedTransparency } = useAppTheme();
  const pathname = usePathname() ?? '/';
  const [isMounted, setIsMounted] = useState(false);

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

  return (
    <>
      {/* The newsletter card sits above the footer's top line, on the page
          (owner, 2026-11-19). Only Home keeps the #newsletter anchor. */}
      <div
        className={styles.newsletterAbove}
        style={{
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 0.2s ease-in',
        }}
      >
        <FooterNewsletter isAnchor={pathname === '/'} />
      </div>
      <footer
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
        <FooterContent isCompact={isCompact} showNewsletter={false} />
      </footer>
    </>
  );
}
