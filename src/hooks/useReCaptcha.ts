import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * Safe wrapper around useGoogleReCaptcha that handles missing context gracefully.
 *
 * If the GoogleReCaptchaProvider is not configured (e.g., when NEXT_PUBLIC_RECAPTCHA_SITE_KEY
 * is not set), this hook returns { executeRecaptcha: undefined } instead of throwing an error.
 *
 * Components can check if executeRecaptcha is available and handle accordingly.
 */
export function useReCaptcha() {
  try {
    return useGoogleReCaptcha();
  } catch (error) {
    // Provider not configured - return undefined executeRecaptcha
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'reCAPTCHA provider not configured. Form submission will proceed without reCAPTCHA token.'
      );
    }
    return { executeRecaptcha: undefined };
  }
}
