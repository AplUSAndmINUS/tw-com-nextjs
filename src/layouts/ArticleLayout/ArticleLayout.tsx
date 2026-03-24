'use client';

import { ReactNode, useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay/FooterOverlay';
import { ImageCarouselModal } from '@/components/ImageCarouselModal';
import { useFooterHeight } from '@/theme/hooks/useFooterHeight';
import { GalleryItem } from '@/content/types';

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
  /** Optional gallery images for the modal carousel */
  gallery?: GalleryItem[];
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
  gallery,
  nav,
}: ArticleLayoutProps) {
  const footerHeight = useFooterHeight();
  const { imagePaneClasses, contentPaneClasses } = useFeatureImageLayout();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build gallery images for modal: use full gallery if available, otherwise just feature image
  const modalImages: GalleryItem[] =
    gallery && gallery.length > 0
      ? gallery
      : featureImage
        ? [
            {
              url: featureImage.src,
              alt: featureImage.alt,
              caption: featureImage.title,
            },
          ]
        : [];

  return (
    <SiteLayout showFooter={false} isContainedView={!!featureImage}>
      {featureImage ? (
        <div className='min-h-[calc(100vh-var(--site-header-height))] flex flex-col md:flex-row md:h-[calc(100vh-var(--site-header-height))] md:overflow-hidden'>
          {/* Feature image pane - fixed and vertically centered on md+ */}
          <aside
            className={imagePaneClasses}
            style={{
              bottom: `calc(${footerHeight} + 1rem)`,
            }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className='w-full max-w-md h-[33.33vh] md:h-auto px-4 py-6 md:py-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity'
              aria-label='View image fullscreen'
            >
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
            </button>
          </aside>

          {/* Image modal */}
          {modalImages.length > 0 && (
            <ImageCarouselModal
              isOpen={isModalOpen}
              onDismiss={() => setIsModalOpen(false)}
              images={modalImages}
              initialIndex={0}
            />
          )}

          {/* Article content pane */}
          <article className={contentPaneClasses}>
            <div className='px-4 sm:px-6 lg:px-8 py-6 pb-16 md:pb-40 min-h-full flex flex-col'>
              <div className='flex-1 flex flex-col justify-center'>
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
              </div>
            </div>
          </article>
        </div>
      ) : (
        <article className='max-width-content mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 md:pb-16'>
          {nav && <div className='mb-6'>{nav}</div>}
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
