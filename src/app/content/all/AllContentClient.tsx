'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
  SortOption,
} from '@/components/ContentListingPage';
import { ContentItem } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface AllContentClientProps {
  allContent: ContentItem[];
}

export function AllContentClient({ allContent }: AllContentClientProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Route to correct detail page based on content type
  const handleCardClick = (id: string) => {
    const item = allContent.find((c) => c.slug === id);
    if (!item || !item.type) return;

    const typePathMap: Record<string, string> = {
      blog: '/blog',
      portfolio: '/portfolio',
      'case-studies': '/case-studies',
    };

    const basePath = typePathMap[item.type] || '/content';
    router.push(`${basePath}/${id}`);
  };

  // Extract unique tags and types
  const allTags = Array.from(
    new Set(allContent.flatMap((item) => item.tags || []))
  ).sort();

  const contentTypes = Array.from(
    new Set(
      allContent
        .map((item) => item.type)
        .filter((type) => type !== undefined) as string[]
    )
  ).sort();

  // Filter and sort content
  const filteredCards = useMemo(() => {
    let filtered = [...allContent];

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((item) => item.tags?.includes(selectedTag));
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter((item) => item.date && item.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((item) => item.date && item.date <= dateTo);
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

    // Transform to cards
    return filtered.map((item) => {
      let formattedDate = 'Date unknown';
      try {
        if (item.date) {
          const parsedDate = parseISO(item.date);
          formattedDate = format(parsedDate, 'MMMM d, yyyy');
        }
      } catch (error) {
        console.warn(`Failed to parse date for item ${item.slug}:`, error);
      }

      const typeLabel =
        item.type === 'case-studies'
          ? 'Case Study'
          : item.type
            ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
            : '';

      return {
        id: item.slug,
        title: item.title,
        description: item.excerpt,
        imageUrl: item.imageUrl || item.featuredImage,
        imageAlt: item.imageAlt || item.title,
        imageText: typeLabel
          ? `${typeLabel} • ${formattedDate}`
          : formattedDate,
        tags: item.tags,
      } as AdaptiveCard;
    });
  }, [allContent, selectedType, selectedTag, sortBy, dateFrom, dateTo]);

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Type',
      options: [
        { value: '', label: 'All Types' },
        ...contentTypes.map((type) => ({
          value: type,
          label:
            type === 'case-studies'
              ? 'Case Studies'
              : type.charAt(0).toUpperCase() + type.slice(1),
        })),
      ],
      value: selectedType,
      onChange: setSelectedType,
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

  return (
    <ContentListingPage
      title='All Content'
      description='Everything I create — articles, case studies, and more. Browse all content or filter by type and tags.'
      basePath='/content'
      cards={filteredCards}
      totalCount={allContent.length}
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
      onCardClick={handleCardClick}
      resultsMessage={
        selectedType || selectedTag || dateFrom || dateTo
          ? `Showing ${filteredCards.length} of ${allContent.length} items`
          : `Showing all ${filteredCards.length} items`
      }
      backArrow={true}
      backArrowPath='/content-hub'
    />
  );
}
