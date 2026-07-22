'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { GalleryItem } from '@/content/types';
import { LoadingImage } from '@/components/ui/LoadingImage';
import styles from './ImageCarousel.module.scss';

interface ImageCarouselProps {
  images: GalleryItem[];
  /** Prefix prepended to relative image URLs, e.g. '/blog/posts/my-post/images/' */
  basePath?: string;
  className?: string;
  /** Optional click handler for when the main image is clicked */
  onImageClick?: () => void;
  /** Called whenever the active slide index changes */
  onActiveIndexChange?: (index: number) => void;
}

export function ImageCarousel({
  images,
  basePath = '',
  className = '',
  onImageClick,
  onActiveIndexChange,
}: ImageCarouselProps) {
  const { reducedTransparency, theme } = useAppTheme();
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  function resolveUrl(url: string): string {
    if (url.startsWith('/') || url.startsWith('http')) return url;
    return `${basePath}${url}`;
  }

  function updateActive(getNext: (prev: number) => number) {
    setActive((prev) => {
      const next = getNext(prev);
      onActiveIndexChange?.(next);
      return next;
    });
  }

  const prev = () =>
    updateActive((i) => (i - 1 + images.length) % images.length);
  const next = () => updateActive((i) => (i + 1) % images.length);

  const current = images[active];

  return (
    <div className={`${styles.root} ${className}`}>
      {/* Main image */}
      <div className={styles.main}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={styles.slide}
          >
            <button
              onClick={onImageClick}
              onKeyDown={(e) => {
                if (onImageClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onImageClick();
                }
              }}
              disabled={!onImageClick}
              className={`${styles.mainButton} ${onImageClick ? styles.clickable : styles.notClickable}`}
              aria-label={onImageClick ? 'View image fullscreen' : undefined}
              tabIndex={onImageClick ? 0 : -1}
            >
              <LoadingImage
                src={resolveUrl(current.url)}
                alt={current.alt}
                fill
                sizes='(max-width: 768px) 100vw, 75vw'
                className={styles.mainImage}
                priority={active === 0}
              />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label='Previous image'
              className={`${styles.navButton} ${styles.navPrev} ${reducedTransparency ? styles.navSolid : styles.navTranslucent}`}
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label='Next image'
              className={`${styles.navButton} ${styles.navNext} ${reducedTransparency ? styles.navSolid : styles.navTranslucent}`}
            >
              ›
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <span
            className={`${styles.counter} ${reducedTransparency ? styles.counterSolid : styles.counterTranslucent}`}
          >
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <p className={styles.caption}>
          {current.caption}
        </p>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => updateActive(() => i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              className={`${styles.thumb} ${
                i === active ? '' : styles.thumbInactive
              }`}
              style={
                i === active
                  ? { borderColor: theme.semanticColors.link.default }
                  : undefined
              }
            >
              <LoadingImage
                src={resolveUrl(img.url)}
                alt={img.alt}
                fill
                sizes='64px'
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
