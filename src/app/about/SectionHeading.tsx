'use client';

import { ReactNode } from 'react';
import { useAppTheme } from '@/theme';
import { Typography } from '@/components/Typography/Typography';
import styles from './SectionHeading.module.scss';

function SectionHeading({
  children,
  isAccent,
  id,
}: {
  children: ReactNode;
  isAccent?: boolean;
  id?: string;
}) {
  const { theme } = useAppTheme();

  return (
    <div className={styles.wrap}>
      <Typography
        variant='h2'
        id={id}
        className={styles.heading}
        style={{
          fontSize: 'clamp(1.6rem, 5vw + 0.5rem, 2.25rem)',
        }}
      >
        {children}
      </Typography>
      <div
        className={styles.rule}
        style={{
          backgroundColor: isAccent
            ? theme.semanticColors.accent.teal
            : theme.palette.themePrimary,
        }}
      />
    </div>
  );
}

export default SectionHeading;
