'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem, ViewType } from '@/content/types';
import { ContentCard } from '@/components/ContentCard';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { TagFilter } from '@/components/TagFilter';

interface BlogListingClientProps {
  posts: ContentItem[];
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const [viewType, setViewType] = useState<ViewType>('large');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeTag && !p.tags?.includes(activeTag)) return false;
      if (activeCategory && p.category !== activeCategory) return false;
      return true;
    });
  }, [posts, activeTag, activeCategory]);

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6'>Blog</h1>

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
          <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} label='Tags' />
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400 py-12 text-center'>
          No posts match the selected filters.
        </p>
      ) : viewType === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((post) => (
            <ContentCard
              key={post.slug}
              item={post}
              href={`/blog/${post.slug}`}
              viewType='grid'
              contentType='Blog'
            />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((post) => (
            <ContentCard
              key={post.slug}
              item={post}
              href={`/blog/${post.slug}`}
              viewType={viewType}
              contentType='Blog'
            />
          ))}
        </div>
      )}
    </div>
  );
}
