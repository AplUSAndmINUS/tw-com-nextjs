'use client';

/**
 * StepContextualQuestions — Step 2 of the Consultation Stepper
 * Conditional questions based on service selection
 */

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { FormButton } from '@/components/Form/FormButton';
import { Input } from '@/components/Form/Input/Input';
import { FormSelect } from '@/components/Form/FormSelect';
import { Textarea } from '@/components/Form/Textarea/Textarea';
import { getQuestionSet } from './constants';
import { ServiceKey, StepOneData, StepTwoData, Question } from './types';

// Map service keys to readable labels for section headings
const SERVICE_OPTIONS_LABELS: Partial<Record<ServiceKey, string>> = {
  personal_training: 'Personal Training',
  it_consulting: 'IT Consulting',
  graphic_design: 'Graphic Design',
  web_development: 'Web Development',
  resonance_coaching: 'Resonance Coaching',
};

interface StepContextualQuestionsProps {
  step1: StepOneData;
  data: StepTwoData;
  onChange: (data: StepTwoData) => void;
  onNext: () => void;
  onBack: () => void;
}

function FileUploadField({
  question,
  file,
  onChange,
}: {
  question: Question;
  file: File | null | undefined;
  onChange: (file: File | null) => void;
}) {
  const { theme } = useAppTheme();
  const [error, setError] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && question.maxSize && f.size > question.maxSize) {
      setError(
        `File too large. Maximum size is ${Math.round(question.maxSize / 1024 / 1024)} MB.`
      );
      onChange(null);
      return;
    }
    setError('');
    onChange(f);
  };

  return (
    <div>
      <Typography
        variant='body'
        as='p'
        style={{
          fontWeight: theme.typography.fontWeights.semiBold,
          color: theme.palette.neutralPrimary,
          marginBottom: '0.5rem',
          display: 'block',
        }}
      >
        {question.label}
      </Typography>
      <input
        type='file'
        accept={question.accept}
        onChange={handleChange}
        aria-label={question.label}
        style={{
          fontSize: theme.typography.fonts.bodySmall.fontSize,
          color: theme.palette.neutralPrimary,
        }}
      />
      {file && (
        <Typography
          variant='body'
          as='p'
          style={{
            color: theme.palette.neutralSecondary,
            fontSize: theme.typography.fonts.bodySmall.fontSize,
            marginTop: '4px',
          }}
        >
          Selected: {file.name}
        </Typography>
      )}
      {error && (
        <Typography
          variant='body'
          as='p'
          style={{
            color: theme.palette.redDark,
            fontSize: theme.typography.fonts.bodySmall.fontSize,
            marginTop: '4px',
          }}
        >
          {error}
        </Typography>
      )}
    </div>
  );
}

export const StepContextualQuestions: React.FC<
  StepContextualQuestionsProps
> = ({ step1, data, onChange, onNext, onBack }) => {
  const { theme } = useAppTheme();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const services = step1.services.filter(
    (s): s is ServiceKey => s !== 'help_me_choose'
  );
  const questionSet = getQuestionSet(step1.services);

  const isHelpMeChoose =
    step1.services.length === 1 && step1.services[0] === 'help_me_choose';

  const updateAnswer = (id: string, value: string) => {
    onChange({ ...data, answers: { ...data.answers, [id]: value } });
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const updateFile = (file: File | null) => {
    onChange({ ...data, fileUpload: file });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const q of questionSet.questions) {
      if (q.type === 'file') continue;
      if (q.required && !data.answers[q.id]?.trim()) {
        newErrors[q.id] = 'This field is required.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!isHelpMeChoose && !validate()) return;
    onNext();
  };

  const renderQuestion = (question: Question) => {
    if (question.type === 'file') {
      return (
        <FileUploadField
          key={question.id}
          question={question}
          file={data.fileUpload}
          onChange={updateFile}
        />
      );
    }

    if (question.type === 'dropdown' && question.options) {
      return (
        <FormSelect
          key={question.id}
          label={question.label}
          value={data.answers[question.id] || ''}
          options={question.options}
          onChange={(value) => updateAnswer(question.id, value ?? '')}
          placeholder='Select an option…'
          aria-label={question.label}
        />
      );
    }

    if (question.type === 'textarea') {
      return (
        <Textarea
          key={question.id}
          label={question.label}
          value={data.answers[question.id] || ''}
          onChange={(event) => updateAnswer(question.id, event.target.value)}
          placeholder={question.placeholder}
          required={question.required}
          rows={3}
        />
      );
    }

    return (
      <Input
        key={question.id}
        label={question.label}
        value={data.answers[question.id] || ''}
        onChange={(event) => updateAnswer(question.id, event.target.value)}
        placeholder={question.placeholder}
        required={question.required}
        type='text'
        fullWidth
      />
    );
  };

  const sectionTitle =
    services.length === 1
      ? `Questions about ${
          SERVICE_OPTIONS_LABELS[services[0]] ?? 'your service'
        }`
      : 'Questions about your needs';

  return (
    <div>
      <Typography
        variant='h3'
        style={{
          color: theme.palette.themePrimary,
          marginBottom: theme.spacing.xs,
        }}
      >
        Step 2 — Tell us a little about your needs
      </Typography>
      <Typography
        variant='body'
        as='p'
        style={{
          color: theme.palette.neutralSecondary,
          marginBottom: theme.spacing.l,
          fontSize: theme.typography.fonts.bodySmall.fontSize,
        }}
      >
        {isHelpMeChoose
          ? "No worries — we'll explore what fits best on the call. Just complete your contact details in the next step."
          : 'Answer as many as you can. These help us make the most of our time together.'}
      </Typography>

      {!isHelpMeChoose && (
        <>
          {(services.length > 1 ||
            step1.services.includes('help_me_choose') === false) && (
            <Typography
              variant='h4'
              style={{
                color: theme.palette.neutralPrimary,
                marginBottom: theme.spacing.m,
              }}
            >
              {sectionTitle}
            </Typography>
          )}

          <div className='flex flex-col gap-4'>
            {questionSet.questions.map((q) => (
              <div key={q.id}>
                {renderQuestion(q)}
                {errors[q.id] && (
                  <div role='alert'>
                    <Typography
                      variant='body'
                      as='p'
                      style={{
                        color: theme.palette.redDark,
                        fontSize: theme.typography.fonts.bodySmall.fontSize,
                        marginTop: '4px',
                      }}
                    >
                      {errors[q.id]}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className='flex justify-between mt-6'>
        <FormButton
          variant='secondary'
          onClick={onBack}
          size='medium'
          type='button'
        >
          ← Back
        </FormButton>
        <FormButton
          variant='primary'
          onClick={handleNext}
          size='medium'
          type='button'
        >
          Next: Contact & Schedule →
        </FormButton>
      </div>
    </div>
  );
};
