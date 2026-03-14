'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Typography } from '../Typography';
import { ThemedLink } from '../ThemedLink';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useIsTablet } from '@/hooks/useMediaQuery';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog' },
    { href: '/github', label: 'GitHub' },
    { href: '/videos', label: 'Videos' },
    { href: '/content-hub', label: 'Content Hub' },
  ],
  work: [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/services', label: 'Services' },
    { href: '/services/resonance-core', label: 'Resonance Core Framework' },
  ],
  connect: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/archive', label: 'Archive' },
  ],
};

interface FooterLinkSectionProps {
  title: string;
  links: Array<{ href: string; label: string }>;
  isCompact: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * FooterLinkSection — Reusable footer link group component
 */
function FooterLinkSection({
  title,
  links,
  isCompact,
  className = '',
  children,
}: FooterLinkSectionProps) {
  return (
    <div
      className={`flex flex-col ${isCompact ? 'gap-2 mb-1' : 'gap-4 mb-2'} ${className}`}
    >
      <Typography
        variant='h5'
        className='font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
        style={{
          fontSize: isCompact ? '1rem' : '1.25rem',
          marginBottom: isCompact ? '0' : '0.75rem',
        }}
      >
        {title}
      </Typography>
      {title === 'Social' ? (
        <SocialLinks isFooter />
      ) : (
        <ul className={isCompact ? 'space-y-1' : 'space-y-2'} role='list'>
          {links.map(({ href, label }) => (
            <li key={href}>
              <ThemedLink href={href} variant='small' isFooter>
                {label}
              </ThemedLink>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}

/**
 * FooterNewsletterMini — Compact newsletter signup for tablet/desktop footer
 * Hidden on mobile via `hidden md:block`.
 */
function FooterNewsletterMini() {
  const { theme } = useAppTheme();
  const { setNewsletterSubscribed } =
    useNewsletterStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();

  // Auto-reset the success confirmation after 5 seconds so the form returns to input state
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setIsSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError('A valid email is required');
        return;
      }
      if (!canSubmit) {
        setError(`Submission limit reached. Try again in ${timeUntilReset}.`);
        return;
      }
      setError(null);
      recordSubmit();
      setIsLoading(true);
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed.toLowerCase() }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to subscribe');
          return;
        }
        setIsSuccess(true);
        setNewsletterSubscribed(true);
      } catch {
        setError('Something went wrong. Try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, setNewsletterSubscribed, canSubmit, recordSubmit, timeUntilReset]
  );

  if (isSuccess) {
    return (
      <div
        className='hidden md:block mt-3 pt-3'
        style={{ borderTop: `1px solid ${theme.semanticColors.border.muted}` }}
      >
        <Typography
          variant='caption'
          style={{
            color: theme.colorBrandForeground1,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          ✓ You&apos;re subscribed!
        </Typography>
        <Typography
          variant='caption'
          style={{
            color: theme.semanticColors.text.muted,
            fontSize: '0.7rem',
            marginTop: '0.25rem',
            display: 'block',
          }}
        >
          <Link
            href='/unsubscribe'
            style={{
              color: theme.colorBrandForeground1,
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
      className='hidden md:block mt-3 pt-3'
      style={{ borderTop: `1px solid ${theme.semanticColors.border.muted}` }}
    >
      <Typography
        variant='h5'
        className='font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
        style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}
      >
        Newsletter
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
        >
          <input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            maxLength={254}
            aria-label='Newsletter email address'
            className='outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-700 dark:focus-visible:ring-blue-400'
            style={{
              width: '100%',
              padding: '0.3rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: theme.borderRadius.container.small,
              border: `1px solid ${
                error
                  ? theme.colorPaletteRedForeground1
                  : theme.semanticColors.border.default
              }`,
              backgroundColor: theme.semanticColors.background.base,
              color: theme.semanticColors.text.primary,
            }}
          />
          {error && (
            <Typography
              variant='caption'
              style={{
                color: theme.colorPaletteRedForeground1,
                fontSize: '0.7rem',
              }}
            >
              {error}
            </Typography>
          )}
          <button
            type='submit'
            disabled={isLoading || !canSubmit}
            style={{
              padding: '0.3rem 0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: theme.borderRadius.container.small,
              backgroundColor: theme.colorBrandBackground,
              color: theme.colorNeutralForegroundOnBrand,
              border: 'none',
              cursor: isLoading || !canSubmit ? 'not-allowed' : 'pointer',
              opacity: isLoading || !canSubmit ? 0.7 : 1,
              transition: 'opacity 0.2s',
              fontFamily: theme.typography.fonts.body.fontFamily,
            }}
          >
            {isLoading ? 'Subscribing…' : 'Subscribe'}
          </button>
          <Typography
            variant='caption'
            style={{
              color: theme.semanticColors.text.muted,
              fontSize: '0.7rem',
              marginTop: '0.125rem',
            }}
          >
            <Link
              href='/unsubscribe'
              style={{
                color: theme.semanticColors.text.muted,
                textDecoration: 'underline',
              }}
            >
              Unsubscribe
            </Link>
          </Typography>
        </div>
      </form>
    </div>
  );
}

interface FooterContentProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
  /** Optional additional content to prepend (e.g., hide button on mobile) */
  headerContent?: React.ReactNode;
}

/**
 * FooterContent — Shared footer content used by both HomePage and Standard footers
 */
export function FooterContent({
  isCompact = false,
  headerContent,
}: FooterContentProps) {
  const year = new Date().getFullYear();
  const isTablet = useIsTablet();

  return (
    <>
      {headerContent}

      {/* had to set the max-width here instead of on the parent because the parent needs to stretch full width for the backdrop blur effect to cover the entire screen, but the content inside should be constrained to match the max width of the Navigation and main content. -TW */}
      <div
        className={`px-6 lg:pl-12 lg:pr-8 max-width-content-footer ${isCompact ? 'py-6' : 'py-8'}`}
        style={{ margin: '0 auto' }}
      >
        <div
          className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 ${isCompact ? 'mb-4' : 'md:mb-0'}`}
        >
          {/* Brand */}
          <div>
            <Link
              href='/'
              className='text-xl font-bold tracking-tight hover:opacity-80 transition-opacity'
            >
              <Typography
                variant='h4'
                className='text-gray-700 dark:text-gray-300'
              >
                Terence Waters
              </Typography>
            </Link>
            <Typography
              variant='blockquote'
              className={`text-gray-700 dark:text-gray-300 max-w-xs ${
                isCompact ? 'mt-1' : 'mt-2'
              }`}
              style={{ fontSize: isCompact ? '0.75rem' : '0.875rem' }}
            >
              {isCompact
                ? 'Author, technologist, and creative thinker.'
                : 'Author, technologist, and creative thinker. Writing about technology, creativity, and the human experience.'}
            </Typography>
          </div>

          {/* Link sections */}
          <FooterLinkSection
            title='Content'
            links={footerLinks.content}
            isCompact={isCompact}
            className='hidden md:flex'
          />
          <FooterLinkSection
            title='Work'
            links={footerLinks.work}
            isCompact={isCompact}
          />
          {!isTablet && (
            <FooterLinkSection
              title='Connect'
              links={footerLinks.connect}
              isCompact={isCompact}
              className='hidden md:flex'
            />
          )}
          <FooterLinkSection
            title='Social'
            links={[]} // Empty array since SocialLinks component handles rendering
            isCompact={true}
          >
            <FooterNewsletterMini />
          </FooterLinkSection>
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between pb-4 sm:pb-0 md:gap-2 ${
            isCompact ? 'pt-0' : 'pt-1'
          }`}
        >
          <Typography
            variant='blockquote'
            className='text-gray-700 dark:text-gray-300'
            style={{ fontSize: isCompact ? '0.75rem' : '0.875rem' }}
          >
            &copy; 2025-{year} Terence Waters. All rights reserved.
          </Typography>
        </div>
      </div>
    </>
  );
}
