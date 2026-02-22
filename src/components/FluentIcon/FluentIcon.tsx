'use client';

/**
 * FluentIcon Component
 * Wrapper for Fluent UI v9 icons with theme integration and SSR safety
 *
 * Fluent UI v9 icons come in pre-sized variants. Import the size you need:
 * - Icon16Regular (16px)
 * - Icon20Regular (20px)
 * - Icon24Regular (24px)
 * - Icon28Regular (28px)
 * - Icon32Regular (32px)
 * - Icon48Regular (48px)
 *
 * Icons are colored via the `primaryFill` prop, which directly sets the SVG fill.
 */

import React, { useState, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import type { FluentIcon as FluentIconComponent } from '@fluentui/react-icons';

export interface FluentIconProps {
  /**
   * Fluent UI v9 icon component (pre-sized variant)
   * @example
   * import { Home16Regular, Home24Regular, Home48Regular } from '@fluentui/react-icons';
   * <FluentIcon iconName={Home24Regular} variant="primary" />
   */
  iconName: FluentIconComponent | React.ComponentType<any>;
  /** Custom color (overrides variant) */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles for the wrapper */
  style?: React.CSSProperties;
  /** Semantic color variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * FluentIcon - Renders Fluent UI v9 icons with theme-aware colors
 *
 * @example
 * ```tsx
 * import { Home24Regular, Search20Regular } from '@fluentui/react-icons';
 *
 * <FluentIcon iconName={Home24Regular} variant="primary" />
 * <FluentIcon iconName={Search20Regular} color="#ff0000" />
 * ```
 */
export const FluentIcon: React.FC<FluentIconProps> = ({
  iconName,
  color,
  className,
  style,
  variant,
  'aria-label': ariaLabel,
  onClick,
}) => {
  const { theme } = useAppTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getVariantColor = (): string => {
    if (color) return color;

    switch (variant) {
      case 'primary':
        return theme.colorBrandForeground1;
      case 'secondary':
        return theme.colorBrandForeground2;
      case 'success':
        return theme.colorPaletteGreenForeground1;
      case 'warning':
        return theme.colorPaletteYellowForeground1;
      case 'error':
        return theme.colorPaletteRedForeground1;
      case 'info':
        return theme.colorPaletteBlueForeground2;
      default:
        return theme.colorNeutralForeground1;
    }
  };

  const iconColor = getVariantColor();

  const wrapperStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : undefined,
    lineHeight: 0, // Prevents extra spacing around icon
    ...style,
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <span
        style={wrapperStyles}
        className={className}
        aria-hidden='true'
        suppressHydrationWarning
      />
    );
  }

  const IconComponent = iconName as React.ComponentType<any>;

  return (
    <span
      style={wrapperStyles}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <IconComponent primaryFill={iconColor} style={{ color: iconColor }} />
    </span>
  );
};

export default FluentIcon;
