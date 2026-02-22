'use client';

import React, { useState, useMemo } from 'react';
import { PodcastEpisode } from '@/content/types';
import { PodcastCard } from '@/components/PodcastCard';
import { TagFilter } from '@/components/TagFilter';

interface PodcastListingClientProps {
  episodes: PodcastEpisode[];
}

export function PodcastListingClient({ episodes }: PodcastListingClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    episodes.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [episodes]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    episodes.forEach((e) => { if (e.category) set.add(e.category); });
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
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Podcasts</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Listen to episodes on technology, creativity, personal growth, and the human experience.
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-3 mb-8'>
        {allCategories.length > 0 && (
          <TagFilter
            tags={allCategories}
            activeTag={activeCategory}
            onTagChange={setActiveCategory}
            label='Category'
          />
        )}
        {allTags.length > 0 && (
          <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} label='Tags' />
        )}
      </div>

      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No episodes match the selected filters.
        </p>
      ) : (
        <div>
          {filtered.map((episode) => (
            <PodcastCard key={episode.slug} episode={episode} />
          ))}
        </div>
      )}
    </div>
  );
}
