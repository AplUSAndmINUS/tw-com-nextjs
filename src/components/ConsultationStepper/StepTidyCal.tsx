'use client';

import React from 'react';

import { Button } from '@/components/Form';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface StepTidyCalProps {
  tidyCalUrl: string;
  onBack: () => void;
  onComplete: () => void;
}

export const StepTidyCal: React.FC<StepTidyCalProps> = ({
  tidyCalUrl,
  onBack,
  onComplete,
}) => {
  const { theme } = useAppTheme();

  return (
    <div>
      <Typography
        variant='h3'
        style={{
          color: theme.palette.themePrimary,
          marginBottom: theme.spacing.xs,
        }}
      >
        Schedule Your Time
      </Typography>
      <Typography
        variant='body'
        style={{
          color: theme.palette.neutralSecondary,
          marginBottom: theme.spacing.l,
          fontSize: theme.typography.fonts.bodySmall.fontSize,
        }}
      >
        Pick a time that works for you below. If the embedded calendar does not
        load correctly, you can still open it in a new tab.
      </Typography>

      <div
        style={{
          border: `1px solid ${theme.semanticColors.border.default}`,
          borderRadius: theme.borderRadius.container.medium,
          overflow: 'hidden',
          backgroundColor: theme.semanticColors.background.elevated,
          minHeight: '600px',
        }}
      >
        <iframe
          src={tidyCalUrl}
          title='TidyCal booking calendar'
          allow='clipboard-write'
          style={{
            width: '100%',
            height: '600px',
            border: 0,
            display: 'block',
            backgroundColor: theme.semanticColors.background.base,
          }}
        />
      </div>

      <div className='flex flex-col gap-3 mt-6 sm:flex-row sm:justify-between sm:items-center'>
        <Button variant='secondary' type='button' onClick={onBack}>
          ← Back
        </Button>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            variant='ghost'
            type='button'
            onClick={() =>
              window.open(tidyCalUrl, '_blank', 'noopener,noreferrer')
            }
          >
            Open in New Tab
          </Button>
          <Button variant='primary' type='button' onClick={onComplete}>
            I&apos;ve Scheduled My Time →
          </Button>
        </div>
      </div>
    </div>
  );
};
