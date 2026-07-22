'use client';

import React from 'react';
import Link from 'next/link';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { BookingsButton } from '@/components/BookingsButton/BookingsButton';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { FluentIcon } from '@/components/FluentIcon/FluentIcon';
import { WindowNewIcon } from '@/components/icons';
import styles from './AboutHeroCTAs.module.scss';

/**
 * AboutHeroCTAs — Theme-aware CTA buttons for the About page Hero.
 * Lives as a client component so it can consume useAppTheme().
 */
export function AboutHeroCTAs() {
  const { theme } = useAppTheme();
  const [secondaryHovered, setSecondaryHovered] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobileHook = useIsMobile();
  const isMobile = isMounted ? isMobileHook : false;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return !isMobile ? (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <BookingsButton isHero />
      <Link
        href='https://fluxline.pro'
        target='_blank'
        rel='noopener noreferrer'
        className={styles.secondaryCta}
        style={{
          backgroundColor: secondaryHovered
            ? theme.colorNeutralBackground2Hover
            : 'transparent',
          color: theme.semanticColors.text.primary,
          border: `2px solid ${theme.semanticColors.border.emphasis}`,
          textDecoration: 'none',
          fontSize: '1.125rem',
          fontWeight: 'normal',
          transition: `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}, border-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
          fontFamily: theme.typography.fonts.body.fontFamily,
        }}
        onPointerEnter={(e: React.PointerEvent<HTMLAnchorElement>) => {
          if (e.pointerType === 'mouse') setSecondaryHovered(true);
        }}
        onPointerLeave={(e: React.PointerEvent<HTMLAnchorElement>) => {
          if (e.pointerType === 'mouse') setSecondaryHovered(false);
        }}
      >
        Visit Fluxline.pro <FluentIcon iconName={WindowNewIcon} />
      </Link>
    </div>
  ) : null;
}
