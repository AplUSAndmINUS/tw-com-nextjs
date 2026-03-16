'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

/**
 * AboutHeroCTAs — Theme-aware CTA buttons for the About page Hero.
 * Lives as a client component so it can consume useAppTheme().
 */
export function AboutHeroCTAs() {
  const { theme, isDark } = useAppTheme();
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Link
        href='/contact'
        className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
        style={{
          backgroundColor: primaryHovered
            ? theme.colorBrandBackgroundHover
            : theme.colorBrandBackground,
          color: isDark ? theme.colorNeutralBackground2 : theme.colorNeutralForegroundOnBrand,
          textDecoration: 'none',
          transition: `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
          fontFamily: theme.typography.fonts.body.fontFamily,
          boxShadow: theme.shadows.button,
        }}
        onMouseEnter={() => setPrimaryHovered(true)}
        onMouseLeave={() => setPrimaryHovered(false)}
      >
        Book a Consultation
      </Link>
      <Link
        href='https://fluxline.pro'
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
        style={{
          backgroundColor: secondaryHovered
            ? theme.colorNeutralBackground2Hover
            : 'transparent',
          color: theme.semanticColors.text.primary,
          border: `1px solid ${theme.semanticColors.border.default}`,
          textDecoration: 'none',
          transition: `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}, border-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
          fontFamily: theme.typography.fonts.body.fontFamily,
        }}
        onMouseEnter={() => setSecondaryHovered(true)}
        onMouseLeave={() => setSecondaryHovered(false)}
      >
        Visit Fluxline.pro
      </Link>
    </div>
  );
}
