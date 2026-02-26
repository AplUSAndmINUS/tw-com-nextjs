import { ThemedLink } from '@/components/ThemedLink';

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
      className='flex flex-wrap items-center justify-between gap-4 py-6 mb-8 border-b border-gray-200 dark:border-gray-700'
    >
      {/* Previous */}
      <div className='flex-1 min-w-0'>
        {prevHref ? (
          <ThemedLink
            href={prevHref}
            className='group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all'
            style={{ fontSize: '1rem', fontWeight: 500 }}
            aria-label={prevTitle ? `Previous: ${prevTitle}` : 'Previous'}
          >
            <span aria-hidden='true' style={{ fontSize: '1.25rem' }}>
              ←
            </span>
            <span className='truncate max-w-[10rem] sm:max-w-xs'>
              {prevTitle ?? 'Previous'}
            </span>
          </ThemedLink>
        ) : (
          <span
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
            style={{ fontSize: '1rem' }}
          >
            <span aria-hidden='true' style={{ fontSize: '1.25rem' }}>
              ←
            </span>
            <span>Previous</span>
          </span>
        )}
      </div>

      {/* Content Hub */}
      <ThemedLink
        href={hubHref}
        className='flex-shrink-0 px-5 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all'
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Content Hub
      </ThemedLink>

      {/* Next */}
      <div className='flex-1 min-w-0 text-right'>
        {nextHref ? (
          <ThemedLink
            href={nextHref}
            className='group inline-flex items-center justify-end gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all'
            style={{ fontSize: '1rem', fontWeight: 500 }}
            aria-label={nextTitle ? `Next: ${nextTitle}` : 'Next'}
          >
            <span className='truncate max-w-[10rem] sm:max-w-xs'>
              {nextTitle ?? 'Next'}
            </span>
            <span aria-hidden='true' style={{ fontSize: '1.25rem' }}>
              →
            </span>
          </ThemedLink>
        ) : (
          <span
            className='inline-flex items-center justify-end gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
            style={{ fontSize: '1rem' }}
          >
            <span>Next</span>
            <span aria-hidden='true' style={{ fontSize: '1.25rem' }}>
              →
            </span>
          </span>
        )}
      </div>
    </nav>
  );
}
