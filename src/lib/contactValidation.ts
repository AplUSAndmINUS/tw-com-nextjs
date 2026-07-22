/**
 * Contact Form Validation
 *
 * Validation rules and utilities for the contact form.
 */

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormTouched {
  name: boolean;
  email: boolean;
  message: boolean;
}

/**
 * Validation constants
 */
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 10,
  MESSAGE_MIN_LENGTH: 15,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Validation error messages
 */
export const ERROR_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`,
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  MESSAGE_REQUIRED: 'Message is required',
  MESSAGE_TOO_SHORT: `Message must be at least ${VALIDATION_RULES.MESSAGE_MIN_LENGTH} characters`,
} as const;

/**
 * Validate name field
 */
export const validateName = (name: string): string | undefined => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return ERROR_MESSAGES.NAME_REQUIRED;
  }

  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return ERROR_MESSAGES.NAME_TOO_SHORT;
  }

  return undefined;
};

/**
 * Validate email field
 */
export const validateEmail = (email: string): string | undefined => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return ERROR_MESSAGES.EMAIL_REQUIRED;
  }

  if (!VALIDATION_RULES.EMAIL_REGEX.test(trimmedEmail)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }

  return undefined;
};

/**
 * Validate message field
 */
export const validateMessage = (message: string): string | undefined => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return ERROR_MESSAGES.MESSAGE_REQUIRED;
  }

  if (trimmedMessage.length < VALIDATION_RULES.MESSAGE_MIN_LENGTH) {
    return ERROR_MESSAGES.MESSAGE_TOO_SHORT;
  }

  return undefined;
};

/**
 * Validate entire form
 */
export const validateForm = (form: ContactFormData): ContactFormErrors => {
  return {
    name: validateName(form.name),
    email: validateEmail(form.email),
    message: validateMessage(form.message),
  };
};

/**
 * Check if form is valid (no errors)
 */
export const isFormValid = (errors: ContactFormErrors): boolean => {
  return !errors.name && !errors.email && !errors.message;
};

/**
 * Get visible errors (only show errors for touched fields)
 */
export const getVisibleErrors = (
  errors: ContactFormErrors,
  touched: ContactFormTouched
): ContactFormErrors => {
  return {
    name: touched.name ? errors.name : undefined,
    email: touched.email ? errors.email : undefined,
    message: touched.message ? errors.message : undefined,
  };
};
