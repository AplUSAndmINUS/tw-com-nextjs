'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Typography } from '@/components/Typography/Typography';
import { useIsTablet, useIsDesktop } from '@/hooks';

interface ResponsiveFeatureImageProps {
  src: string;
  alt: string;
  title?: string;
}

/**
 * ResponsiveFeatureImage — Client component that detects image dimensions
 * and applies appropriate aspect ratios on tablet+ devices
 */
export function ResponsiveFeatureImage({
  src,
  alt,
  title,
}: ResponsiveFeatureImageProps) {
  const [aspectRatio, setAspectRatio] = useState<string>('3/4');
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  // Only apply dynamic aspect ratio on tablet and desktop; on mobile, use a fixed aspect ratio to avoid layout shifts
  const shouldApplyDynamicRatio = isTablet || isDesktop;

  /**
   * Detect image dimensions and calculate aspect ratio
   */
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (!shouldApplyDynamicRatio) return;

    const img = event.currentTarget;
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width && height) {
      const ratio = width / height;

      // Apply different aspect ratio classes based on image dimensions
      if (ratio > 1.5) {
        // Wide landscape
        setAspectRatio('16/9');
      } else if (ratio > 1.2) {
        // Landscape
        setAspectRatio('4/3');
      } else if (ratio > 0.9) {
        // Square-ish
        setAspectRatio('1/1');
      } else if (ratio > 0.7) {
        // Portrait
        setAspectRatio('3/4');
      } else {
        // Tall portrait
        setAspectRatio('2/3');
      }
    }
  };

  // Map aspect ratio to predefined Tailwind classes
  const getAspectClass = () => {
    if (!shouldApplyDynamicRatio) return 'aspect-[3/4]';

    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      case '1/1':
        return 'aspect-square';
      case '3/4':
        return 'aspect-[3/4]';
      case '2/3':
        return 'aspect-[2/3]';
      default:
        return 'aspect-[3/4]';
    }
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden shadow-lg ${getAspectClass()}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes='(max-width: 1024px) 100vw, 25vw'
        className='object-cover'
        priority
        onLoad={handleImageLoad}
      />
      {title && (
        <div className='absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
          <Typography variant='h3' className='text-white text-xl font-semibold'>
            {title}
          </Typography>
        </div>
      )}
    </div>
  );
}
