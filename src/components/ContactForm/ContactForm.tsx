'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
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
import { CONTACT_FORM } from '@/content/site/contact';
import {
  NETWORK_ERROR_MESSAGE,
  apiErrorMessage,
  isNetworkError,
} from '@/lib/formErrors';
import { MICROCOPY } from '@/content/site/microcopy';
import styles from './ContactForm.module.scss';

/**
 * The site's contact form, on /contact/#message (moved from the homepage in
 * redesign Slice 5a; Decision B: the full form lives on /contact only).
 *
 * It carries the real integration the standalone page used to own: shared
 * validation rules from lib/contactValidation, a reCAPTCHA v3 token, and a POST
 * to the /api/contact Azure Function (SMTP2Go behind it). The form the homepage
 * shipped with only set local state and silently dropped the message.
 *
 * reCAPTCHA degrades to a no-op when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is unset —
 * see ReCaptchaProvider — so local development still submits.
 *
 * Accessibility (redesign Slice 5b): each error is tied to its field with
 * aria-describedby; a submit with errors moves focus to the first field that
 * needs fixing; "Message sent" takes focus when it replaces the form, so
 * keyboard and screen-reader users aren't left on a button that vanished.
 */
export function ContactForm() {
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

  const id = useId();
  const fieldId = (field: keyof ContactFormData) => `${id}-${field}`;
  const errorId = (field: keyof ContactFormData) => `${id}-${field}-error`;
  const fieldRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const sentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSent) sentRef.current?.focus();
  }, [isSent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Check a field when you leave it only if you typed something: tabbing
  // through an empty form shouldn't fill it with "required" (Slice 5b).
  // Submitting checks everything.
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!e.target.value.trim()) return;
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ name: true, email: true, message: true });

    const currentErrors = validateForm(form);
    if (!isFormValid(currentErrors)) {
      const first = (['name', 'email', 'message'] as const).find(
        (field) => currentErrors[field]
      );
      if (first) fieldRefs[first].current?.focus();
      return;
    }

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
        throw new Error(
          await apiErrorMessage(
            response,
            'Failed to send message. Please try again.'
          )
        );
      }

      setIsSent(true);
      setForm({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setSubmitError(
        isNetworkError(err)
          ? NETWORK_ERROR_MESSAGE
          : err instanceof Error
            ? err.message
            : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className={styles.formCard}>
        <div className={styles.sentState} role='status' aria-live='polite'>
          <h3 ref={sentRef} tabIndex={-1} className={styles.sentTitle}>
            {CONTACT_FORM.sent}
          </h3>
          <p className={styles.sentBody}>{MICROCOPY.formSuccess}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <form
        className={styles.contactForm}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading || undefined}
      >
        <div className={styles.fieldGroup}>
          <label htmlFor={fieldId('name')} className={styles.fieldLabel}>
            {CONTACT_FORM.name}
          </label>
          <input
            className={styles.field}
            ref={fieldRefs.name}
            id={fieldId('name')}
            name='name'
            placeholder={CONTACT_FORM.namePlaceholder}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={200}
            aria-invalid={!!visibleErrors.name}
            aria-describedby={visibleErrors.name ? errorId('name') : undefined}
            required
          />
          {visibleErrors.name ? (
            <span id={errorId('name')} className={styles.fieldError}>
              {visibleErrors.name}
            </span>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor={fieldId('email')} className={styles.fieldLabel}>
            {CONTACT_FORM.email}
          </label>
          <input
            className={styles.field}
            type='email'
            ref={fieldRefs.email}
            id={fieldId('email')}
            name='email'
            placeholder={CONTACT_FORM.emailPlaceholder}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={254}
            aria-invalid={!!visibleErrors.email}
            aria-describedby={visibleErrors.email ? errorId('email') : undefined}
            required
          />
          {visibleErrors.email ? (
            <span id={errorId('email')} className={styles.fieldError}>
              {visibleErrors.email}
            </span>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor={fieldId('message')} className={styles.fieldLabel}>
            {CONTACT_FORM.message}
          </label>
          <textarea
            className={styles.field}
            ref={fieldRefs.message}
            id={fieldId('message')}
            name='message'
            rows={5}
            placeholder={CONTACT_FORM.messagePlaceholder}
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={5000}
            aria-invalid={!!visibleErrors.message}
            aria-describedby={visibleErrors.message ? errorId('message') : undefined}
            required
          />
          {visibleErrors.message ? (
            <span id={errorId('message')} className={styles.fieldError}>
              {visibleErrors.message}
            </span>
          ) : null}
        </div>

        {submitError ? (
          <p className={styles.submitError} role='alert'>
            {submitError}
          </p>
        ) : null}

        <div className={styles.contactFormActions}>
          <TwButton
            type='submit'
            disabled={isLoading}
            className={isLoading ? styles.busy : undefined}
          >
            {isLoading ? CONTACT_FORM.sending : CONTACT_FORM.submit}
          </TwButton>
          {/* Announces "Sending…" (the button's new label isn't read out). */}
          <span className={styles.srOnly} role='status'>
            {isLoading ? CONTACT_FORM.sending : ''}
          </span>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
