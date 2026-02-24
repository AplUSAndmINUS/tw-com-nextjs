'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Footer } from '@/components/Footer';

interface HomePageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
}

/**
 * HomePageLayout — Client component for homepage with contained viewport behavior
 *
 * Features:
 * - Full-height contained layout (Fluxline.pro style)
 * - Mobile: normal scrolling
 * - Desktop: contained viewport with no page scroll
 * - Integrated Footer handling
 * - Background image automatically switches portrait/landscape via CSS media query
 */
export function HomePageLayout({
  children,
  featureImage,
}: HomePageLayoutProps) {
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
              <div className='flex-1 px-4 sm:px-6 lg:px-8 py-8'>{children}</div>
              <Footer isHomePage />
            </div>
          </div>
        ) : (
          /* No feature image - single column with footer */
          /* Background image automatically switches portrait/landscape via CSS media query */
          <div className='flex-1 flex flex-col lg:overflow-y-auto homepage-background'>
            <div
              className='flex-1 w-full px-4 sm:px-6 lg:px-8 md:py-8'
              style={{ maxWidth: '1920px', margin: '0 auto' }}
            >
              {children}
            </div>
            <Footer isHomePage />
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
