'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface ReCaptchaProviderProps {
  children: React.ReactNode;
}

/**
 * ReCaptchaProvider Component
 *
 * Wraps the application with Google reCAPTCHA v3 provider for spam protection.
 * The site key is loaded from NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.
 *
 * If the site key is not configured, the provider is disabled and children are
 * rendered without reCAPTCHA protection.
 */
export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // If no site key is configured, render children without reCAPTCHA
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'ReCaptcha: NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured. reCAPTCHA protection is disabled.'
      );
    }
    return <>{children}</>;
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
      {children}
    </GoogleReCaptchaProvider>
  );
}
