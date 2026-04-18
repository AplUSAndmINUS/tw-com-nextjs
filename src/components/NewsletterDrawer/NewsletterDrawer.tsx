'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSlideInOut } from '@/hooks/useSlideInOut';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { Input } from '@/components/Form/Input/Input';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { useNewsletterStore } from '@/store/newsletterStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';

/** Delay in ms before the drawer auto-shows on a non-home page */
const SHOW_DELAY_MS = 5000;

export interface NewsletterDrawerProps {
  /** Whether the drawer is forced open (for testing / manual trigger) */
  forceOpen?: boolean;
}

/**
 * NewsletterDrawer Component
 *
 * A bottom-slide drawer that invites users to subscribe to the
 * "The Resonant Identity" email newsletter.
 *
 * - Automatically appears after SHOW_DELAY_MS on non-home pages
 * - Clicking "X" dismisses permanently (stored in Zustand / localStorage)
 * - Backdrop dims the page, requiring the user to act
 * - Respects prefers-reduced-motion
 */
export const NewsletterDrawer: React.FC<NewsletterDrawerProps> = ({
  forceOpen = false,
}) => {
  const { theme, reducedTransparency } = useAppTheme();
  const prefersReducedMotion = useReducedMotion();
  const {
    newsletterDismissed,
    newsletterSubscribed,
    setNewsletterDismissed,
    setNewsletterSubscribed,
  } = useNewsletterStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();

  // Ensure we're mounted before rendering portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-show after delay when on a non-home page
  useEffect(() => {
    if (newsletterDismissed || newsletterSubscribed) return;

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [newsletterDismissed, newsletterSubscribed, forceOpen]);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    setNewsletterDismissed(true);
  }, [setNewsletterDismissed]);

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

        // Close drawer after a short delay on success
        setTimeout(() => setIsOpen(false), 2500);
      } catch {
        setSubmitError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, setNewsletterSubscribed, canSubmit, recordSubmit, timeUntilReset]
  );

  const animDuration = prefersReducedMotion ? 0 : 0.3;
  const { animationProps } = useSlideInOut({
    direction: 'up',
    duration: animDuration,
    distance: 600,
  });

  if (!isMounted) return null;

  const drawerContent = (
    <>
      {/* Backdrop — fades in/out */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='drawer-backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animDuration }}
            onClick={handleDismiss}
            aria-hidden='true'
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: reducedTransparency
                ? 'rgba(0, 0, 0, 0.85)'
                : 'rgba(0, 0, 0, 0.6)',
              zIndex: 1200,
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel — slides up from below */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='drawer-panel'
            {...animationProps}
            role='dialog'
            aria-modal='true'
            aria-label='Subscribe to newsletter'
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1201,
              backgroundColor: theme.semanticColors.background.base,
              borderTop: `1px solid ${theme.semanticColors.border.default}`,
              borderRadius: `${theme.borderRadius.container.large} ${theme.borderRadius.container.large} 0 0`,
              boxShadow: theme.shadows.modal,
              padding: `${theme.spacing.l} ${theme.spacing.m}`,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Close button */}
            <button
              type='button'
              onClick={handleDismiss}
              aria-label='Dismiss newsletter signup'
              style={{
                position: 'absolute',
                top: theme.spacing.m,
                right: theme.spacing.m,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: theme.spacing.s1,
                borderRadius: theme.borderRadius.container.small,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.semanticColors.text.muted,
                zIndex: 10,
              }}
            >
              <FluentIcon iconName={Dismiss24Regular} />
            </button>

            {/* Content */}
            <div
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                paddingBottom: theme.spacing.s1,
              }}
            >
              {isSuccess ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: `${theme.spacing.m} 0`,
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
                  <Typography
                    variant='body'
                    style={{ color: theme.semanticColors.text.muted }}
                  >
                    Welcome to The Resonant Identity newsletter. Check your inbox for your
                    first issue!
                  </Typography>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      marginBottom: theme.spacing.m,
                      paddingRight: theme.spacing.xl,
                    }}
                  >
                    <Typography
                      variant='h3'
                      style={{
                        marginBottom: theme.spacing.s1,
                        color: theme.semanticColors.text.primary,
                      }}
                    >
                      Subscribe to The Resonant Identity email newsletter
                    </Typography>
                    <Typography
                      variant='body'
                      style={{
                        color: theme.semanticColors.text.muted,
                        lineHeight: 1.6,
                      }}
                    >
                      Subscribe to my free, biweekly newsletter, The Resonant
                      Identity — where I share insights on identity architecture,
                      self-improvement, and practical frameworks for navigating
                      transitions with clarity and intention.
                    </Typography>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.s1,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: theme.spacing.s1,
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <Input
                            label='Email address'
                            name='drawer-newsletter-email'
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
                            fullWidth
                            maxLength={254}
                            aria-label='Your email address for newsletter subscription'
                            aria-invalid={!!emailError}
                          />
                        </div>
                        <div style={{ paddingTop: '1.5rem' }}>
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
                        }}
                      >
                        Biweekly newsletter. Unsubscribe at any time from the{' '}
                        <a
                          href='/unsubscribe'
                          onClick={() => setIsOpen(false)}
                          style={{
                            color: theme.colorBrandForeground1,
                            textDecoration: 'underline',
                          }}
                        >
                          unsubscribe page
                        </a>
                        .
                      </Typography>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(drawerContent, document.body);
};
