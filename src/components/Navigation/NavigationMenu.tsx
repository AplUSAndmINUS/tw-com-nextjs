'use client';

/**
 * NavigationMenu Component
 * Slide-in navigation menu panel matching Fluxline-Pro's navigation structure.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { navItems } from './navigation.config';
import { Typography } from '@/components/Typography';
import type { NavItem, NavigationMenuProps } from './navigation.types';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import { useIsMobile, useIsMobileLandscape } from '@/hooks/useMediaQuery';
import { FluentIcon } from '@/components/FluentIcon';
import { defaultUserPreferences } from '@/store/userPreferencesStore';
import { Dismiss32Regular } from '@fluentui/react-icons';
import LinktreeLogo from '@/assets/svgs/LinktreeLogo';

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  isMobile: boolean;
  onClick: () => void;
  textAlignment: 'left' | 'right';
  flexAlignment: 'flex-start' | 'flex-end';
}

function NavigationItem({
  item,
  isActive,
  isMobile,
  onClick,
  textAlignment,
  flexAlignment,
}: NavigationItemProps) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={item.path}
      onClick={onClick}
      style={{ textDecoration: 'none', width: '100%', display: 'block' }}
    >
      <div
        onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setIsHovered(true); }}
        onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setIsHovered(false); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: flexAlignment,
          gap: '0.75rem',
          padding: isMobile ? '0.75rem 0 1rem 0.75rem' : '0.75rem 1rem',
          borderRadius: theme.borderRadiusMedium,
          backgroundColor:
            isActive || isHovered
              ? theme.palette.neutralTertiaryAlt
              : 'transparent',
          transition: 'background-color 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <Typography
          variant='h4'
          style={{
            color:
              isActive || isHovered
                ? theme.colorBrandForeground1
                : theme.colorNeutralForeground1,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: isActive ? 600 : 400,
            textAlign: textAlignment,
            textTransform: 'capitalize',
            transition: 'color 0.2s ease',
          }}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.label}
        </Typography>
      </div>
      {/* {item.description && (isActive || isHovered) && ( --- IGNORE ---
        <Typography
          variant='body'
          style={{
            margin: '0 1rem 0.5rem',
            color: theme.colorNeutralForeground3,
            fontSize: '0.875rem',
            textAlign: 'right',
          }}
        >
          {item.description}
        </Typography>
      )} */}
    </Link>
  );
}

export function NavigationMenu({ onClose }: NavigationMenuProps) {
  const { theme, layoutPreference, isHydrated } = useAppTheme();
  const { shouldReduceMotion } = useReducedMotion();
  const pathname = usePathname();
  const isMobileHook = useIsMobile();
  const isMobileLandscapeHook = useIsMobileLandscape();
  const [isMounted, setIsMounted] = React.useState(false);

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isMobile = isMounted ? isMobileHook : false;
  const isMobileLandscape = isMounted ? isMobileLandscapeHook : false;
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const resolvedLayoutPreference = isHydrated
    ? layoutPreference
    : defaultUserPreferences.layoutPreference;
  const isLeftHanded = resolvedLayoutPreference === 'left-handed';
  const textAlignment = isLeftHanded ? 'left' : 'right';
  const flexAlignment = isLeftHanded ? 'flex-start' : 'flex-end';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Menu Header */}
      <div
        className='flex items-center justify-between'
        style={{
          padding: isMobileLandscape ? '1rem 1.5rem' : '1.5rem 2rem',
          borderBottom: `1px solid ${theme.colorNeutralStroke2}`,
        }}
      >
        <Typography
          variant='h3'
          style={{
            margin: 0,
            color: theme.colorBrandForeground1,
            textAlign: textAlignment,
          }}
        >
          Menu
        </Typography>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: theme.colorBrandForeground1,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            aria-label='Close menu'
          >
            <FluentIcon
              iconName={Dismiss32Regular}
              color={theme.palette.neutralTertiary}
            />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav
        aria-label='Site navigation'
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: isMobileLandscape ? '1rem' : '1.5rem 2rem',
        }}
      >
        <ul
          role='list'
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: flexAlignment,
            gap: '0.25rem',
          }}
        >
          <AnimatePresence>
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : index * 0.06,
                  duration: shouldReduceMotion ? 0 : 0.25,
                  ease: 'easeOut',
                }}
                style={{ width: '100%' }}
              >
                <NavigationItem
                  item={item}
                  isActive={pathname === item.path}
                  isMobile={isMobile}
                  onClick={onClose}
                  textAlignment={textAlignment}
                  flexAlignment={flexAlignment}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <motion.div
          className={`flex items-end ${isLeftHanded ? 'justify-start' : 'justify-end'} mt-8 transition-transform hover:scale-105`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : navItems.length * 0.06 + 0.1,
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: 'easeOut',
          }}
        >
          <a
            href='https://linktr.ee/aplusinflux'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit Terence Waters on Linktree'
            title='Visit Terence Waters on Linktree'
          >
            <LinktreeLogo />
          </a>
        </motion.div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: isMobileLandscape ? '0.25rem' : '0.5rem',
          borderTop: `1px solid ${theme.palette.black}`,
          textAlign: 'center',
          paddingLeft: isMobile
            ? '0'
            : isMobileLandscape
              ? '0.25rem'
              : '0.5rem',
        }}
      >
        <SocialLinks />
        <Typography
          variant='body'
          style={{
            marginBottom: '1rem',
            color: theme.colorNeutralForeground3,
            fontSize: '0.875rem',
          }}
        >
          &copy; 2025-{currentYear} Terence Waters. All rights reserved.
        </Typography>
      </div>
    </div>
  );
}

export default NavigationMenu;
