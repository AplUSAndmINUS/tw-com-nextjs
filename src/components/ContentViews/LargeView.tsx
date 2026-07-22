'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoadingImage } from '@/components/ui/LoadingImage';
import { ContentItem } from '@/content/types';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './LargeView.module.scss';

interface LargeViewProps {
  items: ContentItem[];
  baseUrl?: string;
}

export function LargeView({ items, baseUrl = '' }: LargeViewProps) {
  const { theme } = useAppTheme();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No content found.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const itemUrl = baseUrl
          ? `${baseUrl}/${item.slug}`
          : `/${item.type}/${item.slug}`;

        return (
          <Link
            key={item.slug}
            href={itemUrl}
            className={styles.cardLink}
            onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHoveredSlug(item.slug); }}
            onPointerLeave={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHoveredSlug(null); }}
          >
            <Card className={styles.cardInner}>
              {/* Large Featured Image */}
              {item.imageUrl && (
                <div className={styles.imageWrap}>
                  <LoadingImage
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className={styles.image}
                    sizes='(max-width: 1024px) 100vw, 50vw'
                    priority={items.indexOf(item) < 2} // Prioritize first two images
                  />

                  {/* Featured Badge (if applicable) */}
                  {item.featured && (
                    <div className={styles.featuredBadge}>
                      <span
                        className={styles.featuredLabel}
                        style={{
                          backgroundColor: theme.semanticColors.link.default,
                          color: theme.semanticColors.background.base,
                        }}
                      >
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.content}>
                {/* Category/Type Badge */}
                {(item.category || item.type) && (
                  <div className={styles.badgeRow}>
                    <span
                      className={styles.badge}
                      style={{
                        backgroundColor: theme.semanticColors.background.muted,
                        color: theme.semanticColors.link.default,
                      }}
                    >
                      {item.category || item.type}
                    </span>
                  </div>
                )}

                {/* Title - Larger */}
                <h2
                  className={styles.title}
                  style={{
                    color:
                      hoveredSlug === item.slug
                        ? theme.semanticColors.link.default
                        : undefined,
                  }}
                >
                  {item.title}
                </h2>

                {/* Excerpt - More visible */}
                {item.excerpt && (
                  <p className={styles.excerpt}>
                    {item.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className={styles.meta}>
                  {item.publishedDate && (
                    <time dateTime={item.publishedDate} className={styles.metaEmphasis}>
                      {new Date(item.publishedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </time>
                  )}

                  {item.author && (
                    <>
                      <span>•</span>
                      <span className={styles.metaEmphasis}>{item.author}</span>
                    </>
                  )}
                </div>

                {/* Tags - Full visibility */}
                {item.tags && item.tags.length > 0 && (
                  <div className={styles.tags}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={styles.tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Gallery Indicator */}
                {item.gallery && item.gallery.length > 0 && (
                  <div className={styles.galleryIndicator}>
                    <div className={styles.galleryInner}>
                      <svg
                        className={styles.galleryIcon}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      <span>
                        {item.gallery.length} image
                        {item.gallery.length !== 1 ? 's' : ''} in gallery
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
