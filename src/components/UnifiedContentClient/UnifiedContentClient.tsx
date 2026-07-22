'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem } from '@/content/types';
import { ViewType } from '@/store';
import { ContentCard } from '@/components/ContentCard';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { TagFilter } from '@/components/TagFilter';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './UnifiedContentClient.module.scss';

export interface UnifiedContentEntry extends ContentItem {
  contentType: string;
  href: string;
}

interface UnifiedContentClientProps {
  entries: UnifiedContentEntry[];
}

export function UnifiedContentClient({ entries }: UnifiedContentClientProps) {
  const { theme } = useAppTheme();
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  const allContentTypes = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(e.contentType));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (activeTag && !e.tags?.includes(activeTag)) return false;
      if (activeType && e.contentType !== activeType) return false;
      return true;
    });
  }, [entries, activeTag, activeType]);

  const featuredEntries = useMemo(
    () => filtered.filter((e) => e.featured),
    [filtered]
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Content Hub</h1>
        <p className={styles.subtitle}>
          Explore all content — blog posts, portfolio work, and case studies in
          one place.
        </p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Type filter — derived from actual content types */}
        <div className={styles.typeFilter}>
          <button
            onClick={() => setActiveType(null)}
            className={styles.chip}
            style={
              activeType === null
                ? {
                    backgroundColor: theme.semanticColors.link.default,
                    color: theme.semanticColors.background.base,
                  }
                : undefined
            }
          >
            All
          </button>
          {allContentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type === activeType ? null : type)}
              className={styles.chip}
              style={
                activeType === type
                  ? {
                      backgroundColor: theme.semanticColors.link.default,
                      color: theme.semanticColors.background.base,
                    }
                  : undefined
              }
            >
              {type}
            </button>
          ))}
        </div>
        <ViewSwitcher current={viewType} onChange={setViewType} />
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className={styles.tagSection}>
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            label='Tags'
          />
        </div>
      )}

      {/* Featured section */}
      {featuredEntries.length > 0 && !activeTag && !activeType && (
        <section className={styles.featuredSection}>
          <h2 className={styles.featuredHeading}>Featured</h2>
          <div className={styles.featuredGrid}>
            {featuredEntries.map((entry) => (
              <ContentCard
                key={`${entry.contentType}-${entry.slug}`}
                item={entry}
                href={entry.href}
                viewType='grid'
                contentType={entry.contentType}
              />
            ))}
          </div>
          <hr className={styles.divider} />
        </section>
      )}

      {/* All content */}
      {filtered.length === 0 ? (
        <p className={styles.emptyText}>
          No content matches the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className={styles.grid}>
          {filtered.map((entry) => (
            <ContentCard
              key={`${entry.contentType}-${entry.slug}`}
              item={entry}
              href={entry.href}
              viewType='grid'
              contentType={entry.contentType}
            />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((entry) => (
            <ContentCard
              key={`${entry.contentType}-${entry.slug}`}
              item={entry}
              href={entry.href}
              viewType={viewType}
              contentType={entry.contentType}
            />
          ))}
        </div>
      )}
    </div>
  );
}
