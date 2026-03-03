'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { FooterOverlay } from '@/components/FooterOverlay/FooterOverlay';

interface CaseStudyLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
  industry?: string;
  /** Optional feature image displayed in the left column */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** Optional navigation slot rendered above the case study header */
  nav?: ReactNode;
}

/**
 * CaseStudyLayout — in-depth project case study pages.
 *
 * Grid behaviour:
 * - Mobile / tablet-portrait: single column, image stacked above content
 * - Tablet-landscape / desktop / ultrawide: 3-col image + 9-col content
 */
export function CaseStudyLayout({
  children,
  title,
  date,
  industry,
  featureImage,
  nav,
}: CaseStudyLayoutProps) {
  const { imagePaneClasses, contentPaneClasses } = useFeatureImageLayout();

  const headerContent = (
    <header className='mb-6 md:mb-10 border-b pb-4 md:pb-8'>
      <Typography
        variant='label'
        color='var(--colorBrandForeground1)'
        style={{
          display: 'block',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {industry ?? 'Case Study'}
      </Typography>
      <Typography variant='h1' marginTop='0.5rem'>
        {title}
      </Typography>
      {date && (
        <time className='mt-2 block' dateTime={date}>
          <Typography variant='caption' color='var(--colorNeutralForeground2)'>
            {date}
          </Typography>
        </time>
      )}
    </header>
  );

  return (
    <SiteLayout showFooter={false}>
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
            <article className={contentPaneClasses}>
              {nav && <div>{nav}</div>}
              {headerContent}
              <div className='prose-content-body'>{children}</div>
            </article>
            {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
            <div className='hidden md:block'>
              <FooterOverlay />
            </div>
          </div>
        ) : (
          <article className='max-w-4xl mx-auto'>
            {nav && <div>{nav}</div>}
            {headerContent}
            <div className='prose-content-body'>{children}</div>
          </article>
        )}
      </div>
    </SiteLayout>
  );
}
