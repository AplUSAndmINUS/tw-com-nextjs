'use client';

import React, { useEffect, useRef } from 'react';
import { TwChip } from '../TwChip';
import styles from './TwDrawer.module.scss';

export interface TwDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional category chip above the title. */
  chipLabel?: string;
  chipVariant?: 'default' | 'featured' | 'teal';
  children: React.ReactNode;
}

/**
 * Right-hand slide-over drawer.
 *
 * The shared shell behind the homepage service previews and the Content Hub's
 * Podcasts / Case Studies previews — the pattern where selecting something
 * opens a summary panel without leaving the page. Handles the scrim, the slide
 * animation (reduced-motion aware), Escape-to-close, body scroll lock, and
 * moving focus to the close button on open.
 */
export function TwDrawer({
  open,
  onClose,
  title,
  chipLabel,
  chipVariant = 'teal',
  children,
}: TwDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden='true' />
      <div
        className={`tw-blur ${styles.drawer}`}
        role='dialog'
        aria-modal='true'
        aria-label={title}
      >
        <div className={styles.top}>
          {chipLabel ? (
            <TwChip variant={chipVariant} size='sm'>
              {chipLabel}
            </TwChip>
          ) : (
            <span />
          )}
          <button
            ref={closeRef}
            type='button'
            className={styles.close}
            onClick={onClose}
            aria-label='Close'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              aria-hidden='true'
            >
              <line x1='5' y1='5' x2='19' y2='19' />
              <line x1='19' y1='5' x2='5' y2='19' />
            </svg>
          </button>
        </div>

        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
    </>
  );
}

export default TwDrawer;
