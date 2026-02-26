'use client';

import React, { forwardRef } from 'react';
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
      const baseStyles = {
        border: '2px solid transparent',
        transition: 'all 0.2s ease',
      };

      switch (variant) {
        case 'primary':
          return {
            ...baseStyles,
            backgroundColor: theme.semanticColors.link.default,
            color: theme.semanticColors.background.base,
            borderColor: theme.semanticColors.link.default,
            ':hover': !disabled && {
              backgroundColor: theme.semanticColors.link.hover,
              borderColor: theme.semanticColors.link.hover,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              backgroundColor: theme.semanticColors.link.active,
              borderColor: theme.semanticColors.link.active,
              transform: 'scale(0.98)',
            },
          };

        case 'secondary':
          return {
            ...baseStyles,
            backgroundColor: theme.palette.neutralLighter,
            color: theme.palette.neutralDark,
            borderColor: theme.palette.neutralQuaternary,
            ':hover': !disabled && {
              backgroundColor: theme.palette.neutralLight,
              borderColor: theme.palette.neutralTertiary,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              backgroundColor: theme.palette.neutralQuaternaryAlt,
              transform: 'scale(0.98)',
            },
          };

        case 'outlined':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            color: theme.semanticColors.text.primary,
            borderColor: theme.semanticColors.border.emphasis,
            ':hover': !disabled && {
              backgroundColor: theme.palette.neutralLighter,
              borderColor: theme.semanticColors.link.hover,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              backgroundColor: theme.palette.neutralLight,
              transform: 'scale(0.98)',
            },
          };

        case 'ghost':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            color: theme.semanticColors.text.primary,
            borderColor: 'transparent',
            ':hover': !disabled && {
              backgroundColor: theme.palette.neutralLighter,
            },
            ':active': !disabled && {
              backgroundColor: theme.palette.neutralLight,
            },
          };

        case 'success':
          return {
            ...baseStyles,
            backgroundColor: theme.colorPaletteGreenForeground1,
            color: theme.palette.white,
            borderColor: theme.colorPaletteGreenForeground1,
            ':hover': !disabled && {
              backgroundColor: theme.colorPaletteGreenForeground2,
              borderColor: theme.colorPaletteGreenForeground2,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              transform: 'scale(0.98)',
            },
          };

        case 'warning':
          return {
            ...baseStyles,
            backgroundColor: theme.colorPaletteYellowForeground1,
            color: theme.palette.neutralPrimary,
            borderColor: theme.colorPaletteYellowForeground1,
            ':hover': !disabled && {
              backgroundColor: theme.colorPaletteYellowForeground2,
              borderColor: theme.colorPaletteYellowForeground2,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              transform: 'scale(0.98)',
            },
          };

        case 'error':
          return {
            ...baseStyles,
            backgroundColor: theme.colorPaletteRedForeground1,
            color: theme.palette.white,
            borderColor: theme.colorPaletteRedForeground1,
            ':hover': !disabled && {
              backgroundColor: theme.palette.redDark,
              borderColor: theme.palette.redDark,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              transform: 'scale(0.98)',
            },
          };

        case 'info':
          return {
            ...baseStyles,
            backgroundColor: theme.palette.themePrimary,
            color: theme.palette.white,
            borderColor: theme.palette.themePrimary,
            ':hover': !disabled && {
              backgroundColor: theme.palette.themeDark,
              borderColor: theme.palette.themeDark,
              transform: 'scale(1.02)',
            },
            ':active': !disabled && {
              transform: 'scale(0.98)',
            },
          };

        default:
          return baseStyles;
      }
    };

    const variantStyles = getVariantStyles();
    const config = sizeConfig[size];

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
      ...variantStyles,
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
          {...rest}
        >
          {renderContent()}
        </button>
      </>
    );
  }
);

Button.displayName = 'Button';
