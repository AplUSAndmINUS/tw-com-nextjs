'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedPageWrapper } from '@/components/UnifiedPageWrapper';
import { Typography } from '@/components/Typography';
import { AdaptiveCardGrid, AdaptiveCard } from '@/components/AdaptiveCardGrid';
import { Callout } from '@/components/Callout';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useContentFilterStore, ViewType } from '@/store';
import { useIsMobile } from '@/hooks/useMediaQuery';
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
    return (
      <>
        {safeFilters.map((filter, index) => {
          if (filter.type === 'single') {
            return (
              <FormSelect
                key={index}
                label={filter.label}
                options={filter.options}
                value={filter.value}
                onChange={filter.onChange}
                placeholder={filter.placeholder || `Select ${filter.label}`}
              />
            );
          }
          // Multi-select not implemented yet - can be added later
          return null;
        })}

        {/* View Type Selector */}
        <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
          <FormSelect
            label='View'
            options={viewOptions}
            value={viewType}
            onChange={(value) => setViewType((value as ViewType) || 'grid')}
          />
        </div>
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
                display: 'flex',
                flexWrap: 'wrap',
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
