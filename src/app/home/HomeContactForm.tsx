'use client';

import { useMemo, useState } from 'react';
import { TwButton } from '@/components/dsm';
import { useReCaptcha } from '@/components/ReCaptchaProvider';
import { getApiBaseUrl } from '@/lib/environment';
import {
  getVisibleErrors,
  isFormValid,
  validateForm,
  type ContactFormData,
  type ContactFormTouched,
} from '@/lib/contactValidation';
import styles from './HomeContactForm.module.scss';

/**
 * The homepage contact form.
 *
 * When /contact was retired this became the site's only contact form, so it
 * carries the real integration the standalone page used to own: shared
 * validation rules from lib/contactValidation, a reCAPTCHA v3 token, and a POST
 * to the /api/contact Azure Function (SMTP2Go behind it). The form the homepage
 * shipped with only set local state and silently dropped the message.
 *
 * reCAPTCHA degrades to a no-op when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is unset —
 * see ReCaptchaProvider — so local development still submits.
 */
export function HomeContactForm() {
  const { executeRecaptcha } = useReCaptcha();

  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [touched, setTouched] = useState<ContactFormTouched>({
    name: false,
    email: false,
    message: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(() => validateForm(form), [form]);
  const visibleErrors = getVisibleErrors(errors, touched);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ name: true, email: true, message: true });

    const currentErrors = validateForm(form);
    if (!isFormValid(currentErrors)) return;

    setIsLoading(true);
    try {
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('contact_form_submit');
        } catch {
          throw new Error('Unable to verify reCAPTCHA. Please try again.');
        }
      }

      const response = await fetch(`${getApiBaseUrl()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || 'Failed to send message. Please try again.'
        );
      }

      setIsSent(true);
      setForm({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className={styles.formCard}>
        <div className={styles.sentState} role='status' aria-live='polite'>
          <div className={styles.sentTitle}>Message sent</div>
          <p className={styles.sentBody}>
            Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
        <label className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Name</span>
          <input
            className={styles.field}
            name='name'
            placeholder='Your name (min. 10 characters)'
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={200}
            aria-invalid={!!visibleErrors.name}
            required
          />
          {visibleErrors.name ? (
            <span className={styles.fieldError}>{visibleErrors.name}</span>
          ) : null}
        </label>

        <label className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            className={styles.field}
            type='email'
            name='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={254}
            aria-invalid={!!visibleErrors.email}
            required
          />
          {visibleErrors.email ? (
            <span className={styles.fieldError}>{visibleErrors.email}</span>
          ) : null}
        </label>

        <label className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Message</span>
          <textarea
            className={styles.field}
            name='message'
            rows={5}
            placeholder='What are you working on? (min. 15 characters)'
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={5000}
            aria-invalid={!!visibleErrors.message}
            required
          />
          {visibleErrors.message ? (
            <span className={styles.fieldError}>{visibleErrors.message}</span>
          ) : null}
        </label>

        {submitError ? (
          <p className={styles.submitError} role='alert'>
            {submitError}
          </p>
        ) : null}

        <div className={styles.contactFormActions}>
          <TwButton type='submit' disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send message'}
          </TwButton>
          <TwButton variant='outline' href='https://tidycal.com/terencewaters'>
            Book a consultation
          </TwButton>
        </div>
      </form>
    </div>
  );
}

export default HomeContactForm;
