'use client';

import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
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

  // Filter blog posts based on selected filters
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [initialPosts, selectedTag, selectedCategory]);

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
      };
    });
  }, [filteredPosts]);

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Category',
      options: [
        { key: '', text: 'All Categories' },
        ...allCategories.map((cat) => ({ key: cat, text: cat })),
      ],
      value: selectedCategory,
      onChange: setSelectedCategory,
    },
    {
      type: 'single',
      label: 'Tag',
      options: [
        { key: '', text: 'All Tags' },
        ...allTags.map((tag) => ({ key: tag, text: tag })),
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
      resultsMessage={resultsMessage}
      emptyStateTitle='No blog posts found'
      emptyStateMessage='Try adjusting your filters to see more posts.'
      backArrow={false}
    />
  );
}
