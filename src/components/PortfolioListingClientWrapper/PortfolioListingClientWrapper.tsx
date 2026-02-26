'use client';

import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
} from '@/components/ContentListingPage';
import { ContentItem } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface PortfolioListingClientWrapperProps {
  initialEntries: ContentItem[];
}

/**
 * Portfolio Listing Client Wrapper
 * Handles filtering logic and transforms portfolio data for the unified ContentListingPage
 */
export function PortfolioListingClientWrapper({
  initialEntries,
}: PortfolioListingClientWrapperProps) {
  // State for filters
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  // Extract unique tags and categories
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialEntries.forEach((entry) => {
      entry.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialEntries]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialEntries.forEach((entry) => {
      if (entry.category) categorySet.add(entry.category);
    });
    return Array.from(categorySet).sort();
  }, [initialEntries]);

  // Filter portfolio entries based on selected filters
  const filteredEntries = useMemo(() => {
    let filtered = [...initialEntries];

    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags?.includes(selectedTag));
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (entry) => entry.category === selectedCategory
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [initialEntries, selectedTag, selectedCategory]);

  // Transform portfolio entries to card format
  const cards: AdaptiveCard[] = useMemo(() => {
    return filteredEntries.map((entry) => {
      let formattedDate = 'Date unknown';
      try {
        if (entry.date) {
          const parsedDate = parseISO(entry.date);
          formattedDate = format(parsedDate, 'yyyy');
        }
      } catch (error) {
        console.warn(`Failed to parse date for entry ${entry.slug}:`, error);
      }

      return {
        id: entry.slug,
        title: entry.title,
        description: entry.excerpt,
        imageUrl: entry.imageUrl || entry.featuredImage,
        imageAlt: entry.imageAlt || entry.title,
        imageText: formattedDate,
      };
    });
  }, [filteredEntries]);

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
    filteredEntries.length === initialEntries.length
      ? `Showing all ${filteredEntries.length} project${filteredEntries.length !== 1 ? 's' : ''}`
      : `Showing ${filteredEntries.length} of ${initialEntries.length} project${initialEntries.length !== 1 ? 's' : ''}`;

  return (
    <ContentListingPage
      title='Portfolio'
      iconName='Briefcase24Regular'
      description="Selected creative and technical work — projects I've built, led, or contributed to."
      basePath='/portfolio'
      cards={cards}
      filters={filters}
      resultsMessage={resultsMessage}
      emptyStateTitle='No portfolio entries found'
      emptyStateMessage='Try adjusting your filters to see more projects.'
      backArrow={true}
      backArrowPath='/content'
    />
  );
}
