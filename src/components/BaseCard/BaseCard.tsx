'use client';

import React from 'react';
import Link from 'next/link';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useCardState } from '@/hooks/useCardState';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { resolveIconName, type FluentIconName } from '@/utils/iconResolver';

export interface BaseCardProps {
  /** Card heading */
  title: string;
  /** Secondary line below the title — coloured with the current interaction colour */
  subheading?: string;
  /** Main content area. Pass a string for auto-styled body text, or any ReactNode for custom content */
  body?: React.ReactNode;
  /** Small label/meta text at the bottom of the content block */
  label?: string;
  /** Optional CTA text rendered below body/label */
  cta?: string;
  /** Fluent icon displayed to the left of the title */
  icon?: FluentIconName;
  /** When set the card renders as a Next.js `<Link>` */
  href?: string;
  /** Click handler for non-link clickable cards */
  onClick?: () => void;
  /** Whether hover/focus triggers the interaction visual state. Default: true */
  hoverable?: boolean;
  /** Show the cursor as a pointer when hovering over the card */
  pointer?: boolean;
  /** Disable all interactions and reduce opacity */
  disabled?: boolean;
  /** Badge text shown in the top-right corner (e.g. "Coming Soon!") */
  badge?: string;
  /** aria-label for the card */
  ariaLabel?: string;
  /** Additional slot rendered after body/label, before cta */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BaseCard
 *
 * Reusable card primitive used across Services, Content Hub, About FeaturedProjects,
 * WhatWeOffer, and similar listing surfaces.
 *
 * Design system:
 * - Top accent bar transitions from `restStateColor` → `accentColor` on hover/focus
 * - Gradient shimmer: brand-tinted in light mode, white shimmer in dark mode (toned-down
 *   from the ~0.52 opacity used on About FeaturedProjects)
 * - Border intensifies to `accentColor` on interaction
 * - Scale + shadow elevation transition on hover
 *
 * Behaviour:
 * - Default: hoverable, non-clickable (purely visual feedback)
 * - `href` prop → rendered as `<Link>` (fully keyboard accessible)
 * - `onClick` prop → rendered as a `role="button"` div with keyboard support
 *
 * @example
 * ```tsx
 * <BaseCard
 *   title="Enterprise Design"
 *   subheading="Q3 2025 — Q1 2026"
 *   body="Led architecture and front-end across the full product lifecycle."
 *   label="Next.js · Azure · Design Systems"
 *   icon="DesignIdeasFilled"
 *   href="/portfolio/enterprise-design"
 *   cta="View case study"
 * />
 * ```
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subheading,
  body,
  label,
  cta,
  icon,
  href,
  onClick,
  hoverable = true,
  disabled = false,
  badge,
  ariaLabel,
  children,
  className,
  style,
}) => {
  const { theme } = useAppTheme();
  const isClickable = !disabled && !!(href || onClick);

  const {
    isHovered,
    currentColor,
    topBarColor,
    borderColor,
    backgroundImage,
    backgroundColor,
    boxShadow,
    interactionProps,
  } = useCardState({
    hoverable: hoverable && !disabled,
    clickable: isClickable,
  });

  const IconComponent = icon ? resolveIconName(icon) : undefined;

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.container.medium,
    border: `1px solid ${borderColor}`,
    backgroundColor,
    backgroundImage,
    padding: href ? theme.spacing.base : theme.spacing.l,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, background-image 0.2s ease',
    transform: isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
    boxShadow,
    cursor: disabled ? 'not-allowed' : isClickable ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const cardContent = (
    <>
      {/* Optional badge — top-right corner */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: theme.spacing.s,
            right: theme.spacing.s,
            backgroundColor: theme.colorPaletteRoyalBlueForeground2,
            color: theme.palette.white,
            padding: `${theme.spacing.xxs} ${theme.spacing.xs}`,
            borderRadius: theme.borderRadius.container.small,
            fontSize: '0.6875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: theme.shadows.button,
            zIndex: 1,
          }}
        >
          {badge}
        </div>
      )}

      {/* Accent line */}
      <div
        style={{
          width: '100%',
          height: '4px',
          borderRadius: theme.borderRadius.container.small,
          backgroundColor: topBarColor,
          marginBottom: theme.spacing.m,
          flexShrink: 0,
          transition: 'background-color 0.2s ease',
        }}
      />

      {/* Title row — optional icon sits to the left */}
      <div
        style={{
          display: 'flex',
          gap: theme.spacing.s,
          marginBottom: subheading ? theme.spacing.xs : theme.spacing.m,
          alignItems: 'center',
        }}
      >
        {IconComponent && (
          <div
            style={{
              flexShrink: 0,
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentColor,
              transition: 'color 0.2s ease',
            }}
          >
            <FluentIcon iconName={IconComponent} />
          </div>
        )}
        <Typography
          variant='h3'
          style={{
            color: theme.semanticColors.text.heading,
            fontSize: href ? '1.5rem' : '1.25rem',
            lineHeight: 1.25,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      </div>

      {/* Subheading — adopts interaction colour */}
      {subheading && (
        <Typography
          variant='h5'
          style={{
            fontSize: href ? '1rem' : '0.9375rem',
            lineHeight: 1.2,
            color: currentColor,
            marginBottom: theme.spacing.s,
            transition: 'color 0.2s ease',
          }}
        >
          {subheading}
        </Typography>
      )}

      {/* Body */}
      {body !== undefined && (
        <div
          style={{
            flex: 1,
            marginBottom:
              label || cta || children ? theme.spacing.s : undefined,
          }}
        >
          {typeof body === 'string' ? (
            <Typography
              variant='body'
              style={{
                color: isHovered
                  ? theme.palette.neutralPrimary
                  : theme.semanticColors.text.muted,
                fontSize: href ? '1rem' : '0.875rem',
                lineHeight: 1.5,
              }}
            >
              {body}
            </Typography>
          ) : (
            body
          )}
        </div>
      )}

      {/* Custom children slot */}
      {children}

      {/* Label — small meta/tag text */}
      {label && (
        <Typography
          variant='label'
          style={{
            fontSize: '0.75rem',
            color: isHovered
              ? theme.palette.neutralPrimary
              : theme.semanticColors.text.muted,
            marginTop: theme.spacing.xs,
          }}
        >
          {label}
        </Typography>
      )}

      {/* CTA text link */}
      {cta && (
        <span
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: isHovered ? theme.palette.neutralPrimary : currentColor,
            marginTop: theme.spacing.s,
            transition: 'color 0.2s ease',
          }}
        >
          {cta}
        </span>
      )}
    </>
  );

  // ── Link card ─────────────────────────────────────────────────────────────
  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`block h-full rounded-xl focus-visible:outline-none ${className ?? ''}`}
        aria-label={ariaLabel || title}
        onMouseEnter={interactionProps.onMouseEnter}
        onMouseLeave={interactionProps.onMouseLeave}
        onFocus={interactionProps.onFocus}
        onBlur={interactionProps.onBlur}
        style={{ padding: 0, borderWidth: 0, borderStyle: 'none', ...style }}
      >
        <div style={cardStyle}>{cardContent}</div>
      </Link>
    );
  }

  // ── Non-link, clickable div ───────────────────────────────────────────────
  if (onClick) {
    return (
      <div
        role='button'
        tabIndex={0}
        aria-disabled='false'
        className={className}
        style={cardStyle}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={handleKeyDown}
        onMouseEnter={interactionProps.onMouseEnter}
        onMouseLeave={interactionProps.onMouseLeave}
        onFocus={interactionProps.onFocus}
        onBlur={interactionProps.onBlur}
        onMouseDown={interactionProps.onMouseDown}
        onMouseUp={interactionProps.onMouseUp}
      >
        {cardContent}
      </div>
    );
  }

  // ── Plain hoverable div ───────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={cardStyle}
      onMouseEnter={interactionProps.onMouseEnter}
      onMouseLeave={interactionProps.onMouseLeave}
      onFocus={interactionProps.onFocus}
      onBlur={interactionProps.onBlur}
    >
      {cardContent}
    </div>
  );
};

export default BaseCard;
