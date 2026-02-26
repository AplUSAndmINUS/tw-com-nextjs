'use client';

import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
  SortOption,
} from '@/components/ContentListingPage';
import { PodcastEpisode } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface PodcastListingClientWrapperProps {
  initialEpisodes: PodcastEpisode[];
}

/**
 * Podcast Listing Client Wrapper
 * Handles filtering logic and transforms podcast data for the unified ContentListingPage
 */
export function PodcastListingClientWrapper({
  initialEpisodes,
}: PodcastListingClientWrapperProps) {
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
    initialEpisodes.forEach((episode) => {
      episode.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialEpisodes]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialEpisodes.forEach((episode) => {
      if (episode.category) categorySet.add(episode.category);
    });
    return Array.from(categorySet).sort();
  }, [initialEpisodes]);

  // Filter and sort episodes
  const filteredEpisodes = useMemo(() => {
    let filtered = [...initialEpisodes];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((episode) =>
        episode.tags?.includes(selectedTag)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (episode) => episode.category === selectedCategory
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(
        (episode) => episode.publishedDate && episode.publishedDate >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (episode) => episode.publishedDate && episode.publishedDate <= dateTo
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return (b.publishedDate || '').localeCompare(a.publishedDate || '');
        case 'date-asc':
          return (a.publishedDate || '').localeCompare(b.publishedDate || '');
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    initialEpisodes,
    selectedTag,
    selectedCategory,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  // Transform episodes to card format
  const cards: AdaptiveCard[] = useMemo(() => {
    return filteredEpisodes.map((episode) => {
      let formattedDate = 'Date unknown';
      try {
        if (episode.publishedDate) {
          const parsedDate = parseISO(episode.publishedDate);
          formattedDate = format(parsedDate, 'MMMM d, yyyy');
        }
      } catch (error) {
        console.warn(
          `Failed to parse date for episode ${episode.slug}:`,
          error
        );
      }

      return {
        id: episode.slug,
        title: episode.title,
        description: episode.description,
        imageUrl: undefined,
        imageAlt: episode.title,
        imageText: formattedDate,
        tags: episode.tags,
      };
    });
  }, [filteredEpisodes]);

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Category',
      options: [
        { value: '', label: 'All Categories' },
        ...allCategories.map((cat) => ({ value: cat, label: cat })),
      ],
      value: selectedCategory || '',
      onChange: (key) => setSelectedCategory(key || undefined),
    },
    {
      type: 'single',
      label: 'Tag',
      options: [
        { value: '', label: 'All Tags' },
        ...allTags.map((tag) => ({ value: tag, label: tag })),
      ],
      value: selectedTag || '',
      onChange: (key) => setSelectedTag(key || undefined),
    },
  ];

  // Generate results message
  const resultsMessage =
    filteredEpisodes.length === initialEpisodes.length
      ? `Showing all ${filteredEpisodes.length} episode${filteredEpisodes.length !== 1 ? 's' : ''}`
      : `Showing ${filteredEpisodes.length} of ${initialEpisodes.length} episode${initialEpisodes.length !== 1 ? 's' : ''}`;

  return (
    <ContentListingPage
      title='Podcasts'
      iconName='MicPulseOff24Regular'
      description='Audio conversations on technology, creativity, and building meaningful things.'
      basePath='/podcasts'
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
      emptyStateTitle='No podcast episodes found'
      emptyStateMessage='Try adjusting your filters to see more episodes.'
      backArrow={true}
      backArrowPath='/content'
    />
  );
}
