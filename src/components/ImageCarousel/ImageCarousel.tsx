'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/content/types';

interface ImageCarouselProps {
  images: GalleryItem[];
  /** Prefix prepended to relative image URLs, e.g. '/blog/posts/my-post/images/' */
  basePath?: string;
  className?: string;
}

export function ImageCarousel({ images, basePath = '', className = '' }: ImageCarouselProps) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  function resolveUrl(url: string): string {
    if (url.startsWith('/') || url.startsWith('http')) return url;
    return `${basePath}${url}`;
  }

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const current = images[active];

  return (
    <div className={`w-full ${className}`}>
      {/* Main image */}
      <div className='relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className='absolute inset-0'
          >
            <Image
              src={resolveUrl(current.url)}
              alt={current.alt}
              fill
              sizes='(max-width: 768px) 100vw, 75vw'
              className='object-contain'
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label='Previous image'
              className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors'
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label='Next image'
              className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors'
            >
              ›
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <span className='absolute bottom-2 right-3 text-xs text-white bg-black/50 rounded px-2 py-0.5'>
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic'>
          {current.caption}
        </p>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='flex gap-2 mt-3 overflow-x-auto pb-1'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                i === active
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-400'
              }`}
            >
              <Image
                src={resolveUrl(img.url)}
                alt={img.alt}
                fill
                sizes='64px'
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
