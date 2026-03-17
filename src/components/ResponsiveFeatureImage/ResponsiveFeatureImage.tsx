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
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  // Only apply dynamic aspect ratio on tablet and desktop; on mobile, use a fixed aspect ratio to avoid layout shifts
  const shouldApplyDynamicRatio = isTablet || isDesktop;

  /**
   * Detect image dimensions on load.
   * Always stores the dimensions so re-renders (e.g. when media-query hooks
   * update from false → true after hydration) can pick up the correct ratio.
   */
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width && height) {
      setImageDimensions({ width, height });
    }
  };

  // Derive the aspect-ratio string from the stored natural dimensions
  const getAspectRatioKey = (): string => {
    if (!imageDimensions) return '3/4';
    const ratio = imageDimensions.width / imageDimensions.height;

    if (ratio > 1.5) return '16/9'; // Wide landscape
    if (ratio > 1.2) return '4/3'; // Landscape
    if (ratio > 0.9) return '1/1'; // Square-ish
    if (ratio > 0.7) return '3/4'; // Portrait
    return '2/3'; // Tall portrait
  };

  // Map aspect ratio to predefined Tailwind classes
  const getAspectClass = () => {
    // On mobile: use square aspect ratio to keep image compact and fit within 1/3 viewport
    if (!shouldApplyDynamicRatio) return 'aspect-square';

    switch (getAspectRatioKey()) {
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
        <div className='hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
          <Typography variant='h3' className='text-white text-xl font-semibold'>
            {title}
          </Typography>
        </div>
      )}
    </div>
  );
}
