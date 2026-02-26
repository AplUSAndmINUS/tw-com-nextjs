'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/content/types';
import { ImageCarouselModal } from '@/components/ImageCarouselModal';
import { Button } from '@/components/Form';

interface ContentGalleryClientProps {
  gallery: GalleryItem[];
}

export function ContentGalleryClient({ gallery }: ContentGalleryClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Button
        variant='secondary'
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: '1rem' }}
      >
        View Gallery ({gallery.length}{' '}
        {gallery.length === 1 ? 'image' : 'images'})
      </Button>

      <ImageCarouselModal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        images={gallery}
        initialIndex={0}
      />
    </div>
  );
}
