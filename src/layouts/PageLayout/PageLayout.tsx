import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
}

/**
 * PageLayout — standard page wrapper.
 *
 * Grid behaviour:
 * - Mobile / tablet-portrait: single column, image stacked above content (12 cols)
 * - Tablet-landscape / desktop / ultrawide: 3-col image + 9-col content
 */
export function PageLayout({ children, featureImage }: PageLayoutProps) {
  return (
    <SiteLayout>
      <div className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
        {featureImage ? (
          /* 3/9 responsive grid */
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start'>
            {/* Feature image — 3 cols on md+, full width on mobile */}
            <aside className='md:col-span-3 md:sticky md:top-20'>
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
                    <h2 className='text-white text-xl font-semibold'>
                      {featureImage.title}
                    </h2>
                  </div>
                )}
              </div>
            </aside>

            {/* Main content — 9 cols on md+, full width on mobile */}
            <div className='md:col-span-9'>{children}</div>
          </div>
        ) : (
          /* No feature image — full-width content */
          <div className='max-w-6xl mx-auto w-full'>{children}</div>
        )}
      </div>
    </SiteLayout>
  );
}
