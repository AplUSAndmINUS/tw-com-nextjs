'use client';

import { useState } from 'react';
import { ThemedLink } from '@/components/ThemedLink';
import { resolveIconName } from '@/utils/iconResolver';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface ContentDetailNavProps {
  /** URL of the previous entry (undefined if this is the first) */
  prevHref?: string;
  prevTitle?: string;
  /** URL of the next entry (undefined if this is the last) */
  nextHref?: string;
  nextTitle?: string;
  /** URL for the back to listing link (e.g., /blog, /portfolio) */
  listingPath?: string;
  /** Label for the back to listing link (e.g., "Blog", "Portfolio") */
  listingLabel?: string;
}

/**
 * ContentDetailNav — navigation bar for content detail pages.
 * Renders Previous, Next, and Back to Listing links with clear labels.
 */
export function ContentDetailNav({
  prevHref,
  prevTitle,
  nextHref,
  nextTitle,
  listingPath,
  listingLabel,
}: ContentDetailNavProps) {
  const { theme } = useAppTheme();
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const ChevronLeftIcon = resolveIconName('ChevronLeft20Regular');
  const ChevronRightIcon = resolveIconName('ChevronRight20Regular');
  const ArrowLeftIcon = resolveIconName('ArrowLeft20Regular');
  return (
    <nav
      aria-label='Content navigation'
      className='flex flex-wrap items-center justify-between gap-4 py-6 mb-8 border-b border-gray-200 dark:border-gray-700'
    >
      {/* Previous Entry */}
      <div
        className='flex-1 min-w-0'
        onMouseEnter={() => setPrevHovered(true)}
        onMouseLeave={() => setPrevHovered(false)}
      >
        {prevHref ? (
          <ThemedLink
            href={prevHref}
            className='group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-all'
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              ...(prevHovered
                ? {
                    borderColor: theme.semanticColors.link.default,
                    backgroundColor: theme.semanticColors.background.muted,
                  }
                : {}),
            }}
            aria-label={prevTitle ? `Previous: ${prevTitle}` : 'Previous entry'}
          >
            {ChevronLeftIcon && <ChevronLeftIcon style={{ flexShrink: 0 }} />}
            <span className='hidden sm:inline'>Previous</span>
          </ThemedLink>
        ) : (
          <span
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 opacity-50'
            style={{ fontSize: '0.9rem' }}
          >
            {ChevronLeftIcon && <ChevronLeftIcon style={{ flexShrink: 0 }} />}
            <span className='hidden sm:inline'>Previous</span>
          </span>
        )}
      </div>

      {/* Back to Listing */}
      {listingPath && listingLabel && (
        <span
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          className='flex-shrink-0'
        >
          <ThemedLink
            href={listingPath}
            className='px-4 py-2 rounded-lg border-2 transition-all'
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderColor: theme.semanticColors.link.default,
              ...(backHovered
                ? {
                    backgroundColor: theme.semanticColors.link.default,
                    color: theme.semanticColors.background.base,
                  }
                : {}),
            }}
            aria-label={`Back to ${listingLabel}`}
          >
            {ArrowLeftIcon && <ArrowLeftIcon style={{ flexShrink: 0 }} />}
            <span className='hidden sm:inline'>Back to {listingLabel}</span>
            <span className='sm:hidden'>{listingLabel}</span>
          </ThemedLink>
        </span>
      )}

      {/* Next Entry */}
      <div
        className='flex-1 min-w-0 text-right'
        onMouseEnter={() => setNextHovered(true)}
        onMouseLeave={() => setNextHovered(false)}
      >
        {nextHref ? (
          <ThemedLink
            href={nextHref}
            className='group inline-flex items-center justify-end gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-all'
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              ...(nextHovered
                ? {
                    borderColor: theme.semanticColors.link.default,
                    backgroundColor: theme.semanticColors.background.muted,
                  }
                : {}),
            }}
            aria-label={nextTitle ? `Next: ${nextTitle}` : 'Next entry'}
          >
            <span className='hidden sm:inline'>Next</span>
            {ChevronRightIcon && <ChevronRightIcon style={{ flexShrink: 0 }} />}
          </ThemedLink>
        ) : (
          <span
            className='inline-flex items-center justify-end gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 opacity-50'
            style={{ fontSize: '0.9rem' }}
          >
            <span className='hidden sm:inline'>Next</span>
            {ChevronRightIcon && <ChevronRightIcon style={{ flexShrink: 0 }} />}
          </span>
        )}
      </div>
    </nav>
  );
}
