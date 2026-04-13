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
import { useIsMobile } from '@/hooks/useMediaQuery';

interface PodcastListingClientWrapperProps {
  initialEpisodes: PodcastEpisode[];
  /** Whether the Spreaker feed is currently available */
  feedAvailable?: boolean;
}

const PLATFORM_CONFIGS: {
  key: keyof typeof PODCAST_PLATFORMS;
  label: string;
  ariaLabel: string;
  // Brand colors are hardcoded because they are official platform brand guidelines,
  // not part of the app theme. They are only applied in light/dark mode to preserve
  // legibility in high-contrast and colorblindness-accessible themes.
  brandColor: string;
}[] = [
  {
    key: 'spreaker',
    label: 'Spreaker',
    ariaLabel: 'Listen on Spreaker',
    brandColor: '#EE722E', // Spreaker brand orange
  },
  {
    key: 'spotify',
    label: 'Spotify',
    ariaLabel: 'Listen on Spotify',
    brandColor: '#1DB954', // Spotify brand green
  },
  {
    key: 'applePodcasts',
    label: 'Apple Podcasts',
    ariaLabel: 'Listen on Apple Podcasts',
    brandColor: '#B150E2', // Apple Podcasts brand purple
  },
  {
    key: 'iHeartRadio',
    label: 'iHeartRadio',
    ariaLabel: 'Listen on iHeartRadio',
    brandColor: '#C6002B', // iHeartRadio brand red
  },
  {
    key: 'amazonMusic',
    label: 'Amazon Music',
    ariaLabel: 'Listen on Amazon Music',
    brandColor: '#00A8E1', // Amazon Music brand blue
  },
  {
    key: 'deezer',
    label: 'Deezer',
    ariaLabel: 'Listen on Deezer',
    brandColor: '#A238FF', // Deezer brand violet
  },
  {
    key: 'podchaser',
    label: 'Podchaser',
    ariaLabel: 'Listen on Podchaser',
    brandColor: '#2EBFA5', // Podchaser brand teal
  },
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
  const isMobile = useIsMobile();

  // Brand colors are only applied in standard light/dark modes.
  // Accessibility themes (high-contrast, colorblindness, grayscale) fall back to
  // the default neutral palette so platform branding never compromises readability.
  const useBrandColors =
    theme.themeMode === 'light' || theme.themeMode === 'dark';
  // Live episode data — seeded from SSG props, refreshed from /api/podcasts on mount
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(initialEpisodes);
  const [isFeedAvailable, setIsFeedAvailable] =
    useState<boolean>(feedAvailable);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

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

  const MOBILE_VISIBLE_COUNT = 3;

  const visiblePlatforms =
    isMobile && !showAllPlatforms
      ? PLATFORM_CONFIGS.slice(0, MOBILE_VISIBLE_COUNT)
      : PLATFORM_CONFIGS;

  const heroContent = (
    <nav
      className='flex flex-wrap gap-3 mt-4'
      role='list'
      aria-label='Subscribe to the podcast on your preferred platform'
    >
      {visiblePlatforms.map(({ key, label, ariaLabel, brandColor }) => {
        const activeBrandColor = useBrandColors ? brandColor : undefined;
        return (
          <a
            key={key}
            href={PODCAST_PLATFORMS[key]}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={ariaLabel}
            role='listitem'
            className='podcast-platform-btn'
            style={
              {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: `2px solid ${
                  activeBrandColor ?? theme.palette.neutralTertiary
                }`,
                // Color is set via CSS custom property AND -webkit-text-fill-color.
                // The browser's forced dark mode only injects rules for `color`,
                // not `-webkit-text-fill-color`, so this sidesteps the entire
                // specificity arms race with selectors like a[ping]:link and
                // html[native-dark-active] that keep escalating !important overrides.
                '--podcast-btn-color':
                  activeBrandColor ?? theme.palette.neutralPrimary,
                color: 'var(--podcast-btn-color)',
                WebkitTextFillColor:
                  activeBrandColor ?? theme.palette.neutralPrimary,
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                backgroundColor: theme.palette.neutralLighterAlt,
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = activeBrandColor
                ? `${activeBrandColor}22`
                : theme.palette.neutralLighter;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                theme.palette.neutralLighterAlt;
            }}
          >
            {label}
          </a>
        );
      })}
      {isMobile && (
        <button
          type='button'
          role='listitem'
          onClick={() => setShowAllPlatforms((prev) => !prev)}
          aria-expanded={showAllPlatforms}
          aria-label={
            showAllPlatforms
              ? 'Show fewer podcast platforms'
              : 'Show more podcast platforms'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 16px',
            borderRadius: '9999px',
            border: `2px solid ${theme.palette.neutralTertiary}`,
            color: theme.palette.neutralPrimary,
            background: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.15s ease',
            backgroundColor: theme.palette.neutralLighterAlt,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              theme.palette.neutralLighter;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              theme.palette.neutralLighterAlt;
          }}
        >
          {showAllPlatforms ? 'Show Less' : 'Show More'}
        </button>
      )}
    </nav>
  );

  return (
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
      heroContent={heroContent}
    />
  );
}
