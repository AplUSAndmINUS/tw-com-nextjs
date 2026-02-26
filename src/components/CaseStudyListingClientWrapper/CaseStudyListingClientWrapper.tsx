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

interface CaseStudyListingClientWrapperProps {
  initialCaseStudies: ContentItem[];
}

/**
 * Case Study Listing Client Wrapper
 * Handles filtering logic and transforms case study data for the unified ContentListingPage
 */
export function CaseStudyListingClientWrapper({
  initialCaseStudies,
}: CaseStudyListingClientWrapperProps) {
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
    initialCaseStudies.forEach((cs) => {
      cs.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialCaseStudies]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialCaseStudies.forEach((cs) => {
      if (cs.category) categorySet.add(cs.category);
    });
    return Array.from(categorySet).sort();
  }, [initialCaseStudies]);

  // Filter and sort case studies
  const filteredCaseStudies = useMemo(() => {
    let filtered = [...initialCaseStudies];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((cs) => cs.tags?.includes(selectedTag));
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((cs) => cs.category === selectedCategory);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter((cs) => cs.date && cs.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((cs) => cs.date && cs.date <= dateTo);
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
  }, [
    initialCaseStudies,
    selectedTag,
    selectedCategory,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  // Transform case studies to card format
  const cards: AdaptiveCard[] = useMemo(() => {
    return filteredCaseStudies.map((cs) => {
      let formattedDate = 'Date unknown';
      try {
        if (cs.date) {
          const parsedDate = parseISO(cs.date);
          formattedDate = format(parsedDate, 'yyyy');
        }
      } catch (error) {
        console.warn(`Failed to parse date for case study ${cs.slug}:`, error);
      }

      return {
        id: cs.slug,
        title: cs.title,
        description: cs.excerpt,
        imageUrl: cs.imageUrl || cs.featuredImage,
        imageAlt: cs.imageAlt || cs.title,
        imageText: formattedDate,
        tags: cs.tags,
      };
    });
  }, [filteredCaseStudies]);

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
    filteredCaseStudies.length === initialCaseStudies.length
      ? `Showing all ${filteredCaseStudies.length} case stud${filteredCaseStudies.length !== 1 ? 'ies' : 'y'}`
      : `Showing ${filteredCaseStudies.length} of ${initialCaseStudies.length} case stud${initialCaseStudies.length !== 1 ? 'ies' : 'y'}`;

  return (
    <ContentListingPage
      title='Case Studies'
      iconName='DocumentBulletList24Regular'
      description='Deep dives into specific projects — what I built, the challenges I faced, and what I learned.'
      basePath='/case-studies'
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
      emptyStateTitle='No case studies found'
      emptyStateMessage='Try adjusting your filters to see more case studies.'
      backArrow={true}
      backArrowPath='/content'
    />
  );
}
