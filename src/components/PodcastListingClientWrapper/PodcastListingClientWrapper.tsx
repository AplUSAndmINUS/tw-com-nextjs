'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ContentListingPage,
  FilterConfig,
  SortOption,
} from '@/components/ContentListingPage';
import { PodcastEpisode } from '@/content/types';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';
import { fetchPodcastsFromApi, PODCAST_PLATFORMS } from '@/lib/spreaker';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface PodcastListingClientWrapperProps {
  initialEpisodes: PodcastEpisode[];
  /** Whether the Spreaker feed is currently available */
  feedAvailable?: boolean;
}

const PLATFORM_CONFIGS: {
  key: keyof typeof PODCAST_PLATFORMS;
  label: string;
  ariaLabel: string;
}[] = [
  { key: 'spreaker', label: 'Spreaker', ariaLabel: 'Listen on Spreaker' },
  {
    key: 'applePodcasts',
    label: 'Apple Podcasts',
    ariaLabel: 'Listen on Apple Podcasts',
  },
  { key: 'spotify', label: 'Spotify', ariaLabel: 'Listen on Spotify' },
  {
    key: 'amazonMusic',
    label: 'Amazon Music',
    ariaLabel: 'Listen on Amazon Music',
  },
  { key: 'deezer', label: 'Deezer', ariaLabel: 'Listen on Deezer' },
  { key: 'podchaser', label: 'Podchaser', ariaLabel: 'Listen on Podchaser' },
];

/**
 * Podcast Listing Client Wrapper
 * Handles filtering logic and transforms podcast data for the unified ContentListingPage
 */
export function PodcastListingClientWrapper({
  initialEpisodes,
  feedAvailable = false,
}: PodcastListingClientWrapperProps) {
  const { theme } = useAppTheme();
  // Live episode data — seeded from SSG props, refreshed from /api/podcasts on mount
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(initialEpisodes);
  const [isFeedAvailable, setIsFeedAvailable] =
    useState<boolean>(feedAvailable);

  useEffect(() => {
    fetchPodcastsFromApi()
      .then((result) => {
        if (result.available && result.episodes.length > 0) {
          setEpisodes(result.episodes);
          setIsFeedAvailable(true);
        }
      })
      .catch(() => {
        // Silently fall back to SSG data — no user-visible error
      });
  }, []);

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
    episodes.forEach((episode) => {
      episode.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [episodes]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    episodes.forEach((episode) => {
      if (episode.category) categorySet.add(episode.category);
    });
    return Array.from(categorySet).sort();
  }, [episodes]);

  // Filter and sort episodes
  const filteredEpisodes = useMemo(() => {
    let filtered = [...episodes];

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
  }, [episodes, selectedTag, selectedCategory, dateFrom, dateTo, sortBy]);

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
    filteredEpisodes.length === episodes.length
      ? `Showing all ${filteredEpisodes.length} episode${filteredEpisodes.length !== 1 ? 's' : ''}`
      : `Showing ${filteredEpisodes.length} of ${episodes.length} episode${episodes.length !== 1 ? 's' : ''}`;

  return (
    <div>
      {/* Platform subscription links */}
      <div
        className='flex flex-wrap gap-3 mb-8'
        role='list'
        aria-label='Subscribe to the podcast on your preferred platform'
      >
        {PLATFORM_CONFIGS.map(({ key, label, ariaLabel }) => (
          <a
            key={key}
            href={PODCAST_PLATFORMS[key]}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={ariaLabel}
            role='listitem'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: theme.borderRadius.m,
              border: `1px solid ${theme.palette.neutralTertiary}`,
              color: theme.palette.neutralPrimary,
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.15s ease',
              backgroundColor: theme.palette.neutralLighterAlt,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                theme.palette.themePrimary;
              (e.currentTarget as HTMLAnchorElement).style.color =
                theme.palette.themePrimary;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                theme.palette.neutralTertiary;
              (e.currentTarget as HTMLAnchorElement).style.color =
                theme.palette.neutralPrimary;
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Episode listing */}
      <ContentListingPage
        title='Podcast Episodes'
        iconName='MicRegular'
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
        feedAvailable={isFeedAvailable}
        onClearDates={() => {
          setDateFrom('');
          setDateTo('');
        }}
        resultsMessage={resultsMessage}
        emptyStateTitle='No podcast episodes found'
        emptyStateMessage='Try adjusting your filters to see more episodes.'
      />
    </div>
  );
}
