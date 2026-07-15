import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConsentState {
  /** Whether the user has made a consent decision (banner has been interacted with) */
  consentGiven: boolean;
  /** Consent for analytics cookies (Google Analytics) */
  analyticsConsent: boolean;
  /** Consent for ads cookies (Google AdSense personalization) */
  adsConsent: boolean;
  /** Accept all non-essential cookies */
  acceptAll: () => void;
  /** Reject all non-essential cookies */
  rejectAll: () => void;
  /** Update specific consent types */
  updateConsent: (analytics: boolean, ads: boolean) => void;
  /** Reset consent state — re-shows the banner on next visit */
  resetConsent: () => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      consentGiven: false,
      analyticsConsent: false,
      adsConsent: false,
      acceptAll: () =>
        set({ consentGiven: true, analyticsConsent: true, adsConsent: true }),
      rejectAll: () =>
        set({
          consentGiven: true,
          analyticsConsent: false,
          adsConsent: false,
        }),
      updateConsent: (analytics, ads) =>
        set({
          consentGiven: true,
          analyticsConsent: analytics,
          adsConsent: ads,
        }),
      resetConsent: () =>
        set({
          consentGiven: false,
          analyticsConsent: false,
          adsConsent: false,
        }),
    }),
    {
      name: 'tw-consent',
      skipHydration: true,
    }
  )
);
