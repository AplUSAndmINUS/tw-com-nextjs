'use client';

import React, { useEffect, useState } from 'react';
import { TwButton, TwAppearancePanel } from '@/components/dsm';
import styles from './HomeNav.module.scss';

export interface HomeNavLink {
  label: string;
  href: string;
}

export interface HomeNavProps {
  links: HomeNavLink[];
  /** Section ids to track for the active-underline (defaults to link targets). */
  sectionIds?: string[];
}

/**
 * Homepage sticky navigation.
 *
 * Distinct from the DSM's TwNav because the homepage nav carries the appearance
 * panel and a newsletter CTA, and its links are in-page anchors with an
 * active-section underline. TwNav stays the general-purpose nav for other pages.
 *
 * Active section is tracked with a single IntersectionObserver whose root
 * margin collapses the trigger zone to a band near the top third of the
 * viewport, so exactly one section reads as active while scrolling rather than
 * every section that happens to be on screen.
 */
export function HomeNav({ links, sectionIds }: HomeNavProps) {
  const [active, setActive] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  const ids = sectionIds ?? links.map((l) => l.href.replace('#', ''));
  const idKey = ids.join(',');

  useEffect(() => {
    const targets = idKey
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey]);

  const isActive = (href: string) => href.replace('#', '') === active;

  return (
    <header className={`tw-blur ${styles.nav}`}>
      <div className={styles.inner}>
        <a href='#top' className={styles.brand}>
          Terence Waters
        </a>

        <nav className={styles.links} aria-label='Primary'>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[styles.link, isActive(link.href) ? styles.linkActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive(link.href) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <TwAppearancePanel />
          <span className={styles.newsletterBtn}>
            <TwButton size='sm' href='#newsletter'>
              Newsletter
            </TwButton>
          </span>
          <button
            type='button'
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls='home-mobile-menu'
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
        id='home-mobile-menu'
        className={styles.mobileMenu}
        data-open={menuOpen}
      >
        <div className={styles.mobileInner}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[
                styles.mobileLink,
                isActive(link.href) ? styles.mobileLinkActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href='#newsletter'
            className={styles.mobileNewsletter}
            onClick={() => setMenuOpen(false)}
          >
            Newsletter &#8594;
          </a>
        </div>
      </div>
    </header>
  );
}

export default HomeNav;
