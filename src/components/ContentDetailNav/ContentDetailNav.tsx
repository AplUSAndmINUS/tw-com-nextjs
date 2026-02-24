import Link from 'next/link';

interface ContentDetailNavProps {
  /** URL of the previous entry (undefined if this is the first) */
  prevHref?: string;
  prevTitle?: string;
  /** URL of the next entry (undefined if this is the last) */
  nextHref?: string;
  nextTitle?: string;
  /** URL of the content hub — defaults to /content-hub */
  hubHref?: string;
}

/**
 * ContentDetailNav — navigation bar for content detail pages.
 * Renders Back (previous), Forward (next), and Content Hub links.
 */
export function ContentDetailNav({
  prevHref,
  prevTitle,
  nextHref,
  nextTitle,
  hubHref = '/content-hub',
}: ContentDetailNavProps) {
  return (
    <nav
      aria-label='Content navigation'
      className='flex flex-wrap items-center justify-between gap-3 py-4 mb-6 border-b border-gray-200 dark:border-gray-700 text-sm'
    >
      {/* Previous */}
      <div className='flex-1 min-w-0'>
        {prevHref ? (
          <Link
            href={prevHref}
            className='group inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            aria-label={prevTitle ? `Previous: ${prevTitle}` : 'Previous'}
          >
            <span aria-hidden='true'>←</span>
            <span className='truncate max-w-[12rem] sm:max-w-xs'>
              {prevTitle ?? 'Previous'}
            </span>
          </Link>
        ) : (
          <span className='text-gray-300 dark:text-gray-600 inline-flex items-center gap-1.5'>
            <span aria-hidden='true'>←</span>
            <span>Previous</span>
          </span>
        )}
      </div>

      {/* Content Hub */}
      <Link
        href={hubHref}
        className='flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors'
      >
        Content Hub
      </Link>

      {/* Next */}
      <div className='flex-1 min-w-0 text-right'>
        {nextHref ? (
          <Link
            href={nextHref}
            className='group inline-flex items-center justify-end gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            aria-label={nextTitle ? `Next: ${nextTitle}` : 'Next'}
          >
            <span className='truncate max-w-[12rem] sm:max-w-xs'>
              {nextTitle ?? 'Next'}
            </span>
            <span aria-hidden='true'>→</span>
          </Link>
        ) : (
          <span className='text-gray-300 dark:text-gray-600 inline-flex items-center justify-end gap-1.5'>
            <span>Next</span>
            <span aria-hidden='true'>→</span>
          </span>
        )}
      </div>
    </nav>
  );
}
