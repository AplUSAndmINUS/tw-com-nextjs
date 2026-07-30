'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useConsentStore } from '@/store/consentStore';
import {
  ADSENSE_PUB_ID,
  ADSENSE_SCRIPT_SRC,
  isAdsAllowedPath,
} from '@/lib/adsense';

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

/** Attribute used to find the Auto ads loader we injected. */
const ADSENSE_SCRIPT_ATTR = 'data-adsense-loader';

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
 * Manages Google Analytics (GA4) and Google AdSense script loading, and keeps
 * Google Consent Mode v2 in sync with the user's consent choices stored in
 * `useConsentStore`.
 *
 * - GA4 script is loaded once the component mounts (always loaded so that
 *   Consent Mode can send anonymised, cookieless pings even before consent).
 * - AdSense Auto ads are loaded only after `adsConsent` is granted (to prevent
 *   serving personalized ads before user interaction) and only on routes that
 *   permit ads — see `isAdsAllowedPath` in `@/lib/adsense`.
 * - On every consent change, `gtag('consent', 'update', {...})` is called to
 *   inform Google of the current consent state.
 *
 * The Google Consent Mode v2 defaults (`denied`) are initialised earlier in
 * the page `<head>` (see `layout.tsx`) so this component only handles updates.
 *
 * NEXT_PUBLIC_GA_MEASUREMENT_ID must be set (e.g. G-XXXXXXXXXX) for GA to
 * work. If the variable is not set, the script is not loaded.
 */
export function GoogleAnalytics() {
  const { consentGiven, analyticsConsent, adsConsent } = useConsentStore();
  const pathname = usePathname();

  // Track whether the GA config command has been sent for this session
  const gaConfiguredRef = useRef(false);
  // Track whether the AdSense script has been injected
  const adsenseInjectedRef = useRef(false);
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

  /*
   * Auto ads loader — injected once ads consent is granted, and only on routes
   * where ads are permitted (see `@/lib/adsense`). Because this is a SPA the
   * loader outlives the page it was injected on, so navigating to an excluded
   * route removes it again; the matching AdSense console exclusions stop Google
   * from filling any slot it may already have placed.
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const allowed = consentGiven && adsConsent && isAdsAllowedPath(pathname);

    if (!allowed) {
      if (adsenseInjectedRef.current) {
        document
          .querySelectorAll(`script[${ADSENSE_SCRIPT_ATTR}]`)
          .forEach(node => node.remove());
        adsenseInjectedRef.current = false;
      }
      return;
    }

    if (adsenseInjectedRef.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = ADSENSE_SCRIPT_SRC;
    script.setAttribute(ADSENSE_SCRIPT_ATTR, '');
    script.setAttribute('data-ad-client', ADSENSE_PUB_ID);
    document.head.appendChild(script);
    // Mark as injected only after successful append
    adsenseInjectedRef.current = true;
  }, [consentGiven, adsConsent, pathname]);

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
