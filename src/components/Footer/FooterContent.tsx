'use client';

import React, { useState, useCallback, useEffect, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Typography } from '../Typography';
import { ThemedLink } from '../ThemedLink';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useWindowSize, useDeviceOrientation } from '@/hooks/useMediaQuery';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useNewsletterStore } from '@/store/newsletterStore';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import ResonantIdentityIcon from '@/assets/images/ResonantIdentity_icon_192.png';
import {
  FLUXLINE_URL,
  RCF_PREORDER_HREF,
  RCF_PREORDERS_OPEN,
  TRI_URL,
} from '@/lib/rcf';
import styles from './FooterContent.module.scss';

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog' },
    { href: '/github', label: 'GitHub' },
    { href: '/videos', label: 'Videos' },
    { href: '/content-hub', label: 'Content Hub' },
  ],
  work: [
    { href: '/podcasts/theresonantid', label: 'The Resonant Identity Podcast' },
    {
      href: '/resonance-core-framework',
      label: 'The Resonance Core Framework™',
    },
    { href: '/portfolio', label: 'Portfolio' },
  ],
  connect: [
    { href: '/about', label: 'About' },
    { href: '/contact/', label: 'Contact' },
    { href: '/contact/#newsletter', label: 'Newsletter' },
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
        <ul
          className={`${styles.linkList} ${isCompact ? styles.linkListCompact : ''}`}
          role='list'
        >
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
 * FooterNewsletter: The Resonant Identity newsletter signup, the footer's lead
 * block (#285). Bigger than the old corner form and set in the heading font;
 * on phones it is a single row of input and button. `id="newsletter"` is the
 * home page's #newsletter anchor (older links); the site's newsletter links
 * now go to /contact/#newsletter (#295).
 */
export function FooterNewsletter({ isAnchor = true }: { isAnchor?: boolean }) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;
  const { newsletterSubscribed, setNewsletterSubscribed } =
    useNewsletterStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();
  const getRecaptchaToken = useRecaptchaToken();

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
        const recaptchaToken = await getRecaptchaToken('newsletter_subscribe');
        if (recaptchaToken === null) {
          setError(
            'Spam protection didn’t finish loading. Refresh the page and try again.'
          );
          return;
        }

        const response = await fetch(`${getApiBaseUrl()}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmed.toLowerCase(),
            recaptchaToken,
          }),
        });
        // 429 and 504 bodies may not be JSON; fall back to a generic message.
        const data = await response.json().catch(() => ({}));
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
    [
      email,
      setNewsletterSubscribed,
      canSubmit,
      recordSubmit,
      timeUntilReset,
      getRecaptchaToken,
    ]
  );

  const intro = (
    <div className={styles.newsletterIntro}>
      <div className={styles.newsletterHead}>
        <Image
          src={ResonantIdentityIcon}
          alt=''
          width={32}
          height={32}
          className={styles.newsletterIcon}
        />
        <p className={styles.newsletterKicker}>The Resonant Identity</p>
      </div>
      <h2 id={titleId} className={styles.newsletterTitle}>
        Get new writing in your inbox
      </h2>
      <p className={styles.newsletterText}>
        Occasional notes on resonance, systems, and the work in progress. No
        spam, and you can unsubscribe anytime.
      </p>
    </div>
  );

  // Subscribed: just subscribed (5s confirmation) or the persisted flag.
  if (isSuccess || newsletterSubscribed) {
    return (
      <section
        id={isAnchor ? 'newsletter' : undefined}
        className={styles.newsletter}
        aria-labelledby={titleId}
      >
        {intro}
        <div className={styles.newsletterAction}>
          <p className={styles.newsletterDone} role='status'>
            ✓ You&apos;re subscribed!
          </p>
          <ThemedLink
            href='/unsubscribe/'
            className={styles.unsubscribe}
            variant='small'
            isFooter
          >
            Unsubscribe
          </ThemedLink>
        </div>
      </section>
    );
  }

  return (
    <section
      id={isAnchor ? 'newsletter' : undefined}
      className={styles.newsletter}
      aria-labelledby={titleId}
    >
      {intro}
      <form
        className={styles.newsletterAction}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={styles.newsletterRow}>
          <input
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            maxLength={254}
            aria-label='Newsletter email address'
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`${styles.emailInput} ${error ? styles.emailInputError : ''}`}
          />
          <button
            type='submit'
            className={styles.subscribeButton}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
        {error && (
          <p id={errorId} className={styles.newsletterError} role='alert'>
            {error}
          </p>
        )}
        <ThemedLink
          href='/unsubscribe/'
          className={styles.unsubscribe}
          variant='small'
          isFooter
        >
          Unsubscribe
        </ThemedLink>
      </form>
    </section>
  );
}

interface FooterContentProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
  /** Optional additional content to prepend (e.g., hide button on mobile) */
  headerContent?: React.ReactNode;
  /**
   * False where the newsletter card is drawn above the footer instead
   * (HomePageFooter, owner 2026-11-19); the overlay copy keeps it inside.
   */
  showNewsletter?: boolean;
}

/**
 * FooterContent — Shared footer content used by both HomePage and Standard footers
 */
export function FooterContent({
  isCompact = false,
  headerContent,
  showNewsletter = true,
}: FooterContentProps) {
  const pathname = usePathname() ?? '/';
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
        {/* Only the overlay copy draws the card in here; HomePageFooter draws
            it above the footer line and owns Home's #newsletter anchor. */}
        {showNewsletter ? <FooterNewsletter isAnchor={false} /> : null}

        <div
          className={`${styles.grid} ${isCompact ? styles.gridCompact : ''}`}
        >
          {/* Brand */}
          <div>
            {/* Switched Typography and ThemedLink JSX so the link can be styled based on theme and compact mode -TW */}
            <Typography variant='h4' className={styles.brandTitle}>
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
              style={{
                fontSize: '1.25rem',
                fontStyle: 'italic',
                marginTop: '0.25rem',
              }}
            >
              "Know who you are and what you stand for!" <br />
              <em style={{ fontWeight: 300 }}>
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
          {/* Hidden on phones to keep the footer short; the podcast and book
              stay reachable via "More from" below. */}
          <FooterLinkSection
            title='Work'
            links={footerLinks.work}
            isCompact={isCompact}
            className={styles.mdOnly}
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
          />
        </div>

        {/* Ecosystem links. TW uses this shorter block rather than the shared
            Listen / Read / Work lines (owner, 2026-10-20). The owned sites
            carry rel="me" so search engines tie them to one identity; the
            store link opens in a new tab (2026-11-19). Short labels (owner, 2026-11-14); the nav's aria-label
            gives them their context. */}
        <nav className={styles.ecosystem} aria-label='More from Terence Waters'>
          <span className={styles.ecosystemTitle}>
            More from Terence Waters
          </span>
          {/* ThemedLink, like the link lists above: Merriweather, footer
              colours and hover. rel="me" passes through. */}
          <ThemedLink href={TRI_URL} rel='me' variant='small' isFooter>
            The Resonant Identity
          </ThemedLink>
          {RCF_PREORDERS_OPEN && (
            <ThemedLink
              href={RCF_PREORDER_HREF}
              target='_blank'
              keepReferrer
              variant='small'
              isFooter
            >
              Pre-order the Book
            </ThemedLink>
          )}
          <ThemedLink href={FLUXLINE_URL} rel='me' variant='small' isFooter>
            Fluxline Resonance Group
          </ThemedLink>
        </nav>

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
