'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './NotFoundContent.module.scss';

export function NotFoundContent() {
  const { theme } = useAppTheme();
  const [homeBtnHovered, setHomeBtnHovered] = useState(false);
  const [contentBtnHovered, setContentBtnHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const primaryBtnStyle = {
    backgroundColor: homeBtnHovered
      ? theme.semanticColors.link.hover
      : theme.semanticColors.link.default,
    color: theme.semanticColors.background.base,
  };

  const outlineBtnStyle = {
    borderColor: theme.semanticColors.link.default,
    color: contentBtnHovered
      ? theme.semanticColors.background.base
      : theme.semanticColors.link.default,
    backgroundColor: contentBtnHovered
      ? theme.semanticColors.link.default
      : undefined,
  };

  return (
    <div className={styles.root}>
      <Typography
        variant='body'
        className={styles.intro}
      >
        Let&apos;s get you back on track:
      </Typography>

      <div className={styles.ctaRow}>
        <Link
          href='/'
          className={styles.primaryBtn}
          style={primaryBtnStyle}
          onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setHomeBtnHovered(true); }}
          onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setHomeBtnHovered(false); }}
        >
          ← Go to Home
        </Link>
        <Link
          href='/content-hub'
          className={styles.outlineBtn}
          style={outlineBtnStyle}
          onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setContentBtnHovered(true); }}
          onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setContentBtnHovered(false); }}
        >
          Browse Content Hub
        </Link>
      </div>

      <div className={styles.popularSection}>
        <Typography
          variant='h3'
          className={styles.popularHeading}
        >
          Popular Pages
        </Typography>
        <div className={styles.cardGrid}>
          {[
            {
              href: '/blog',
              label: 'Blog',
              desc: 'Read articles and insights',
            },
            {
              href: '/portfolio',
              label: 'Portfolio',
              desc: 'View my work and projects',
            },
            { href: '/about', label: 'About', desc: 'Learn more about me' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className={styles.card}
              style={
                hoveredCard === href
                  ? { borderColor: theme.semanticColors.link.default }
                  : undefined
              }
              onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setHoveredCard(href); }}
              onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setHoveredCard(null); }}
            >
              <Typography variant='h4' className={styles.cardTitle}>
                {label}
              </Typography>
              <Typography
                variant='caption'
                className={styles.cardDesc}
              >
                {desc}
              </Typography>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
