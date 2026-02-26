'use client';

import React from 'react';
import {
  Button,
  ButtonProps as FluentButtonProps,
} from '@fluentui/react-components';

export interface FormButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is full width */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button type for forms */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * FormButton Component
 *
 * Fluent UI v9 button component for forms and actions
 *
 * @example
 * ```tsx
 * <FormButton variant="primary" onClick={handleSubmit}>
 *   Submit
 * </FormButton>
 * ```
 */
export const FormButton: React.FC<FormButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  children,
  ...rest
}) => {
  const getAppearance = (): FluentButtonProps['appearance'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      case 'subtle':
        return 'subtle';
      case 'transparent':
        return 'transparent';
      default:
        return 'primary';
    }
  };

  return (
    <Button
      appearance={getAppearance()}
      size={size}
      style={{
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};
