'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/Typography';
import { AdaptiveCardGrid, AdaptiveCard } from '@/components/AdaptiveCardGrid';
import { Callout } from '@/components/Callout';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useContentFilterStore, ViewType } from '@/store';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { Button, Select, SelectOption, DateInput } from '@/components/Form';
import { Hero } from '@/components/Hero';
import { NewsletterSignupCTA } from '../NewsletterSignupCTA';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Filter configuration for single-select dropdown
 */
export interface SingleSelectFilter {
  type: 'single';
  label: string;
  placeholder?: string;
  options: SelectOption[];
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
  options: SelectOption[];
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
  defaultCardType?: 'grid' | 'small' | 'large';
  showViewSelector?: boolean;

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
  emailNewsletterSignup?: boolean;
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
  defaultCardType,
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
  emailNewsletterSignup = false,
  backArrowPath = '/content-hub',
  customSection,
  showViewSelector = true,
}: ContentListingPageProps) {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { viewType, setViewType } = useContentFilterStore();
  const isMobileHook = useIsMobile();
  const isTabletHook = useIsTablet();
  const [isMounted, setIsMounted] = React.useState(false);

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isMobile = isMounted ? isMobileHook : false;
  const isTablet = isMounted ? isTabletHook : false;
  const { shouldReduceMotion } = useReducedMotion();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // View type options for dropdown
  const viewOptions: SelectOption[] = [
    { value: 'grid', label: 'Grid View' },
    { value: 'small', label: 'Small Tile' },
    { value: 'large', label: 'Large Tile' },
  ];
  const resolvedViewType = showViewSelector
    ? viewType
    : defaultCardType || 'grid';

  // Ensure filters array is always defined
  const safeFilters = filters || [];
  const safeCards = cards || [];

  // Handle card click
  const handleCardClick = (id: string) => {
    if (onCardClick) {
      onCardClick(id);
    } else {
      router.push(`${basePath}/${id}`);
    }
  };

  React.useEffect(() => {
    if (!showViewSelector) {
      setViewType(defaultCardType || 'grid');
      return;
    }

    if (defaultCardType) {
      setViewType(defaultCardType);
    }
  }, [defaultCardType, setViewType, showViewSelector]);

  const filterSelectSize = isMobile ? 'small' : 'medium';

  // Render filter controls
  const renderFilters = () => {
    const sortOptions: SelectOption[] = [
      { value: 'date-desc', label: 'Newest First' },
      { value: 'date-asc', label: 'Oldest First' },
      { value: 'title', label: 'Title A-Z' },
    ];

    const hasDateFilter = dateFrom || dateTo;

    return (
      <>
        {/* Dynamic Filters (Category, Tag, etc.) */}
        {safeFilters.map((filter, index) => {
          if (filter.type === 'single') {
            return (
              <div key={index} style={{ minWidth: '0' }}>
                <Select
                  label={filter.label}
                  options={filter.options}
                  size={filterSelectSize}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value || undefined)}
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
            <Select
              label='Sort'
              options={sortOptions}
              size={filterSelectSize}
              value={sortBy}
              onChange={(e) =>
                onSortChange((e.target.value as SortOption) || 'date-desc')
              }
            />
          </div>
        )}

        {/* From Date - Hidden on Mobile and Tablet */}
        {onDateFromChange && !isMobile && !isTablet && (
          <div style={{ minWidth: '0' }}>
            <DateInput
              label='From Date'
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              fullWidth
            />
          </div>
        )}

        {/* To Date - Hidden on Mobile and Tablet */}
        {onDateToChange && !isMobile && !isTablet && (
          <div style={{ minWidth: '0' }}>
            <DateInput
              label='To Date'
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              fullWidth
            />
          </div>
        )}

        {/* View Type Selector */}
        {showViewSelector && (
          <div style={{ minWidth: '0' }}>
            <Select
              label='View'
              options={viewOptions}
              size={filterSelectSize}
              value={viewType}
              onChange={(e) =>
                setViewType((e.target.value as ViewType) || 'grid')
              }
            />
          </div>
        )}

        {/* Clear Dates Button - Hidden on Mobile, Shows when dates are set */}
        {hasDateFilter && onClearDates && !isMobile && (
          <div
            style={{
              minWidth: '0',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Button
              variant='secondary'
              onClick={onClearDates}
              style={{
                padding: `${theme.spacing.s1} ${theme.spacing.m}`,
                minHeight: '36px',
                width: '100%',
              }}
            >
              Clear Dates
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
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
              gridTemplateColumns:
                isMobile || isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? theme.spacing.s1 : theme.spacing.m,
              width: '100%',
              alignItems: 'end',
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.4,
            ease: 'easeIn',
          }}
          style={{
            marginTop: theme.spacing.l,
            marginBottom: theme.spacing.l,
          }}
        >
          {customSection}
        </motion.div>
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
          <AnimatePresence mode='wait'>
            <motion.div
              key={resolvedViewType}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.24,
                ease: 'easeInOut',
              }}
            >
              <AdaptiveCardGrid
                cards={safeCards}
                basePath={basePath}
                viewType={resolvedViewType}
                onCardClick={handleCardClick}
              />
            </motion.div>
          </AnimatePresence>
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
                <Button
                  key={index}
                  variant={button.variant}
                  onClick={() => router.push(button.path)}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </Callout>
        </div>
      )}

      {/* Email Newsletter Signup CTA for Mobile and Tablet to save space */}
      {emailNewsletterSignup && (
        <div style={{ marginTop: theme.spacing.l }}>
          <NewsletterSignupCTA />
        </div>
      )}
    </div>
  );
}
