'use client';

/**
 * ConsultationStepper
 * Three-step branded onboarding modal for Fluxline.pro
 *
 * Step 1: Service Selection
 * Step 2: Contextual Questions
 * Step 3: Contact & Scheduling (TidyCal integration)
 */

import React, { useCallback, useEffect } from 'react';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { Modal } from '@/components/Modal';
import { useConsultationStorage } from './useConsultationStorage';
import { StepServiceSelection } from './StepServiceSelection';
import { StepContextualQuestions } from './StepContextualQuestions';
import { StepContactSchedule } from './StepContactSchedule';
import { StepTidyCal } from './StepTidyCal';
import {
  buildLeadNote,
  buildLeadPayload,
  buildTidyCalUrl,
  fireEvent,
} from './lead';
import { getApiBaseUrl } from '@/lib/environment';
import { StepperStep, SubmitStatus } from './types';
import { Button } from '@/components/Form';
import { FluentIcon } from '../FluentIcon';
import { CheckmarkIcon } from '@/components/icons';

export interface ConsultationStepperProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onDismiss: () => void;
}

const STEP_LABELS: Record<StepperStep, string> = {
  1: 'Services',
  2: 'Your Needs',
  3: 'Contact & Schedule',
};

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: StepperStep;
  onStepClick: (step: StepperStep) => void;
}) {
  const { theme } = useAppTheme();
  const steps: StepperStep[] = [1, 2, 3];

  return (
    <nav
      aria-label='Consultation steps'
      style={{ marginBottom: theme.spacing.xl }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: 0,
        }}
      >
        {steps.map((step, idx) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isClickable = step < currentStep;

          return (
            <React.Fragment key={step}>
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: idx < 2 ? 1 : undefined,
                }}
              >
                <Button
                  type='button'
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${step}: ${STEP_LABELS[step]}${isCompleted ? ' (completed)' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isClickable ? 'pointer' : 'default',
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                    padding: 0,
                    boxShadow: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: theme.typography.fontWeights.semiBold,
                      fontSize: '0.875rem',
                      backgroundColor: isCompleted
                        ? theme.palette.themePrimary
                        : isCurrent
                          ? theme.palette.themePrimary
                          : theme.palette.neutralQuaternaryAlt,
                      color:
                        isCompleted || isCurrent
                          ? theme.palette.white
                          : theme.palette.neutralSecondary,
                      border: isCurrent
                        ? `3px solid ${theme.palette.themeDark}`
                        : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isCompleted ? '✓' : step}
                  </div>
                  <Typography
                    variant='label'
                    style={{
                      color: isCurrent
                        ? theme.palette.themePrimary
                        : theme.palette.neutralSecondary,
                      fontWeight: isCurrent
                        ? theme.typography.fontWeights.semiBold
                        : undefined,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {STEP_LABELS[step]}
                  </Typography>
                </Button>

                {/* Connector line */}
                {idx < 2 && (
                  <div
                    aria-hidden='true'
                    style={{
                      flex: 1,
                      height: '2px',
                      marginBottom: '20px',
                      marginLeft: '8px',
                      marginRight: '8px',
                      backgroundColor:
                        step < currentStep
                          ? theme.palette.themePrimary
                          : theme.palette.neutralQuaternaryAlt,
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  const { theme } = useAppTheme();
  return (
    <div
      style={{
        textAlign: 'center',
        padding: `${theme.spacing.xl} ${theme.spacing.m}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing.m,
      }}
      role='status'
      aria-live='polite'
    >
      <div style={{ fontSize: '4rem' }} aria-hidden='true'>
        <FluentIcon iconName={CheckmarkIcon} size={28} />
      </div>
      <Typography
        variant='h3'
        style={{ color: theme.palette.themePrimary, marginBottom: 0 }}
      >
        You&apos;re all set!
      </Typography>
      <Typography
        variant='body'
        style={{ color: theme.palette.neutralSecondary, maxWidth: '400px' }}
      >
        Your consultation has been scheduled. Check your inbox for a
        confirmation email with all the details.
      </Typography>

      <Button
        type='button'
        onClick={onClose}
        style={{
          marginTop: theme.spacing.m,
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: 'transparent',
          color: theme.palette.neutralSecondary,
          cursor: 'pointer',
          fontSize: theme.typography.fonts.bodySmall.fontSize,
          textDecoration: 'underline',
          boxShadow: 'none',
        }}
      >
        Close
      </Button>
    </div>
  );
}

export const ConsultationStepper: React.FC<ConsultationStepperProps> = ({
  isOpen,
  onDismiss,
}) => {
  const { theme } = useAppTheme();
  const [currentStep, setCurrentStep] = React.useState<StepperStep>(1);
  const [status, setStatus] = React.useState<SubmitStatus>('idle');
  const [tidyCalUrl, setTidyCalUrl] = React.useState('');

  const { step1, step2, step3, setStep1, setStep2, setStep3, clearDraft } =
    useConsultationStorage();

  // Fire "stepper opened" event on open
  useEffect(() => {
    if (isOpen) {
      fireEvent('consultation_stepper_opened');
      setStatus('idle');
    }
  }, [isOpen]);

  const goToStep = useCallback((step: StepperStep) => {
    setCurrentStep(step);
  }, []);

  const handleStep1Next = useCallback(() => {
    fireEvent('consultation_step_completed', { step: 1 });
    setCurrentStep(2);
  }, []);

  const handleStep2Next = useCallback(() => {
    fireEvent('consultation_step_completed', { step: 2 });
    setCurrentStep(3);
  }, []);

  const handleSchedule = useCallback(async () => {
    fireEvent('consultation_booking_initiated');
    setStatus('submitting');

    const note = buildLeadNote(step1, step2);

    const tidyCalUrl = buildTidyCalUrl(
      step3.preferredMeetingLength,
      step3.fullName,
      step3.email,
      note
    );
    setTidyCalUrl(tidyCalUrl);

    // Post lead payload to backend
    try {
      const payload = buildLeadPayload(
        step1,
        step2,
        step3,
        window.location.search
      );

      const response = await fetch(`${getApiBaseUrl()}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.ok) {
        fireEvent('consultation_step_completed', { step: 3 });
        setStatus('schedule');
      } else {
        fireEvent('consultation_booking_failed');
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[ConsultationStepper] Lead submission failed:',
            response.status,
            responseBody
          );
        }
        setStatus('error');
      }
    } catch (error) {
      fireEvent('consultation_booking_failed');
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ConsultationStepper] Lead submission failed:', error);
      }
      setStatus('error');
    }
  }, [step1, step2, step3]);

  const handleBookingComplete = useCallback(() => {
    fireEvent('consultation_booking_confirmed');
    clearDraft();
    setStatus('success');
  }, [clearDraft]);

  const handleClose = useCallback(() => {
    onDismiss();
    // Reset step after animation finishes
    setTimeout(() => {
      setCurrentStep(1);
      setStatus('idle');
      setTidyCalUrl('');
    }, 300);
  }, [onDismiss]);

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      ariaLabel='Book a Conversation'
      maxWidth={status === 'schedule' ? '960px' : '800px'}
      maxHeight={status === 'schedule' ? '92vh' : '90vh'}
    >
      <div
        style={{
          padding: theme.spacing.xl,
          paddingTop: theme.spacing.l,
          border: `2px solid ${theme.palette.neutralLighterAlt}`,
        }}
      >
        {status === 'success' ? (
          <SuccessView onClose={handleClose} />
        ) : status === 'schedule' ? (
          <StepTidyCal
            tidyCalUrl={tidyCalUrl}
            onBack={() => setStatus('idle')}
            onComplete={handleBookingComplete}
          />
        ) : (
          <>
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

            {currentStep === 1 && (
              <StepServiceSelection
                data={step1}
                onChange={setStep1}
                onNext={handleStep1Next}
              />
            )}

            {currentStep === 2 && (
              <StepContextualQuestions
                step1={step1}
                data={step2}
                onChange={setStep2}
                onNext={handleStep2Next}
                onBack={() => {
                  fireEvent('consultation_step_back', { from: 2 });
                  setCurrentStep(1);
                }}
              />
            )}

            {currentStep === 3 && (
              <StepContactSchedule
                data={step3}
                onChange={setStep3}
                onBack={() => {
                  fireEvent('consultation_step_back', { from: 3 });
                  setCurrentStep(2);
                }}
                onSchedule={handleSchedule}
                status={status}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
