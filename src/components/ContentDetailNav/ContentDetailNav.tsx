'use client';

import { useState } from 'react';
import { ThemedLink } from '@/components/ThemedLink';
import { resolveIconName } from '@/utils/iconResolver';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './ContentDetailNav.module.scss';

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
      className={styles.nav}
    >
      {/* Previous Entry */}
      <div
        className={styles.col}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return;
          setPrevHovered(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          setPrevHovered(false);
        }}
      >
        {prevHref ? (
          <ThemedLink
            href={prevHref}
            hoverScale={1.1}
            invertOnPress
            className={styles.link}
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
            <span className={styles.smInline}>Previous</span>
          </ThemedLink>
        ) : (
          <span
            className={styles.disabled}
            style={{ fontSize: '0.9rem' }}
          >
            {ChevronLeftIcon && <ChevronLeftIcon style={{ flexShrink: 0 }} />}
            <span className={styles.smInline}>Previous</span>
          </span>
        )}
      </div>

      {/* Back to Listing */}
      {listingPath && listingLabel && (
        <span
          onPointerEnter={(e) => {
            if (e.pointerType !== 'mouse') return;
            setBackHovered(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'mouse') return;
            setBackHovered(false);
          }}
          className={styles.backWrap}
        >
          <ThemedLink
            href={listingPath}
            hoverScale={1.1}
            invertOnPress
            className={styles.backLink}
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
            <span className={styles.smInline}>Back to {listingLabel}</span>
            <span className={styles.smHidden}>{listingLabel}</span>
          </ThemedLink>
        </span>
      )}

      {/* Next Entry */}
      <div
        className={`${styles.col} ${styles.textRight}`}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return;
          setNextHovered(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          setNextHovered(false);
        }}
      >
        {nextHref ? (
          <ThemedLink
            href={nextHref}
            hoverScale={1.1}
            invertOnPress
            className={`${styles.link} ${styles.justifyEnd}`}
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
            <span className={styles.smInline}>Next</span>
            {ChevronRightIcon && <ChevronRightIcon style={{ flexShrink: 0 }} />}
          </ThemedLink>
        ) : (
          <span
            className={`${styles.disabled} ${styles.justifyEnd}`}
            style={{ fontSize: '0.9rem' }}
          >
            <span className={styles.smInline}>Next</span>
            {ChevronRightIcon && <ChevronRightIcon style={{ flexShrink: 0 }} />}
          </span>
        )}
      </div>
    </nav>
  );
}
