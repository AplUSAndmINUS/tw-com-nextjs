'use client';

/**
 * Header Component
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
import {
  useIsMobile,
  useIsMobileLandscape,
  useIsDesktop,
} from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAccessControl } from '@/hooks/useAccessControl';
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

export function Header() {
  const [activeModal, setActiveModal] = React.useState<
    'menu' | 'settings' | null
  >(null);
  const [isViewTransitioning, setIsViewTransitioning] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [hoveredButton, setHoveredButton] = React.useState<
    'theme' | 'settings' | 'menu' | null
  >(null);

  const modalSwitchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const {
    theme,
    themeMode,
    setThemeMode,
    layoutPreference,
    reducedTransparency,
  } = useAppTheme();
  const pathname = usePathname();
  const isMobileHook = useIsMobile();
  const isMobileLandscapeHook = useIsMobileLandscape();
  const isDesktopHook = useIsDesktop();
  const isMobile = isMounted ? isMobileHook : false;
  const isMobileLandscape = isMounted ? isMobileLandscapeHook : false;
  const isDesktop = isMounted ? isDesktopHook : false;
  const { shouldReduceMotion } = useReducedMotion();
  const { authRequired, isAuthenticated } = useAccessControl();

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
    // Clear any existing timeout before scheduling a new one
    if (modalSwitchTimeoutRef.current) {
      clearTimeout(modalSwitchTimeoutRef.current);
    }

    setIsViewTransitioning(true);
    modalSwitchTimeoutRef.current = setTimeout(() => {
      setActiveModal(target);
      setIsViewTransitioning(false);
      modalSwitchTimeoutRef.current = null;
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

  React.useEffect(() => {
    if (!isMounted) return;

    // On desktop, always use the "scrolled" state for consistent blur effect
    if (isDesktop) {
      setIsScrolled(true);
      return;
    }

    // On mobile, detect actual scroll position
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // sync initial position

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isMounted, isDesktop]);

  // Clean up modal switch timeout on unmount
  React.useEffect(() => {
    return () => {
      if (modalSwitchTimeoutRef.current) {
        clearTimeout(modalSwitchTimeoutRef.current);
      }
    };
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
    hidden: {
      x: shouldReduceMotion ? '0%' : modalSlideFrom,
      opacity: shouldReduceMotion ? 1 : 0,
    },
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
    width: isMobileLandscape ? '2.5rem' : '3rem',
    height: isMobileLandscape ? '2.5rem' : '3rem',
    cursor: 'pointer',
    color: theme.palette.neutralPrimary,
    transition: 'background-color 0.2s ease',
    padding: 0,
  };

  // Modal position: right side by default, left side in left-handed mode
  const modalPositionStyle: React.CSSProperties = isLeftHanded
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
      }
    : {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
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
          zIndex: 100,
          // transform, backface-visibility, and backdrop-filter base values are
          // set via the CSS rule in globals.css so they apply before hydration.
          // After hydration, these inline values take over and animate on scroll.
          backdropFilter: reducedTransparency
            ? 'none'
            : isScrolled || isDesktop
              ? 'blur(20px) saturate(300%)'
              : 'blur(6px) saturate(120%)',
          WebkitBackdropFilter: reducedTransparency
            ? 'none'
            : isScrolled || isDesktop
              ? 'blur(20px) saturate(300%)'
              : 'blur(6px) saturate(120%)',
          backgroundColor: isDark
            ? reducedTransparency
              ? 'rgba(26,26,26,0.95)'
              : isDesktop
                ? 'rgba(26,26,26,0.4)'
                : isScrolled
                  ? 'rgba(26, 26, 26, 0.75)'
                  : 'rgba(26, 26, 26, 0.4)'
            : reducedTransparency
              ? 'rgba(255,255,255,0.95)'
              : isDesktop
                ? 'rgba(255,255,255,0.5)'
                : isScrolled
                  ? 'rgba(255, 255, 255, 0.82)'
                  : 'rgba(255, 255, 255, 0.35)',
          borderBottom:
            isScrolled || isDesktop
              ? `1px solid ${theme.semanticColors.border.default}`
              : '1px solid transparent',
          boxShadow:
            isScrolled || isDesktop
              ? isDark
                ? '0 1px 24px rgba(0, 0, 0, 0.45)'
                : theme.shadows.s
              : 'none',
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isLeftHanded ? 'row-reverse' : 'row',
            padding:
              isMobileLandscape || isMobile ? '0.5rem 1.5rem' : '1rem 2rem',
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
                  padding: '0.125rem', // space for hanging letters
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
                                transition:
                                  'color 0.2s ease, backdrop-filter 0.2s ease',
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
              gap: isDesktop ? '0.75rem' : '0.5rem',
              marginLeft: isLeftHanded ? '0' : '1rem',
              marginRight: isLeftHanded ? '1rem' : '0',
              flexDirection: isLeftHanded ? 'row-reverse' : 'row',
            }}
            suppressHydrationWarning
          >
            {/* Theme toggle — only light/dark, hidden on homepage */}
            {!isHomePage && (themeMode === 'light' || themeMode === 'dark') && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleThemeClick}
                  onMouseEnter={() => setHoveredButton('theme')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={buttonStyle}
                  aria-label={`Displaying ${isDark ? 'dark' : 'light'} mode`}
                  title={`Displaying ${isDark ? 'dark' : 'light'} mode`}
                >
                  {isDark ? (
                    <FluentIcon
                      iconName={WeatherMoon32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  ) : (
                    <FluentIcon
                      iconName={WeatherSunny32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  )}
                </button>
                <span
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: hoveredButton === 'theme' ? 1 : 0,
                    visibility:
                      hoveredButton === 'theme' ? 'visible' : 'hidden',
                    transition:
                      'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                    fontSize: theme.typography.fontSizes.md,
                    letterSpacing: theme.typography.letterSpacing.tight,
                    fontWeight: theme.typography.fontWeights.semiBold,
                    color: theme.palette.neutralPrimary,
                    marginTop: '-0.25rem',
                    backgroundColor: 'transparent',
                    padding: '0',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 200,
                  }}
                >
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </div>
            )}

            {!isHomePage && !(authRequired && !isAuthenticated) && (
              <div style={{ position: 'relative' }}>
                <button
                  type='button'
                  onClick={handleSettingsClick}
                  onMouseEnter={() => setHoveredButton('settings')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={buttonStyle}
                  aria-label={
                    activeModal === 'settings'
                      ? 'Close settings'
                      : 'Open settings'
                  }
                  aria-expanded={activeModal === 'settings'}
                  aria-controls='settings-panel'
                >
                  {activeModal === 'settings' ? (
                    <FluentIcon
                      iconName={DismissSquare32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  ) : (
                    <FluentIcon
                      iconName={Settings32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  )}
                </button>
                <span
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: hoveredButton === 'settings' ? 1 : 0,
                    visibility:
                      hoveredButton === 'settings' ? 'visible' : 'hidden',
                    transition:
                      'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                    fontSize: theme.typography.fontSizes.md,
                    letterSpacing: theme.typography.letterSpacing.tight,
                    fontWeight: theme.typography.fontWeights.semiBold,
                    color: theme.palette.neutralPrimary,
                    marginTop: '-0.25rem',
                    backgroundColor:
                      themeMode === 'high-contrast'
                        ? theme.colorNeutralBackground1
                        : 'transparent',
                    padding: themeMode === 'high-contrast' ? '4px 8px' : '0',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 200,
                  }}
                >
                  Settings
                </span>
              </div>
            )}

            {/* Menu toggle */}
            {!(authRequired && !isAuthenticated) && (
              <div style={{ position: 'relative' }}>
                <button
                  type='button'
                  onClick={handleMenuClick}
                  onMouseEnter={() => setHoveredButton('menu')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={buttonStyle}
                  aria-label={
                    activeModal === 'menu' ? 'Close menu' : 'Open menu'
                  }
                  aria-expanded={activeModal === 'menu'}
                  aria-controls='navigation-menu'
                >
                  {activeModal === 'menu' ? (
                    <FluentIcon
                      iconName={DismissSquare32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  ) : (
                    <FluentIcon
                      iconName={Navigation32Regular}
                      color={theme.palette.neutralPrimary}
                    />
                  )}
                </button>
                <span
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: hoveredButton === 'menu' ? 1 : 0,
                    visibility: hoveredButton === 'menu' ? 'visible' : 'hidden',
                    transition:
                      'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                    fontSize: theme.typography.fontSizes.md,
                    letterSpacing: theme.typography.letterSpacing.tight,
                    fontWeight: theme.typography.fontWeights.semiBold,
                    color: theme.palette.neutralPrimary,
                    marginTop: '-0.25rem',
                    backgroundColor:
                      themeMode === 'high-contrast'
                        ? theme.colorNeutralBackground1
                        : 'transparent',
                    padding: themeMode === 'high-contrast' ? '4px 8px' : '0',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 200,
                  }}
                >
                  Menu
                </span>
              </div>
            )}
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
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}
            onClick={handleModalClose}
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
                maxWidth: isMobile ? '400px' : '480px',
                backgroundColor: isDark
                  ? theme.colorNeutralBackground2
                  : theme.colorNeutralBackground1,
                boxShadow: theme.shadow64,
                overflowY: 'auto',
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
