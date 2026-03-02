'use client';

import React, { useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Input } from '@/components/Form/Input/Input';
import { Textarea } from '@/components/Form/Textarea/Textarea';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * ContactForm Component
 *
 * Three-field contact form (name, email, message) that submits
 * to the /api/contact Azure Function endpoint via SMTP2Go.
 */
export const ContactForm: React.FC = () => {
  const { theme } = useAppTheme();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || 'Failed to send message. Please try again.'
        );
      }

      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
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
          placeholder='enter your name'
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
          fullWidth
          maxLength={200}
          aria-label='Your name'
        />

        <Input
          label='Email'
          name='email'
          type='email'
          placeholder='enter your email'
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
          fullWidth
          maxLength={254}
          aria-label='Your email address'
        />

        <Textarea
          label='Message'
          name='message'
          placeholder='enter a message'
          value={form.message}
          onChange={handleChange}
          error={errors.message}
          required
          fullWidth
          rows={5}
          maxLength={5000}
          showCount
          aria-label='Your message'
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
            disabled={isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </form>
  );
};
