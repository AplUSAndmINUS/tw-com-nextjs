'use client';

import React from 'react';
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

  // Resolve icon names to components
  const BackArrowIcon = resolveIconName('ArrowLeft24Regular');
  const IconComponent = iconName ? resolveIconName(iconName) : undefined;

  /** Truncates text to first sentence (up to and including first period) */
  const getFirstSentence = (text: string): string => {
    const periodIndex = text.indexOf('.');
    if (periodIndex === -1) {
      return text;
    }
    return text.substring(0, periodIndex + 1);
  };

  return (
    <div
      className={`${className}`}
      style={{
        border: showBorder
          ? `1px solid ${theme.palette.neutralTertiary}`
          : 'none',
        backgroundColor:
          theme.themeMode === 'high-contrast'
            ? theme.semanticColors.background.base
            : theme.palette.neutralLight,
        padding: isMobile
          ? `${theme.spacing.l}`
          : isTablet
            ? `${theme.spacing.xl} ${theme.spacing.xxl}`
            : `${theme.spacing.xxl} ${theme.spacing.xxxl}`,
        borderRadius: theme.borderRadius.container.medium,
        boxShadow: showShadow ? theme.shadows.hero : 'none',
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
                backgroundColor: theme.palette.neutralLighter,
                border: `1px solid ${theme.palette.neutralQuaternary}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.palette.neutralLight;
                e.currentTarget.style.borderColor =
                  theme.palette.neutralTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.palette.neutralLighter;
                e.currentTarget.style.borderColor =
                  theme.palette.neutralQuaternary;
              }}
            >
              <BackArrowIcon
                style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  color: theme.palette.themePrimary,
                }}
              />
            </div>
          </Link>
        )}
        {IconComponent && (
          <IconComponent
            style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              color: theme.palette.themePrimary,
              flexShrink: 0,
            }}
          />
        )}
        <Typography
          variant='h1'
          style={{
            color: theme.palette.neutralPrimary,
            margin: 0,
            fontSize: isMobile ? '1.75rem' : '2.5rem',
            lineHeight: 1.2,
            flex: 1,
          }}
        >
          {title}
        </Typography>
      </div>

      {subtitle && (
        <Typography
          variant='h2'
          style={{
            fontStyle: 'italic',
            color: theme.palette.neutralSecondary,
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
                color: theme.palette.neutralSecondary,
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
                color: theme.palette.neutralSecondary,
                margin: 0,
              }}
            >
              <strong>Last Updated:</strong> {lastUpdated}
            </Typography>
          )}
        </div>
      )}

      {description && (
        <Typography
          variant='body'
          style={{
            color: theme.palette.neutralSecondary,
            fontSize: isMobile ? '0.9375rem' : '1.0625rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {isMobile ? getFirstSentence(description) : description}
        </Typography>
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
