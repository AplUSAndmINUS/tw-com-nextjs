import { ReactNode } from 'react';
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
 */
export function PageHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  const headerClasses = ['mb-6 md:mb-10 border-b pb-4 md:pb-8', className]
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
    <header className={headerClasses}>
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
