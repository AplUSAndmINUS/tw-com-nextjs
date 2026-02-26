'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaVariant = 'default' | 'outlined' | 'filled';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  /** Textarea variant */
  variant?: TextareaVariant;
  /** Textarea size */
  size?: TextareaSize;
  /** Label text */
  label?: string;
  /** Helper text below textarea */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Full width textarea */
  fullWidth?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Resize behavior */
  resize?: TextareaResize;
  /** Character count display */
  showCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
}

/**
 * Textarea Component
 *
 * Standardized multi-line text input with validation states.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Message"
 *   rows={4}
 *   maxLength={500}
 *   showCount
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      label,
      helperText,
      error,
      success,
      fullWidth = true,
      required = false,
      disabled = false,
      resize = 'vertical',
      showCount = false,
      maxLength,
      className = '',
      style,
      id,
      value,
      defaultValue,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [currentValue, setCurrentValue] = useState(
      value || defaultValue || ''
    );
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const sizeConfig = {
      small: {
        fontSize: '0.875rem',
        padding: '0.5rem 0.75rem',
      },
      medium: {
        fontSize: '1rem',
        padding: '0.75rem 1rem',
      },
      large: {
        fontSize: '1.125rem',
        padding: '1rem 1.25rem',
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

    const textareaStyles: React.CSSProperties = {
      width: '100%',
      minHeight: `${rows * 1.5}rem`,
      padding: config.padding,
      fontSize: config.fontSize,
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: theme.semanticColors.text.primary,
      borderRadius: theme.borderRadius.container.small,
      outline: 'none',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
      resize,
      lineHeight: 1.5,
      ...getVariantStyles(),
    };

    const labelStyles: React.CSSProperties = {
      fontSize: '0.875rem',
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

    const countStyles: React.CSSProperties = {
      fontSize: '0.75rem',
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: theme.palette.neutralSecondary,
      textAlign: 'right',
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentValue(e.target.value);
      if (rest.onChange) {
        rest.onChange(e);
      }
    };

    const currentLength = String(currentValue).length;

    return (
      <div
        className={`tw-textarea-container ${className}`}
        style={containerStyles}
      >
        {label && (
          <label htmlFor={textareaId} style={labelStyles}>
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

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          style={textareaStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...rest}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {(error || success || helperText) && (
            <span style={messageStyles}>{error || success || helperText}</span>
          )}

          {showCount && maxLength && (
            <span style={countStyles}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
