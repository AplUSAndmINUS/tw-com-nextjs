'use client';

import React from 'react';
import {
  Button,
  ButtonProps as FluentButtonProps,
} from '@fluentui/react-components';

export type FormButtonProps = Omit<FluentButtonProps, 'appearance' | 'size'> & {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is full width */
  fullWidth?: boolean;
};

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
  className,
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
      {...(rest as FluentButtonProps)}
      appearance={getAppearance()}
      className={className}
      size={size}
      style={{
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
    >
      {children}
    </Button>
  );
};
