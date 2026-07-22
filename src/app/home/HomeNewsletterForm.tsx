'use client';

import { useState } from 'react';
import { TwButton, TwSwitch } from '@/components/dsm';
import { getApiBaseUrl } from '@/lib/environment';
import { useNewsletterRateLimit } from '@/hooks/useNewsletterRateLimit';
import { useNewsletterStore } from '@/store/newsletterStore';
import styles from './HomeNewsletterForm.module.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The homepage newsletter signup.
 *
 * Same integration as the footer's mini form: POST to /api/subscribe, the
 * shared localStorage rate limit (3 per hour across every newsletter form), and
 * the persisted `newsletterSubscribed` flag so the drawer and footer agree
 * about state. The version this replaces flipped a local boolean and never
 * called the API.
 */
export function HomeNewsletterForm() {
  const { newsletterSubscribed, setNewsletterSubscribed } =
    useNewsletterStore();
  const { canSubmit, recordSubmit, timeUntilReset } = useNewsletterRateLimit();

  const [email, setEmail] = useState('');
  const [notify, setNotify] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch(`${getApiBaseUrl()}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed.toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Failed to subscribe. Please try again.');
        return;
      }
      setIsSuccess(true);
      setNewsletterSubscribed(true);
      setEmail('');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess || newsletterSubscribed) {
    return (
      <div className={styles.successNote} role='status' aria-live='polite'>
        You&apos;re in. Thanks for subscribing — I&apos;ll be in touch.
      </div>
    );
  }

  return (
    <>
      <form className={styles.inlineForm} onSubmit={handleSubmit} noValidate>
        <input
          type='email'
          className={styles.field}
          placeholder='you@example.com'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          maxLength={254}
          aria-label='Email address'
          aria-invalid={!!error}
          required
        />
        <TwButton type='submit' disabled={isLoading}>
          {isLoading ? 'Subscribing…' : 'Subscribe'}
        </TwButton>
      </form>

      {error ? (
        <p className={styles.error} role='alert'>
          {error}
        </p>
      ) : null}

      <div className={styles.notifyRow}>
        <TwSwitch
          label='Email me when I publish new posts'
          checked={notify}
          onChange={setNotify}
        />
      </div>
    </>
  );
}

export default HomeNewsletterForm;
