'use client';

import React, { useState, useCallback } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Input } from '@/components/Form/Input/Input';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';

export interface NewsletterSignupCTAProps {
  /** Optional heading override */
  heading?: string;
  /** Optional description override */
  description?: string;
  /** Optional class name for the wrapper */
  className?: string;
}

/**
 * NewsletterSignupCTA Component
 *
 * Inline call-to-action banner that invites users to subscribe to the
 * "A+ in FLUX- Mythmaker Drop" newsletter. Used on /about and /contact pages.
 *
 * On successful subscription the email is written to the SharePoint Online
 * Email Distribution List via the /api/subscribe Azure Function.
 */
export const NewsletterSignupCTA: React.FC<NewsletterSignupCTAProps> = ({
  heading = 'Join the A+ in FLUX- Mythmaker Drop',
  description = 'Subscribe to my free, biweekly newsletter — where I share insights on Fluxline, The Resonance Core, and practical ways to improve your life using this powerful framework.',
  className = '',
}) => {
  const { theme, reducedTransparency } = useAppTheme();
  const { newsletterSubscribed, setNewsletterSubscribed } = useNewsletterStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      const error = validateEmail(email);
      if (error) {
        setEmailError(error);
        return;
      }

      setIsLoading(true);
      try {
        const apiUrl = `${getApiBaseUrl()}/api/subscribe`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await response.json();

        if (!response.ok) {
          setSubmitError(data.error || 'Failed to subscribe. Please try again.');
          return;
        }

        setIsSuccess(true);
        setNewsletterSubscribed(true);
      } catch {
        setSubmitError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, setNewsletterSubscribed]
  );

  // If already subscribed this session or globally, show confirmation
  if (isSuccess || newsletterSubscribed) {
    return (
      <div
        className={`rounded-xl p-6 ${className}`}
        style={{
          backgroundColor: theme.semanticColors.background.elevated,
          border: `1px solid ${theme.semanticColors.border.default}`,
        }}
      >
        <Typography
          variant='h3'
          style={{
            color: theme.colorBrandForeground1,
            marginBottom: theme.spacing.s1,
          }}
        >
          You&apos;re subscribed! 🎉
        </Typography>
        <Typography variant='body' style={{ color: theme.semanticColors.text.muted }}>
          Welcome to the Mythmaker Drop. Check your inbox for your first issue!
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-6 ${className}`}
      style={{
        backgroundColor: reducedTransparency
          ? theme.semanticColors.background.elevated
          : theme.semanticColors.background.elevated,
        border: `1px solid ${theme.semanticColors.border.default}`,
      }}
    >
      <Typography
        variant='h3'
        style={{
          marginBottom: theme.spacing.s1,
          color: theme.colorBrandForeground1,
        }}
      >
        {heading}
      </Typography>
      <Typography
        variant='body'
        style={{
          marginBottom: theme.spacing.m,
          color: theme.semanticColors.text.muted,
        }}
      >
        {description}
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.s1,
          }}
        >
          <div style={{ display: 'flex', gap: theme.spacing.s1, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input
                label='Email address'
                name='newsletter-email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(validateEmail(e.target.value));
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                error={emailError}
                fullWidth
                maxLength={254}
                aria-label='Your email address for newsletter subscription'
                aria-invalid={!!emailError}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '1.5rem' }}>
              <Button
                type='submit'
                variant='primary'
                loading={isLoading}
                disabled={isLoading}
                aria-label='Subscribe to newsletter'
              >
                Subscribe
              </Button>
            </div>
          </div>

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

          <Typography
            variant='label'
            style={{
              color: theme.semanticColors.text.muted,
              fontSize: '0.75rem',
            }}
          >
            Biweekly newsletter. Unsubscribe at any time from the{' '}
            <a
              href='/unsubscribe'
              style={{ color: theme.colorBrandForeground1, textDecoration: 'underline' }}
            >
              unsubscribe page
            </a>
            .
          </Typography>
        </div>
      </form>
    </div>
  );
};
