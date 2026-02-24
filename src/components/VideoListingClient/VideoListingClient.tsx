'use client';

import React, { useState, useMemo } from 'react';
import { VideoItem, ViewType } from '@/content/types';
import { VideoCard } from '@/components/VideoCard';
import { TagFilter } from '@/components/TagFilter';
import { ViewSwitcher } from '@/components/ViewSwitcher';

interface VideoListingClientProps {
  videos: VideoItem[];
}

export function VideoListingClient({ videos }: VideoListingClientProps) {
  const [viewType, setViewType] = useState<ViewType>('grid');
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
            <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} label='Tags' />
          )}
        </div>
        <ViewSwitcher current={viewType} onChange={setViewType} />
      </div>

      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No videos match the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} viewType='grid' />
          ))}
        </div>
      ) : viewType === 'large' ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} viewType='large' />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} viewType='small' />
          ))}
        </div>
      )}
    </div>
  );
}
