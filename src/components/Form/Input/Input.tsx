'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import type { FluentIcon as FluentIconType } from '@fluentui/react-icons';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'outlined' | 'filled';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Input variant */
  variant?: InputVariant;
  /** Input size */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Icon before input */
  iconBefore?: FluentIconType;
  /** Icon after input */
  iconAfter?: FluentIconType;
  /** Full width input */
  fullWidth?: boolean;
  /** Required field indicator */
  required?: boolean;
}

/**
 * Input Component
 *
 * Standardized text input with validation states and icon support.
 *
 * @example
 * ```tsx
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Search" iconBefore={Search24Regular} />
 * <Input label="Password" type="password" error="Password is required" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      label,
      helperText,
      error,
      success,
      iconBefore,
      iconAfter,
      fullWidth = false,
      required = false,
      disabled = false,
      className = '',
      style,
      id,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Size configurations
    const sizeConfig = {
      small: {
        height: '2rem',
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem',
      },
      medium: {
        height: '2.5rem',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
      },
      large: {
        height: '3rem',
        fontSize: '1.125rem',
        padding: '0.75rem 1.25rem',
      },
    };

    const config = sizeConfig[size];

    // Determine border color based on state
    const getBorderColor = () => {
      if (error) return theme.colorPaletteRedForeground1;
      if (success) return theme.colorPaletteGreenForeground1;
      if (isFocused) return theme.semanticColors.focus.ring;
      return theme.palette.neutralQuaternary;
    };

    // Variant styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'outlined':
          return {
            backgroundColor: 'transparent',
            border: `2px solid ${getBorderColor()}`,
          };
        case 'filled':
          return {
            backgroundColor: theme.palette.neutralLighter,
            border: `2px solid ${getBorderColor()}`,
          };
        default:
          return {
            backgroundColor: theme.semanticColors.background.base,
            border: `1px solid ${getBorderColor()}`,
          };
      }
    };

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    const inputWrapperStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    };

    const inputStyles: React.CSSProperties = {
      width: '100%',
      height: config.height,
      padding: config.padding,
      paddingLeft: iconBefore
        ? `calc(${config.padding} + 1.5rem)`
        : config.padding,
      paddingRight: iconAfter
        ? `calc(${config.padding} + 1.5rem)`
        : config.padding,
      fontSize: config.fontSize,
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: theme.semanticColors.text.primary,
      borderRadius: theme.borderRadius.container.small,
      outline: 'none',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
      ...getVariantStyles(),
    };

    const labelStyles: React.CSSProperties = {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.semanticColors.text.primary,
      fontFamily: theme.typography.fonts.body.fontFamily,
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: error
        ? theme.colorPaletteRedForeground1
        : success
          ? theme.colorPaletteGreenForeground1
          : theme.palette.neutralSecondary,
    };

    const messageStyles: React.CSSProperties = {
      fontSize: '0.75rem',
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: error
        ? theme.colorPaletteRedForeground1
        : success
          ? theme.colorPaletteGreenForeground1
          : theme.palette.neutralSecondary,
    };

    return (
      <div
        className={`tw-input-container ${className}`}
        style={containerStyles}
      >
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
            {required && (
              <span
                style={{
                  color: theme.colorPaletteRedForeground1,
                  marginLeft: '0.25rem',
                }}
              >
                *
              </span>
            )}
          </label>
        )}

        <div style={inputWrapperStyles}>
          {iconBefore && (
            <div style={{ ...iconStyles, left: '0.75rem' }}>
              <FluentIcon iconName={iconBefore} />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            style={inputStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />

          {iconAfter && (
            <div style={{ ...iconStyles, right: '0.75rem' }}>
              <FluentIcon iconName={iconAfter} />
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <span style={messageStyles}>{error || success || helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
