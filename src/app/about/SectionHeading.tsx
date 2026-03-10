'use client';

import { ReactNode } from 'react';
import { useAppTheme } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

function SectionHeading({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();
  
  return (
    <div className='mb-6'>
      <Typography variant='h3' className='text-2xl font-bold uppercase tracking-wide text-gray-900 dark:text-white'>
        {children}
      </Typography>
      <div
        className='mt-2 w-16 h-1 rounded-full'
        style={{ backgroundColor: theme.palette.themePrimary }}
      />
    </div>
  );
}

export default SectionHeading;