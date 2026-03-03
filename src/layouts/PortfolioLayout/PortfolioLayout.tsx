'use client';

import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';

interface PortfolioLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  /** Optional feature image displayed in the left column */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** Optional navigation slot rendered above the content body (outside prose) */
  nav?: ReactNode;
}

/**
 * PortfolioLayout — portfolio entry pages.
 *
 * Full-width content layout (no feature image sidebar).
 */
export function PortfolioLayout({
  children,
  title,
  description,
  featureImage,
  nav,
}: PortfolioLayoutProps) {
  return (
    <SiteLayout>
      <div className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:py-8 min-h-[calc(100vh-4rem)]'>
        <div className='max-w-5xl mx-auto h-full flex flex-col justify-center'>
          {nav && <div>{nav}</div>}
          <header className='mb-10'>
            <Typography variant='h2'>{title}</Typography>
            {description && (
              <Typography
                variant='body'
                color='var(--colorNeutralForeground2)'
                marginTop='0.75rem'
              >
                {description}
              </Typography>
            )}
          </header>
          <div className='prose-content-body'>{children}</div>
        </div>
      </div>
    </SiteLayout>
  );
}
