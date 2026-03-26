/**
 * ConsultationStepper Types
 * Shared type definitions for the three-step onboarding stepper
 */

import type { FluentIconName } from '@/utils/iconResolver';

export type ServiceKey =
  | 'personal_training'
  | 'it_consulting'
  | 'graphic_design'
  | 'web_development'
  | 'resonance_coaching'
  | 'help_me_choose';

export interface ServiceOption {
  key: ServiceKey;
  label: string;
  description: string;
  icon: FluentIconName;
}

export type QuestionType = 'text' | 'dropdown' | 'textarea' | 'file';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  required: boolean;
  options?: Array<{ key: string; text: string }>;
  accept?: string;
  maxSize?: number;
}

export interface QuestionSet {
  serviceKey: ServiceKey | 'generic';
  questions: Question[];
}

export type MeetingLength = '20' | '30' | '45';

export interface StepOneData {
  services: ServiceKey[];
}

export interface StepTwoData {
  answers: Record<string, string>;
  fileUpload?: File | null;
}

export interface StepThreeData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  preferredMeetingLength: MeetingLength;
  referralSource: string;
  referralOther: string;
  consent: boolean;
}

export interface ConsultationFormData {
  step1: StepOneData;
  step2: StepTwoData;
  step3: StepThreeData;
  savedAt?: string;
}

export interface LeadPayload {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: ServiceKey[];
  answers: Record<string, string>;
  preferredMeetingLength: MeetingLength;
  referralSource: string;
  consent: boolean;
  submittedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type StepperStep = 1 | 2 | 3;

export type SubmitStatus =
  | 'idle'
  | 'booking'
  | 'submitting'
  | 'schedule'
  | 'success'
  | 'error';
