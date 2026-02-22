'use client';

import React, { useState, useMemo } from 'react';
import { VideoItem } from '@/content/types';
import { VideoCard } from '@/components/VideoCard';
import { TagFilter } from '@/components/TagFilter';

interface VideoListingClientProps {
  videos: VideoItem[];
}

export function VideoListingClient({ videos }: VideoListingClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => v.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [videos]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => { if (v.category) set.add(v.category); });
    return Array.from(set).sort();
  }, [videos]);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (activeTag && !v.tags?.includes(activeTag)) return false;
      if (activeCategory && v.category !== activeCategory) return false;
      return true;
    });
  }, [videos, activeTag, activeCategory]);

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Videos</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Watch videos from Terence Waters on technology, creativity, and personal development.
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
          No videos match the selected filters.
        </p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
