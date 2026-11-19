/**
 * The booking flow's logic, shared by BookingFlow (inline or in the
 * full-screen BookingModal, #278) and the legacy ConsultationStepper modal.
 * Moved out of
 * ConsultationStepper.tsx unchanged so both send the same lead and open the
 * same TidyCal page.
 */

import { TIDYCAL_LINKS } from './constants';
import type {
  LeadPayload,
  MeetingLength,
  StepOneData,
  StepThreeData,
  StepTwoData,
} from './types';

/** Maximum character length for TidyCal prefill notes parameter */
export const TIDYCAL_MAX_NOTES_LENGTH = 500;

/** Builds a TidyCal prefill URL with contact + summary data */
export function buildTidyCalUrl(
  meetingLength: MeetingLength,
  fullName: string,
  email: string,
  noteSummary: string
): string {
  const base = TIDYCAL_LINKS[meetingLength] ?? TIDYCAL_LINKS['30'];
  const params = new URLSearchParams({
    name: fullName,
    email,
    notes: noteSummary.slice(0, TIDYCAL_MAX_NOTES_LENGTH),
  });
  return `${base}?${params.toString()}`;
}

/** The short note TidyCal shows with the booking: services, then answers. */
export function buildLeadNote(step1: StepOneData, step2: StepTwoData): string {
  const answerLines = Object.entries(step2.answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const services = step1.services.join(', ');
  return `Services: ${services}\n${answerLines}`.trim();
}

/** What POST /api/leads receives (see api/leads/index.js for the checks). */
export function buildLeadPayload(
  step1: StepOneData,
  step2: StepTwoData,
  step3: StepThreeData,
  search: string,
  now: Date = new Date()
): LeadPayload {
  const utmParams = new URLSearchParams(search);
  const answers = { ...step2.answers };

  if (step2.fileUpload) {
    answers._uploadedReferenceFile = `${step2.fileUpload.name} (${Math.round(
      step2.fileUpload.size / 1024
    )} KB)`;
  }

  return {
    fullName: step3.fullName,
    email: step3.email,
    phone: step3.phone,
    company: step3.company,
    services: step1.services,
    answers,
    preferredMeetingLength: step3.preferredMeetingLength,
    referralSource:
      step3.referralSource === 'other'
        ? step3.referralOther || 'Other'
        : step3.referralSource,
    consent: step3.consent,
    submittedAt: now.toISOString(),
    utmSource: utmParams.get('utm_source') ?? undefined,
    utmMedium: utmParams.get('utm_medium') ?? undefined,
    utmCampaign: utmParams.get('utm_campaign') ?? undefined,
  };
}

declare global {
  interface Window {
    gtag?: (
      cmd: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/** Fires an analytics event if window.gtag is available */
export function fireEvent(
  name: string,
  params?: Record<string, string | number>
) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params);
    }
  } catch {
    // Ignore analytics errors
  }
}
