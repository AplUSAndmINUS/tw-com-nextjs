'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { FluentIcon } from '@/components/FluentIcon';
import { ChevronDown24Regular } from '@fluentui/react-icons';

export type SelectSize = 'small' | 'medium' | 'large';
export type SelectVariant = 'default' | 'outlined' | 'filled';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  /** Select variant */
  variant?: SelectVariant;
  /** Select size */
  size?: SelectSize;
  /** Label text */
  label?: string;
  /** Helper text below select */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Options */
  options: SelectOption[];
  /** Placeholder */
  placeholder?: string;
  /** Full width select */
  fullWidth?: boolean;
  /** Required field indicator */
  required?: boolean;
}

/**
 * Select Component
 *
 * Standardized dropdown select with validation states.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      label,
      helperText,
      error,
      success,
      options,
      placeholder = 'Select an option',
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
    const isMobileHook = useIsMobile();
    const [isFocused, setIsFocused] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const isMobile = isMounted ? isMobileHook : false;

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    const sizeConfig = {
      small: {
        height: isMobile ? '1.875rem' : '2rem',
        fontSize: isMobile
          ? 'clamp(0.72rem, 0.68rem + 0.2vw, 0.8rem)'
          : 'clamp(0.6rem, 0.8rem + 0.2vw, 0.875rem)',
        padding: isMobile
          ? '0.3125rem 1.875rem 0.3125rem 0.625rem'
          : '0.375rem 2rem 0.375rem 0.75rem',
      },
      medium: {
        height: isMobile ? '2.25rem' : '2.5rem',
        fontSize: isMobile
          ? 'clamp(0.78rem, 0.74rem + 0.24vw, 0.875rem)'
          : 'clamp(0.875rem, 0.85rem + 0.3vw, 1rem)',
        padding: isMobile
          ? '0.4375rem 2.25rem 0.4375rem 0.75rem'
          : '0.5rem 2.5rem 0.5rem 1rem',
      },
      large: {
        height: isMobile ? '2.75rem' : '3rem',
        fontSize: isMobile
          ? 'clamp(0.9rem, 0.84rem + 0.28vw, 1rem)'
          : 'clamp(1rem, 0.9rem + 0.4vw, 1.125rem)',
        padding: isMobile
          ? '0.625rem 2.75rem 0.625rem 1rem'
          : '0.75rem 3rem 0.75rem 1.25rem',
      },
    };

    const config = sizeConfig[size];

    const getBorderColor = () => {
      if (error) return theme.colorPaletteRedForeground1;
      if (success) return theme.colorPaletteGreenForeground1;
      if (isFocused) return theme.semanticColors.focus.ring;
      return theme.palette.neutralQuaternary;
    };

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

    const selectWrapperStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    };

    const selectStyles: React.CSSProperties = {
      width: '100%',
      height: config.height,
      padding: config.padding,
      fontSize: config.fontSize,
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: theme.semanticColors.text.primary,
      borderRadius: theme.borderRadius.container.small,
      outline: 'none',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      appearance: 'none',
      ...getVariantStyles(),
    };

    const labelStyles: React.CSSProperties = {
      fontSize: isMobile
        ? 'clamp(0.72rem, 0.68rem + 0.18vw, 0.8rem)'
        : '0.875rem',
      fontWeight: 600,
      color: theme.semanticColors.text.primary,
      fontFamily: theme.typography.fonts.body.fontFamily,
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
        className={`tw-select-container ${className}`}
        style={containerStyles}
      >
        {label && (
          <label htmlFor={selectId} style={labelStyles}>
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

        <div style={selectWrapperStyles}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            style={selectStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          >
            {placeholder && (
              <option value='' disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <FluentIcon iconName={ChevronDown24Regular} />
          </div>
        </div>

        {(error || success || helperText) && (
          <span style={messageStyles}>{error || success || helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
