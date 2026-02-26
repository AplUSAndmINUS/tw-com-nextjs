'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { Calendar24Regular } from '@fluentui/react-icons';

export type DateInputSize = 'small' | 'medium' | 'large';
export type DateInputVariant = 'default' | 'outlined' | 'filled';

export interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Input variant */
  variant?: DateInputVariant;
  /** Input size */
  size?: DateInputSize;
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Full width input */
  fullWidth?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Show calendar icon */
  showIcon?: boolean;
}

/**
 * DateInput Component
 *
 * Standardized date input with validation states and consistent theming.
 *
 * @example
 * ```tsx
 * <DateInput label="From Date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
 * <DateInput label="To Date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
 * ```
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      label,
      helperText,
      error,
      success,
      fullWidth = false,
      required = false,
      disabled = false,
      showIcon = true,
      className = '',
      style,
      id,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputId =
      id || `date-input-${Math.random().toString(36).substr(2, 9)}`;

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
      paddingRight: showIcon
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
      right: '0.75rem',
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
        className={`tw-date-input-container ${className}`}
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
          <input
            ref={ref}
            id={inputId}
            type='date'
            disabled={disabled}
            required={required}
            style={inputStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />

          {showIcon && (
            <div style={iconStyles}>
              <FluentIcon iconName={Calendar24Regular} />
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

DateInput.displayName = 'DateInput';
