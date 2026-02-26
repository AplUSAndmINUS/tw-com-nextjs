'use client';

import React from 'react';
import { Select, SelectProps, useId, Label } from '@fluentui/react-components';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export interface FormSelectOption {
  key: string;
  text: string;
}

export interface FormSelectProps extends Omit<SelectProps, 'onChange'> {
  /** Label for the select */
  label?: string;
  /** Array of options */
  options: FormSelectOption[];
  /** Selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Error message to display */
  errorMessage?: string;
}

/**
 * FormSelect Component
 *
 * Fluent UI v9 dropdown/select component for forms
 *
 * @example
 * ```tsx
 * <FormSelect
 *   label="Category"
 *   options={[
 *     { key: '', text: 'All Categories' },
 *     { key: 'tech', text: 'Technology' },
 *     { key: 'design', text: 'Design' }
 *   ]}
 *   value={selectedCategory}
 *   onChange={setSelectedCategory}
 * />
 * ```
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  errorMessage,
  style,
  ...rest
}) => {
  const selectId = useId('select');
  const { theme } = useAppTheme();

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newValue = event.target.value;
    onChange?.(newValue === '' ? undefined : newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        minWidth: '200px',
        flex: '1 1 200px',
        ...style,
      }}
    >
      {label && (
        <Label
          htmlFor={selectId}
          required={required}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.palette.neutralPrimary,
          }}
        >
          {label}
        </Label>
      )}
      <Select
        id={selectId}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      >
        {placeholder && !value && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.text}
          </option>
        ))}
      </Select>
      {errorMessage && (
        <span
          style={{
            fontSize: '0.75rem',
            color: theme.palette.redDark,
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
