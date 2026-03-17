'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Input } from '@/components/Form/Input/Input';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';

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
  const { theme, themeMode } = useAppTheme();
  const { setNewsletterSubscribed } = useNewsletterStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();

  // Auto-reset the success confirmation after 5 seconds so the form returns to input state
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setIsSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

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

      if (!canSubmit) {
        setSubmitError(
          `You've reached the submission limit. Try again in ${timeUntilReset}.`
        );
        return;
      }

      recordSubmit();
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
          setSubmitError(
            data.error || 'Failed to subscribe. Please try again.'
          );
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
    [email, setNewsletterSubscribed, canSubmit, recordSubmit, timeUntilReset]
  );

  // Hero-matching surface + gradient — mirrors the accentColor logic in Hero.tsx
  const accentColor = theme.semanticColors.accent.yellow;
  const isLightFamily =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';
  const surfaceColor = isLightFamily
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;
  const heroGradient = `linear-gradient(160deg, ${accentColor}14 0%, transparent 87%)`;

  // Show temporary confirmation after subscribing; returns to the form after the timer
  if (isSuccess) {
    return (
      <div
        className={`rounded-xl p-6 ${className}`}
        style={{
          backgroundColor: surfaceColor,
          backgroundImage: heroGradient,
          border: `1px solid ${theme.semanticColors.border.default}`,
          borderTop: `4px solid ${accentColor}`,
        }}
      >
        <Typography
          variant='h3'
          style={{
            color: accentColor,
            marginBottom: theme.spacing.s1,
          }}
        >
          You&apos;re subscribed! 🎉
        </Typography>
        <Typography
          variant='body'
          style={{ color: theme.semanticColors.text.muted }}
        >
          Welcome to the Mythmaker Drop. Watch your inbox for the first
          newsletter arriving soon!
        </Typography>
        <Typography
          variant='label'
          style={{
            color: theme.semanticColors.text.muted,
            fontSize: '0.75rem',
            marginTop: theme.spacing.m,
            display: 'block',
          }}
        >
          Changed your mind?{' '}
          <Link
            href='/unsubscribe'
            style={{
              color: theme.palette.neutralPrimary,
              textDecoration: 'underline',
            }}
          >
            Unsubscribe
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-6 ${className}`}
      style={{
        backgroundColor: surfaceColor,
        backgroundImage: heroGradient,
        border: `1px solid ${theme.semanticColors.border.default}`,
        borderTop: `4px solid ${accentColor}`,
      }}
    >
      <Typography
        variant='h3'
        style={{
          marginBottom: theme.spacing.s1,
          color: accentColor,
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
          <div
            style={{ display: 'flex', gap: theme.spacing.s1, flexWrap: 'wrap' }}
          >
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
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: '1.5rem',
              }}
            >
              <Button
                type='submit'
                variant='primary'
                loading={isLoading}
                disabled={isLoading || !canSubmit}
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
              marginTop: theme.spacing.m,
            }}
          >
            Biweekly newsletter. Unsubscribe at any time from the{' '}
            <Link
              href='/unsubscribe'
              style={{
                color: theme.colorBrandForeground1,
                textDecoration: 'underline',
              }}
            >
              unsubscribe page
            </Link>
            .
          </Typography>
        </div>
      </form>
    </div>
  );
};
