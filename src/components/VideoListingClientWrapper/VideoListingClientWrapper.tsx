'use client';

import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
} from '@/components/ContentListingPage';
import { VideoItem } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface VideoListingClientWrapperProps {
  initialVideos: VideoItem[];
}

/**
 * Video Listing Client Wrapper
 * Handles filtering logic and transforms video data for the unified ContentListingPage
 */
export function VideoListingClientWrapper({
  initialVideos,
}: VideoListingClientWrapperProps) {
  // State for filters
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  // Extract unique tags and categories
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialVideos.forEach((video) => {
      video.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialVideos]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialVideos.forEach((video) => {
      if (video.category) categorySet.add(video.category);
    });
    return Array.from(categorySet).sort();
  }, [initialVideos]);

  // Filter videos based on selected filters
  const filteredVideos = useMemo(() => {
    let filtered = [...initialVideos];

    if (selectedTag) {
      filtered = filtered.filter((video) => video.tags?.includes(selectedTag));
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (video) => video.category === selectedCategory
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [initialVideos, selectedTag, selectedCategory]);

  // Transform videos to card format
  const cards: AdaptiveCard[] = useMemo(() => {
    return filteredVideos.map((video) => {
      let formattedDate = 'Date unknown';
      try {
        if (video.publishedAt) {
          const parsedDate = parseISO(video.publishedAt);
          formattedDate = format(parsedDate, 'MMMM d, yyyy');
        }
      } catch (error) {
        console.warn(`Failed to parse date for video ${video.id}:`, error);
      }

      return {
        id: video.id,
        title: video.title,
        description: video.description,
        imageUrl: video.thumbnailUrl,
        imageAlt: video.title,
        imageText: formattedDate,
      };
    });
  }, [filteredVideos]);

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Category',
      options: [
        { key: '', text: 'All Categories' },
        ...allCategories.map((cat) => ({ key: cat, text: cat })),
      ],
      value: selectedCategory || '',
      onChange: (key) => setSelectedCategory(key || undefined),
    },
    {
      type: 'single',
      label: 'Tag',
      options: [
        { key: '', text: 'All Tags' },
        ...allTags.map((tag) => ({ key: tag, text: tag })),
      ],
      value: selectedTag || '',
      onChange: (key) => setSelectedTag(key || undefined),
    },
  ];

  // Generate results message
  const resultsMessage =
    filteredVideos.length === initialVideos.length
      ? `Showing all ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}`
      : `Showing ${filteredVideos.length} of ${initialVideos.length} video${initialVideos.length !== 1 ? 's' : ''}`;

  return (
    <ContentListingPage
      title='Videos'
      iconName='Video24Regular'
      description='Video content exploring technology, creativity, and the human experience.'
      basePath='/videos'
      cards={cards}
      filters={filters}
      resultsMessage={resultsMessage}
      emptyStateTitle='No videos found'
      emptyStateMessage='Try adjusting your filters to see more videos.'
      backArrow={true}
      backArrowPath='/content'
    />
  );
}
