'use client';

import { useState, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FooterContent } from './FooterContent';

interface StandardFooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
}

/**
 * StandardFooter — Simple always-visible footer for non-homepage pages
 */
export function StandardFooter({ isCompact = false }: StandardFooterProps) {
  const { theme, themeMode, reducedTransparency } = useAppTheme();
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

  // Dark mode: accent top border to match Hero treatment
  // Light mode: subtle 1px default border
  const footerBorderTop = isLightFamily
    ? `1px solid ${theme.semanticColors.border.default}`
    : `4px solid ${accentColor}`;

  // Light mode: frost glass with gradient when transparency enabled; opaque otherwise
  // Dark mode: semi-transparent dark blur when transparency enabled; opaque otherwise
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

  // Diagonal brand gradient — light mode only, transparency enabled
  const footerGradient =
    isLightFamily && !reducedTransparency
      ? `linear-gradient(160deg, ${accentColor}18 0%, transparent 48%)`
      : 'none';

  return (
    <footer
      className='mt-auto mb-0'
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
      <FooterContent isCompact={isCompact} />
    </footer>
  );
}
