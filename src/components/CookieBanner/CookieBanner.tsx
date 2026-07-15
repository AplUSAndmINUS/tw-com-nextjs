'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useConsentStore } from '@/store/consentStore';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Form/Button/Button';

/** Delay before the banner auto-shows, giving the page time to render */
const SHOW_DELAY_MS = 800;

/**
 * CookieBanner Component
 *
 * GDPR/EEA-compliant consent banner. Appears at the bottom of every page on
 * first visit and persists the user's choice in localStorage via Zustand.
 *
 * Consent choices control:
 * - analyticsConsent — Google Analytics (GA4) data collection
 * - adsConsent — Google AdSense personalized ads
 *
 * When the user rejects non-essential cookies, Google Consent Mode v2
 * signals "denied" to GA and AdSense, which prevents personal data
 * collection while still allowing aggregated/anonymous measurement.
 */
export const CookieBanner: React.FC = () => {
  const { theme, reducedTransparency, isDark } = useAppTheme();
  const { shouldReduceMotion } = useReducedMotion();
  const { consentGiven, acceptAll, rejectAll } = useConsentStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || consentGiven) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isMounted, consentGiven]);

  const handleAcceptAll = () => {
    setIsVisible(false);
    acceptAll();
  };

  const handleRejectAll = () => {
    setIsVisible(false);
    rejectAll();
  };

  const animDuration = shouldReduceMotion ? 0 : 0.3;

  const bannerBg = reducedTransparency
    ? isDark
      ? theme.semanticColors.background.elevated
      : theme.semanticColors.background.base
    : isDark
      ? 'rgba(18, 24, 38, 0.97)'
      : 'rgba(255, 255, 255, 0.97)';

  if (!isMounted || typeof document === 'undefined') return null;

  const bannerContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key='cookie-banner'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: animDuration, ease: 'easeOut' }}
          role='dialog'
          aria-modal='false'
          aria-label='Cookie consent'
          aria-live='polite'
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 900,
            backgroundColor: bannerBg,
            borderTop: `1px solid ${theme.semanticColors.border.default}`,
            boxShadow: theme.shadows.modal,
            padding: '1rem 1.5rem',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Text */}
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <Typography
                variant='bodySmall'
                style={{
                  color: theme.semanticColors.text.primary,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                We use cookies and similar technologies to analyze site traffic
                and serve personalized ads. By clicking{' '}
                <strong>Accept All</strong>, you consent to analytics and
                personalized advertising. You can also{' '}
                <strong>Reject Non-Essential</strong> cookies. See our{' '}
                <a
                  href='https://fluxline.pro/legal/privacy-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    color: theme.semanticColors.link.default,
                    textDecoration: 'underline',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Privacy Policy on Fluxline.pro
                </a>{' '}
                for details.
              </Typography>
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexShrink: 0,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Button
                type='button'
                variant='secondary'
                size='small'
                onClick={handleRejectAll}
                aria-label='Reject non-essential cookies'
              >
                Reject Non-Essential
              </Button>
              <Button
                type='button'
                variant='primary'
                size='small'
                onClick={handleAcceptAll}
                aria-label='Accept all cookies'
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(bannerContent, document.body);
};
