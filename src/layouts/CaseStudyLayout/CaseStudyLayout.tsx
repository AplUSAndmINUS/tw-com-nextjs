'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Typography } from '@/components/Typography';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';
import { FooterOverlay } from '@/components/FooterOverlay/FooterOverlay';
import { ImageCarouselModal } from '@/components/ImageCarouselModal';
import { useFooterHeight } from '@/theme/hooks/useFooterHeight';
import { GalleryItem } from '@/content/types';

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
    <SiteLayout>
      <div
        className='max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8'
        style={{
          minHeight: `calc(100vh - 4rem - ${footerHeight})`,
        }}
      >
        {featureImage ? (
          <div className='min-h-[calc(100vh-4rem)] flex flex-col md:flex-row'>
            {/* Feature image pane - fixed and vertically centered on md+ */}
            <aside
              className={imagePaneClasses}
              style={{
                bottom: `calc(${footerHeight} + 1rem)`,
              }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className='relative w-full rounded-xl overflow-hidden shadow-lg aspect-[3/4] cursor-pointer hover:opacity-90 transition-opacity'
                aria-label='View image fullscreen'
              >
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

            {/* Content pane */}
            <article className={contentPaneClasses}>
              <div className='px-4 sm:px-6 lg:px-8 py-6 pb-32 min-h-full flex flex-col'>
                <div className='flex-1 flex flex-col justify-center'>
                  {nav && <div>{nav}</div>}
                  {headerContent}
                  <div className='prose-content-body'>{children}</div>
                </div>
              </div>
            </article>
            {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
            <div className='hidden md:block'>
              <FooterOverlay hideButton={true} />
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
