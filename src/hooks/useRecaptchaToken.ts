'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useReCaptcha } from '@/components/ReCaptchaProvider';

/** How long a submit waits for the async reCAPTCHA script before giving up. */
const RECAPTCHA_READY_TIMEOUT_MS = 10000;
const RECAPTCHA_POLL_MS = 100;

/**
 * Fetches a reCAPTCHA v3 token for the given action, waiting for the async
 * reCAPTCHA script to finish loading if it hasn't yet.
 *
 * `executeRecaptcha` from `useReCaptcha()` is undefined until the script
 * lands, so a form submitted quickly (a one-field newsletter signup, often
 * submitted before the page has even finished settling) would otherwise
 * either silently skip verification or fail outright. This polls a ref for
 * up to 10s before giving up, mirroring the pattern in
 * the-resonant-identity's and fluxline-pro-next's contact/newsletter forms.
 *
 * Returns `null` if the script never became ready in time, so callers can
 * show a "refresh and try again" message instead of posting without a token.
 */
export function useRecaptchaToken() {
  const { executeRecaptcha } = useReCaptcha();

  const executeRecaptchaRef = useRef(executeRecaptcha);
  useEffect(() => {
    executeRecaptchaRef.current = executeRecaptcha;
  }, [executeRecaptcha]);

  return useCallback(async (action: string): Promise<string | null> => {
    const deadline = Date.now() + RECAPTCHA_READY_TIMEOUT_MS;
    while (!executeRecaptchaRef.current) {
      if (Date.now() > deadline) return null;
      await new Promise((resolve) => setTimeout(resolve, RECAPTCHA_POLL_MS));
    }
    return executeRecaptchaRef.current(action);
  }, []);
}

export default useRecaptchaToken;
