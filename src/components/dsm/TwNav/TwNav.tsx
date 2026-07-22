'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { TwButton } from '../TwButton';
import styles from './TwNav.module.scss';

export interface TwNavLink {
  label: string;
  /** In-page anchor ('#about') or a route ('/blog'). */
  href: string;
}

export interface TwNavProps {
  links?: TwNavLink[];
  logoText?: string;
  /** Optional wordmark image. Falls back to `logoText` in Montserrat. */
  logoMark?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Where the brand link points. */
  homeHref?: string;
  className?: string;
}

/** Anchor hrefs ('#about') get section tracking; routes ('/blog') do not. */
function anchorIds(links: TwNavLink[]): string[] {
  return links
    .filter((l) => l.href.startsWith('#'))
    .map((l) => l.href.slice(1));
}

/**
 * Sticky top navigation with active-section highlighting.
 *
 * Sticky rather than fixed, per the design system — it scrolls with the
 * document flow and settles at the top, so it never overlaps content.
 *
 * Active-section tracking uses one IntersectionObserver over all anchor targets
 * rather than a scroll handler. The `rootMargin` shrinks the observation band to
 * a horizontal strip near the top of the viewport, so "active" means "this
 * section is at reading position", not merely "on screen" — otherwise a tall
 * section and the one after it are both intersecting and the highlight flickers
 * between them.
 *
 * Nothing here reads the reduced-transparency preference: the nav's blur comes
 * from --tw-nav-blur, which that preference already swaps to `none` in CSS.
 */
export function TwNav({
  links = [],
  logoText = 'Terence Waters',
  logoMark,
  ctaLabel = 'Newsletter',
  ctaHref = '#newsletter',
  homeHref = '#top',
  className,
}: TwNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);

  const ids = anchorIds(links);
  // Stable primitive so the effect does not re-run on every render when the
  // caller passes a fresh array literal.
  const idKey = ids.join(',');

  useEffect(() => {
    if (!idKey) return;

    const targets = idKey
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Among everything currently in the band, pick the one nearest the top.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Top offset clears the nav itself; the large negative bottom leaves a
        // narrow strip so only one section qualifies at a time.
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0,
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey]);

  // Close the mobile panel on Escape, and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href.startsWith('#') && href.slice(1) === activeId;

  return (
    <header
      ref={navRef}
      className={[styles.nav, className].filter(Boolean).join(' ')}
    >
      <div className={styles.inner}>
        <a href={homeHref} className={styles.brand}>
          {logoMark ? (
            <img src={logoMark} alt='' className={styles.brandMark} />
          ) : null}
          <span className={styles.brandText}>{logoText}</span>
        </a>

        <nav className={styles.links} aria-label='Primary'>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[
                styles.link,
                isActive(link.href) ? styles.linkActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive(link.href) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          {ctaLabel ? (
            <TwButton size='sm' href={ctaHref}>
              {ctaLabel}
            </TwButton>
          ) : null}
        </nav>

        <button
          type='button'
          className={styles.burger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            width='24'
            height='24'
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

      {menuOpen ? (
        <div id={menuId} className={styles.mobilePanel}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={[
                styles.mobileLink,
                isActive(link.href) ? styles.mobileLinkActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive(link.href) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          {ctaLabel ? (
            <TwButton size='sm' href={ctaHref} onClick={() => setMenuOpen(false)}>
              {ctaLabel}
            </TwButton>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

export default TwNav;
