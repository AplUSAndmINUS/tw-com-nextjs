'use client';

import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';

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

  const accentColor = theme.semanticColors.accent.yellow;

  return (
    <div style={{ borderRadius: '1rem', overflow: 'clip' }}>
      <section
        style={{
          backgroundColor: cardSurfaceColor,
          backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
          border: `1px solid ${theme.semanticColors.border.default}`,
          borderTop: `4px solid ${accentColor}`,
          padding: theme.spacing.l,
        }}
      >
        <Typography
          variant='h3'
          className='text-2xl font-semibold mb-3'
          style={{ color: theme.semanticColors.accent.yellow }}
        >
          Ready to get started?
        </Typography>
        <Typography
          variant='body'
          className='text-gray-600 dark:text-gray-400 mb-6'
        >
          If this service fits where you are right now, we can start with a
          focused consultation and define your next best move.
        </Typography>
        <ThemedLink
          href='/contact'
          className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
          style={{
            backgroundColor: theme.semanticColors.link.default,
            color: theme.semanticColors.background.base,
            boxShadow: theme.shadows.button,
          }}
          onPointerEnter={(e: React.PointerEvent<HTMLAnchorElement>) => {
            if (e.pointerType !== 'mouse') return;
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          }}
          onPointerLeave={(e: React.PointerEvent<HTMLAnchorElement>) => {
            if (e.pointerType !== 'mouse') return;
            (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Book a Consultation
        </ThemedLink>
        &nbsp;&nbsp;&nbsp;
        <ThemedLink
          href='https://fluxline.pro'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
          style={{
            border: `2px solid ${theme.semanticColors.border.emphasis}`,
            color: theme.semanticColors.text.primary,
            backgroundColor: 'transparent',
          }}
          onPointerEnter={(e: React.PointerEvent<HTMLAnchorElement>) => {
            if (e.pointerType === 'mouse')
              (e.currentTarget as HTMLElement).style.opacity = '0.9';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          }}
          onPointerLeave={(e: React.PointerEvent<HTMLAnchorElement>) => {
            if (e.pointerType === 'mouse')
              (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Visit Fluxline.pro
        </ThemedLink>
      </section>
    </div>
  );
};
