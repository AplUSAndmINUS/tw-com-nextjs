'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/content/types';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { LoadingImage } from '@/components/ui/LoadingImage';
import styles from './SmallView.module.scss';

interface SmallViewProps {
  items: ContentItem[];
  baseUrl?: string;
}

export function SmallView({ items, baseUrl = '' }: SmallViewProps) {
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
    <div className={styles.list}>
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
            <div
              className={styles.card}
              style={
                hoveredSlug === item.slug
                  ? { borderColor: theme.semanticColors.link.default }
                  : undefined
              }
            >
              {/* Thumbnail */}
              {item.imageUrl && (
                <div className={styles.thumb}>
                  <LoadingImage
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className={styles.image}
                    sizes='96px'
                  />
                </div>
              )}

              <div className={styles.body}>
                {/* Header: Category and Featured */}
                <div className={styles.headerRow}>
                  {(item.category || item.type) && (
                    <span
                      className={styles.category}
                      style={{
                        backgroundColor: theme.semanticColors.background.muted,
                        color: theme.semanticColors.link.default,
                      }}
                    >
                      {item.category || item.type}
                    </span>
                  )}

                  {item.featured && (
                    <span
                      className={styles.featured}
                      style={{
                        backgroundColor: theme.semanticColors.link.default,
                        color: theme.semanticColors.background.base,
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>

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

                {/* Meta and Tags */}
                <div className={styles.meta}>
                  {/* Date */}
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

                  {/* Author */}
                  {item.author && (
                    <>
                      <span>•</span>
                      <span>{item.author}</span>
                    </>
                  )}

                  {/* Gallery indicator */}
                  {item.gallery && item.gallery.length > 0 && (
                    <>
                      <span>•</span>
                      <span className={styles.galleryCount}>
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
                        {item.gallery.length}
                      </span>
                    </>
                  )}

                  {/* Tags - Limited to 2 */}
                  {item.tags && item.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className={styles.tagGroup}>
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={styles.tag}
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className={styles.tagMore}>
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
