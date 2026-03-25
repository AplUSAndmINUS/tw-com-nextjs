'use client';

/**
 * StepServiceSelection — Step 1 of the Consultation Stepper
 * Multi-select checkboxes for service intent
 */

import React from 'react';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { FormButton } from '@/components/Form/FormButton';
import { SERVICE_OPTIONS } from './constants';
import { ServiceKey, StepOneData } from './types';

interface StepServiceSelectionProps {
  data: StepOneData;
  onChange: (data: StepOneData) => void;
  onNext: () => void;
}

export const StepServiceSelection: React.FC<StepServiceSelectionProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const { theme } = useAppTheme();
  const [error, setError] = React.useState('');

  const toggle = (key: ServiceKey) => {
    let next: ServiceKey[];
    if (key === 'help_me_choose') {
      // Selecting "help me choose" deselects everything else
      next = data.services.includes('help_me_choose') ? [] : ['help_me_choose'];
    } else {
      const without = data.services.filter((s) => s !== 'help_me_choose');
      next = without.includes(key)
        ? without.filter((s) => s !== key)
        : [...without, key];
    }
    onChange({ services: next });
    if (next.length > 0) setError('');
  };

  const handleNext = () => {
    if (data.services.length === 0) {
      setError('Please select at least one option to continue.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div role='group' aria-labelledby='step1-heading'>
      <Typography
        variant='h3'
        id='step1-heading'
        style={{
          color: theme.palette.themePrimary,
          marginBottom: theme.spacing.xs,
        }}
      >
        Step 1 — What are you interested in?
      </Typography>
      <Typography
        variant='body'
        style={{
          color: theme.palette.neutralSecondary,
          marginBottom: theme.spacing.l,
        }}
      >
        Select one or more services. If you&apos;re unsure, choose &ldquo;I
        don&apos;t know&rdquo; and we&apos;ll help on the call.
      </Typography>

      <div className='flex flex-col gap-3'>
        {SERVICE_OPTIONS.map((option) => {
          const isSelected = data.services.includes(option.key);
          return (
            <label
              key={option.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: theme.spacing.m,
                padding: theme.spacing.m,
                borderRadius: theme.borderRadius.m,
                border: `2px solid ${isSelected ? theme.palette.themePrimary : theme.palette.neutralQuaternaryAlt}`,
                backgroundColor: isSelected
                  ? theme.palette.themeLighterAlt
                  : theme.palette.neutralLighterAlt,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type='checkbox'
                checked={isSelected}
                onChange={() => toggle(option.key)}
                aria-label={option.label}
                style={{
                  marginTop: '3px',
                  accentColor: theme.palette.themePrimary,
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span
                style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}
                aria-hidden='true'
              >
                {option.icon}
              </span>
              <div>
                <Typography
                  variant='label'
                  style={{
                    fontWeight: theme.typography.fontWeights.semiBold,
                    color: isSelected
                      ? theme.palette.themePrimary
                      : theme.palette.neutralPrimary,
                    margin: 0,
                    marginBottom: '2px',
                  }}
                >
                  {option.label}
                </Typography>
                <Typography
                  variant='body'
                  style={{
                    color: theme.palette.neutralSecondary,
                    margin: 0,
                  }}
                >
                  {option.description}
                </Typography>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <div
          role='alert'
          style={{
            marginTop: theme.spacing.m,
            color: theme.palette.redDark,
            fontSize: theme.typography.fonts.bodySmall.fontSize,
          }}
        >
          {error}
        </div>
      )}

      <div className='flex justify-end mt-6'>
        <FormButton variant='primary' onClick={handleNext} size='medium'>
          Next: Tell us about your needs →
        </FormButton>
      </div>
    </div>
  );
};
