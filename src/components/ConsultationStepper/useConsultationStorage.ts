'use client';

/**
 * useConsultationStorage
 * Hook for persisting and restoring consultation form state in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ConsultationFormData,
  StepOneData,
  StepTwoData,
  StepThreeData,
  MeetingLength,
} from './types';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_TTL_MS } from './constants';

const DEFAULT_STEP1: StepOneData = { services: [] };
const DEFAULT_STEP2: StepTwoData = { answers: {}, fileUpload: null };
const DEFAULT_STEP3: StepThreeData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  preferredMeetingLength: '30' as MeetingLength,
  referralSource: '',
  referralOther: '',
  consent: false,
};

interface UseConsultationStorageResult {
  step1: StepOneData;
  step2: StepTwoData;
  step3: StepThreeData;
  hasDraft: boolean;
  setStep1: (data: StepOneData) => void;
  setStep2: (data: StepTwoData) => void;
  setStep3: (data: StepThreeData) => void;
  clearDraft: () => void;
}

export function useConsultationStorage(): UseConsultationStorageResult {
  const [step1, setStep1State] = useState<StepOneData>(DEFAULT_STEP1);
  const [step2, setStep2State] = useState<StepTwoData>(DEFAULT_STEP2);
  const [step3, setStep3State] = useState<StepThreeData>(DEFAULT_STEP3);
  const [hasDraft, setHasDraft] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;
      const parsed: ConsultationFormData & { savedAt?: string } =
        JSON.parse(raw);
      const savedAt = parsed.savedAt ? new Date(parsed.savedAt).getTime() : 0;
      if (Date.now() - savedAt > LOCAL_STORAGE_TTL_MS) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }
      if (parsed.step1) setStep1State(parsed.step1);
      if (parsed.step2) setStep2State({ ...parsed.step2, fileUpload: null });
      if (parsed.step3) setStep3State(parsed.step3);
      const hasContent =
        (parsed.step1?.services?.length ?? 0) > 0 ||
        Object.keys(parsed.step2?.answers ?? {}).length > 0 ||
        (parsed.step3?.fullName ?? '').length > 0;
      setHasDraft(hasContent);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[ConsultationStepper] Failed to restore draft from localStorage:',
          err
        );
      }
      // Clear corrupted data
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const persist = useCallback(
    (s1: StepOneData, s2: StepTwoData, s3: StepThreeData) => {
      try {
        const data: ConsultationFormData = {
          step1: s1,
          step2: { answers: s2.answers },
          step3: s3,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[ConsultationStepper] Failed to persist draft to localStorage:',
            err
          );
        }
      }
    },
    []
  );

  const setStep1 = useCallback(
    (data: StepOneData) => {
      setStep1State(data);
      setHasDraft(true);
      persist(data, step2, step3);
    },
    [step2, step3, persist]
  );

  const setStep2 = useCallback(
    (data: StepTwoData) => {
      setStep2State(data);
      setHasDraft(true);
      persist(step1, data, step3);
    },
    [step1, step3, persist]
  );

  const setStep3 = useCallback(
    (data: StepThreeData) => {
      setStep3State(data);
      setHasDraft(true);
      persist(step1, step2, data);
    },
    [step1, step2, persist]
  );

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore errors
    }
    setStep1State(DEFAULT_STEP1);
    setStep2State(DEFAULT_STEP2);
    setStep3State(DEFAULT_STEP3);
    setHasDraft(false);
  }, []);

  return {
    step1,
    step2,
    step3,
    hasDraft,
    setStep1,
    setStep2,
    setStep3,
    clearDraft,
  };
}
