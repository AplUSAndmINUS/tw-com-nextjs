'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoadingImage } from '@/components/ui/LoadingImage';
import { ContentItem } from '@/content/types';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './GridView.module.scss';

interface GridViewProps {
  items: ContentItem[];
  baseUrl?: string; // Base URL for linking (e.g., '/blog', '/portfolio')
}

export function GridView({ items, baseUrl = '' }: GridViewProps) {
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
              {item.imageUrl && (
                <div className={styles.imageWrap}>
                  <LoadingImage
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className={styles.image}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
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

                {/* Title */}
                <h3
                  className={styles.title}
                  style={{
                    color:
                      hoveredSlug === item.slug
                        ? theme.semanticColors.link.default
                        : undefined,
                  }}
                >
                  {item.title}
                </h3>

                {/* Excerpt */}
                {item.excerpt && (
                  <p className={styles.excerpt}>
                    {item.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className={styles.meta}>
                  {item.publishedDate && (
                    <time dateTime={item.publishedDate}>
                      {new Date(item.publishedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </time>
                  )}

                  {item.author && (
                    <>
                      <span>•</span>
                      <span>{item.author}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className={styles.tags}>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={styles.tag}
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className={styles.tagMore}>
                        +{item.tags.length - 3} more
                      </span>
                    )}
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
