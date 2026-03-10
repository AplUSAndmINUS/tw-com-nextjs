'use client';

import Link from 'next/link';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';

export const ConsultationCTA: React.FC = () => {
  const { theme } = useAppTheme();

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
        style={{
          color: theme.semanticColors.text.muted,
        }}
      >
        If this service fits where you are right now, we can start with a
        focused consultation and define your next best move.
      </Typography>
      <ThemedLink
        href='/contact'
        style={{
          display: 'inline-block',
          padding: `${theme.spacing.m}`,
          backgroundColor: accentColor,
          color: theme.semanticColors.background.base,
          borderRadius: theme.borderRadius.container.small,
          fontWeight: 500,
          transition: 'opacity 0.2s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }}
      >
        Book a consultation
      </ThemedLink>
    </section>
  );
};
