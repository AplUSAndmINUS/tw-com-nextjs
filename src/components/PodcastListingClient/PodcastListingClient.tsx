'use client';

import React, { useState, useMemo } from 'react';
import { PodcastEpisode } from '@/content/types';
import { ViewType } from '@/store';
import { PodcastCard } from '@/components/PodcastCard';
import { TagFilter } from '@/components/TagFilter';
import { ViewSwitcher } from '@/components/ViewSwitcher';

interface PodcastListingClientProps {
  episodes: PodcastEpisode[];
}

export function PodcastListingClient({ episodes }: PodcastListingClientProps) {
  const [viewType, setViewType] = useState<ViewType>('large');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    episodes.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [episodes]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    episodes.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set).sort();
  }, [episodes]);

  const filtered = useMemo(() => {
    return episodes.filter((e) => {
      if (activeTag && !e.tags?.includes(activeTag)) return false;
      if (activeCategory && e.category !== activeCategory) return false;
      return true;
    });
  }, [episodes, activeTag, activeCategory]);

  return (
    <div>
      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex flex-col gap-3 flex-1'>
          {allCategories.length > 0 && (
            <TagFilter
              tags={allCategories}
              activeTag={activeCategory}
              onTagChange={setActiveCategory}
              label='Category'
            />
          )}
          {allTags.length > 0 && (
            <TagFilter
              tags={allTags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
              label='Tags'
            />
          )}
        </div>
        <ViewSwitcher current={viewType} onChange={setViewType} />
      </div>

      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No episodes match the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((episode) => (
            <PodcastCard key={episode.slug} episode={episode} viewType='grid' />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((episode) => (
            <PodcastCard
              key={episode.slug}
              episode={episode}
              viewType={viewType}
            />
          ))}
        </div>
      )}
    </div>
  );
}
