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
import type { NavItem, NavigationMenuProps } from './navigation.types';

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavigationItem({ item, isActive, onClick }: NavigationItemProps) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={item.path}
      onClick={onClick}
      style={{ textDecoration: 'none', width: '100%', display: 'block' }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: theme.borderRadiusMedium,
          backgroundColor:
            isActive || isHovered
              ? theme.colorNeutralBackground1Hover
              : 'transparent',
          transition: 'background-color 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            color:
              isActive || isHovered
                ? theme.colorBrandForeground1
                : theme.colorNeutralForeground1,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: isActive ? 600 : 400,
            fontFamily: theme.fontFamilyBase,
            textAlign: 'right',
            textTransform: 'capitalize',
            transition: 'color 0.2s ease',
          }}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.label}
        </span>
      </div>
      {item.description && (isActive || isHovered) && (
        <p
          style={{
            margin: '0 1rem 0.5rem',
            color: theme.colorNeutralForeground3,
            fontSize: '0.875rem',
            textAlign: 'right',
          }}
        >
          {item.description}
        </p>
      )}
    </Link>
  );
}

export function NavigationMenu({ onClose }: NavigationMenuProps) {
  const { theme } = useAppTheme();
  const { shouldReduceMotion } = useReducedMotion();
  const pathname = usePathname();

  const currentYear = new Date().getFullYear();

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
        style={{
          padding: '1.5rem 2rem',
          borderBottom: `1px solid ${theme.colorNeutralStroke2}`,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.colorBrandForeground1,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontFamily: theme.fontFamilyBase,
            fontWeight: 600,
            textAlign: 'right',
          }}
        >
          Menu
        </h2>
      </div>

      {/* Navigation Items */}
      <nav
        aria-label='Site navigation'
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '1.5rem 1rem',
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
            alignItems: 'flex-end',
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
                  onClick={onClose}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid ${theme.colorNeutralStroke2}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colorNeutralForeground3,
            fontSize: '0.875rem',
          }}
        >
          &copy; {currentYear} Terence Waters. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default NavigationMenu;
