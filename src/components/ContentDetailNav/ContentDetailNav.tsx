'use client';

import { ThemedLink } from '@/components/ThemedLink';
import { resolveIconName } from '@/utils/iconResolver';

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
  const ChevronLeftIcon = resolveIconName('ChevronLeft20Regular');
  const ChevronRightIcon = resolveIconName('ChevronRight20Regular');
  const ArrowLeftIcon = resolveIconName('ArrowLeft20Regular');
  return (
    <nav
      aria-label='Content navigation'
      className='flex flex-wrap items-center justify-between gap-4 py-6 mb-8 border-b border-gray-200 dark:border-gray-700'
    >
      {/* Previous Entry */}
      <div className='flex-1 min-w-0'>
        {prevHref ? (
          <ThemedLink
            href={prevHref}
            className='group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all'
            style={{ fontSize: '0.9rem', fontWeight: 500 }}
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
        <ThemedLink
          href={listingPath}
          className='flex-shrink-0 px-4 py-2 rounded-lg border-2 border-blue-500 dark:border-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all'
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          aria-label={`Back to ${listingLabel}`}
        >
          {ArrowLeftIcon && <ArrowLeftIcon style={{ flexShrink: 0 }} />}
          <span className='hidden sm:inline'>Back to {listingLabel}</span>
          <span className='sm:hidden'>{listingLabel}</span>
        </ThemedLink>
      )}

      {/* Next Entry */}
      <div className='flex-1 min-w-0 text-right'>
        {nextHref ? (
          <ThemedLink
            href={nextHref}
            className='group inline-flex items-center justify-end gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all'
            style={{ fontSize: '0.9rem', fontWeight: 500 }}
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
