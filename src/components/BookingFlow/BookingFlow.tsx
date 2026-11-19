'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { TwButton } from '@/components/dsm';
import { getApiBaseUrl } from '@/lib/environment';
import { resolveIconName } from '@/utils/iconResolver';
import {
  BOOKING_FLOW,
  MESSAGE_FALLBACK_HREF,
  TIDYCAL_URL,
} from '@/content/site/booking';
import { FORM_ERRORS } from '@/content/site/contact';
import {
  CONTACT_STEP_TEXT,
  MEETING_LENGTHS,
  REFERRAL_OPTIONS,
  SERVICE_OPTIONS,
  fileTooLarge,
  getQuestionSet,
} from '@/components/ConsultationStepper/constants';
import {
  buildLeadNote,
  buildLeadPayload,
  buildTidyCalUrl,
  fireEvent,
} from '@/components/ConsultationStepper/lead';
import { useConsultationStorage } from '@/components/ConsultationStepper/useConsultationStorage';
import type {
  Question,
  ServiceKey,
  StepThreeData,
  StepperStep,
  SubmitStatus,
} from '@/components/ConsultationStepper/types';
import styles from './BookingFlow.module.scss';

/**
 * Book a Conversation, on the page (redesign Slice 7).
 *
 * The same three steps as the old modal stepper (services → your needs →
 * contact & schedule), the same questions, meeting lengths and consent, the
 * same POST to /api/leads and the same prefilled TidyCal page. What changed:
 * it sits inline or in the full-screen BookingModal (#278), uses the
 * design system, speaks in the first person where it has its own words, and
 * loads TidyCal only when asked (click to load; a new-tab link always works).
 *
 * Accessibility: visible progress ("Step n of 3" + the step list with
 * aria-current), the step heading takes focus when the step changes, every
 * field has a label, and errors are tied to their fields.
 */

const STEPS: StepperStep[] = [1, 2, 3];

/** Errors from /api/leads, in words a visitor can act on. */
async function leadErrorMessage(response: Response): Promise<string> {
  if (response.status === 429) return FORM_ERRORS.rateLimited;
  if (response.status === 504) {
    const data = await response.json().catch(() => ({}));
    if (typeof data?.error === 'string') return data.error;
  }
  return BOOKING_FLOW.errors.generic;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function BookingFlow() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [step, setStep] = useState<StepperStep>(1);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [tidyCalUrl, setTidyCalUrl] = useState('');
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { step1, step2, step3, setStep1, setStep2, setStep3, clearDraft } =
    useConsultationStorage();

  // Move focus to the new step's heading (not on first render).
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const view = status === 'schedule' || status === 'success' ? status : step;
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  const goTo = useCallback((next: StepperStep) => {
    setErrors({});
    setSubmitError(null);
    setStep(next);
  }, []);

  /* ── Step 1: services ─────────────────────────────────────────────── */

  const toggleService = (key: ServiceKey) => {
    let next: ServiceKey[];
    if (key === 'help_me_choose') {
      next = step1.services.includes('help_me_choose')
        ? []
        : ['help_me_choose'];
    } else {
      const without = step1.services.filter((s) => s !== 'help_me_choose');
      next = without.includes(key)
        ? without.filter((s) => s !== key)
        : [...without, key];
    }
    setStep1({ services: next });
    if (next.length > 0) setErrors({});
  };

  const nextFromStep1 = () => {
    if (step1.services.length === 0) {
      setErrors({ services: BOOKING_FLOW.step1.error });
      return;
    }
    fireEvent('consultation_step_completed', { step: 1 });
    goTo(2);
  };

  /* ── Step 2: questions ────────────────────────────────────────────── */

  const questionSet = getQuestionSet(step1.services);
  const isHelpMeChoose =
    step1.services.length === 1 && step1.services[0] === 'help_me_choose';

  const setAnswer = (qid: string, value: string) => {
    setStep2({ ...step2, answers: { ...step2.answers, [qid]: value } });
    if (errors[qid]) setErrors((prev) => ({ ...prev, [qid]: '' }));
  };

  const nextFromStep2 = () => {
    if (!isHelpMeChoose) {
      const found: Record<string, string> = {};
      for (const q of questionSet.questions) {
        if (q.type === 'file') continue;
        if (q.required && !step2.answers[q.id]?.trim()) {
          found[q.id] = BOOKING_FLOW.step2.required;
        }
      }
      setErrors(found);
      const first = Object.keys(found)[0];
      if (first) {
        document.getElementById(id(first))?.focus();
        return;
      }
    }
    fireEvent('consultation_step_completed', { step: 2 });
    goTo(3);
  };

  /* ── Step 3: contact, then /api/leads, then the calendar ──────────── */

  const setField = <K extends keyof StepThreeData>(
    key: K,
    value: StepThreeData[K]
  ) => {
    setStep3({ ...step3, [key]: value });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateStep3 = (): boolean => {
    const e = CONTACT_STEP_TEXT.errors;
    const found: Record<string, string> = {};
    if (!step3.fullName.trim()) found.fullName = e.fullName;
    if (!step3.email.trim()) found.email = e.emailRequired;
    else if (!EMAIL_RE.test(step3.email)) found.email = e.emailInvalid;
    if (!step3.referralSource) found.referralSource = e.referral;
    if (!step3.consent) found.consent = e.consent;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) document.getElementById(id(first))?.focus();
    return !first;
  };

  const schedule = async () => {
    if (!validateStep3()) return;
    fireEvent('consultation_booking_initiated');
    setSubmitError(null);
    setStatus('submitting');
    setTidyCalUrl(
      buildTidyCalUrl(
        step3.preferredMeetingLength,
        step3.fullName,
        step3.email,
        buildLeadNote(step1, step2)
      )
    );
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildLeadPayload(step1, step2, step3, window.location.search)
        ),
      });
      if (response.ok) {
        fireEvent('consultation_step_completed', { step: 3 });
        setCalendarLoaded(false);
        setStatus('schedule');
        return;
      }
      fireEvent('consultation_booking_failed');
      setSubmitError(await leadErrorMessage(response));
      setStatus('error');
    } catch (err) {
      fireEvent('consultation_booking_failed');
      setSubmitError(
        err instanceof TypeError
          ? FORM_ERRORS.network
          : BOOKING_FLOW.errors.generic
      );
      setStatus('error');
    }
  };

  const finish = () => {
    fireEvent('consultation_booking_confirmed');
    clearDraft();
    setStatus('success');
  };

  /* ── Views ────────────────────────────────────────────────────────── */

  const errorFor = (name: string) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className={styles.fieldError}>
        {errors[name]}
      </p>
    ) : null;
  const describedBy = (name: string) =>
    errors[name] ? id(`${name}-error`) : undefined;

  if (status === 'success') {
    return (
      <div className={styles.flow}>
        <div className={styles.success} role='status'>
          <h3 ref={headingRef} tabIndex={-1} className={styles.title}>
            {BOOKING_FLOW.success.title}
          </h3>
          <p className={styles.text}>{BOOKING_FLOW.success.text}</p>
        </div>
      </div>
    );
  }

  if (status === 'schedule') {
    return (
      <div className={styles.flow}>
        <h3 ref={headingRef} tabIndex={-1} className={styles.title}>
          {BOOKING_FLOW.schedule.title}
        </h3>
        {calendarLoaded ? (
          <div className={styles.frameWrap}>
            <iframe
              src={tidyCalUrl}
              title={BOOKING_FLOW.schedule.frameTitle}
              allow='clipboard-write'
              className={styles.frame}
            />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.text}>{BOOKING_FLOW.schedule.placeholder}</p>
            <div className={styles.actions}>
              <TwButton type='button' onClick={() => setCalendarLoaded(true)}>
                {BOOKING_FLOW.schedule.load}
              </TwButton>
            </div>
          </div>
        )}
        <div className={styles.actionsSplit}>
          <TwButton
            variant='outline'
            type='button'
            onClick={() => {
              setStatus('idle');
              goTo(3);
            }}
          >
            <span aria-hidden='true'>&#8592;</span> {BOOKING_FLOW.back}
          </TwButton>
          <div className={styles.actions}>
            <a
              className={styles.textLink}
              href={tidyCalUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {BOOKING_FLOW.schedule.newTab}{' '}
              <span aria-hidden='true'>&#8599;</span>
            </a>
            <TwButton type='button' onClick={finish}>
              {BOOKING_FLOW.schedule.done}{' '}
              <span aria-hidden='true'>&#8594;</span>
            </TwButton>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className={styles.flow}>
      <noscript>
        <p className={styles.text}>
          {BOOKING_FLOW.noScript}{' '}
          <a className={styles.textLink} href={TIDYCAL_URL}>
            {BOOKING_FLOW.noScriptLink} <span aria-hidden='true'>&#8599;</span>
          </a>
        </p>
      </noscript>

      {/* Progress: where you are, and what's done. */}
      <p className={styles.progress}>
        {BOOKING_FLOW.progress.replace('{n}', String(step))}
      </p>
      <ol className={styles.steps} aria-label={BOOKING_FLOW.stepsLabel}>
        {STEPS.map((s) => (
          <li
            key={s}
            className={[
              styles.stepItem,
              s < step ? styles.stepDone : '',
              s === step ? styles.stepCurrent : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={s === step ? 'step' : undefined}
          >
            <span className={styles.stepDot} aria-hidden='true'>
              {s < step ? '✓' : s}
            </span>
            <span className={styles.stepLabel}>
              {BOOKING_FLOW.stepLabels[s]}
            </span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div
          role='group'
          aria-labelledby={id('title')}
          aria-describedby={describedBy('services')}
        >
          <h3
            id={id('title')}
            ref={headingRef}
            tabIndex={-1}
            className={styles.title}
          >
            {BOOKING_FLOW.step1.title}
          </h3>
          <p className={styles.text}>{BOOKING_FLOW.step1.text}</p>
          <ul className={styles.options}>
            {SERVICE_OPTIONS.map((option) => {
              const selected = step1.services.includes(option.key);
              const Icon = resolveIconName(option.icon);
              return (
                <li key={option.key}>
                  <label
                    className={[styles.option, selected ? styles.optionOn : '']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type='checkbox'
                      className={styles.check}
                      checked={selected}
                      onChange={() => toggleService(option.key)}
                    />
                    {Icon ? (
                      <span className={styles.optionIcon} aria-hidden='true'>
                        <Icon size={22} />
                      </span>
                    ) : null}
                    <span className={styles.optionText}>
                      <span className={styles.optionLabel}>{option.label}</span>
                      <span className={styles.optionDesc}>
                        {option.description}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {errors.services ? (
            <p
              id={id('services-error')}
              className={styles.fieldError}
              role='alert'
            >
              {errors.services}
            </p>
          ) : null}
          <div className={styles.actionsEnd}>
            <TwButton type='button' onClick={nextFromStep1}>
              {BOOKING_FLOW.step1.next} <span aria-hidden='true'>&#8594;</span>
            </TwButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 ref={headingRef} tabIndex={-1} className={styles.title}>
            {BOOKING_FLOW.step2.title}
          </h3>
          <p className={styles.text}>
            {isHelpMeChoose
              ? BOOKING_FLOW.step2.helpMeChoose
              : BOOKING_FLOW.step2.text}
          </p>
          {!isHelpMeChoose && (
            <div className={styles.fields}>
              {questionSet.questions.map((q) => (
                <QuestionField
                  key={q.id}
                  question={q}
                  fieldId={id(q.id)}
                  value={step2.answers[q.id] ?? ''}
                  file={step2.fileUpload}
                  error={errors[q.id]}
                  errorId={id(`${q.id}-error`)}
                  onChange={(v) => setAnswer(q.id, v)}
                  onFile={(f) => setStep2({ ...step2, fileUpload: f })}
                />
              ))}
            </div>
          )}
          <div className={styles.actionsSplit}>
            <TwButton variant='outline' type='button' onClick={() => goTo(1)}>
              <span aria-hidden='true'>&#8592;</span> {BOOKING_FLOW.back}
            </TwButton>
            <TwButton type='button' onClick={nextFromStep2}>
              {BOOKING_FLOW.step2.next} <span aria-hidden='true'>&#8594;</span>
            </TwButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 ref={headingRef} tabIndex={-1} className={styles.title}>
            {BOOKING_FLOW.step3.title}
          </h3>
          <p className={styles.text}>{BOOKING_FLOW.step3.text}</p>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor={id('fullName')} className={styles.label}>
                {CONTACT_STEP_TEXT.fullName.label}{' '}
                <span aria-hidden='true'>*</span>
              </label>
              <input
                id={id('fullName')}
                className={styles.input}
                type='text'
                autoComplete='name'
                value={step3.fullName}
                placeholder={CONTACT_STEP_TEXT.fullName.placeholder}
                onChange={(e) => setField('fullName', e.target.value)}
                aria-invalid={!!errors.fullName}
                aria-describedby={describedBy('fullName')}
                required
              />
              {errorFor('fullName')}
            </div>
            <div className={styles.field}>
              <label htmlFor={id('email')} className={styles.label}>
                {CONTACT_STEP_TEXT.email.label}{' '}
                <span aria-hidden='true'>*</span>
              </label>
              <input
                id={id('email')}
                className={styles.input}
                type='email'
                autoComplete='email'
                value={step3.email}
                placeholder={CONTACT_STEP_TEXT.email.placeholder}
                onChange={(e) => setField('email', e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={describedBy('email')}
                required
              />
              {errorFor('email')}
            </div>
            <div className={styles.fieldPair}>
              <div className={styles.field}>
                <label htmlFor={id('phone')} className={styles.label}>
                  {CONTACT_STEP_TEXT.phone.label}
                </label>
                <input
                  id={id('phone')}
                  className={styles.input}
                  type='tel'
                  autoComplete='tel'
                  value={step3.phone}
                  placeholder={CONTACT_STEP_TEXT.phone.placeholder}
                  onChange={(e) =>
                    setField('phone', formatPhone(e.target.value))
                  }
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={id('company')} className={styles.label}>
                  {CONTACT_STEP_TEXT.company.label}
                </label>
                <input
                  id={id('company')}
                  className={styles.input}
                  type='text'
                  autoComplete='organization'
                  value={step3.company}
                  placeholder={CONTACT_STEP_TEXT.company.placeholder}
                  onChange={(e) => setField('company', e.target.value)}
                />
              </div>
            </div>

            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>
                {CONTACT_STEP_TEXT.meetingLength}{' '}
                <span aria-hidden='true'>*</span>
              </legend>
              <div className={styles.lengths}>
                {MEETING_LENGTHS.map(({ value, label, description }) => (
                  <label
                    key={value}
                    className={[
                      styles.length,
                      step3.preferredMeetingLength === value
                        ? styles.optionOn
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type='radio'
                      name={id('meeting-length')}
                      value={value}
                      className={styles.check}
                      checked={step3.preferredMeetingLength === value}
                      onChange={() => setField('preferredMeetingLength', value)}
                    />
                    <span className={styles.optionText}>
                      <span className={styles.optionLabel}>{label}</span>
                      <span className={styles.optionDesc}>{description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.field}>
              <label htmlFor={id('referralSource')} className={styles.label}>
                {CONTACT_STEP_TEXT.referral} <span aria-hidden='true'>*</span>
              </label>
              <select
                id={id('referralSource')}
                className={styles.input}
                value={step3.referralSource}
                onChange={(e) => setField('referralSource', e.target.value)}
                aria-invalid={!!errors.referralSource}
                aria-describedby={describedBy('referralSource')}
                required
              >
                <option value=''>{CONTACT_STEP_TEXT.selectPlaceholder}</option>
                {REFERRAL_OPTIONS.map(({ key, text }) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>
              {errorFor('referralSource')}
            </div>
            {step3.referralSource === 'other' && (
              <div className={styles.field}>
                <label htmlFor={id('referralOther')} className={styles.label}>
                  {CONTACT_STEP_TEXT.referralOther.label}
                </label>
                <input
                  id={id('referralOther')}
                  className={styles.input}
                  type='text'
                  value={step3.referralOther}
                  placeholder={CONTACT_STEP_TEXT.referralOther.placeholder}
                  onChange={(e) => setField('referralOther', e.target.value)}
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.consent}>
                <input
                  id={id('consent')}
                  type='checkbox'
                  className={styles.check}
                  checked={step3.consent}
                  onChange={(e) => setField('consent', e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={describedBy('consent')}
                  required
                />
                <span className={styles.consentText}>
                  {CONTACT_STEP_TEXT.consentBefore}{' '}
                  <a
                    href={CONTACT_STEP_TEXT.privacyUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.textLink}
                  >
                    {CONTACT_STEP_TEXT.consentLink}
                    <span className={styles.srOnly}>
                      {' '}
                      (opens in new window)
                    </span>
                  </a>{' '}
                  {CONTACT_STEP_TEXT.consentAfter}{' '}
                  <span aria-hidden='true'>*</span>
                </span>
              </label>
              {errorFor('consent')}
            </div>
          </div>

          {submitError ? (
            <div className={styles.submitError} role='alert'>
              <p>
                {submitError}{' '}
                <a className={styles.textLink} href={MESSAGE_FALLBACK_HREF}>
                  {BOOKING_FLOW.errors.messageLink}
                </a>
              </p>
            </div>
          ) : null}

          <div className={styles.actionsSplit}>
            <TwButton
              variant='outline'
              type='button'
              onClick={() => goTo(2)}
              disabled={isSubmitting}
            >
              <span aria-hidden='true'>&#8592;</span> {BOOKING_FLOW.back}
            </TwButton>
            <TwButton
              type='button'
              onClick={schedule}
              disabled={isSubmitting}
              className={isSubmitting ? styles.busy : undefined}
            >
              {isSubmitting
                ? BOOKING_FLOW.step3.submitting
                : BOOKING_FLOW.step3.submit}
              {isSubmitting ? null : <span aria-hidden='true'> &#8594;</span>}
            </TwButton>
          </div>
          <span className={styles.srOnly} role='status'>
            {isSubmitting ? BOOKING_FLOW.step3.submitting : ''}
          </span>
        </div>
      )}
    </div>
  );
}

/** One step-2 question, rendered by its type (text, dropdown, textarea, file). */
function QuestionField({
  question,
  fieldId,
  value,
  file,
  error,
  errorId,
  onChange,
  onFile,
}: {
  question: Question;
  fieldId: string;
  value: string;
  file: File | null | undefined;
  error?: string;
  errorId: string;
  onChange: (value: string) => void;
  onFile: (file: File | null) => void;
}) {
  const [fileError, setFileError] = useState('');
  const shown = error || fileError;
  const common = {
    id: fieldId,
    className: styles.input,
    'aria-invalid': !!shown,
    'aria-describedby': shown ? errorId : undefined,
    required: question.required,
  };

  let control: React.ReactNode;
  if (question.type === 'file') {
    control = (
      <>
        <input
          {...common}
          className={styles.file}
          type='file'
          accept={question.accept}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f && question.maxSize && f.size > question.maxSize) {
              setFileError(fileTooLarge(question.maxSize));
              onFile(null);
              return;
            }
            setFileError('');
            onFile(f);
          }}
        />
        {file ? <p className={styles.hint}>Selected: {file.name}</p> : null}
      </>
    );
  } else if (question.type === 'dropdown' && question.options) {
    control = (
      <select
        {...common}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value=''>{CONTACT_STEP_TEXT.selectPlaceholder}</option>
        {question.options.map(({ key, text }) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    );
  } else if (question.type === 'textarea') {
    control = (
      <textarea
        {...common}
        rows={3}
        value={value}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else {
    control = (
      <input
        {...common}
        type='text'
        value={value}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {question.label}
        {question.required ? <span aria-hidden='true'> *</span> : null}
      </label>
      {control}
      {shown ? (
        <p id={errorId} className={styles.fieldError}>
          {shown}
        </p>
      ) : null}
    </div>
  );
}

export default BookingFlow;
