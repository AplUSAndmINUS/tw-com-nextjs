'use client';

/**
 * Navigation / Header Component
 *
 * Matches Fluxline-Pro's header architecture:
 * - Fixed position with backdrop blur
 * - Breadcrumb navigation on desktop
 * - Current page title on mobile
 * - Slide-in navigation menu modal
 * - Theme toggle button
 * - Framer Motion animations
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { NavigationMenu } from './NavigationMenu';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isClickable?: boolean;
}

export function Navigation() {
  const [activeModal, setActiveModal] = React.useState<
    'menu' | 'settings' | null
  >(null);
  const [isMounted, setIsMounted] = React.useState(false);

  const { theme, themeMode, setThemeMode } = useAppTheme();
  const pathname = usePathname();
  const isMobileHook = useIsMobile();
  const isMobile = isMounted ? isMobileHook : false;
  const { shouldReduceMotion } = useReducedMotion();

  // Generate breadcrumb items from pathname
  const breadcrumbItems: BreadcrumbItem[] = React.useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const decodedPath = decodeURIComponent(path);
      const label = decodedPath
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      crumbs.push({ label, href: currentPath, isClickable: true });
    });

    return crumbs;
  }, [pathname]);

  const currentPageTitle =
    breadcrumbItems[breadcrumbItems.length - 1]?.label ?? 'Home';
  const isHomePage = pathname === '/';

  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  const handleThemeClick = () => {
    if (themeMode !== 'light' && themeMode !== 'dark') return;
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const handleMenuClick = () => {
    setActiveModal((prev) => (prev === 'menu' ? null : 'menu'));
  };

  const handleModalClose = () => setActiveModal(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) handleModalClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeModal]);

  // Modal animation variants
  const modalVariants: Variants = {
    hidden: { x: '100%', opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0.0, 0.2, 1.0],
      },
    },
    exit: {
      x: '100%',
      opacity: shouldReduceMotion ? 1 : 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: [0.4, 0.0, 1.0, 1.0],
      },
    },
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    background: 'none',
    border: `1px solid ${theme.colorNeutralStroke2}`,
    borderRadius: theme.borderRadiusMedium,
    cursor: 'pointer',
    color: isHomePage ? theme.colorNeutralForegroundOnBrand : theme.colorNeutralForeground1,
    transition: 'background-color 0.2s ease, transform 0.15s ease',
    padding: 0,
  };

  return (
    <div suppressHydrationWarning>
      {/* Fixed Navigation Bar */}
      <nav
        role='banner'
        suppressHydrationWarning
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: isDark
            ? 'rgba(15, 15, 15, 0.8)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.colorNeutralStroke2}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
            maxWidth: '1920px',
            margin: '0 auto',
          }}
          suppressHydrationWarning
        >
          {/* Left: Breadcrumbs (desktop) or page title (mobile) */}
          <div style={{ flex: 1, minWidth: 0 }} suppressHydrationWarning>
            {isMobile ? (
              /* Mobile: current page title */
              <span
                style={{
                  color: theme.colorNeutralForeground1,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontFamily: theme.fontFamilyBase,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {isHomePage ? 'Terence Waters' : currentPageTitle}
              </span>
            ) : (
              /* Desktop: breadcrumb trail */
              <nav aria-label='Breadcrumb' suppressHydrationWarning>
                {isHomePage ? (
                  <Link
                    href='/'
                    style={{
                      color: theme.colorBrandForeground1,
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      fontFamily: theme.fontFamilyBase,
                      textDecoration: 'none',
                    }}
                  >
                    Terence Waters
                  </Link>
                ) : (
                  <ol
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                    }}
                    suppressHydrationWarning
                  >
                    {breadcrumbItems.map((item, index) => {
                      const isLast = index === breadcrumbItems.length - 1;
                      const isFirst = index === 0;

                      return (
                        <li
                          key={item.href}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          suppressHydrationWarning
                        >
                          {index > 0 && (
                            <span
                              aria-hidden='true'
                              style={{
                                color: theme.colorNeutralForeground3,
                                fontSize: '0.875rem',
                              }}
                            >
                              /
                            </span>
                          )}
                          {isLast ? (
                            <span
                              style={{
                                color: theme.colorNeutralForeground1,
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                fontFamily: theme.fontFamilyBase,
                              }}
                              aria-current='page'
                            >
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              style={{
                                color: isFirst
                                  ? theme.colorBrandForeground1
                                  : theme.colorNeutralForeground2,
                                fontSize: isFirst ? '1.25rem' : '1.125rem',
                                fontWeight: isFirst ? 600 : 400,
                                fontFamily: theme.fontFamilyBase,
                                textDecoration: 'none',
                                transition: 'color 0.2s ease',
                              }}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </nav>
            )}
          </div>

          {/* Right: Action buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginLeft: '1rem',
            }}
            suppressHydrationWarning
          >
            {/* Theme toggle — only light/dark */}
            {(themeMode === 'light' || themeMode === 'dark') && (
              <button
                onClick={handleThemeClick}
                style={buttonStyle}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  /* Sun icon */
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='5' />
                    <line x1='12' y1='1' x2='12' y2='3' />
                    <line x1='12' y1='21' x2='12' y2='23' />
                    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
                    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
                    <line x1='1' y1='12' x2='3' y2='12' />
                    <line x1='21' y1='12' x2='23' y2='12' />
                    <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
                    <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                  </svg>
                )}
              </button>
            )}

            {/* Menu toggle */}
            <button
              onClick={handleMenuClick}
              style={buttonStyle}
              aria-label={activeModal === 'menu' ? 'Close menu' : 'Open menu'}
              aria-expanded={activeModal === 'menu'}
              aria-controls='navigation-menu'
            >
              {activeModal === 'menu' ? (
                /* X icon */
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Navigation Modal */}
      <AnimatePresence mode='wait'>
        {isMounted && activeModal === 'menu' && (
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={handleModalClose}
            aria-hidden='true'
          >
            <motion.div
              id='navigation-menu'
              role='dialog'
              aria-modal='true'
              aria-label='Site navigation'
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '400px',
                backgroundColor: isDark
                  ? theme.colorNeutralBackground2
                  : theme.colorNeutralBackground1,
                boxShadow: theme.shadow64,
                overflowY: 'auto',
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <NavigationMenu onClose={handleModalClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
