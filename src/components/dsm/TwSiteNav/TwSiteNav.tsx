'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TwAppearancePanel } from '../TwAppearancePanel';
import { TwButton } from '../TwButton';
import styles from './TwSiteNav.module.scss';

export interface TwSiteNavChild {
  label: string;
  href: string;
}

export interface TwSiteNavLink {
  label: string;
  href: string;
  /** Keep in the bar below tablet width instead of folding into the menu. */
  pinned?: boolean;
  /**
   * Sub-pages: a dropdown on desktop, an expandable drawer in the menu below
   * tablet width. The link itself stays clickable.
   */
  children?: TwSiteNavChild[];
}

export interface TwSiteNavCta {
  label: string;
  href: string;
  /** Off-site target: opens in a new tab. */
  external?: boolean;
  /**
   * Optional click handler for all three copies of the button (bar, phone
   * menu, phone pill). Call event.preventDefault() to handle it in place
   * (TW.com opens the Book a Conversation modal, #281); without one, or if it
   * doesn't prevent the default, the link navigates to `href`.
   */
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
}

export interface TwSiteNavProps {
  /** Brand wordmark; links home. */
  brand: string;
  links: TwSiteNavLink[];
  /** The persistent main button ("Book a Conversation"). */
  cta: TwSiteNavCta;
  /**
   * Returns the href of the link to mark as current for a pathname. Kept as a
   * prop so the nav stays content-agnostic (see activeNavHref in
   * src/content/site/navigation.ts).
   */
  activeHref?: (pathname: string) => string | undefined;
}

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(' ');

const normalize = (p: string) => p.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

/**
 * Desktop dropdown for a link with children (Content).
 *
 * "Content" is a real link; a separate chevron button opens the list, so the
 * link stays clickable and the menu is still reachable by keyboard
 * (disclosure pattern: aria-expanded on the button, plain links inside). It
 * also opens on hover for pointer users. Escape closes it and returns focus
 * to the button; clicking outside or tabbing away closes it.
 */
function NavDropdown({
  link,
  on,
  pathname,
}: {
  link: TwSiteNavLink;
  on: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  // True while the menu is open because the mouse is over it. A click that
  // follows a hover-open should keep it open, not toggle it shut.
  const openedByHover = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // Close after navigating.
  useEffect(() => close(), [pathname, close]);

  const onBlur = (e: React.FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
  };
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, 180);
  };
  const onToggle = () => {
    if (openedByHover.current) {
      // The hover already opened it; this click confirms rather than closes.
      openedByHover.current = false;
      setOpen(true);
      return;
    }
    setOpen((o) => !o);
  };

  return (
    <div
      ref={rootRef}
      className={styles.dropdown}
      data-open={open ? 'true' : 'false'}
      onBlur={onBlur}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Link
        href={link.href}
        className={cx(styles.link, on && styles.linkActive)}
        aria-current={
          normalize(pathname) === normalize(link.href) ? 'page' : undefined
        }
      >
        {link.label}
      </Link>
      <button
        ref={buttonRef}
        type='button'
        className={styles.caret}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${link.label} pages`}
        onClick={onToggle}
      >
        <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
          <path
            d='M2.5 4.5 6 8l3.5-3.5'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      <ul id={menuId} className={styles.menu} hidden={!open}>
        {link.children!.map((child) => {
          const current = normalize(pathname).startsWith(normalize(child.href));
          return (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cx(
                  styles.menuLink,
                  current && styles.menuLinkActive
                )}
                aria-current={current ? 'page' : undefined}
                onClick={close}
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Site navigation for the redesigned pages.
 *
 * One link set with real page URLs, "Book a Conversation" as the one
 * persistent button (bottom-right pill on phones), the Display panel, a
 * Content dropdown, and About pinned in the bar at every width
 * (DESIGN_BRIEF.md §6.2; owner, 2026-11-18). The skip link is rendered by
 * providers.tsx (components/SkipLink) so it comes before the site-wide
 * pre-order bar in the tab order.
 */
export function TwSiteNav({ brand, links, cta, activeHref }: TwSiteNavProps) {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  // The menu goes inert when it closes, dropping focus inside it; focus goes
  // back to the burger instead (Escape, and the CTA, whose dialog returns
  // focus to whatever opened it).
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<string | null>(null);
  const current = activeHref?.(pathname);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close the menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
    setDrawerOpen(null);
  }, [pathname]);

  const ctaProps = {
    ...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    // A handled CTA must not also trigger the site's link interception.
    ...(cta.onClick ? { 'data-no-route-transition': '' } : {}),
  };

  const plainLink = (link: TwSiteNavLink) => {
    const on = link.href === current;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={cx(styles.link, on && styles.linkActive)}
        aria-current={on ? 'page' : undefined}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <header className={`tw-blur ${styles.nav}`}>
        <div className={styles.inner}>
          <Link href='/' className={styles.brand}>
            {brand}
          </Link>

          <nav className={styles.links} aria-label='Primary'>
            {links.map((link) =>
              link.children?.length ? (
                <NavDropdown
                  key={link.href}
                  link={link}
                  on={link.href === current}
                  pathname={pathname}
                />
              ) : (
                plainLink(link)
              )
            )}
          </nav>

          {/* Below tablet width, pinned links (About) stay in the bar; the
              rest fold into the menu. */}
          <nav className={styles.pinned} aria-label='Primary (pinned)'>
            {links.filter((link) => link.pinned).map(plainLink)}
          </nav>

          <div className={styles.actions}>
            <TwAppearancePanel />
            <TwButton
              size='sm'
              href={cta.href}
              className={styles.cta}
              onClick={cta.onClick}
              {...ctaProps}
            >
              {cta.label}
            </TwButton>
            <button
              ref={burgerRef}
              type='button'
              className={styles.burger}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls='site-mobile-menu'
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
          id='site-mobile-menu'
          className={styles.mobileMenu}
          data-open={menuOpen}
          // Out of the tab order and the accessibility tree while closed.
          inert={!menuOpen}
        >
          <nav className={styles.mobileInner} aria-label='Primary (mobile)'>
            {links
              .filter((link) => !link.pinned)
              .map((link) => {
                const on = link.href === current;
                if (!link.children?.length) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cx(
                        styles.mobileLink,
                        on && styles.mobileLinkActive
                      )}
                      aria-current={on ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                }
                // A drawer inside the menu: the link goes to the hub; the
                // button beside it reveals the sub-pages.
                const drawerId = `site-drawer-${link.href.replace(/\W+/g, '')}`;
                const isOpen = drawerOpen === link.href;
                return (
                  <div key={link.href} className={styles.mobileGroup}>
                    <div className={styles.mobileGroupRow}>
                      <Link
                        href={link.href}
                        className={cx(
                          styles.mobileLink,
                          on && styles.mobileLinkActive
                        )}
                        aria-current={
                          normalize(pathname) === normalize(link.href)
                            ? 'page'
                            : undefined
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <button
                        type='button'
                        className={styles.drawerToggle}
                        aria-expanded={isOpen}
                        aria-controls={drawerId}
                        aria-label={`${link.label} pages`}
                        onClick={() => setDrawerOpen(isOpen ? null : link.href)}
                      >
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 12 12'
                          aria-hidden='true'
                        >
                          <path
                            d='M2.5 4.5 6 8l3.5-3.5'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='1.6'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                    <ul
                      id={drawerId}
                      className={styles.drawer}
                      hidden={!isOpen}
                    >
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={styles.drawerLink}
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            <a
              href={cta.href}
              className={styles.mobileMenuCta}
              onClick={(event) => {
                setMenuOpen(false);
                burgerRef.current?.focus();
                cta.onClick?.(event);
              }}
              {...ctaProps}
            >
              {cta.label}{' '}
              <span aria-hidden='true'>{cta.external ? '↗' : '→'}</span>
            </a>
          </nav>
        </div>
      </header>

      {/*
        Phones: the main button moves out of the crowded bar into thumb reach,
        pinned bottom-right (DESIGN_BRIEF §6.2 "always visible, including on
        mobile"; §9 calls it a thumb-reached control that left-handed mode will
        mirror). Persistent, never timed, so it is not a pop-up. Rendered
        outside <header> because the header's backdrop-filter would otherwise
        become the containing block for position: fixed. The cookie banner and
        the podcast mini player sit above it when they're open.
      */}
      <a
        href={cta.href}
        className={styles.mobileCta}
        onClick={cta.onClick}
        {...ctaProps}
      >
        {cta.label}
      </a>
    </>
  );
}

export default TwSiteNav;
