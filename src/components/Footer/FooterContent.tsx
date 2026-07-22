'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '../Typography';
import { ThemedLink } from '../ThemedLink';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useWindowSize, useDeviceOrientation } from '@/hooks/useMediaQuery';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';
import ResonantIdentityIcon from '@/assets/images/ResonantIdentity_icon.png';
import styles from './FooterContent.module.scss';

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog' },
    { href: '/github', label: 'GitHub' },
    { href: '/videos', label: 'Videos' },
    { href: '/content-hub', label: 'Content Hub' },
  ],
  work: [
    { href: '/podcasts/theresonantid', label: 'The Resonant Identity Podcast', },
    {
      href: 'https://fluxline.pro/services/resonance-core',
      label: 'Resonance Core Framework',
    },
    { href: '/portfolio', label: 'Portfolio' },
    { href: 'https://fluxline.pro/case-studies', label: 'Case Studies' },
  ],
  connect: [
    { href: '/about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
    { href: '/#newsletter', label: 'Newsletter' },
  ],
};

interface FooterLinkSectionProps {
  title: string;
  links: Array<{ href: string; label: string }>;
  isCompact: boolean;
  isAuthorTagline?: boolean;
  className?: string;
  children?: React.ReactNode;
  windowWidth?: number;
}

/**
 * FooterLinkSection — Reusable footer link group component
 */
function FooterLinkSection({
  title,
  links,
  isCompact,
  isAuthorTagline = false,
  className = '',
  children,
  windowWidth,
}: FooterLinkSectionProps) {
  return (
    <div
      className={`${styles.linkSection} ${isCompact ? styles.linkSectionCompact : ''} ${className}`}
    >
      <Typography
        variant='h5'
        className={styles.sectionTitle}
        style={{
          fontSize: isCompact ? '1rem' : '1.25rem',
          marginBottom: isCompact ? '0' : '0.75rem',
        }}
      >
        {title}
      </Typography>
      {title === 'Social' ? (
        <SocialLinks
          isFooter
          isAuthorTagline={
            isAuthorTagline ||
            (windowWidth !== undefined && windowWidth <= 1366)
          }
        />
      ) : (
        <ul className={`${styles.linkList} ${isCompact ? styles.linkListCompact : ''}`} role='list'>
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
  const { newsletterSubscribed, setNewsletterSubscribed } =
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

  // Show subscribed state if: just subscribed (5s confirmation) OR persisted Zustand flag
  if (isSuccess || newsletterSubscribed) {
    return (
      <div className={styles.newsletterMini}>
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
          <ThemedLink
            href='/unsubscribe'
            style={{
              color: theme.colorBrandForeground1,
            }}
            isFooter
          >
            Unsubscribe
          </ThemedLink>
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.newsletterMini}>
      <div className={styles.newsletterHead}>
        <Image
          src={ResonantIdentityIcon}
          alt='The Resonant Identity'
          width={24}
          height={24}
          style={{ borderRadius: '4px' }}
        />
        <Typography
          variant='h5'
          style={{
            fontSize: '0.875rem',
            marginBottom: 0,
            color: theme.semanticColors.text.primary,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          The Resonant Identity
        </Typography>
      </div>
      <Typography
        variant='caption'
        style={{
          color: theme.semanticColors.text.muted,
          fontSize: '0.7rem',
          marginBottom: '0.5rem',
          display: 'block',
        }}
      >
        Subscribe to The Resonant Identity email newsletter
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
            className={`${styles.emailInput} ${error ? styles.emailInputError : ''}`}
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
            <ThemedLink
              href='/unsubscribe'
              style={{
                color: theme.semanticColors.text.muted,
                textDecoration: 'underline',
                fontSize: '0.7rem',
              }}
              isFooter
            >
              Unsubscribe
            </ThemedLink>
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
  const { theme } = useAppTheme();
  const { windowWidth } = useWindowSize();
  const orientation = useDeviceOrientation();
  const isLargePortrait = orientation === 'large-portrait';

  return (
    <>
      {headerContent}

      {/* had to set the max-width here instead of on the parent because the parent needs to stretch full width for the backdrop blur effect to cover the entire screen, but the content inside should be constrained to match the max width of the Navigation and main content. -TW */}
      <div
        className={`${styles.container} max-width-content-footer ${isCompact ? styles.containerCompact : ''}`}
      >
        <div
          className={`${styles.grid} ${isCompact ? styles.gridCompact : ''}`}
        >
          {/* Brand */}
          <div>
            {/* Switched Typography and ThemedLink JSX so the link can be styled based on theme and compact mode -TW */}
            <Typography
              variant='h4'
              className={styles.brandTitle}
            >
              <ThemedLink
                href='/'
                className={styles.brandLink}
                isFooter
                style={{
                  color: theme.semanticColors.text.primary,
                  fontSize: isCompact ? '1.5rem' : '1.75rem',
                  fontFamily: theme.typography.fontFamilies.h1,
                  fontWeight: 600,
                }}
              >
                Terence Waters
              </ThemedLink>
            </Typography>
            <Typography
              variant='h3'
              className={styles.brandTagline}
              style={{ fontSize: '1.25rem', fontStyle: 'italic', marginTop: '0.25rem' }}
            >
              "Know who you are and what you stand for!" <br />
              <em style={{ fontWeight: 100 }}>
                &mdash; Terence Waters &amp; The Resonant Identity
              </em>
            </Typography>
          </div>

          {/* Link sections */}
          <FooterLinkSection
            title='Content'
            links={footerLinks.content}
            isCompact={isCompact}
            className={styles.mdOnly}
          />
          <FooterLinkSection
            title='Work'
            links={footerLinks.work}
            isCompact={isCompact}
          />
          {windowWidth >= 1366 && (
            <FooterLinkSection
              title='Connect'
              links={footerLinks.connect}
              isCompact={isCompact}
              className={styles.mdOnly}
            />
          )}
          <FooterLinkSection
            title='Social'
            links={[]} // Empty array since SocialLinks component handles rendering
            isCompact={true}
            isAuthorTagline={isLargePortrait}
            windowWidth={windowWidth}
          >
            <FooterNewsletterMini />
          </FooterLinkSection>
        </div>

        {/* Bottom bar */}
        <div
          className={`${styles.bottomBar} ${isCompact ? styles.bottomBarCompact : ''}`}
        >
          <Typography
            variant='blockquote'
            className={styles.copyright}
            style={{ fontSize: isCompact ? '0.75rem' : '0.875rem' }}
          >
            &copy; 2025-
            {year} Terence Waters and his awesomeness. All rights reserved.
          </Typography>
        </div>
      </div>
    </>
  );
}
