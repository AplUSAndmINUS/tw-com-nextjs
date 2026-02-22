import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
  /** Optional feature image displayed in the left column */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
}

/**
 * ContentLayout — long-form content (essays, articles).
 *
 * Grid behaviour:
 * - Mobile / tablet-portrait: single column, image stacked above content
 * - Tablet-landscape / desktop / ultrawide: 3-col image + 9-col content
 */
export function ContentLayout({
  children,
  title,
  date,
  featureImage,
}: ContentLayoutProps) {
  return (
    <SiteLayout>
      <div className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
        {featureImage ? (
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start'>
            {/* Feature image — sticky sidebar on md+ */}
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

            {/* Content — 9 cols */}
            <article className='md:col-span-9'>
              <header className='mb-8'>
                <h1 className='text-4xl font-bold'>{title}</h1>
                {date && (
                  <time
                    className='text-sm text-gray-500 mt-2 block'
                    dateTime={date}
                  >
                    {date}
                  </time>
                )}
              </header>
              <div className='prose prose-lg dark:prose-invert max-w-none'>
                {children}
              </div>
            </article>
          </div>
        ) : (
          <article className='max-w-3xl mx-auto'>
            <header className='mb-8'>
              <h1 className='text-4xl font-bold'>{title}</h1>
              {date && (
                <time
                  className='text-sm text-gray-500 mt-2 block'
                  dateTime={date}
                >
                  {date}
                </time>
              )}
            </header>
            <div className='prose prose-lg dark:prose-invert max-w-none'>
              {children}
            </div>
          </article>
        )}
      </div>
    </SiteLayout>
  );
}
