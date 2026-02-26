'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export type RadioSize = 'small' | 'medium' | 'large';

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Radio size */
  size?: RadioSize;
  /** Label text */
  label?: string;
  /** Helper text below radio */
  helperText?: string;
  /** Error message */
  error?: string;
}

/**
 * Radio Component
 *
 * Standardized radio button for single selection in a group.
 *
 * @example
 * ```tsx
 * <Radio name="plan" value="free" label="Free Plan" />
 * <Radio name="plan" value="pro" label="Pro Plan" />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = 'medium',
      label,
      helperText,
      error,
      disabled = false,
      checked,
      className = '',
      style,
      id,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const sizeConfig = {
      small: {
        boxSize: '1rem',
        dotSize: '0.5rem',
        fontSize: '0.875rem',
      },
      medium: {
        boxSize: '1.25rem',
        dotSize: '0.625rem',
        fontSize: '1rem',
      },
      large: {
        boxSize: '1.5rem',
        dotSize: '0.75rem',
        fontSize: '1.125rem',
      },
    };

    const config = sizeConfig[size];

    const getBorderColor = () => {
      if (error) return theme.colorPaletteRedForeground1;
      if (checked) return theme.semanticColors.link.default;
      if (isFocused) return theme.semanticColors.focus.ring;
      return theme.palette.neutralQuaternary;
    };

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      ...style,
    };

    const radioWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };

    const radioBoxStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: config.boxSize,
      height: config.boxSize,
      flexShrink: 0,
      marginTop: '0.125rem',
      borderRadius: '50%',
      border: `2px solid ${getBorderColor()}`,
      backgroundColor: 'transparent',
      transition: 'all 0.2s ease',
    };

    const radioDotStyles: React.CSSProperties = {
      width: config.dotSize,
      height: config.dotSize,
      borderRadius: '50%',
      backgroundColor: theme.semanticColors.link.default,
      transform: checked ? 'scale(1)' : 'scale(0)',
      transition: 'transform 0.2s ease',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: config.fontSize,
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: theme.semanticColors.text.primary,
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
    };

    const messageStyles: React.CSSProperties = {
      fontSize: '0.75rem',
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: error
        ? theme.colorPaletteRedForeground1
        : theme.palette.neutralSecondary,
      marginLeft: `calc(${config.boxSize} + 0.5rem)`,
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById(radioId) as HTMLInputElement;
        if (input) {
          input.click();
        }
      }
    };

    return (
      <div
        className={`tw-radio-container ${className}`}
        style={containerStyles}
      >
        <div
          style={radioWrapperStyles}
          onClick={(e) => {
            if (disabled) return;
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT') {
              const input = document.getElementById(
                radioId
              ) as HTMLInputElement;
              if (input) {
                input.click();
              }
            }
          }}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role='radio'
          aria-checked={checked ? 'true' : 'false'}
          aria-disabled={disabled ? 'true' : 'false'}
        >
          <div style={radioBoxStyles}>
            <input
              ref={ref}
              type='radio'
              id={radioId}
              disabled={disabled}
              checked={checked}
              style={{
                position: 'absolute',
                opacity: 0,
                width: 0,
                height: 0,
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...rest}
            />
            <div style={radioDotStyles} />
          </div>

          {label && (
            <label htmlFor={radioId} style={labelStyles}>
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && (
          <span style={messageStyles}>{error || helperText}</span>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
