'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { TwButton } from '@/components/dsm';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import type { TwButtonProps } from '@/components/dsm/TwButton/TwButton';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { BookingFlow } from './BookingFlow';
import styles from './BookingModal.module.scss';

/**
 * "Book a Conversation" as a full-screen modal (#278).
 *
 * One provider (mounted once in providers.tsx) owns the dialog, so every
 * opener on the site shares it (today the old header's "Book a free
 * consultation" button; the new nav and the home "Let's talk" button use
 * BookingTrigger). Openers are real links to BOOK_A_CONVERSATION.href:
 * without JavaScript, or outside the provider, they still go somewhere
 * useful.
 *
 * The dialog: role="dialog" + aria-modal, labelled by its heading; focus moves
 * in on open, stays inside (Tab wraps), and returns to the opener on close;
 * Escape, the X, or a click/tap on the dim area outside the panel closes it
 * (not a press on the overlay's scrollbar, which would throw away a filled-in
 * form); following a link inside it or changing page closes it too; the page
 * behind does not scroll. No animation library: a short CSS fade that reduced
 * motion turns off.
 */

interface BookingModalContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(
  null
);

/** Open/close the booking modal. Null outside BookingModalProvider. */
export function useBookingModal(): BookingModalContextValue | null {
  return useContext(BookingModalContext);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const open = useCallback(() => {
    openerRef.current =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Back to whatever opened it, once the dialog is gone, if it is still on
    // the page (the opener may have unmounted, or Safari never focused it).
    const opener = openerRef.current;
    window.requestAnimationFrame(() => {
      // preventScroll: a link inside the flow may have just moved the page.
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }, []);

  // A page change (browser Back, a link inside the flow) closes the dialog,
  // so it never outlives the page that opened it.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      {isOpen ? <BookingDialog onClose={close} /> : null}
    </BookingModalContext.Provider>
  );
}

function BookingDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const { reducedTransparency } = useAppTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // True only when a press started on the dim area itself (not inside the
  // panel, not on the overlay's scrollbar).
  const pressOnBackdrop = useRef(false);

  // Lock the page behind, focus the close button, handle Escape and Tab.
  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    // Third-party floaters (the Ko-fi "Tip Me" button) stack above any
    // z-index we pick; this flag hides them while the dialog is open.
    root.setAttribute('data-booking-open', '');
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previousOverflow;
      root.removeAttribute('data-booking-open');
    };
  }, [onClose]);

  const dialog = (
    <div
      className={
        reducedTransparency
          ? `${styles.overlay} ${styles.overlayOpaque}`
          : styles.overlay
      }
      onMouseDown={(event) => {
        const el = event.currentTarget;
        // clientX past clientWidth is the overlay's own scrollbar.
        pressOnBackdrop.current =
          event.target === el && event.clientX < el.clientWidth;
      }}
      onClick={(event) => {
        if (pressOnBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
        pressOnBackdrop.current = false;
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        // Following a link inside the flow (for example "send me a message
        // instead") leaves the dialog: close it so the destination is visible.
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest('a[href]');
          if (link && link.getAttribute('target') !== '_blank') onClose();
        }}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {BOOK_A_CONVERSATION.label}
          </h2>
          <button
            ref={closeRef}
            type='button'
            className={styles.close}
            onClick={onClose}
            aria-label='Close'
          >
            <svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true'>
              <path
                d='M6 6l12 12M18 6L6 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          <BookingFlow />
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

export type BookingTriggerProps = Omit<TwButtonProps, 'href' | 'onClick'> & {
  children?: React.ReactNode;
};

/**
 * A "Book a Conversation" button. It links to BOOK_A_CONVERSATION.href and,
 * inside BookingModalProvider, opens the modal instead of navigating.
 * data-no-route-transition keeps PageTransition (which handles link clicks in
 * the capture phase) from navigating away at the same time.
 */
export function BookingTrigger({ children, ...rest }: BookingTriggerProps) {
  const modal = useBookingModal();
  return (
    <TwButton
      {...rest}
      {...{ 'data-no-route-transition': '' }}
      href={BOOK_A_CONVERSATION.href}
      onClick={(event) => {
        if (!modal) return;
        event.preventDefault();
        modal.open();
      }}
    >
      {children ?? BOOK_A_CONVERSATION.label}
    </TwButton>
  );
}

export default BookingModalProvider;
