'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface AboutSectionWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'strong' | 'skills' | 'accent';
  className?: string;
}

/**
 * AboutSectionWrapper - Client wrapper for About page sections
 * Applies theme-aware backgrounds using brand palette tokens.
 * Respects reducedTransparency preference for semi-transparent dark surfaces.
 */
export function AboutSectionWrapper({
  children,
  variant = 'default',
  className = '',
}: AboutSectionWrapperProps) {
  const { theme, themeMode, reducedTransparency } = useAppTheme();

  const isLightFamilyMode =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';

  const accent = theme.palette.themePrimary;

  const styles: Record<
    'default' | 'subtle' | 'strong' | 'skills' | 'accent',
    React.CSSProperties
  > = {
    default: {
      backgroundColor: isLightFamilyMode
        ? theme.semanticColors.background.elevated
        : reducedTransparency
          ? theme.semanticColors.background.elevated
          : 'rgba(0, 0, 0, 0.2)',
      borderLeft: `4px solid ${accent}`,
    },
    subtle: {
      backgroundColor: isLightFamilyMode
        ? theme.semanticColors.background.muted
        : reducedTransparency
          ? theme.semanticColors.background.muted
          : 'rgba(0, 0, 0, 0.1)',
      borderLeft: `4px solid ${theme.semanticColors.border.emphasis}`,
    },
    strong: {
      backgroundColor: isLightFamilyMode
        ? theme.semanticColors.background.base
        : theme.semanticColors.background.elevated,
      boxShadow: theme.shadows.card,
    },
    skills: {
      backgroundColor: isLightFamilyMode
        ? theme.semanticColors.background.muted
        : reducedTransparency
          ? theme.semanticColors.background.muted
          : 'rgba(0, 0, 0, 0.2)',
      borderTop: `1px solid ${theme.semanticColors.border.default}`,
      borderRight: `1px solid ${theme.semanticColors.border.default}`,
      borderBottom: `1px solid ${theme.semanticColors.border.default}`,
      borderLeft: `4px solid ${theme.semanticColors.border.emphasis}`,
    },
    accent: {
      backgroundColor: isLightFamilyMode
        ? theme.semanticColors.background.muted
        : reducedTransparency
          ? theme.semanticColors.background.muted
          : 'rgba(28, 28, 28, 0.2)',
      borderTop: `1px solid ${theme.semanticColors.border.default}`,
      borderRight: `1px solid ${theme.semanticColors.border.default}`,
      borderBottom: `1px solid ${theme.semanticColors.border.default}`,
      borderLeft: `4px solid ${theme.semanticColors.accent.teal}`,
    },
  };

  return (
    <div style={{ borderRadius: '1rem', overflow: 'clip' }}>
      <section className={className} style={styles[variant]}>
        {children}
      </section>
    </div>
  );
}
