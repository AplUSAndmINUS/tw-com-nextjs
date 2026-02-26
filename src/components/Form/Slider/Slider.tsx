'use client';

import React, { forwardRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export type SliderSize = 'small' | 'medium' | 'large';

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Slider size */
  size?: SliderSize;
  /** Label text */
  label?: string;
  /** Helper text below slider */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Show current value */
  showValue?: boolean;
  /** Value formatter function */
  formatValue?: (value: number) => string;
  /** Show min/max labels */
  showMinMax?: boolean;
  /** Full width slider */
  fullWidth?: boolean;
}

/**
 * Slider Component
 *
 * Standardized range slider with value display.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   min={0}
 *   max={100}
 *   value={50}
 *   showValue
 * />
 * ```
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      size = 'medium',
      label,
      helperText,
      error,
      showValue = true,
      formatValue,
      showMinMax = false,
      fullWidth = true,
      disabled = false,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      className = '',
      style,
      id,
      onChange,
      ...rest
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const [currentValue, setCurrentValue] = useState(
      Number(value || defaultValue || min)
    );
    const [isFocused, setIsFocused] = useState(false);
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;

    const sizeConfig = {
      small: {
        height: '0.25rem',
        thumbSize: '0.875rem',
        fontSize: '0.875rem',
      },
      medium: {
        height: '0.375rem',
        thumbSize: '1.125rem',
        fontSize: '1rem',
      },
      large: {
        height: '0.5rem',
        thumbSize: '1.375rem',
        fontSize: '1.125rem',
      },
    };

    const config = sizeConfig[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setCurrentValue(newValue);
      if (onChange) {
        onChange(e);
      }
    };

    const percentage =
      ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100;

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    const headerStyles: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.semanticColors.text.primary,
      fontFamily: theme.typography.fonts.body.fontFamily,
    };

    const valueStyles: React.CSSProperties = {
      fontSize: config.fontSize,
      fontWeight: 600,
      color: theme.semanticColors.link.default,
      fontFamily: theme.typography.fonts.body.fontFamily,
    };

    const sliderWrapperStyles: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      padding: `${config.thumbSize} 0`,
    };

    const trackStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: config.height,
      transform: 'translateY(-50%)',
      borderRadius: config.height,
      backgroundColor: theme.palette.neutralLight,
      overflow: 'hidden',
    };

    const progressStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${percentage}%`,
      backgroundColor: error
        ? theme.colorPaletteRedForeground1
        : theme.semanticColors.link.default,
      transition: 'width 0.1s ease',
    };

    const sliderStyles: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      height: config.height,
      margin: 0,
      padding: 0,
      background: 'transparent',
      WebkitAppearance: 'none',
      appearance: 'none',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      zIndex: 1,
    };

    const thumbStyles = `
      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: ${config.thumbSize};
        height: ${config.thumbSize};
        border-radius: 50%;
        background: ${error ? theme.colorPaletteRedForeground1 : theme.semanticColors.link.default};
        border: 2px solid ${theme.palette.white};
        box-shadow: ${theme.shadows.button};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        transition: transform 0.2s ease;
      }
      
      input[type='range']::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }
      
      input[type='range']::-webkit-slider-thumb:active {
        transform: scale(0.95);
      }
      
      input[type='range']::-moz-range-thumb {
        width: ${config.thumbSize};
        height: ${config.thumbSize};
        border-radius: 50%;
        background: ${error ? theme.colorPaletteRedForeground1 : theme.semanticColors.link.default};
        border: 2px solid ${theme.palette.white};
        box-shadow: ${theme.shadows.button};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        transition: transform 0.2s ease;
      }
      
      input[type='range']::-moz-range-thumb:hover {
        transform: scale(1.1);
      }
      
      input[type='range']::-moz-range-thumb:active {
        transform: scale(0.95);
      }
    `;

    const minMaxStyles: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: theme.palette.neutralSecondary,
      fontFamily: theme.typography.fonts.body.fontFamily,
    };

    const messageStyles: React.CSSProperties = {
      fontSize: '0.75rem',
      fontFamily: theme.typography.fonts.body.fontFamily,
      color: error
        ? theme.colorPaletteRedForeground1
        : theme.palette.neutralSecondary,
    };

    const displayValue = formatValue
      ? formatValue(currentValue)
      : String(currentValue);

    return (
      <>
        <style>{thumbStyles}</style>
        <div
          className={`tw-slider-container ${className}`}
          style={containerStyles}
        >
          {(label || showValue) && (
            <div style={headerStyles}>
              {label && (
                <label htmlFor={sliderId} style={labelStyles}>
                  {label}
                </label>
              )}
              {showValue && <span style={valueStyles}>{displayValue}</span>}
            </div>
          )}

          <div style={sliderWrapperStyles}>
            <div style={trackStyles}>
              <div style={progressStyles} />
            </div>

            <input
              ref={ref}
              type='range'
              id={sliderId}
              min={min}
              max={max}
              step={step}
              value={value !== undefined ? value : currentValue}
              disabled={disabled}
              style={sliderStyles}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-valuemin={Number(min)}
              aria-valuemax={Number(max)}
              aria-valuenow={Number(currentValue)}
              {...rest}
            />
          </div>

          {showMinMax && (
            <div style={minMaxStyles}>
              <span>{min}</span>
              <span>{max}</span>
            </div>
          )}

          {(error || helperText) && (
            <span style={messageStyles}>{error || helperText}</span>
          )}
        </div>
      </>
    );
  }
);

Slider.displayName = 'Slider';
