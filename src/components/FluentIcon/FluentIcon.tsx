'use client';

/**
 * Icon wrapper with theme-aware colouring.
 *
 * Named FluentIcon for historical reasons — it wrapped `@fluentui/react-icons`.
 * It now renders icons from `src/components/icons`, and the name is kept only
 * because ~24 call sites use it; renaming is page-migration work.
 *
 * Two things changed with the icon set:
 *
 * - Size is a prop, not part of the component name. Fluent shipped a separate
 *   component per size (`Home24Regular`, `Home32Regular`); ours take `size`.
 * - Colour comes from the CSS `color` property via `currentColor`, not Fluent's
 *   `primaryFill`. The variant colours below are `var(--tw-*)` references, so
 *   they follow the active theme with no JS involvement.
 *
 * The old SSR mount guard is gone. It rendered an empty <span> until after
 * hydration to dodge a mismatch, which meant every icon on the page popped in
 * late. These icons are pure and deterministic, so there is nothing to guard.
 */

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import type { IconProps } from '@/components/icons';

export interface FluentIconProps {
  /**
   * Icon component from `@/components/icons`.
   *
   * @example
   * import { HomeIcon } from '@/components/icons';
   * <FluentIcon iconName={HomeIcon} variant='primary' />
   */
  iconName: React.ComponentType<IconProps>;
  /** Rendered size in pixels. Defaults to 24. */
  size?: number;
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

export const FluentIcon: React.FC<FluentIconProps> = ({
  iconName: IconComponent,
  size = 24,
  color,
  className,
  style,
  variant,
  'aria-label': ariaLabel,
  onClick,
}) => {
  const { theme } = useAppTheme();

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

  const wrapperStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : undefined,
    lineHeight: 0, // Prevents extra spacing around icon
    // The glyph paints with currentColor, so setting `color` here is what
    // actually tints it.
    color: getVariantColor(),
    ...style,
  };

  return (
    <span
      style={wrapperStyles}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      {...(onClick && { role: 'button', tabIndex: 0 })}
    >
      <IconComponent size={size} />
    </span>
  );
};

export default FluentIcon;
