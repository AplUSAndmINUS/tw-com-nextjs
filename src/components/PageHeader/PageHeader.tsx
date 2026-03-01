'use client';

import { ReactNode, useMemo } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { resolveIconName } from '@/utils/iconResolver';

interface PageHeaderProps {
  title: string;
  iconName?: string;
  subtitle?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

/**
 * PageHeader
 *
 * Shared top-of-page header with consistent responsive spacing.
 * Mobile is intentionally tighter to reduce large visual gaps.
 *
 * All colors driven by theme.semanticColors tokens—automatically adapts across
 * all 8 theme modes (light, dark, high-contrast, colorblind variants, grayscale).
 * Accent color is deterministic (based on title hash) for consistent visual identity per page.
 */
export function PageHeader({
  title,
  iconName,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  const { theme, themeMode } = useAppTheme();

  const isLightFamilyMode =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';

  const headerSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;

  // Deterministic accent color based on title (consistent per page)
  const accentPalette = useMemo(
    () => [
      theme.semanticColors.link.default,
      theme.semanticColors.link.hover,
      theme.semanticColors.link.visited,
      theme.semanticColors.border.emphasis,
      theme.palette.themePrimary,
      theme.palette.themeSecondary,
    ],
    [theme]
  );

  const accentColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i);
      hash = hash | 0; // Force 32-bit signed int
    }
    return accentPalette[Math.abs(hash) % accentPalette.length];
  }, [title, accentPalette]);

  const headerClasses = [
    'mb-6 md:mb-10 px-6 py-5 md:px-10 md:py-8 rounded-xl',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedTitleClassName = ['text-4xl font-bold', titleClassName]
    .filter(Boolean)
    .join(' ');

  const IconComponent = resolveIconName(iconName);

  return (
    <header
      className={headerClasses}
      style={{
        borderBottom: `1px solid ${theme.semanticColors.border.default}`,
        borderTop: `4px solid ${accentColor}`,
        backgroundColor: headerSurfaceColor,
        background: `linear-gradient(160deg, ${accentColor}14 0%, transparent 100%)`,
        boxShadow: theme.shadows.card,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.s1,
        }}
      >
        {IconComponent && (
          <FluentIcon
            iconName={IconComponent}
            color={accentColor}
            style={{
              width: '3rem',
              height: '3rem',
              fontSize: '3rem',
              display: 'inline-flex',
            }}
          />
        )}
        <Typography
          variant='h2'
          className={resolvedTitleClassName}
          style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
        >
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography
          variant='body'
          className={['mt-3 text-base sm:text-lg md:text-xl', subtitleClassName]
            .filter(Boolean)
            .join(' ')}
          style={{
            color: theme.semanticColors.text.muted,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </header>
  );
}
