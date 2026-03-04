'use client';

import React, { useState, useMemo } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Input } from '@/components/Form/Input/Input';
import { Textarea } from '@/components/Form/Textarea/Textarea';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { getApiBaseUrl } from '@/lib/environment';
import {
  validateForm,
  isFormValid,
  getVisibleErrors,
  type ContactFormData,
  type ContactFormErrors,
  type ContactFormTouched,
} from './validation';

/**
 * ContactForm Component
 *
 * Three-field contact form (name, email, message) that submits
 * to the /api/contact Azure Function endpoint via SMTP2Go.
 *
 * Validation:
 * - Name: minimum 10 characters
 * - Email: valid email format
 * - Message: minimum 15 characters
 * - Errors only shown after field is touched (onBlur)
 * - Submit button disabled until all fields are valid
 *
 * Security:
 * - Google reCAPTCHA v3 protection against spam
 */
export const ContactForm: React.FC = () => {
  const { theme } = useAppTheme();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [touched, setTouched] = useState<ContactFormTouched>({
    name: false,
    email: false,
    message: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Derive errors synchronously from current form state
  const errors = useMemo(() => validateForm(form), [form]);

  // Check if submit button should be enabled
  const isSubmitDisabled = isLoading || !isFormValid(errors);

  // Get only the errors for touched fields
  const visibleErrors = getVisibleErrors(errors, touched);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields as touched on submit attempt
    setTouched({ name: true, email: true, message: true });

    // Re-validate with current form values to guarantee fresh validation
    const currentErrors = validateForm(form);
    if (!isFormValid(currentErrors)) {
      return;
    }

    setIsLoading(true);
    try {
      // Get reCAPTCHA token
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('contact_form_submit');
        } catch (recaptchaError) {
          console.error('reCAPTCHA error:', recaptchaError);
          throw new Error(
            'Unable to verify reCAPTCHA. Please try again or contact support.'
          );
        }
      }

      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || 'Failed to send message. Please try again.'
        );
      }

      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        role='status'
        aria-live='polite'
        style={{
          padding: theme.spacing.xl,
          backgroundColor: theme.semanticColors.background.elevated,
          borderRadius: theme.borderRadius.container.medium,
          border: `1px solid ${theme.semanticColors.border.default}`,
          textAlign: 'center',
        }}
      >
        <Typography
          variant='h3'
          style={{
            color: theme.semanticColors.text.heading,
            marginBottom: theme.spacing.s1,
          }}
        >
          Message Sent!
        </Typography>
        <Typography
          variant='body'
          style={{ color: theme.semanticColors.text.muted }}
        >
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible.
        </Typography>
        <a
          href='https://terencewaters.com'
          rel='noopener noreferrer'
          target='_self'
        >
          <Button
            type='button'
            variant='primary'
            aria-label='Return to home page'
          >
            Return to Home
          </Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.m,
        }}
      >
        <Input
          label='Name'
          name='name'
          type='text'
          placeholder='Enter your name (min. 10 characters)'
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleErrors.name}
          required
          fullWidth
          maxLength={200}
          aria-label='Your name'
          aria-invalid={!!visibleErrors.name}
          aria-describedby={visibleErrors.name ? 'name-error' : undefined}
        />

        <Input
          label='Email'
          name='email'
          type='email'
          placeholder='Enter your email'
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleErrors.email}
          required
          fullWidth
          maxLength={254}
          aria-label='Your email address'
          aria-invalid={!!visibleErrors.email}
          aria-describedby={visibleErrors.email ? 'email-error' : undefined}
        />

        <Textarea
          label='Message'
          name='message'
          placeholder='Enter a message (min. 15 characters)'
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleErrors.message}
          required
          fullWidth
          rows={5}
          maxLength={5000}
          showCount
          aria-label='Your message'
          aria-invalid={!!visibleErrors.message}
          aria-describedby={visibleErrors.message ? 'message-error' : undefined}
        />

        {submitError && (
          <Typography
            variant='body'
            style={{
              color: theme.colorPaletteRedForeground1,
              fontSize: '0.875rem',
            }}
          >
            {submitError}
          </Typography>
        )}

        <div>
          <Button
            type='submit'
            variant='primary'
            loading={isLoading}
            disabled={isSubmitDisabled}
            aria-label={
              isSubmitDisabled
                ? 'Complete all fields to send message'
                : 'Send message'
            }
          >
            Send Message
          </Button>
        </div>
      </div>
    </form>
  );
};
