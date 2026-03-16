'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export const ConsultationCTA: React.FC = () => {
  const { theme, isDark } = useAppTheme();

  const isLightFamilyMode =
    theme.themeMode === 'light' ||
    theme.themeMode === 'protanopia' ||
    theme.themeMode === 'deuteranopia' ||
    theme.themeMode === 'tritanopia' ||
    theme.themeMode === 'grayscale';

  const cardSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;

  const accentColor = theme.palette.themePrimary;
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <section
      style={{
        backgroundColor: cardSurfaceColor,
        backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
        borderRadius: theme.borderRadius.container.medium,
        border: `1px solid ${theme.semanticColors.border.default}`,
        borderTop: `4px solid ${accentColor}`,
        padding: theme.spacing.l,
      }}
    >
      <Typography variant='h2' className='text-2xl font-semibold mb-3'>
        Ready to get started?
      </Typography>
      <Typography
        variant='body'
        className='text-gray-600 dark:text-gray-400 mb-6 max-w-xl'
      >
        If this service fits where you are right now, we can start with a
        focused consultation and define your next best move.
      </Typography>
      <Link
        href='/contact'
        className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
        style={{
          backgroundColor: buttonHovered
            ? theme.colorBrandBackgroundHover
            : theme.colorBrandBackground,
          color: isDark
            ? theme.colorNeutralBackground2
            : theme.colorNeutralForegroundOnBrand,
          textDecoration: 'none',
          transition: `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
          fontFamily: theme.typography.fonts.body.fontFamily,
          boxShadow: theme.shadows.button,  
        }}
        onMouseEnter={(e) => {
          setButtonHovered(true);
          (e.currentTarget as HTMLElement).style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          setButtonHovered(false);
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }}
      >
        Book a consultation
      </Link>
    </section>
  );
};
