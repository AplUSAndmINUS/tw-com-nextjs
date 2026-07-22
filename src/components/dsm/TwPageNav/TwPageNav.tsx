'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TwButton, TwAppearancePanel } from '@/components/dsm';
import styles from './TwPageNav.module.scss';

export interface TwPageNavLink {
  label: string;
  href: string;
  /** Marks this link as the current section (drives the active underline). */
  active?: boolean;
}

export interface TwPageNavProps {
  /**
   * The contextual back-link that replaces a brand wordmark. On a listing page
   * this points home ("← Back to Home"); on a detail page it points back to the
   * listing ("← Back to Content Hub"). The arrow is added automatically.
   */
  back: { label: string; href: string };
  links?: TwPageNavLink[];
  /** Newsletter CTA target. Defaults to the homepage newsletter anchor. */
  newsletterHref?: string;
}

/**
 * Sticky navigation for interior pages (Blog, Portfolio, Content Hub, …).
 *
 * The distinguishing feature is the contextual back-link where the homepage nav
 * has a brand wordmark — the redesign uses the logo slot as a "way back up"
 * affordance that changes with depth. Otherwise it carries the same appearance
 * panel, newsletter CTA, and mobile menu as the homepage nav.
 *
 * Kept separate from HomeNav (anchor links + scroll-spy) and from the DSM's
 * generic TwNav because the back-link behaviour is specific to this layout.
 */
export function TwPageNav({
  back,
  links = [],
  newsletterHref = '/#newsletter',
}: TwPageNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`tw-blur ${styles.nav}`}>
      <div className={styles.inner}>
        <Link href={back.href} className={styles.back}>
          <span aria-hidden='true'>&#8592;</span>
          {back.label}
        </Link>

        <nav className={styles.links} aria-label='Primary'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[styles.link, link.active ? styles.linkActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <TwAppearancePanel />
          <span className={styles.newsletterBtn}>
            <TwButton size='sm' href={newsletterHref}>
              Newsletter
            </TwButton>
          </span>
          <button
            type='button'
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls='page-mobile-menu'
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              aria-hidden='true'
            >
              {menuOpen ? (
                <>
                  <line x1='5' y1='5' x2='19' y2='19' />
                  <line x1='19' y1='5' x2='5' y2='19' />
                </>
              ) : (
                <>
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id='page-mobile-menu'
        className={styles.mobileMenu}
        data-open={menuOpen}
      >
        <div className={styles.mobileInner}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                styles.mobileLink,
                link.active ? styles.mobileLinkActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={newsletterHref}
            className={styles.mobileNewsletter}
            onClick={() => setMenuOpen(false)}
          >
            Newsletter &#8594;
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TwPageNav;
