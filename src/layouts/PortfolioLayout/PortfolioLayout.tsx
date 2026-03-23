'use client';

import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';
import { useFooterHeight } from '@/theme/hooks/useFooterHeight';

interface PortfolioLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
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
  nav,
}: PortfolioLayoutProps) {
  const footerHeight = useFooterHeight();

  return (
    <SiteLayout showFooter={false}>
      <div
        className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:py-8'
        style={{
          minHeight: `calc(100vh - 4rem - ${footerHeight})`,
        }}
      >
        <div className='max-w-5xl mx-auto h-full flex flex-col justify-center'>
          {nav && <div className='mb-6'>{nav}</div>}
          <header className='mb-8'>
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
      {/* Mobile: Standard footer always visible */}
      <div className='md:hidden'>
        <Footer isCompact />
      </div>
      {/* Tablet/Desktop: Interactive footer overlay */}
      <div className='hidden md:block'>
        <FooterOverlay />
      </div>
    </SiteLayout>
  );
}
