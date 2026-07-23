'use client';

import React, { useEffect, useRef } from 'react';
import { TwChip } from '@/components/dsm';
import type { HomeService } from './homeData';
import { serviceHref } from './homeData';
import styles from './ServiceDrawer.module.scss';

export interface ServiceDrawerProps {
  service: HomeService | null;
  onClose: () => void;
}

/**
 * Slide-over drawer summarising a service.
 *
 * The homepage opens this instead of navigating away, so a visitor can read
 * what a service is without leaving TW.com; only the explicit CTA goes out to
 * fluxline.pro (new tab).
 *
 * Open/closed is driven by whether `service` is non-null. While open it traps
 * nothing heavier than Escape-to-close and a focus move to the panel — a full
 * focus trap would be overkill for a marketing drawer, but the close button is
 * focused on open so keyboard users land somewhere sensible.
 */
export function ServiceDrawer({ service, onClose }: ServiceDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = service !== null;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Lock body scroll while the drawer is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!service) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden='true' />
      <div
        className={`tw-blur ${styles.drawer}`}
        role='dialog'
        aria-modal='true'
        aria-label={service.title}
      >
        <div className={styles.top}>
          <TwChip variant='teal' size='sm'>
            {service.category}
          </TwChip>
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

        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.blurb}>{service.blurb}</p>

        <div className={styles.pointsLabel}>What&apos;s included</div>
        <ul className={styles.points}>
          {service.points.map((point) => (
            <li key={point} className={styles.point}>
              <span className={styles.bullet} aria-hidden='true'>
                &#9670;
              </span>
              {point}
            </li>
          ))}
        </ul>

        {service.slug === 'fractional' ? (
          <a
            href='https://tidycal.com/terencewaters'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.cta}
          >
            Book a consultation &#8594;
          </a>
        ) : (
          <a
            href={serviceHref(service.slug)}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.cta}
          >
            Open on Fluxline.pro &#8599;
          </a>
        )}
        <button type='button' className={styles.back} onClick={onClose}>
          Back to services
        </button>
      </div>
    </>
  );
}

export default ServiceDrawer;
