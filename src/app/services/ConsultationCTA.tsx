'use client';

import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';
import { BookingsButton } from '@/components/BookingsButton/BookingsButton';
import { accentWash } from '@/utils/color';
import styles from './ConsultationCTA.module.scss';

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
          backgroundImage: accentWash(accentColor, 8),
          border: `1px solid ${theme.semanticColors.border.default}`,
          borderTop: `4px solid ${accentColor}`,
          padding: theme.spacing.l,
        }}
      >
        <Typography
          variant='h3'
          className={styles.heading}
          style={{ color: theme.semanticColors.accent.yellow }}
        >
          Ready to get started?
        </Typography>
        <Typography variant='body' className={styles.body}>
          If this service fits where you are right now, we can start with a
          focused consultation and define your next best move.
        </Typography>
        <div className={styles.actions}>
          <BookingsButton isHero />
          <ThemedLink
            href='https://fluxline.pro'
            target='_blank'
            rel='noopener noreferrer'
            hoverScale={1.05}
            className={styles.fluxlineLink}
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
