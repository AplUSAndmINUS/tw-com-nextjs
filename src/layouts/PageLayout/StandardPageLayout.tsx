import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';

interface StandardPageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** If true, renders a more compact layout */
  isCompact?: boolean;
}

/**
 * StandardPageLayout — Server component for standard (non-homepage) pages
 *
 * Provides a normal scrolling layout with optional feature image.
 * Uses CSS media queries instead of JS hooks for responsive behavior.
 */
export function StandardPageLayout({
  children,
  featureImage,
}: StandardPageLayoutProps) {
  return (
    <SiteLayout>
      {/* manually set the maxwidth here because it needs to stretch the same size as the Navigation content (which is outside of this PageLayout) */}
      <div className='mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 max-width-content'>
        {featureImage ? (
          /* 3/9 responsive grid - use items-start on mobile, items-center on desktop via CSS */
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start lg:items-center'>
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
          <div
            className='w-full max-width-content'
            style={{ margin: '0 auto' }}
          >
            {children}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
