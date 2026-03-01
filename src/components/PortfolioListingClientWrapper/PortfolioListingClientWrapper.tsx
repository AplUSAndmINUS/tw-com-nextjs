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
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

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

  // Filter and sort portfolio entries
  const filteredEntries = useMemo(() => {
    let filtered = [...initialEntries];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags?.includes(selectedTag));
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (entry) => entry.category === selectedCategory
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(
        (entry) => entry.date && entry.date >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter((entry) => entry.date && entry.date <= dateTo);
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
  }, [initialEntries, selectedTag, selectedCategory, dateFrom, dateTo, sortBy]);

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
        tags: entry.tags,
      };
    });
  }, [filteredEntries]);

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
      emptyStateTitle='No portfolio entries found'
      emptyStateMessage='Try adjusting your filters to see more projects.'
    />
  );
}
