'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useReCaptcha } from '@/components/ReCaptchaProvider';

/** How long a submit waits for the async reCAPTCHA script before giving up. */
const RECAPTCHA_READY_TIMEOUT_MS = 10000;
const RECAPTCHA_POLL_MS = 100;
/** Mirrors ReCaptchaProvider's own check — reCAPTCHA degrades to a no-op
 *  when this is unset, so there's nothing to wait for. */
const RECAPTCHA_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

/**
 * Fetches a reCAPTCHA v3 token for the given action, waiting for the async
 * reCAPTCHA script to finish loading if it hasn't yet.
 *
 * `executeRecaptcha` from `useReCaptcha()` is undefined both while the script
 * is still loading AND permanently when no site key is configured — those
 * need different handling. A form submitted quickly (a one-field newsletter
 * signup, often submitted before the page has even finished settling) should
 * wait for a script that's genuinely on its way in, up to 10s, mirroring the
 * pattern in the-resonant-identity's and fluxline-pro-next's contact/
 * newsletter forms. But with no site key configured, `executeRecaptcha` will
 * never become truthy, so waiting would just block every submission for 10s
 * before failing — where `HomeContactForm` degrades to a no-op instead.
 *
 * Returns `undefined` when reCAPTCHA isn't configured (callers should post
 * without a token, same as the contact form), or `null` if it is configured
 * but the script never became ready in time (callers should show a "refresh
 * and try again" message instead of posting without a token).
 */
export function useRecaptchaToken() {
  const { executeRecaptcha } = useReCaptcha();

  const executeRecaptchaRef = useRef(executeRecaptcha);
  useEffect(() => {
    executeRecaptchaRef.current = executeRecaptcha;
  }, [executeRecaptcha]);

  return useCallback(async (action: string): Promise<string | null | undefined> => {
    if (!RECAPTCHA_CONFIGURED) return undefined;
    const deadline = Date.now() + RECAPTCHA_READY_TIMEOUT_MS;
    while (!executeRecaptchaRef.current) {
      if (Date.now() > deadline) return null;
      await new Promise((resolve) => setTimeout(resolve, RECAPTCHA_POLL_MS));
    }
    return executeRecaptchaRef.current(action);
  }, []);
}

export default useRecaptchaToken;
