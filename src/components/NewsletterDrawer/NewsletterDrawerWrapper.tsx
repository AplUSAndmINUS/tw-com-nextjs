'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NewsletterDrawer } from './NewsletterDrawer';
import { useNewsletterStore } from '@/store/newsletterStore';

/** Pages where the drawer should never appear */
const EXCLUDED_PATHS = ['/', '/unsubscribe'];

/** Probability (0–1) the drawer shows on any given non-excluded page load */
const SHOW_PROBABILITY = 0.4;

/**
 * NewsletterDrawerWrapper
 *
 * Conditionally renders the NewsletterDrawer on non-home, non-excluded pages
 * based on a random probability check. Once dismissed or subscribed, the drawer
 * will not appear again (persisted in localStorage via Zustand).
 */
export const NewsletterDrawerWrapper: React.FC = () => {
  const pathname = usePathname();
  const { newsletterDismissed, newsletterSubscribed } = useNewsletterStore();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (newsletterDismissed || newsletterSubscribed) {
      setShouldRender(false);
      return;
    }

    if (EXCLUDED_PATHS.includes(pathname)) {
      setShouldRender(false);
      return;
    }

    // Random chance to show on this page navigation
    setShouldRender(Math.random() < SHOW_PROBABILITY);
  }, [pathname, newsletterDismissed, newsletterSubscribed]);

  if (!shouldRender) return null;

  return <NewsletterDrawer />;
};
