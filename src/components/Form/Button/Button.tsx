'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import type { FluentIcon as FluentIconType } from '@fluentui/react-icons';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon before text */
  iconBefore?: FluentIconType;
  /** Icon after text */
  iconAfter?: FluentIconType;
  /** Icon only (no text) */
  iconOnly?: FluentIconType;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Children */
  children?: React.ReactNode;
}

/**
 * Button Component
 *
 * Standardized button component with multiple variants, sizes, and states.
 * Fully integrated with the theme system.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium">Click me</Button>
 * <Button variant="outlined" iconBefore={Add24Regular}>Add Item</Button>
 * <Button variant="error" loading>Deleting...</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      loading = false,
      iconBefore,
      iconAfter,
      iconOnly,
      type = 'button',
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Extract consumer-provided mouse and pointer handlers from rest props
    const {
      onMouseEnter: consumerOnMouseEnter,
      onMouseLeave: consumerOnMouseLeave,
      onMouseDown: consumerOnMouseDown,
      onMouseUp: consumerOnMouseUp,
      onPointerEnter: consumerOnPointerEnter,
      onPointerLeave: consumerOnPointerLeave,
      onPointerDown: consumerOnPointerDown,
      onPointerUp: consumerOnPointerUp,
      ...restProps
    } = rest;

    // Pointer-based handlers — only fire for mouse input to prevent iOS stuck-hover
    const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== 'mouse') return;
      if (!disabled && !loading) setIsHovered(true);
      consumerOnMouseEnter?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      consumerOnPointerEnter?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== 'mouse') return;
      setIsHovered(false);
      setIsActive(false);
      consumerOnMouseLeave?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      consumerOnPointerLeave?.(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== 'mouse') return;
      if (!disabled && !loading) setIsActive(true);
      consumerOnMouseDown?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      consumerOnPointerDown?.(e);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== 'mouse') return;
      setIsActive(false);
      consumerOnMouseUp?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      consumerOnPointerUp?.(e);
    };

    // Size configurations
    const sizeConfig = {
      small: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
        gap: '0.375rem',
      },
      medium: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        gap: '0.5rem',
      },
      large: {
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
        gap: '0.625rem',
      },
    };

    // Variant configurations
    const getVariantStyles = () => {
      const baseTransition = {
        transition: 'all 0.2s ease',
      };

      switch (variant) {
        case 'primary':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.semanticColors.link.default,
              color: theme.semanticColors.background.base,
              border: `2px solid ${theme.semanticColors.link.default}`,
            },
            hover: {
              backgroundColor: theme.semanticColors.link.hover,
              borderColor: theme.semanticColors.link.hover,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.semanticColors.link.active,
              borderColor: theme.semanticColors.link.active,
              transform: 'scale(0.98)',
            },
          };

        case 'secondary':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.palette.neutralLighter,
              color: theme.palette.neutralDark,
              border: `2px solid ${theme.palette.neutralQuaternary}`,
            },
            hover: {
              backgroundColor: theme.palette.neutralLight,
              borderColor: theme.palette.neutralTertiary,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.palette.neutralQuaternaryAlt,
              borderColor: theme.palette.neutralTertiary,
              transform: 'scale(0.98)',
            },
          };

        case 'outlined':
          return {
            base: {
              ...baseTransition,
              backgroundColor: 'transparent',
              color: theme.semanticColors.text.primary,
              border: `2px solid ${theme.semanticColors.border.emphasis}`,
            },
            hover: {
              backgroundColor: theme.palette.neutralLighter,
              borderColor: theme.semanticColors.link.hover,
              color: theme.semanticColors.link.hover,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.palette.neutralLight,
              borderColor: theme.semanticColors.link.active,
              color: theme.semanticColors.link.active,
              transform: 'scale(0.98)',
            },
          };

        case 'ghost':
          return {
            base: {
              ...baseTransition,
              backgroundColor: 'transparent',
              color: theme.semanticColors.text.primary,
              border: '2px solid transparent',
            },
            hover: {
              backgroundColor: theme.palette.neutralLighter,
            },
            active: {
              backgroundColor: theme.palette.neutralLight,
            },
          };

        case 'success':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.colorPaletteGreenForeground1,
              color: theme.palette.white,
              border: `2px solid ${theme.colorPaletteGreenForeground1}`,
            },
            hover: {
              backgroundColor: theme.colorPaletteGreenForeground2,
              borderColor: theme.colorPaletteGreenForeground2,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.colorPaletteGreenForeground3,
              borderColor: theme.colorPaletteGreenForeground3,
              transform: 'scale(0.98)',
            },
          };

        case 'warning':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.colorPaletteYellowForeground1,
              color: theme.palette.neutralPrimary,
              border: `2px solid ${theme.colorPaletteYellowForeground1}`,
            },
            hover: {
              backgroundColor: theme.colorPaletteYellowForeground2,
              borderColor: theme.colorPaletteYellowForeground2,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.colorPaletteYellowForeground3,
              borderColor: theme.colorPaletteYellowForeground3,
              transform: 'scale(0.98)',
            },
          };

        case 'error':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.colorPaletteRedForeground1,
              color: theme.palette.white,
              border: `2px solid ${theme.colorPaletteRedForeground1}`,
            },
            hover: {
              backgroundColor: theme.palette.redDark,
              borderColor: theme.palette.redDark,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.colorPaletteRedForeground3,
              borderColor: theme.colorPaletteRedForeground3,
              transform: 'scale(0.98)',
            },
          };

        case 'info':
          return {
            base: {
              ...baseTransition,
              backgroundColor: theme.palette.themePrimary,
              color: theme.palette.white,
              border: `2px solid ${theme.palette.themePrimary}`,
            },
            hover: {
              backgroundColor: theme.palette.themeDark,
              borderColor: theme.palette.themeDark,
              transform: 'scale(1.02)',
            },
            active: {
              backgroundColor: theme.palette.themeDarker,
              borderColor: theme.palette.themeDarker,
              transform: 'scale(0.98)',
            },
          };

        default:
          return {
            base: baseTransition,
            hover: {},
            active: {},
          };
      }
    };

    const variantStyles = getVariantStyles();
    const config = sizeConfig[size];

    // Determine which state styles to apply
    const getStateStyles = () => {
      if (disabled || loading) {
        return {};
      }
      if (isActive) {
        return variantStyles.active;
      }
      if (isHovered) {
        return variantStyles.hover;
      }
      return {};
    };

    const buttonStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: config.gap,
      padding: iconOnly ? config.padding : config.padding,
      fontSize: config.fontSize,
      fontWeight: 600,
      fontFamily: theme.typography.fonts.body.fontFamily,
      borderRadius: theme.borderRadius.container.small,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      boxShadow:
        variant !== 'ghost' && variant !== 'outlined'
          ? theme.shadows.button
          : 'none',
      ...variantStyles.base,
      ...getStateStyles(),
      ...(disabled && {
        pointerEvents: 'none',
      }),
      ...style,
    };

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <span
              style={{
                width: '1em',
                height: '1em',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }}
            />
            {children && <span>{children}</span>}
          </>
        );
      }

      if (iconOnly) {
        return <FluentIcon iconName={iconOnly} />;
      }

      return (
        <>
          {iconBefore && <FluentIcon iconName={iconBefore} />}
          {children && <span>{children}</span>}
          {iconAfter && <FluentIcon iconName={iconAfter} />}
        </>
      );
    };

    return (
      <>
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          className={`tw-button ${className}`}
          style={buttonStyles}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          {...restProps}
        >
          {renderContent()}
        </button>
      </>
    );
  }
);

Button.displayName = 'Button';
