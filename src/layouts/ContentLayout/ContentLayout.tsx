import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';

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
 * ContentLayout — long-form content (i.e., articles).
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
                    <Typography variant='h5' color='#ffffff'>
                      {featureImage.title}
                    </Typography>
                  </div>
                )}
              </div>
            </aside>

            {/* Content — 9 cols */}
            <article className='md:col-span-9'>
              <header className='mb-8'>
                <Typography variant='h1'>{title}</Typography>
                {date && (
                  <time className='mt-2 block' dateTime={date}>
                    <Typography variant='caption' color='var(--colorNeutralForeground2)'>
                      {date}
                    </Typography>
                  </time>
                )}
              </header>
              <div>{children}</div>
            </article>
          </div>
        ) : (
          <article className='max-w-3xl mx-auto'>
            <header className='mb-8'>
              <Typography variant='h1'>{title}</Typography>
              {date && (
                <time className='mt-2 block' dateTime={date}>
                  <Typography variant='caption' color='var(--colorNeutralForeground2)'>
                    {date}
                  </Typography>
                </time>
              )}
            </header>
            <div>{children}</div>
          </article>
        )}
      </div>
    </SiteLayout>
  );
}
