'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem, ViewType } from '@/content/types';
import { ContentCard } from '@/components/ContentCard';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { TagFilter } from '@/components/TagFilter';

export interface UnifiedContentEntry extends ContentItem {
  contentType: string;
  href: string;
}

interface UnifiedContentClientProps {
  entries: UnifiedContentEntry[];
}

export function UnifiedContentClient({ entries }: UnifiedContentClientProps) {
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
    [filtered],
  );

  return (
    <div className='max-w-7xl mx-auto px-4 py-12'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Content Hub</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Explore all content — blog posts, portfolio work, and case studies in one place.
        </p>
      </div>

      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        {/* Type filter — derived from actual content types */}
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setActiveType(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              activeType === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {allContentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type === activeType ? null : type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <ViewSwitcher current={viewType} onChange={setViewType} />
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className='mb-6'>
          <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} label='Tags' />
        </div>
      )}

      {/* Featured section */}
      {featuredEntries.length > 0 && !activeTag && !activeType && (
        <section className='mb-12'>
          <h2 className='text-xl font-semibold mb-4'>Featured</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
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
          <hr className='my-8 border-gray-200 dark:border-gray-700' />
        </section>
      )}

      {/* All content */}
      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No content matches the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
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
