'use client';

import { useState } from 'react';
import { GalleryItem } from '@/content/types';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ImageCarouselModal } from '@/components/ImageCarouselModal';

interface ContentGalleryClientProps {
  gallery: GalleryItem[];
}

/**
 * ContentGalleryClient - Displays an inline image carousel/gallery
 * Used in blog posts, portfolio entries, and case studies
 */
export function ContentGalleryClient({ gallery }: ContentGalleryClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <ImageCarousel
          images={gallery}
          onImageClick={() => setModalOpen(true)}
          onActiveIndexChange={setActiveIndex}
        />
      </div>
      <ImageCarouselModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        images={gallery}
        initialIndex={activeIndex}
      />
    </>
  );
}
