'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem } from '@/content/types';
import { ViewType } from '@/store';
import { ContentCard } from '@/components/ContentCard';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { TagFilter } from '@/components/TagFilter';

interface PortfolioListingClientProps {
  entries: ContentItem[];
}

export function PortfolioListingClient({
  entries,
}: PortfolioListingClientProps) {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (activeTag && !e.tags?.includes(activeTag)) return false;
      if (activeCategory && e.category !== activeCategory) return false;
      return true;
    });
  }, [entries, activeTag, activeCategory]);

  return (
    <div className='mx-auto px-4 py-12 max-width-content'>
      <h1 className='text-4xl font-bold mb-6'>Portfolio</h1>

      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex flex-wrap gap-4'>
          {allCategories.length > 0 && (
            <TagFilter
              tags={allCategories}
              activeTag={activeCategory}
              onTagChange={setActiveCategory}
              label='Category'
            />
          )}
        </div>
        <ViewSwitcher current={viewType} onChange={setViewType} />
      </div>

      {allTags.length > 0 && (
        <div className='mb-6'>
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            label='Tags'
          />
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No entries match the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((entry) => (
            <ContentCard
              key={entry.slug}
              item={entry}
              href={`/portfolio/${entry.slug}`}
              viewType='grid'
              contentType='Portfolio'
            />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((entry) => (
            <ContentCard
              key={entry.slug}
              item={entry}
              href={`/portfolio/${entry.slug}`}
              viewType={viewType}
              contentType='Portfolio'
            />
          ))}
        </div>
      )}
    </div>
  );
}
