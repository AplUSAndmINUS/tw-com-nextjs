'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/content/types';

interface ImageCarouselProps {
  images: GalleryItem[];
  className?: string;
}

/**
 * ImageCarousel - Displays a gallery of images with navigation
 *
 * Features:
 * - Full-size image display
 * - Next/Previous navigation
 * - Thumbnail strip
 * - Keyboard navigation (arrow keys)
 * - Click thumbnail to jump to image
 * - Captions and alt text
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div className={`w-full ${className}`}>
      {/* Main Image Display */}
      <div className='relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4'>
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          className='object-contain'
          sizes='100vw'
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors'
              aria-label='Previous image'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors'
              aria-label='Next image'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className='absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm'>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Caption */}
      {currentImage.caption && (
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 text-center italic'>
          {currentImage.caption}
        </p>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-600/50'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className='object-cover'
                sizes='80px'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
