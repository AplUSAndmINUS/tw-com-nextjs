'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/Modal';
import { FluentIcon } from '@/components/FluentIcon';
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GalleryItem } from '@/content/types';

export interface ImageCarouselModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onDismiss: () => void;
  /** Array of images to display in carousel */
  images: GalleryItem[];
  /** Initial image index to display (default: 0) */
  initialIndex?: number;
}

/**
 * ImageCarouselModal Component
 *
 * Fullscreen modal for viewing image galleries with navigation.
 * Includes left/right arrows, image captions, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <ImageCarouselModal
 *   isOpen={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   images={galleryImages}
 *   initialIndex={0}
 * />
 * ```
 */
export const ImageCarouselModal: React.FC<ImageCarouselModalProps> = ({
  isOpen,
  onDismiss,
  images,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [lastOpenState, setLastOpenState] = useState(isOpen);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const { theme } = useAppTheme();

  // Reset index when modal opens
  if (isOpen !== lastOpenState) {
    setLastOpenState(isOpen);
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsImageLoading(true);
    }
  }

  // Navigate to next image
  const handleNext = useCallback(() => {
    setIsImageLoading(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Navigate to previous image
  const handlePrevious = useCallback(() => {
    setIsImageLoading(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrevious]);

  const currentImage = images[currentIndex];
  const showNavigation = images.length > 1;

  // Image animation variants
  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const navigationButtonStyles: React.CSSProperties = {
    background: theme.semanticColors.background.base,
    border: `2px solid ${theme.palette.neutralLight}`,
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.m,
    zIndex: 10,
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      ariaLabel='Image gallery'
      maxWidth='95vw'
      maxHeight='95vh'
      showCloseButton={true}
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        {/* Image container with navigation */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.xl,
            minHeight: 0,
          }}
        >
          {/* Previous button */}
          {showNavigation && (
            <button
              onClick={handlePrevious}
              aria-label='Previous image'
              style={{
                ...navigationButtonStyles,
                position: 'absolute',
                left: theme.spacing.l,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor =
                  theme.palette.neutralLighter;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor =
                  theme.semanticColors.background.base;
              }}
            >
              <FluentIcon iconName={ChevronLeft24Regular} />
            </button>
          )}

          {/* Image with animation */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Loading state */}
            {isImageLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: theme.palette.neutralSecondary,
                }}
              >
                <Typography variant='body'>Loading...</Typography>
              </div>
            )}

            <AnimatePresence initial={false} custom={direction} mode='wait'>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={imageVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                  sizes='95vw'
                  onLoad={() => setIsImageLoading(false)}
                  priority={currentIndex === initialIndex}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          {showNavigation && (
            <button
              onClick={handleNext}
              aria-label='Next image'
              style={{
                ...navigationButtonStyles,
                position: 'absolute',
                right: theme.spacing.l,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor =
                  theme.palette.neutralLighter;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor =
                  theme.semanticColors.background.base;
              }}
            >
              <FluentIcon iconName={ChevronRight24Regular} />
            </button>
          )}
        </div>

        {/* Caption and counter */}
        <div
          style={{
            width: '100%',
            padding: `${theme.spacing.l} ${theme.spacing.xl}`,
            backgroundColor: theme.palette.neutralLighterAlt,
            borderTop: `1px solid ${theme.palette.neutralLight}`,
            textAlign: 'center',
          }}
        >
          {/* Image counter */}
          {showNavigation && (
            <Typography
              variant='caption'
              style={{
                color: theme.semanticColors.text.muted,
                fontWeight: 600,
                marginBottom: theme.spacing.s1,
              }}
            >
              {currentIndex + 1} of {images.length}
            </Typography>
          )}

          {/* Caption */}
          {currentImage.caption && (
            <Typography
              variant='body'
              style={{
                color: theme.semanticColors.text.primary,
                fontStyle: 'italic',
                marginTop: theme.spacing.s1,
              }}
            >
              {currentImage.caption}
            </Typography>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageCarouselModal;
