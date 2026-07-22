'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/components/Typography/Typography';
import { useIsTablet, useIsDesktop } from '@/hooks';
import { LoadingImage } from '@/components/ui/LoadingImage';
import styles from './ResponsiveFeatureImage.module.scss';

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
  const isTabletHook = useIsTablet();
  const isDesktopHook = useIsDesktop();
  const [isMounted, setIsMounted] = useState(false);

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isTablet = isMounted ? isTabletHook : false;
  const isDesktop = isMounted ? isDesktopHook : false;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Map aspect ratio to predefined aspect-ratio classes
  const getAspectClass = () => {
    // On mobile: use square aspect ratio to keep image compact and fit within 1/3 viewport
    if (!shouldApplyDynamicRatio) return styles.aspectSquare;

    switch (getAspectRatioKey()) {
      case '16/9':
        return styles.aspectVideo;
      case '4/3':
        return styles.aspect43;
      case '1/1':
        return styles.aspectSquare;
      case '3/4':
        return styles.aspect34;
      case '2/3':
        return styles.aspect23;
      default:
        return styles.aspect34;
    }
  };

  return (
    <div className={`${styles.frame} ${getAspectClass()}`}>
      <LoadingImage
        src={src}
        alt={alt}
        fill
        sizes='(max-width: 1024px) 100vw, 25vw'
        className={styles.image}
        priority
        onLoad={handleImageLoad}
      />
      {title && (
        <div className={styles.overlay}>
          <Typography variant='h3' className={styles.title}>
            {title}
          </Typography>
        </div>
      )}
    </div>
  );
}
