'use client';

import { useEffect } from 'react';
import { useBookingModal } from '@/components/BookingFlow';

/**
 * Opens the Book a Conversation dialog once when /book loads, after a short
 * delay so assistive technologies can announce the page first. Renders
 * nothing; outside the booking provider it does nothing.
 */
export function BookAutoOpen() {
  const open = useBookingModal()?.open;
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => open(), 150);
    return () => window.clearTimeout(timer);
  }, [open]);
  return null;
}

export default BookAutoOpen;
