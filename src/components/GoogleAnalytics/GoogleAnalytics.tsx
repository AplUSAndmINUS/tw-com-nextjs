'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useConsentStore } from '@/store/consentStore';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      cmd: string,
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/** Google Analytics 4 Measurement ID — set via NEXT_PUBLIC_GA_MEASUREMENT_ID */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/**
 * Calls window.gtag if it is available.
 * Handles consent updates, config, and event commands.
 */
function callGtag(
  cmd: string,
  target: string,
  params?: Record<string, unknown>
) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(cmd, target, params);
    }
  } catch {
    // Ignore analytics errors
  }
}

/**
 * GoogleAnalytics Component
 *
 * Manages Google Analytics (GA4) configuration and keeps Google Consent Mode v2
 * in sync with the user's consent choices stored in `useConsentStore`.
 *
 * - GA4 script is loaded once the component mounts (always loaded so that
 *   Consent Mode can send anonymised, cookieless pings even before consent).
 * - On every consent change, `gtag('consent', 'update', {...})` is called to
 *   inform Google of the current consent state for both GA and AdSense.
 *
 * The Google Consent Mode v2 defaults (`denied`) are initialised earlier in
 * the page `<head>` (see `layout.tsx`) and the shared AdSense loader is also
 * rendered there so every page carries the same publisher script.
 *
 * NEXT_PUBLIC_GA_MEASUREMENT_ID must be set (e.g. G-XXXXXXXXXX) for GA to
 * work. If the variable is not set, the script is not loaded.
 */
export function GoogleAnalytics() {
  const { consentGiven, analyticsConsent, adsConsent } = useConsentStore();

  // Track whether the GA config command has been sent for this session
  const gaConfiguredRef = useRef(false);
  // Track previous consentGiven state to detect revocation
  const prevConsentGivenRef = useRef(consentGiven);

  // Sync consent state with Google Consent Mode v2 whenever it changes
  useEffect(() => {
    const wasConsentGiven = prevConsentGivenRef.current;
    prevConsentGivenRef.current = consentGiven;

    if (!consentGiven) {
      // If consent was previously given but has now been revoked, signal denied
      if (wasConsentGiven) {
        callGtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        // Note: gaConfiguredRef is intentionally not reset — GA4 config is sent
        // once per page load. Consent denial via 'update' is sufficient to stop
        // personal data collection without re-triggering the config command.
      }
      return;
    }

    callGtag('consent', 'update', {
      analytics_storage: analyticsConsent ? 'granted' : 'denied',
      ad_storage: adsConsent ? 'granted' : 'denied',
      ad_user_data: adsConsent ? 'granted' : 'denied',
      ad_personalization: adsConsent ? 'granted' : 'denied',
    });

    // Send the GA config command once analytics consent is granted
    if (analyticsConsent && GA_MEASUREMENT_ID && !gaConfiguredRef.current) {
      callGtag('config', GA_MEASUREMENT_ID);
      gaConfiguredRef.current = true;
    }

  }, [consentGiven, analyticsConsent, adsConsent]);

  // Only render the GA script tag when a Measurement ID is configured
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Google tag (gtag.js) — loaded after interactive, respects Consent Mode v2 */}
      <Script
        id='gtag-script'
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* Initialise gtag dataLayer and register page timestamp — config is sent via useEffect after consent */}
      <Script
        id='gtag-config'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  );
}
