'use client';

import { ReactNode } from 'react';
import { useAppTheme } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

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
    <div className='mb-6'>
      <Typography
        variant='h2'
        id={id}
        className='font-bold uppercase tracking-wide text-gray-900 mt-2 dark:text-white'
        style={{
          fontSize: 'clamp(1.6rem, 5vw + 0.5rem, 2.25rem)',
        }}
      >
        {children}
      </Typography>
      <div
        className='mt-2 w-40 h-1.5 mb-8 rounded-full'
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
