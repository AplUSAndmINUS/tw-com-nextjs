'use client';

import { useId } from 'react';

import styles from './TwSelect.module.scss';

/**
 * A styled native <select>.
 *
 * Deliberately not a custom listbox. The native control gets the platform
 * picker on mobile, keyboard type-ahead, and screen-reader support for free —
 * all of which a div-based combobox has to reimplement and usually gets wrong.
 * `appearance: none` strips the OS chrome; everything else stays native.
 *
 * The chevron is an inline SVG rather than a background-image data URI so it
 * can inherit `currentColor` and follow the theme without a second token.
 */

export interface TwSelectOption {
  label: string;
  value: string;
}

export interface TwSelectProps {
  label?: string;
  options: TwSelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  /** Placeholder row rendered as a disabled option, e.g. 'Choose a topic'. */
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TwSelect({
  label,
  options,
  value,
  onChange,
  id,
  disabled = false,
  placeholder,
  name,
  required,
  className,
  style,
}: TwSelectProps) {
  // useId only runs when the caller has not supplied one; it is called
  // unconditionally to keep hook order stable.
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const classes = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {label ? (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <div className={styles.control}>
        <select
          id={selectId}
          name={name}
          className={styles.select}
          value={value}
          disabled={disabled}
          required={required}
          onChange={(event) => onChange(event.target.value)}
        >
          {placeholder ? (
            <option value='' disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className={styles.chevron}
          viewBox='0 0 12 8'
          width='12'
          height='8'
          aria-hidden='true'
          focusable='false'
        >
          <path
            d='M1 1.5 6 6.5 11 1.5'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    </div>
  );
}

export default TwSelect;
