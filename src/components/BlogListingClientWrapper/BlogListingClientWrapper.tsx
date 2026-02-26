'use client';

import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
  SortOption,
} from '@/components/ContentListingPage';
import { ContentItem } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface BlogListingClientWrapperProps {
  initialPosts: ContentItem[];
}

/**
 * Blog Listing Client Wrapper
 * Handles filtering logic and transforms blog data for the unified ContentListingPage
 */
export function BlogListingClientWrapper({
  initialPosts,
}: BlogListingClientWrapperProps) {
  // State for filters
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Extract unique tags and categories
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialPosts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialPosts]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialPosts.forEach((post) => {
      if (post.category) categorySet.add(post.category);
    });
    return Array.from(categorySet).sort();
  }, [initialPosts]);

  // Filter and sort blog posts
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter((post) => post.date && post.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((post) => post.date && post.date <= dateTo);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return (b.date || '').localeCompare(a.date || '');
        case 'date-asc':
          return (a.date || '').localeCompare(b.date || '');
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialPosts, selectedTag, selectedCategory, dateFrom, dateTo, sortBy]);

  // Transform blog posts to card format
  const cards: AdaptiveCard[] = useMemo(() => {
    return filteredPosts.map((post) => {
      let formattedDate = 'Date unknown';
      try {
        if (post.date) {
          const parsedDate = parseISO(post.date);
          formattedDate = format(parsedDate, 'MMMM d, yyyy');
        } else if (post.publishedDate) {
          const parsedDate = parseISO(post.publishedDate);
          formattedDate = format(parsedDate, 'MMMM d, yyyy');
        }
      } catch (error) {
        console.warn(`Failed to parse date for post ${post.slug}:`, error);
      }

      return {
        id: post.slug,
        title: post.title,
        description: post.excerpt,
        imageUrl: post.imageUrl || post.featuredImage,
        imageAlt: post.imageAlt || post.title,
        imageText: formattedDate,
        tags: post.tags,
      };
    });
  }, [filteredPosts]);

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Category',
      options: [
        { value: '', label: 'All Categories' },
        ...allCategories.map((cat) => ({ value: cat, label: cat })),
      ],
      value: selectedCategory,
      onChange: setSelectedCategory,
    },
    {
      type: 'single',
      label: 'Tag',
      options: [
        { value: '', label: 'All Tags' },
        ...allTags.map((tag) => ({ value: tag, label: tag })),
      ],
      value: selectedTag,
      onChange: setSelectedTag,
    },
  ];

  // Build results message
  const resultsMessage = `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'}${selectedCategory ? ` in ${selectedCategory}` : ''}${selectedTag ? ` tagged with ${selectedTag}` : ''}`;

  return (
    <ContentListingPage
      title='Blog'
      iconName='DocumentText24Regular'
      description='Insights, best practices, and thoughts on technology, design, and human experience. Explore articles on software development, creativity, wellness, and personal growth.'
      basePath='/blog'
      cards={cards}
      filters={filters}
      sortBy={sortBy}
      onSortChange={setSortBy}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onDateFromChange={setDateFrom}
      onDateToChange={setDateTo}
      onClearDates={() => {
        setDateFrom('');
        setDateTo('');
      }}
      resultsMessage={resultsMessage}
      emptyStateTitle='No blog posts found'
      emptyStateMessage='Try adjusting your filters to see more posts.'
      backArrow={false}
    />
  );
}
