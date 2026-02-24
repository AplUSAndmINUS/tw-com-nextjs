'use client';

import { useState, useMemo, useEffect } from 'react';
import { ContentItem, ViewType } from '@/content/types';
import { GridView, LargeView, SmallView } from '@/components/ContentViews';

interface ContentHubClientProps {
  allContent: ContentItem[];
}

type SortOption = 'date-desc' | 'date-asc' | 'title';

export function ContentHubClient({ allContent }: ContentHubClientProps) {
  // View type state (persisted in localStorage)
  const [viewType, setViewType] = useState<ViewType>('grid');

  // Filter states
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Load view preference from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedView = localStorage.getItem(
        'contentHubView'
      ) as ViewType | null;
      if (savedView && ['grid', 'large', 'small'].includes(savedView)) {
        setViewType(savedView);
      }
    } catch (error) {
      // Silently fail if localStorage is not available, use default 'grid' view
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('contentHubView', view);
      } catch (error) {
        // Silently fail if localStorage is not available
      }
    }
  };

  // Get unique content types
  const contentTypes = useMemo(() => {
    const types = new Set(allContent.map((item) => item.type));
    return ['all', ...Array.from(types).sort()];
  }, [allContent]);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allContent.forEach((item) => {
      item.tags?.forEach((tag) => tags.add(tag));
    });
    return ['all', ...Array.from(tags).sort()];
  }, [allContent]);

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let result = [...allContent];

    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter((item) => item.type === selectedType);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      result = result.filter((item) => item.tags?.includes(selectedTag));
    }

    // Filter by date range
    if (dateFrom) {
      result = result.filter((item) => item.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((item) => item.date <= dateTo);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [allContent, selectedType, selectedTag, sortBy, dateFrom, dateTo]);

  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className='space-y-6'>
      {/* Controls Bar */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4'>
        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          {/* Left side: Filters */}
          <div className='flex flex-wrap gap-3 items-center'>
            {/* Content Type Filter */}
            <div className='flex items-center gap-2'>
              <label
                htmlFor='type-filter'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Type:
              </label>
              <select
                id='type-filter'
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all'
                      ? 'All Types'
                      : (type?.charAt(0).toUpperCase() ?? '') +
                        (type?.slice(1) ?? '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className='flex items-center gap-2'>
              <label
                htmlFor='tag-filter'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Tag:
              </label>
              <select
                id='tag-filter'
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className='px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {allTags.slice(0, 20).map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === 'all' ? 'All Tags' : tag}
                  </option>
                ))}
                {allTags.length > 20 && (
                  <option disabled>...and {allTags.length - 20} more</option>
                )}
              </select>
            </div>

            {/* Sort */}
            <div className='flex items-center gap-2'>
              <label
                htmlFor='sort-filter'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Sort:
              </label>
              <select
                id='sort-filter'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className='px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                <option value='date-desc'>Newest First</option>
                <option value='date-asc'>Oldest First</option>
                <option value='title'>Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Right side: View Toggle */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              View:
            </span>
            <div className='inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800'>
              <button
                onClick={() => handleViewChange('grid')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewType === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label='Grid view'
                title='Grid view'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                </svg>
              </button>
              <button
                onClick={() => handleViewChange('large')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewType === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label='Large tile view'
                title='Large tile view'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                </svg>
              </button>
              <button
                onClick={() => handleViewChange('small')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewType === 'small'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label='Small tile view'
                title='Small tile view'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-3 items-center'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Date range:
          </span>
          <div className='flex items-center gap-2'>
            <label
              htmlFor='date-from'
              className='text-xs text-gray-500 dark:text-gray-400'
            >
              From
            </label>
            <input
              id='date-from'
              type='date'
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className='px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label
              htmlFor='date-to'
              className='text-xs text-gray-500 dark:text-gray-400'
            >
              To
            </label>
            <input
              id='date-to'
              type='date'
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className='px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
          {hasDateFilter && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
            >
              Clear dates
            </button>
          )}
        </div>

        {/* Results count */}
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-800'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Showing{' '}
            <span className='font-semibold'>{filteredContent.length}</span> of{' '}
            <span className='font-semibold'>{allContent.length}</span> items
          </p>
        </div>
      </div>

      {/* Content Display */}
      <div>
        {viewType === 'grid' && <GridView items={filteredContent} />}
        {viewType === 'large' && <LargeView items={filteredContent} />}
        {viewType === 'small' && <SmallView items={filteredContent} />}
      </div>
    </div>
  );
}
