'use client';

import { createContext, useContext } from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha as useGoogleReCaptchaOriginal,
} from 'react-google-recaptcha-v3';

interface ReCaptchaContextValue {
  executeRecaptcha?: (action?: string) => Promise<string>;
}

const ReCaptchaContext = createContext<ReCaptchaContextValue>({
  executeRecaptcha: undefined,
});

export const useReCaptcha = () => useContext(ReCaptchaContext);

interface ReCaptchaProviderProps {
  children: React.ReactNode;
}

/**
 * Bridge component that connects Google's reCAPTCHA context to our custom context
 */
function ReCaptchaBridge({ children }: { children: React.ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptchaOriginal();

  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

/**
 * ReCaptchaProvider Component
 *
 * Wraps the application with Google reCAPTCHA v3 provider for spam protection.
 * The site key is loaded from NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.
 *
 * If the site key is not configured, provides a mock context that returns undefined
 * for executeRecaptcha, allowing the app to function without reCAPTCHA protection.
 */
export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // If no site key is configured, provide mock context
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'ReCaptcha: NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured. reCAPTCHA protection is disabled.'
      );
    }
    return (
      <ReCaptchaContext.Provider value={{ executeRecaptcha: undefined }}>
        {children}
      </ReCaptchaContext.Provider>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <ReCaptchaBridge>{children}</ReCaptchaBridge>
    </GoogleReCaptchaProvider>
  );
}
