'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export interface FluentIconProps {
  iconName:
    | string
    | React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
      }>;
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const sizeMap = {
  xSmall: '12px',
  small: '16px',
  medium: '24px',
  large: '32px',
  xLarge: '48px',
};

/**
 * FluentIcon component for rendering icons
 * Supports both Fluent UI v9 icon components and custom SVG components
 *
 * @example
 * ```tsx
 * import { HomeRegular } from '@fluentui/react-icons';
 *
 * <FluentIcon iconName={HomeRegular} size="medium" variant="primary" />
 * <FluentIcon iconName={CustomSvgComponent} size="large" color="#ff0000" />
 * ```
 */
export const FluentIcon: React.FC<FluentIconProps> = ({
  iconName,
  size = 'medium',
  color,
  className,
  style,
  variant,
}) => {
  const { theme } = useAppTheme();

  const getVariantColor = () => {
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

  const iconStyles: React.CSSProperties = {
    width: sizeMap[size],
    height: sizeMap[size],
    fontSize: sizeMap[size],
    color: getVariantColor(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  // If iconName is a React component (Fluent UI v9 icon or custom SVG)
  if (typeof iconName === 'function') {
    const IconComponent = iconName;
    return (
      <div style={iconStyles} className={className}>
        <IconComponent
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
          }}
        />
      </div>
    );
  }

  // If iconName is a string, render as text (fallback)
  return (
    <div style={iconStyles} className={className}>
      <span>{iconName}</span>
    </div>
  );
};
