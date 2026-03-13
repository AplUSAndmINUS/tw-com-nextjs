'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Input } from '@/components/Form/Input/Input';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';

/**
 * UnsubscribePageClient
 *
 * Centered card allowing a user to unsubscribe from the newsletter.
 * Matches the translucent card style used on the home page.
 */
export function UnsubscribePageClient() {
  const { theme, reducedTransparency } = useAppTheme();
  const { setNewsletterSubscribed } = useNewsletterStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();

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
        const apiUrl = `${getApiBaseUrl()}/api/unsubscribe`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await response.json();

        if (!response.ok) {
          setSubmitError(
            data.error || 'Failed to unsubscribe. Please try again.'
          );
          return;
        }

        setIsSuccess(true);
        setNewsletterSubscribed(false);
      } catch {
        setSubmitError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, setNewsletterSubscribed, canSubmit, recordSubmit, timeUntilReset]
  );

  return (
    <PageLayout>
      <div
        style={{
          minHeight: 'calc(100vh - 4rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.m,
        }}
      >
        {/* Card matching the home page card style */}
        <div
          className={`rounded-2xl ${reducedTransparency ? '' : 'backdrop-blur-sm'}`}
          style={{
            backgroundColor: reducedTransparency
              ? theme.semanticColors.background.base
              : `${theme.semanticColors.background.elevated}cc`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${theme.semanticColors.border.default}`,
            padding: theme.spacing.xl,
            width: '100%',
            maxWidth: '480px',
          }}
        >
          {isSuccess ? (
            /* ── Confirmation State ── */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: theme.spacing.m,
              }}
            >
              <Typography
                variant='h2'
                style={{
                  color: theme.colorBrandForeground1,
                }}
              >
                You&apos;ve been unsubscribed
              </Typography>
              <Typography
                variant='body'
                style={{ color: theme.semanticColors.text.muted }}
              >
                You&apos;ve been successfully removed from the A+ in FLUX-
                Mythmaker Drop newsletter.
              </Typography>
              <Link href='/'>
                <Button
                  type='button'
                  variant='primary'
                  aria-label='Go to home page'
                >
                  Go to Home Page
                </Button>
              </Link>
            </div>
          ) : (
            /* ── Unsubscribe Form ── */
            <>
              <div
                style={{
                  marginBottom: theme.spacing.m,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant='h2'
                  style={{
                    marginBottom: theme.spacing.s1,
                    color: theme.semanticColors.text.primary,
                  }}
                >
                  Unsubscribe
                </Typography>
                <Typography
                  variant='body'
                  style={{ color: theme.semanticColors.text.muted }}
                >
                  Enter your email address below to unsubscribe from the A+ in
                  FLUX- Mythmaker Drop newsletter.
                </Typography>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.m,
                  }}
                >
                  <Input
                    label='Email address'
                    name='unsubscribe-email'
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        setEmailError(validateEmail(e.target.value));
                      }
                    }}
                    onBlur={() => setEmailError(validateEmail(email))}
                    error={emailError}
                    required
                    fullWidth
                    maxLength={254}
                    aria-label='Your email address to unsubscribe'
                    aria-invalid={!!emailError}
                    aria-describedby={
                      emailError ? 'unsubscribe-email-error' : undefined
                    }
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

                  <Button
                    type='submit'
                    variant='primary'
                    loading={isLoading}
                    disabled={isLoading}
                    fullWidth
                    aria-label='Unsubscribe from newsletter'
                  >
                    Unsubscribe
                  </Button>

                  <div style={{ textAlign: 'center' }}>
                    <Link href='/'>
                      <Button
                        type='button'
                        variant='ghost'
                        aria-label='Return to home page'
                      >
                        Return to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
