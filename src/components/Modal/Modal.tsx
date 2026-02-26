'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onDismiss: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Maximum width of modal */
  maxWidth?: string;
  /** Maximum height of modal */
  maxHeight?: string;
  /** Show close button in top right */
  showCloseButton?: boolean;
  /** Custom styles for modal content */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * Modal Component
 *
 * Accessible modal dialog with backdrop, animations, and keyboard support.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   ariaLabel="Confirmation dialog"
 * >
 *   <h2>Are you sure?</h2>
 *   <button onClick={() => setIsOpen(false)}>Cancel</button>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  children,
  ariaLabel = 'Modal dialog',
  maxWidth = '90vw',
  maxHeight = '90vh',
  showCloseButton = true,
  style,
  className = '',
}) => {
  const { theme } = useAppTheme();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onDismiss();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onDismiss]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  // Don't render if not open
  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            onClick={handleBackdropClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: theme.spacing.m,
            }}
          >
            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              role='dialog'
              aria-modal='true'
              aria-label={ariaLabel}
              onClick={(e) => e.stopPropagation()}
              className={className}
              style={{
                position: 'relative',
                backgroundColor: theme.semanticColors.background.base,
                borderRadius: theme.borderRadius.container.large,
                boxShadow: theme.shadows.modal,
                maxWidth,
                maxHeight,
                width: '100%',
                overflow: 'auto',
                ...style,
              }}
            >
              {/* Close button */}
              {showCloseButton && (
                <button
                  onClick={onDismiss}
                  aria-label='Close modal'
                  style={{
                    position: 'absolute',
                    top: theme.spacing.m,
                    right: theme.spacing.m,
                    zIndex: 10,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: theme.spacing.s1,
                    borderRadius: theme.borderRadius.container.small,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.semanticColors.text.muted,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme.palette.neutralLighter;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <FluentIcon iconName={Dismiss24Regular} />
                </button>
              )}

              {/* Content */}
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document body level
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
