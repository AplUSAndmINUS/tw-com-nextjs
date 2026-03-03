'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';

interface ArticleLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
  author?: string;
  /** Optional feature image displayed in the left column */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };
  /** Optional navigation slot rendered above the article body (outside prose) */
  nav?: ReactNode;
}

/**
 * ArticleLayout — blog posts with header and byline.
 *
 * Grid behaviour:
 * - Mobile / tablet-portrait: single column, image stacked above content
 * - Tablet-landscape / desktop / ultrawide: 3-col image + 9-col content
 */
export function ArticleLayout({
  children,
  title,
  date,
  author,
  featureImage,
  nav,
}: ArticleLayoutProps) {
  const { imagePaneClasses, contentPaneClasses } = useFeatureImageLayout();

  return (
    <SiteLayout>
      {featureImage ? (
        <div className='min-h-[calc(100vh-4rem)] flex flex-col md:flex-row md:h-[calc(100vh-4rem)] md:overflow-hidden'>
          {/* Feature image pane - fixed and vertically centered on md+ */}
          <aside className={imagePaneClasses}>
            <div className='w-full max-w-md h-[33.33vh] md:h-auto px-4 py-6 md:py-0 overflow-hidden'>
              <ResponsiveFeatureImage
                src={featureImage.src}
                alt={featureImage.alt}
                title={featureImage.title}
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

          {/* Article content pane */}
          <article className={contentPaneClasses}>
            {nav && <div>{nav}</div>}
            <header className='mb-8 border-b pb-6'>
              <Typography variant='h2'>{title}</Typography>
              <div className='flex items-center gap-4 mt-3'>
                {author && (
                  <Typography
                    variant='caption'
                    color='var(--colorNeutralForeground2)'
                  >
                    By {author}
                  </Typography>
                )}
                {date && (
                  <time dateTime={date}>
                    <Typography
                      variant='caption'
                      color='var(--colorNeutralForeground2)'
                    >
                      {date}
                    </Typography>
                  </time>
                )}
              </div>
              {author && (
                <div className='mt-3'>
                  <SocialLinks isAuthorTagline={true} />
                </div>
              )}
            </header>
            <div className='prose-content-body'>{children}</div>
          </article>
        </div>
      ) : (
        <article className='max-width-content mx-auto'>
          {nav && <div>{nav}</div>}
          <header className='mb-8 pb-6'>
            <Typography variant='h2'>{title}</Typography>
            <div className='flex items-center gap-4 mt-3'>
              {author && (
                <Typography
                  variant='caption'
                  color='var(--colorNeutralForeground2)'
                >
                  By {author}
                </Typography>
              )}
              {date && (
                <time dateTime={date}>
                  <Typography
                    variant='caption'
                    color='var(--colorNeutralForeground2)'
                  >
                    {date}
                  </Typography>
                </time>
              )}
            </div>
            {author && (
              <div className='mt-3'>
                <SocialLinks isAuthorTagline={true} />
              </div>
            )}
          </header>
          <div className='border-t'>{children}</div>
        </article>
      )}
    </SiteLayout>
  );
}
