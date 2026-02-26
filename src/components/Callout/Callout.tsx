'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';

export interface CalloutProps {
  /**
   * Visual intensity variant
   * - 'accent': Full accent color (for important quotes/highlights)
   * - 'subtle': Softer appearance with primary color dominance
   * - 'neutral': Minimal accent, theme-primary focused
   */
  variant?: 'accent' | 'subtle' | 'neutral';
  /** Main heading text */
  title: string;
  /** Optional subtitle or supporting text */
  subtitle?: string;
  /** Body content */
  children?: React.ReactNode;
  /** Optional action element (button, link, etc.) */
  action?: React.ReactNode;
  /** Custom icon or decorative element */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * Callout Component
 *
 * DSM-compliant callout component for highlighting important information.
 * Supports three variants for different visual intensity levels.
 *
 * @example
 * ```tsx
 * <Callout
 *   variant="accent"
 *   title="Important Note"
 *   subtitle="Please read carefully"
 * >
 *   <p>This is an important message...</p>
 * </Callout>
 * ```
 */
export const Callout: React.FC<CalloutProps> = ({
  variant = 'subtle',
  title,
  subtitle,
  children,
  action,
  icon,
  className,
}) => {
  const { theme } = useAppTheme();

  // Variant-specific styling
  const getVariantStyles = React.useMemo(() => {
    const baseStyles = {
      padding: `${theme.spacing.l} ${theme.spacing.xl}`,
      borderRadius: theme.borderRadius.container.medium,
    };

    switch (variant) {
      case 'accent':
        // Strong accent presence - for quotes and key highlights
        return {
          ...baseStyles,
          border: `1px solid ${theme.palette.neutralQuaternary}`,
          backgroundColor:
            theme.themeMode === 'high-contrast'
              ? theme.semanticColors.background.base
              : theme.palette.neutralLighterAlt,
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          boxShadow: `0 0 0 1px ${theme.palette.neutralQuaternary}`,
        };

      case 'subtle':
        // Balanced appearance - softer accent, primary color focus
        return {
          ...baseStyles,
          border: `1px solid ${theme.palette.neutralQuaternary}`,
          backgroundColor:
            theme.themeMode === 'high-contrast'
              ? theme.semanticColors.background.base
              : theme.palette.neutralLighterAlt,
          borderTop: `3px solid ${theme.palette.themePrimary}`,
          boxShadow: theme.shadows.card,
        };

      case 'neutral':
        // Minimal accent - theme-primary only
        return {
          ...baseStyles,
          border: `1px solid ${theme.palette.neutralQuaternary}`,
          backgroundColor:
            theme.themeMode === 'high-contrast'
              ? theme.semanticColors.background.base
              : theme.palette.neutralLighterAlt,
          borderTop: `2px solid ${theme.palette.neutralTertiary}`,
          boxShadow: theme.shadows.card,
        };

      default:
        return baseStyles;
    }
  }, [variant, theme]);

  const getTitleColor = React.useMemo(() => {
    switch (variant) {
      case 'accent':
        return theme.palette.themePrimary; // Accent/brand color
      case 'subtle':
        return theme.palette.themePrimary; // Primary blue
      case 'neutral':
        return theme.palette.neutralPrimary; // Default text
      default:
        return theme.palette.neutralPrimary;
    }
  }, [variant, theme]);

  const getSubtitleColor = React.useMemo(() => {
    return theme.palette.neutralSecondary;
  }, [theme]);

  return (
    <div className={className} style={getVariantStyles}>
      {/* Icon (optional) */}
      {icon && <div style={{ marginBottom: theme.spacing.m }}>{icon}</div>}

      {/* Title */}
      <Typography
        variant='h3'
        style={{
          color: getTitleColor,
          marginBottom: subtitle || children ? theme.spacing.s1 : 0,
          fontSize: '1.5rem',
        }}
      >
        {title}
      </Typography>

      {/* Subtitle (optional) */}
      {subtitle && (
        <Typography
          variant='body'
          style={{
            color: getSubtitleColor,
            fontStyle: variant === 'accent' ? 'italic' : 'normal',
            marginBottom: children ? theme.spacing.m : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Body content (optional) */}
      {children && (
        <div style={{ marginBottom: action ? theme.spacing.m : 0 }}>
          {children}
        </div>
      )}

      {/* Action element (optional) */}
      {action && <div style={{ marginTop: theme.spacing.m }}>{action}</div>}
    </div>
  );
};
