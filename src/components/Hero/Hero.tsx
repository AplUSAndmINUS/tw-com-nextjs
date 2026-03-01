'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { FluentIcon } from '@/components/FluentIcon';
import { resolveIconName } from '@/utils/iconResolver';

export interface HeroProps {
  /** Main heading text */
  title: string;
  /** Subtitle text (styled as italic secondary color) */
  subtitle?: string;
  /** Description text (styled as body text with relaxed line height) */
  description?: string;
  /** Effective date for legal documents */
  effectiveDate?: string;
  /** Last updated date for legal documents */
  lastUpdated?: string;
  /** Icon name from Fluent UI icons */
  iconName?: string;
  /** Additional content below description */
  children?: React.ReactNode;
  /** Optional custom className for additional styling */
  className?: string;
  /** Optional custom styles */
  style?: React.CSSProperties;
  /** Show border around hero section @default true */
  showBorder?: boolean;
  /** Show shadow on hero section @default false */
  showShadow?: boolean;
  /** Show back arrow icon next to title @default false */
  backArrow?: boolean;
  /** Path for back arrow link @default '/content' */
  backArrowPath?: string;
  /** Filter controls to display below description */
  filters?: React.ReactNode;
}

/**
 * Hero Component
 *
 * Reusable hero section for page headers with title and content.
 * Designed for consistency across all pages.
 *
 * @example
 * ```tsx
 * <Hero
 *   title="Blog"
 *   subtitle="Insights and thoughts"
 *   description="Explore articles on technology and design"
 *   iconName="DocumentText24Regular"
 * />
 * ```
 */
export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  iconName,
  description,
  children,
  className = '',
  style,
  showBorder = true,
  showShadow = false,
  backArrow = false,
  backArrowPath = '/content',
  filters,
}) => {
  const { theme } = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [isExpanded, setIsExpanded] = useState(false);

  // Resolve icon names to components
  const BackArrowIcon = resolveIconName('ArrowLeft24Regular');
  const IconComponent = iconName ? resolveIconName(iconName) : undefined;

  // Determine if description is long enough to warrant truncation (rough estimate: >150 chars)
  const shouldTruncate = description && description.length > 150;

  // Deterministic accent by title keeps visual identity per page without extra props.
  const accentPalette = useMemo(
    () => [
      theme.semanticColors.link.default,
      theme.semanticColors.link.hover,
      theme.semanticColors.link.visited,
      theme.semanticColors.border.emphasis,
      theme.palette.themePrimary,
      theme.palette.themeSecondary,
    ],
    [theme]
  );

  const accentColor = useMemo(() => {
    const hash = Array.from(title).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return accentPalette[hash % accentPalette.length];
  }, [title, accentPalette]);

  return (
    <div
      className={`${className}`}
      style={{
        border: showBorder
          ? `1px solid ${theme.semanticColors.border.default}`
          : 'none',
        borderTop: `4px solid ${accentColor}`,
        backgroundColor: theme.semanticColors.background.elevated,
        backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
        padding: isMobile
          ? `${theme.spacing.l}`
          : isTablet
            ? `${theme.spacing.xl} ${theme.spacing.xxl}`
            : `${theme.spacing.xxl} ${theme.spacing.xxxl}`,
        borderRadius: theme.borderRadius.container.medium,
        boxShadow: showShadow ? theme.shadows.hero : theme.shadows.card,
        marginTop: !isMobile && !isTablet ? theme.spacing.xl : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? theme.spacing.m : theme.spacing.xs,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: backArrow ? theme.spacing.m : theme.spacing.s1,
        }}
      >
        {backArrow && BackArrowIcon && (
          <Link href={backArrowPath} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '2rem' : '2.5rem',
                height: isMobile ? '2rem' : '2.5rem',
                borderRadius: theme.borderRadius.container.small,
                backgroundColor: theme.semanticColors.background.muted,
                border: `1px solid ${theme.semanticColors.border.default}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.semanticColors.background.base;
                e.currentTarget.style.borderColor = accentColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.semanticColors.focus.ring}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.semanticColors.background.muted;
                e.currentTarget.style.borderColor =
                  theme.semanticColors.border.default;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <BackArrowIcon
                style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  color: accentColor,
                }}
              />
            </div>
          </Link>
        )}
        {IconComponent && (
          <IconComponent
            style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              color: accentColor,
              flexShrink: 0,
              paddingRight: '0.25rem',
              width: isMobile ? '36px' : '48px',
              height: isMobile ? '36px' : '48px',
            }}
          />
        )}
        <Typography
          variant='h1'
          style={{
            color: theme.semanticColors.text.heading,
            margin: 0,
            fontSize: isMobile ? '1.75rem' : '2.5rem',
            lineHeight: 1.2,
            flex: 1,
          }}
        >
          {title}
        </Typography>
      </div>

      <div
        style={{
          width: isMobile ? '5rem' : '7rem',
          height: '0.25rem',
          borderRadius: theme.borderRadius.container.small,
          background: `linear-gradient(90deg, ${accentColor} 0%, ${theme.semanticColors.link.hover} 100%)`,
          marginTop: isMobile ? theme.spacing.xs : theme.spacing.s1,
          marginBottom: theme.spacing.s1,
        }}
      />

      {subtitle && (
        <Typography
          variant='h2'
          style={{
            fontStyle: 'italic',
            color: theme.semanticColors.text.primary,
            fontSize: isMobile ? '1rem' : '1.25rem',
            margin: 0,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {(effectiveDate || lastUpdated) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            marginTop: '0.5rem',
          }}
        >
          {effectiveDate && (
            <Typography
              variant='body'
              style={{
                fontSize: '0.875rem',
                color: theme.semanticColors.text.muted,
                margin: 0,
              }}
            >
              <strong>Effective Date:</strong> {effectiveDate}
            </Typography>
          )}
          {lastUpdated && (
            <Typography
              variant='body'
              style={{
                fontSize: '0.875rem',
                color: theme.semanticColors.text.muted,
                margin: 0,
              }}
            >
              <strong>Last Updated:</strong> {lastUpdated}
            </Typography>
          )}
        </div>
      )}

      {description && (
        <div style={{ marginBottom: '1rem' }}>
          <Typography
            variant='body'
            style={{
              color: theme.semanticColors.text.muted,
              fontSize: isMobile ? '0.9375rem' : '1.0625rem',
              lineHeight: 1.6,
              margin: 0,
              // Use CSS line-clamp for mobile when not expanded
              ...(isMobile && !isExpanded && shouldTruncate
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : {}),
            }}
          >
            {description}
          </Typography>
          {isMobile && shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='rounded-lg transition-all font-semibold hover:scale-105 active:scale-95'
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                border: `2px solid ${theme.semanticColors.border.emphasis}`,
                color: accentColor,
                backgroundColor: theme.semanticColors.background.base,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.typography.fonts.body.fontFamily,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-expanded={isExpanded ? 'true' : 'false'}
              aria-label={
                isExpanded ? 'Show less description' : 'Show more description'
              }
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {filters && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing.m,
            marginTop: theme.spacing.s1,
            alignItems: 'flex-end',
          }}
        >
          {filters}
        </div>
      )}

      {children && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? theme.spacing.s1 : theme.spacing.m,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
