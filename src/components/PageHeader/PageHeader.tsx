'use client';

import { ReactNode, useMemo } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';

interface PageHeaderProps {
  title: string;
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
 * Accent color is determined by title hash—same page always gets the same accent.
 * Text colors remain unchanged across all theme modes.
 */
export function PageHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  const { theme } = useAppTheme();

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
      hash = hash & hash;
    }
    return accentPalette[Math.abs(hash) % accentPalette.length];
  }, [title, accentPalette]);

  const headerClasses = ['mb-6 md:mb-10 pb-4 md:pb-8', className]
    .filter(Boolean)
    .join(' ');

  const resolvedTitleClassName = ['text-4xl font-bold', titleClassName]
    .filter(Boolean)
    .join(' ');

  const resolvedSubtitleClassName = [
    'mt-3 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400',
    subtitleClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header
      className={headerClasses}
      style={{
        borderBottom: `1px solid ${theme.semanticColors.border.default}`,
        borderTop: `4px solid ${accentColor}`,
        background: `linear-gradient(160deg, ${accentColor}14 0%, transparent 100%)`,
      }}
    >
      <Typography variant='h1' className={resolvedTitleClassName}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant='body' className={resolvedSubtitleClassName}>
          {subtitle}
        </Typography>
      )}
    </header>
  );
}
