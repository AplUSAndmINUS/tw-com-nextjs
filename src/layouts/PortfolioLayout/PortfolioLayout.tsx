'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { FooterOverlay } from '@/components/FooterOverlay/FooterOverlay';

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
 * Grid behaviour:
 * - Mobile / tablet-portrait: single column, image stacked above content
 * - Tablet-landscape / desktop / ultrawide: 3-col image + 9-col content
 */
export function PortfolioLayout({
  children,
  title,
  description,
  featureImage,
  nav,
}: PortfolioLayoutProps) {
  const { imagePaneClasses, contentPaneClasses } = useFeatureImageLayout();

  return (
    <SiteLayout>
      <div className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8'>
        {featureImage ? (
          <div className='min-h-[calc(100vh-4rem)] flex flex-col md:flex-row'>
            {/* Feature image pane - fixed and vertically centered on md+ */}
            <aside className={imagePaneClasses}>
              <div className='relative w-full rounded-xl overflow-hidden shadow-lg aspect-[3/4]'>
                <Image
                  src={featureImage.src}
                  alt={featureImage.alt}
                  fill
                  sizes='(max-width: 768px) 100vw, 25vw'
                  className='object-cover'
                  priority
                />
                {featureImage.title && (
                  <div className='absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                    <Typography variant='h5' color='#ffffff'>
                      {featureImage.title}
                    </Typography>
                  </div>
                )}
              </div>
            </aside>

            {/* Content pane */}
            <div className={contentPaneClasses}>
              <div className='px-4 sm:px-6 lg:px-8 py-6 pb-32'>
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
            {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
            <div className='hidden md:block'>
              <FooterOverlay hideButton={true} />
            </div>
          </div>
        ) : (
          <div className='max-w-5xl mx-auto'>
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
        )}
      </div>
    </SiteLayout>
  );
}
