'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/content/types';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

interface ContentGalleryClientProps {
  gallery: GalleryItem[];
}

export function ContentGalleryClient({ gallery }: ContentGalleryClientProps) {
  const [showGallery, setShowGallery] = useState(false);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className='mb-8'>
      <button
        onClick={() => setShowGallery((v) => !v)}
        className='text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2'
      >
        {showGallery
          ? 'Hide Gallery'
          : `View Gallery (${gallery.length} images)`}
      </button>
      {showGallery && <ImageCarousel images={gallery} />}
    </div>
  );
}
