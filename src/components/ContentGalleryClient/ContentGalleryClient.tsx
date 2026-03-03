'use client';

import React from 'react';
import { GalleryItem } from '@/content/types';
import { ImageCarousel } from '@/components/ImageCarousel';

interface ContentGalleryClientProps {
  gallery: GalleryItem[];
}

/**
 * ContentGalleryClient - Displays an inline image carousel/gallery
 * Used in blog posts, portfolio entries, and case studies
 */
export function ContentGalleryClient({ gallery }: ContentGalleryClientProps) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <ImageCarousel images={gallery} />
    </div>
  );
}
