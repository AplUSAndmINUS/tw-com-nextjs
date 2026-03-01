'use client';

/**
 * Navigation / Header Component
 *
 * Matches Fluxline-Pro's header architecture:
 * - Fixed position with backdrop blur
 * - Breadcrumb navigation on desktop
 * - Current page title on mobile
 * - Slide-in navigation menu modal
 * - Settings panel modal
 * - Left-handed / right-handed layout support
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
import { SettingsPanel } from '@/components/SettingsPanel';
import { FluentIcon } from '../FluentIcon';
import {
  DismissSquare32Regular,
  Navigation32Regular,
  Settings32Regular,
  WeatherMoon32Regular,
  WeatherSunny32Regular,
} from '@fluentui/react-icons';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isClickable?: boolean;
}

export function Navigation() {
  const [activeModal, setActiveModal] = React.useState<
    'menu' | 'settings' | null
  >(null);
  const [isViewTransitioning, setIsViewTransitioning] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const { theme, themeMode, setThemeMode, layoutPreference } = useAppTheme();
  const pathname = usePathname();
  const isMobileHook = useIsMobile();
  const isMobile = isMounted ? isMobileHook : false;
  const { shouldReduceMotion } = useReducedMotion();

  const isLeftHanded = layoutPreference === 'left-handed';

  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

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

  const handleThemeClick = () => {
    if (themeMode !== 'light' && themeMode !== 'dark') return;
    setThemeMode(isDark ? 'light' : 'dark');
  };

  // Matches the modal exit transition duration (0.25s = 250ms) + small buffer
  const MODAL_SWITCH_DELAY = 300;

  const switchToModal = (target: 'menu' | 'settings') => {
    setIsViewTransitioning(true);
    setTimeout(() => {
      setActiveModal(target);
      setIsViewTransitioning(false);
    }, MODAL_SWITCH_DELAY);
  };

  const handleSettingsClick = () => {
    if (activeModal === 'settings') {
      setActiveModal(null);
    } else if (activeModal === 'menu') {
      switchToModal('settings');
    } else {
      setActiveModal('settings');
    }
  };

  const handleMenuClick = () => {
    if (activeModal === 'menu') {
      setActiveModal(null);
    } else if (activeModal === 'settings') {
      switchToModal('menu');
    } else {
      setActiveModal('menu');
    }
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

  // For left-handed mode, the modal slides from the left; otherwise from the right
  const modalSlideFrom = isLeftHanded ? '-100%' : '100%';

  const modalVariants: Variants = {
    hidden: { x: shouldReduceMotion ? '0%' : modalSlideFrom, opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0.0, 0.2, 1.0],
      },
    },
    exit: {
      x: shouldReduceMotion ? '0%' : modalSlideFrom,
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
    width: '3rem',
    height: '3rem',
    background: 'none',
    cursor: 'pointer',
    color: theme.colorNeutralForeground1,
    transition: 'background-color 0.2s ease, transform 0.15s ease',
    padding: 0,
  };

  // Modal position: right side by default, left side in left-handed mode
  const modalPositionStyle: React.CSSProperties = isLeftHanded
    ? { position: 'absolute', top: 0, left: 0, bottom: 0 }
    : { position: 'absolute', top: 0, right: 0, bottom: 0 };

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
          borderBottom: `1px solid ${theme.colorBrandBackgroundStatic}`,
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
              <span
                style={{
                  color: theme.colorNeutralForeground1,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontFamily: theme.typography.fontFamilies.h3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {isHomePage ? 'Terence Waters' : currentPageTitle}
              </span>
            ) : (
              <nav aria-label='Breadcrumb' suppressHydrationWarning>
                {isHomePage ? (
                  <Link
                    href='/'
                    style={{
                      color: theme.colorBrandForeground1,
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      fontFamily: theme.typography.fontFamilies.h3,
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
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
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
                                fontFamily: theme.typography.fontFamilies.h3,
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
                                fontFamily: theme.typography.fontFamilies.h3,
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
              gap: '0.5rem',
              marginLeft: '1rem',
            }}
            suppressHydrationWarning
          >
            {/* Theme toggle — only light/dark, hidden on homepage */}
            {!isHomePage && (themeMode === 'light' || themeMode === 'dark') && (
              <button
                onClick={handleThemeClick}
                style={buttonStyle}
                aria-label={`Displaying ${isDark ? 'dark' : 'light'} mode`}
                title={`Displaying ${isDark ? 'dark' : 'light'} mode`}
              >
                {isDark ? (
                  <FluentIcon
                    iconName={WeatherMoon32Regular}
                    color={theme.colorBrandForeground1}
                  />
                ) : (
                  <FluentIcon
                    iconName={WeatherSunny32Regular}
                    color={theme.colorBrandForeground1}
                  />
                )}
              </button>
            )}

            {/* Settings toggle */}
            <button
              onClick={handleSettingsClick}
              style={buttonStyle}
              aria-label={
                activeModal === 'settings' ? 'Close settings' : 'Open settings'
              }
              aria-expanded={activeModal === 'settings'}
              aria-controls='settings-panel'
            >
              {activeModal === 'settings' ? (
                <FluentIcon
                  iconName={DismissSquare32Regular}
                  color={theme.colorBrandForeground1}
                />
              ) : (
                <FluentIcon
                  iconName={Settings32Regular}
                  color={theme.colorBrandForeground1}
                />
              )}
            </button>

            {/* Menu toggle */}
            <button
              onClick={handleMenuClick}
              style={buttonStyle}
              aria-label={activeModal === 'menu' ? 'Close menu' : 'Open menu'}
              aria-expanded={activeModal === 'menu'}
              aria-controls='navigation-menu'
            >
              {activeModal === 'menu' ? (
                <FluentIcon
                  iconName={DismissSquare32Regular}
                  color={theme.colorBrandForeground1}
                />
              ) : (
                <FluentIcon
                  iconName={Navigation32Regular}
                  color={theme.colorBrandForeground1}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Modal overlay for both menu and settings */}
      <AnimatePresence mode='wait'>
        {isMounted && activeModal && (
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
              id={activeModal === 'menu' ? 'navigation-menu' : 'settings-panel'}
              role='dialog'
              aria-modal='true'
              aria-label={
                activeModal === 'menu' ? 'Site navigation' : 'Settings panel'
              }
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              style={{
                ...modalPositionStyle,
                width: '100%',
                maxWidth: isMobile ? '350px' : '400px',
                backgroundColor: isDark
                  ? theme.colorNeutralBackground2
                  : theme.colorNeutralBackground1,
                boxShadow: theme.shadow64,
                overflowY: 'auto',
                opacity: isViewTransitioning ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {activeModal === 'menu' && (
                <NavigationMenu onClose={handleModalClose} />
              )}
              {activeModal === 'settings' && (
                <SettingsPanel onClose={handleModalClose} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
