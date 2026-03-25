'use client';

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
        <div className='flex flex-wrap gap-4'>
          <ThemedLink
            href='/contact'
            hoverScale={1.05}
            className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
            style={{
              backgroundColor: theme.semanticColors.link.default,
              color: theme.semanticColors.background.base,
              boxShadow: theme.shadows.button,
            }}
          >
            Book a Consultation
          </ThemedLink>
          <ThemedLink
            href='https://fluxline.pro'
            target='_blank'
            rel='noopener noreferrer'
            hoverScale={1.05}
            className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg'
            style={{
              border: `2px solid ${theme.semanticColors.border.emphasis}`,
              color: theme.semanticColors.text.primary,
              backgroundColor: 'transparent',
            }}
          >
            Visit Fluxline.pro
          </ThemedLink>
        </div>
      </section>
    </div>
  );
};
