'use client';

import { ReactNode, useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { FooterOverlay } from '@/components/FooterOverlay/FooterOverlay';
import { Footer } from '@/components/Footer';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ImageCarouselModal } from '@/components/ImageCarouselModal';
import { useFooterHeight } from '@/theme/hooks/useFooterHeight';
import { GalleryItem } from '@/content/types';
import { ResponsiveFeatureImage } from '@/components/ResponsiveFeatureImage/ResponsiveFeatureImage';

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
  /** Optional gallery images for the modal carousel */
  gallery?: GalleryItem[];
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
  gallery,
  nav,
}: CaseStudyLayoutProps) {
  const footerHeight = useFooterHeight();
  const { containerClasses, imagePaneClasses, contentPaneClasses } =
    useFeatureImageLayout();
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
    <SiteLayout showFooter={false} isContainedView={!!featureImage}>
      <div
        className='mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8'
        style={{
          minHeight: `calc(100vh - var(--site-header-height) - ${footerHeight})`,
        }}
      >
        {featureImage ? (
          <div className={containerClasses}>
            {/* Feature image pane - fixed and vertically centered on md+ */}
            <aside
              className={imagePaneClasses}
              style={{
                bottom: `calc(${footerHeight} + 1rem)`,
              }}
            >
              {modalImages.length > 1 ? (
                // Multiple images: show carousel
                <div className='w-full max-w-xl px-4 py-6 md:py-0'>
                  <ImageCarousel
                    images={modalImages}
                    onImageClick={() => setIsModalOpen(true)}
                  />
                </div>
              ) : (
                // Single image: show responsive feature image
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='relative w-full rounded-xl overflow-hidden aspect-[3/4] cursor-pointer hover:opacity-90 transition-opacity'
                  aria-label='View image fullscreen'
                >
                  <ResponsiveFeatureImage
                    src={featureImage.src}
                    alt={featureImage.alt}
                    title={featureImage.title}
                  />
                </button>
              )}
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

            {/* Content pane */}
            <article className={contentPaneClasses}>
              <div className='px-4 sm:px-6 lg:px-8 py-6 pb-16 md:pb-40 min-h-full flex flex-col'>
                <div className='flex-1 flex flex-col justify-center'>
                  {nav && <div>{nav}</div>}
                  {headerContent}
                  <div className='prose-content-body'>{children}</div>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <article className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 md:pb-16'>
            {nav && <div className='mb-6'>{nav}</div>}
            {headerContent}
            <div className='prose-content-body'>{children}</div>
          </article>
        )}
      </div>
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
