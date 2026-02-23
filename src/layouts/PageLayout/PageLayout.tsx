'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };

  /// If true, applies special layout/styling for the homepage (full-height contained view)
  isHomePage?: boolean;
}

/**
 * PageLayout — standard page wrapper.
 *
 * Grid behaviour:
 * - Mobile: single column, scrollable
 * - Desktop with feature image: sticky left image (3 cols) + scrollable right content (9 cols)
 * - Desktop homepage: full-viewport contained (no scrolling), with compact footer
 */
export function PageLayout({
  children,
  featureImage,
  isHomePage = false,
}: PageLayoutProps) {
  // Homepage: full-height contained layout (Fluxline.pro style)
  if (isHomePage) {
    return (
      <SiteLayout isContainedView>
        {/* Mobile: normal scrolling | Desktop: contained viewport */}
        <div className='h-full overflow-y-auto lg:overflow-hidden flex flex-col'>
          {featureImage ? (
            /* Desktop: 3/9 grid with sticky left pane */
            <div className='flex-1 lg:grid lg:grid-cols-12 lg:h-full lg:overflow-hidden'>
              {/* Left image pane - sticky, non-scrollable on desktop */}
              <aside className='lg:col-span-3 lg:h-full lg:overflow-hidden relative'>
                <div className='relative w-full h-64 lg:h-full'>
                  <Image
                    src={featureImage.src}
                    alt={featureImage.alt}
                    fill
                    sizes='(max-width: 1024px) 100vw, 25vw'
                    className='object-cover'
                    priority
                  />
                  {featureImage.title && (
                    <div className='absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                      <h2 className='text-white text-xl font-semibold'>
                        {featureImage.title}
                      </h2>
                    </div>
                  )}
                </div>
              </aside>

              {/* Right content pane - contains both content and footer on desktop */}
              <div className='lg:col-span-9 lg:h-full lg:overflow-y-auto flex flex-col'>
                <div className='flex-1 px-4 sm:px-6 lg:px-8 py-8'>
                  {children}
                </div>
                <Footer isHomePage />
              </div>
            </div>
          ) : (
            /* No feature image - single column with footer */
            <div className='flex-1 flex flex-col lg:overflow-y-auto'>
              <div className='flex-1 max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8'>
                {children}
              </div>
              <Footer isHomePage />
            </div>
          )}
        </div>
      </SiteLayout>
    );
  }

  // Standard pages: normal scrolling layout
  return (
    <SiteLayout>
      <div className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
        {featureImage ? (
          /* 3/9 responsive grid */
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start'>
            {/* Feature image — 3 cols on lg+, sticky on desktop */}
            <aside className='lg:col-span-3 lg:sticky lg:top-20'>
              <div className='relative w-full rounded-xl overflow-hidden shadow-lg aspect-[3/4]'>
                <Image
                  src={featureImage.src}
                  alt={featureImage.alt}
                  fill
                  sizes='(max-width: 1024px) 100vw, 25vw'
                  className='object-cover'
                  priority
                />
                {featureImage.title && (
                  <div className='absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                    <h2 className='text-white text-xl font-semibold'>
                      {featureImage.title}
                    </h2>
                  </div>
                )}
              </div>
            </aside>

            {/* Main content — 9 cols on lg+, full width on mobile */}
            <div className='lg:col-span-9'>{children}</div>
          </div>
        ) : (
          /* No feature image — full-width content */
          <div className='max-w-6xl w-full mx-auto'>{children}</div>
        )}
      </div>
    </SiteLayout>
  );
}
