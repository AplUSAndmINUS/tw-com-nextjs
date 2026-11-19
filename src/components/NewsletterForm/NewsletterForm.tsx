'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { TwButton } from '@/components/dsm';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';
import { useRecaptchaToken } from '@/hooks/useRecaptchaToken';
import { useNewsletterStore } from '@/store/newsletterStore';
import { NEWSLETTER_FORM } from '@/content/site/contact';
import {
  NETWORK_ERROR_MESSAGE,
  apiErrorMessage,
  isNetworkError,
} from '@/lib/formErrors';
import styles from './NewsletterForm.module.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The inline newsletter signup on /contact/#newsletter (#295). Never a
 * pop-up.
 *
 * Same integration as the footer's mini form: POST to /api/subscribe, the
 * shared localStorage rate limit (3 per hour across every newsletter form), and
 * the persisted `newsletterSubscribed` flag so the drawer and footer agree
 * about state. The version this replaces flipped a local boolean and never
 * called the API.
 *
 * Accessibility (redesign Slice 5b): the error is tied to the field with
 * aria-describedby, and the thank-you note takes focus when it replaces the
 * form after a signup (not when a returning subscriber loads the page).
 */
export function NewsletterForm() {
  const { newsletterSubscribed, setNewsletterSubscribed } =
    useNewsletterStore();
  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();
  const getRecaptchaToken = useRecaptchaToken();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorId = `${useId()}-error`;
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isSuccess) successRef.current?.focus();
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('A valid email is required');
      return;
    }
    if (!canSubmit) {
      setError(`Submission limit reached. Try again in ${timeUntilReset}.`);
      return;
    }

    setError(null);
    recordSubmit();
    setIsLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken('newsletter_subscribe');
      if (recaptchaToken === null) {
        setError(
          'Spam protection didn’t finish loading. Refresh the page and try again.'
        );
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed.toLowerCase(),
          recaptchaToken,
        }),
      });
      if (!response.ok) {
        setError(
          await apiErrorMessage(
            response,
            'Failed to subscribe. Please try again.'
          )
        );
        return;
      }
      setIsSuccess(true);
      setNewsletterSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(
        isNetworkError(err)
          ? NETWORK_ERROR_MESSAGE
          : 'Something went wrong. Try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess || newsletterSubscribed) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={styles.successNote}
        role='status'
        aria-live='polite'
      >
        {NEWSLETTER_FORM.success}
      </div>
    );
  }

  return (
    <>
      <form
        className={styles.inlineForm}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading || undefined}
      >
        <input
          type='email'
          className={styles.field}
          placeholder={NEWSLETTER_FORM.emailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          maxLength={254}
          aria-label={NEWSLETTER_FORM.emailLabel}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required
        />
        <TwButton
          type='submit'
          disabled={isLoading || !canSubmit}
          className={isLoading ? styles.busy : undefined}
        >
          {isLoading ? NEWSLETTER_FORM.submitting : NEWSLETTER_FORM.submit}
        </TwButton>
        <span className={styles.srOnly} role='status'>
          {isLoading ? NEWSLETTER_FORM.submitting : ''}
        </span>
      </form>

      {error ? (
        <p id={errorId} className={styles.error} role='alert'>
          {error}
        </p>
      ) : null}
    </>
  );
}

export default NewsletterForm;
