'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { Checkmark24Regular, Subtract24Regular } from '@fluentui/react-icons';

export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Checkbox size */
  size?: CheckboxSize;
  /** Label text */
  label?: string;
  /** Helper text below checkbox */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 *
 * Standardized checkbox with indeterminate state support.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" required />
 * <Checkbox label="Select all" indeterminate />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'medium',
      label,
      helperText,
      error,
      indeterminate = false,
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
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeConfig = {
      small: {
        boxSize: '1rem',
        iconSize: 16,
        fontSize: '0.875rem',
      },
      medium: {
        boxSize: '1.25rem',
        iconSize: 20,
        fontSize: '1rem',
      },
      large: {
        boxSize: '1.5rem',
        iconSize: 24,
        fontSize: '1.125rem',
      },
    };

    const config = sizeConfig[size];

    const getCheckboxBgColor = () => {
      if (checked || indeterminate) {
        return theme.semanticColors.link.default;
      }
      return 'transparent';
    };

    const getBorderColor = () => {
      if (error) return theme.colorPaletteRedForeground1;
      if (checked || indeterminate) return theme.semanticColors.link.default;
      if (isFocused) return theme.semanticColors.focus.ring;
      return theme.palette.neutralQuaternary;
    };

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      ...style,
    };

    const checkboxWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };

    const checkboxBoxStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: config.boxSize,
      height: config.boxSize,
      flexShrink: 0,
      marginTop: '0.125rem',
      borderRadius: theme.borderRadius.container.small,
      border: `2px solid ${getBorderColor()}`,
      backgroundColor: getCheckboxBgColor(),
      transition: 'all 0.2s ease',
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
        const input = document.getElementById(checkboxId) as HTMLInputElement;
        if (input) {
          input.click();
        }
      }
    };

    return (
      <div
        className={`tw-checkbox-container ${className}`}
        style={containerStyles}
      >
        <div
          style={checkboxWrapperStyles}
          onClick={(e) => {
            if (disabled) return;
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT') {
              const input = document.getElementById(
                checkboxId
              ) as HTMLInputElement;
              if (input) {
                input.click();
              }
            }
          }}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role='checkbox'
          aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
          aria-disabled={disabled ? 'true' : 'false'}
        >
          <div style={checkboxBoxStyles}>
            <input
              ref={ref}
              type='checkbox'
              id={checkboxId}
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
            {indeterminate ? (
              <FluentIcon
                iconName={Subtract24Regular}
                color={theme.palette.white}
              />
            ) : checked ? (
              <FluentIcon
                iconName={Checkmark24Regular}
                color={theme.palette.white}
              />
            ) : null}
          </div>

          {label && (
            <label htmlFor={checkboxId} style={labelStyles}>
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

Checkbox.displayName = 'Checkbox';
