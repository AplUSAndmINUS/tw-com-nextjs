'use client';

import { ReactNode } from 'react';
import { useAppTheme } from '@/theme';

function SectionHeading({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();

  return (
    <div className='mb-6'>
      <h2 className='text-2xl font-bold uppercase tracking-wide text-gray-900 dark:text-white'>
        {children}
      </h2>
      <div
        className='mt-2 w-20 h-1.5 rounded-full'
        style={{ backgroundColor: theme.palette.themePrimary }}
      />
    </div>
  );
}

export default SectionHeading;
