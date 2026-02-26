'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedPageWrapper } from '@/components/UnifiedPageWrapper';
import { Typography } from '@/components/Typography';
import { AdaptiveCardGrid, AdaptiveCard } from '@/components/AdaptiveCardGrid';
import { Callout } from '@/components/Callout';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useContentFilterStore, ViewType } from '@/store';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { FormButton, FormSelect, FormSelectOption } from '@/components/Form';
import { Hero } from '@/components/Hero';

/**
 * Filter configuration for single-select dropdown
 */
export interface SingleSelectFilter {
  type: 'single';
  label: string;
  placeholder?: string;
  options: FormSelectOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

/**
 * Filter configuration for multi-select dropdown
 */
export interface MultiSelectFilter {
  type: 'multi';
  label: string;
  placeholder?: string;
  options: FormSelectOption[];
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
}

/**
 * Union type for all filter types
 */
export type FilterConfig = SingleSelectFilter | MultiSelectFilter;

/**
 * Sort options
 */
export type SortOption = 'date-desc' | 'date-asc' | 'title';

/**
 * Props for ContentListingPage component
 */
export interface ContentListingPageProps {
  // Page identity
  title: string;
  iconName?: string;
  description: string;
  basePath: string;

  // Content
  cards: AdaptiveCard[];
  totalCount?: number;

  // Filters
  filters: FilterConfig[];

  // Sort and date range
  sortBy?: SortOption;
  onSortChange?: (sortBy: SortOption) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (date: string) => void;
  onDateToChange?: (date: string) => void;
  onClearDates?: () => void;

  // Results messaging
  resultsMessage?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;

  // Optional call-to-action section
  ctaSection?: {
    title: string;
    description: string;
    buttons: Array<{
      label: string;
      variant: 'primary' | 'secondary';
      path: string;
    }>;
  };

  // Navigation
  onCardClick?: (id: string) => void;
  backArrow?: boolean;
  backArrowPath?: string;

  // Custom section
  customSection?: React.ReactNode;
}

/**
 * Unified Content Listing Page Component
 *
 * Consolidates shared logic across Blog, Portfolio, and other content pages.
 * Supports flexible filtering, view types, and responsive layouts.
 *
 * @example
 * ```tsx
 * <ContentListingPage
 *   title="Blog"
 *   iconName="DocumentText24Regular"
 *   description="Latest insights..."
 *   basePath="/blog"
 *   cards={blogCards}
 *   filters={[
 *     {
 *       type: 'single',
 *       label: 'Category',
 *       options: categoryOptions,
 *       value: selectedCategory,
 *       onChange: setSelectedCategory
 *     }
 *   ]}
 * />
 * ```
 */
export function ContentListingPage({
  title,
  iconName,
  description,
  basePath,
  cards,
  totalCount = cards.length,
  filters,
  sortBy = 'date-desc',
  onSortChange,
  dateFrom = '',
  dateTo = '',
  onDateFromChange,
  onDateToChange,
  onClearDates,
  resultsMessage,
  emptyStateTitle = 'No items found',
  emptyStateMessage = 'Try adjusting your filters to see more items.',
  ctaSection,
  onCardClick,
  backArrow = false,
  backArrowPath = '/content',
  customSection,
}: ContentListingPageProps) {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { viewType, setViewType } = useContentFilterStore();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // View type options for dropdown
  const viewOptions: FormSelectOption[] = [
    { key: 'grid', text: 'Grid View' },
    { key: 'small-tile', text: 'Small Tile' },
    { key: 'large-tile', text: 'Large Tile' },
  ];

  // Ensure filters array is always defined
  const safeFilters = filters || [];
  const safeCards = cards || [];

  // Map view type for grid component
  const getViewType = (): 'grid' | 'small' | 'large' => {
    if (viewType === 'small-tile') return 'small';
    if (viewType === 'large-tile') return 'large';
    return 'grid';
  };

  // Handle card click
  const handleCardClick = (id: string) => {
    if (onCardClick) {
      onCardClick(id);
    } else {
      router.push(`${basePath}/${id}`);
    }
  };

  // Render filter controls
  const renderFilters = () => {
    const sortOptions: FormSelectOption[] = [
      { key: 'date-desc', text: 'Newest First' },
      { key: 'date-asc', text: 'Oldest First' },
      { key: 'title', text: 'Title A-Z' },
    ];

    const hasDateFilter = dateFrom || dateTo;

    return (
      <>
        {/* Dynamic Filters (Category, Tag, etc.) */}
        {safeFilters.map((filter, index) => {
          if (filter.type === 'single') {
            return (
              <div key={index} style={{ minWidth: '0' }}>
                <FormSelect
                  label={filter.label}
                  options={filter.options}
                  value={filter.value}
                  onChange={filter.onChange}
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                />
              </div>
            );
          }
          // Multi-select not implemented yet - can be added later
          return null;
        })}

        {/* Sort Selector */}
        {onSortChange && (
          <div style={{ minWidth: '0' }}>
            <FormSelect
              label='Sort'
              options={sortOptions}
              value={sortBy}
              onChange={(value) =>
                onSortChange((value as SortOption) || 'date-desc')
              }
            />
          </div>
        )}

        {/* From Date - Hidden on Mobile and Tablet */}
        {onDateFromChange && !isMobile && !isTablet && (
          <div style={{ minWidth: '0' }}>
            <label
              htmlFor='date-from-input'
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: theme.palette.neutralPrimary,
                marginBottom: theme.spacing.xs,
              }}
            >
              From Date
            </label>
            <input
              id='date-from-input'
              type='date'
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              aria-label='From date'
              style={{
                width: '100%',
                padding: `${theme.spacing.s1} ${theme.spacing.s1}`,
                borderRadius: theme.borderRadius.container.small,
                border: `1px solid ${theme.palette.neutralQuaternary}`,
                backgroundColor: theme.palette.white,
                color: theme.palette.neutralPrimary,
                fontSize: '0.875rem',
              }}
            />
          </div>
        )}

        {/* To Date - Hidden on Mobile and Tablet */}
        {onDateToChange && !isMobile && !isTablet && (
          <div style={{ minWidth: '0' }}>
            <label
              htmlFor='date-to-input'
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: theme.palette.neutralPrimary,
                marginBottom: theme.spacing.xs,
              }}
            >
              To Date
            </label>
            <input
              id='date-to-input'
              type='date'
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              aria-label='To date'
              style={{
                width: '100%',
                padding: `${theme.spacing.s1} ${theme.spacing.s1}`,
                borderRadius: theme.borderRadius.container.small,
                border: `1px solid ${theme.palette.neutralQuaternary}`,
                backgroundColor: theme.palette.white,
                color: theme.palette.neutralPrimary,
                fontSize: '0.875rem',
              }}
            />
          </div>
        )}

        {/* View Type Selector */}
        <div style={{ minWidth: '0' }}>
          <FormSelect
            label='View'
            options={viewOptions}
            value={viewType}
            onChange={(value) => setViewType((value as ViewType) || 'grid')}
          />
        </div>

        {/* Clear Dates Button - Hidden on Mobile, Shows when dates are set */}
        {hasDateFilter && onClearDates && !isMobile && (
          <div
            style={{
              minWidth: '0',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <FormButton
              variant='secondary'
              onClick={onClearDates}
              style={{
                padding: `${theme.spacing.s1} ${theme.spacing.m}`,
                minHeight: '36px',
                width: '100%',
              }}
            >
              Clear Dates
            </FormButton>
          </div>
        )}
      </>
    );
  };

  return (
    <UnifiedPageWrapper layoutType='responsive-grid'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Hero Section with Filters */}
        <Hero
          title={title}
          iconName={iconName}
          description={description}
          backArrow={backArrow}
          backArrowPath={backArrowPath}
          filters={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile || isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
                gap: theme.spacing.m,
                width: '100%',
              }}
            >
              {renderFilters()}
            </div>
          }
        />

        {/* Results Message */}
        {resultsMessage && (
          <div
            style={{
              marginTop: theme.spacing.l,
              marginBottom: theme.spacing.m,
            }}
          >
            <Typography
              variant='body'
              style={{
                color: theme.palette.neutralSecondary,
                fontSize: '0.9375rem',
              }}
            >
              {resultsMessage}
            </Typography>
          </div>
        )}

        {/* Custom Section (e.g., GitHub contributions) */}
        {customSection && (
          <div
            style={{
              marginTop: theme.spacing.l,
              marginBottom: theme.spacing.l,
            }}
          >
            {customSection}
          </div>
        )}

        {/* Content Grid */}
        <div style={{ marginTop: theme.spacing.l }}>
          {safeCards.length === 0 ? (
            <Callout
              variant='neutral'
              title={emptyStateTitle}
              subtitle={emptyStateMessage}
            />
          ) : (
            <AdaptiveCardGrid
              cards={safeCards}
              basePath={basePath}
              viewType={getViewType()}
              onCardClick={handleCardClick}
            />
          )}
        </div>

        {/* CTA Section */}
        {ctaSection && (
          <div style={{ marginTop: theme.spacing.xxxl }}>
            <Callout variant='subtle' title={ctaSection.title}>
              <Typography
                variant='body'
                style={{
                  marginBottom: theme.spacing.l,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {ctaSection.description}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  gap: theme.spacing.m,
                  flexWrap: 'wrap',
                }}
              >
                {ctaSection.buttons.map((button, index) => (
                  <FormButton
                    key={index}
                    variant={button.variant}
                    onClick={() => router.push(button.path)}
                  >
                    {button.label}
                  </FormButton>
                ))}
              </div>
            </Callout>
          </div>
        )}
      </div>
    </UnifiedPageWrapper>
  );
}
