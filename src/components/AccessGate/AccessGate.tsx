'use client';

/**
 * AccessGate Component
 *
 * Provides token-based access control for DEV and TEST environments.
 * Shows a token input form within StandardPageLayout that requires a valid access token before
 * allowing access to the site content.
 *
 * On PROD (or when auth is not required) the component is transparent
 * and simply renders its children.
 */

import React, { useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Input } from '@/components/Form/Input/Input';
import { Button } from '@/components/Form/Button/Button';
import { Typography } from '@/components/Typography';
import { useAccessControl } from '@/hooks/useAccessControl';
import { StandardPageLayout } from '@/layouts/PageLayout/StandardPageLayout';
import { getApiBaseUrl } from '@/lib/environment';

interface AccessGateProps {
  children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  const { theme, isDark } = useAppTheme();
  const {
    isAuthenticated,
    isLoading,
    error,
    environment,
    authRequired,
    submitToken,
  } = useAccessControl();
  const [tokenInput, setTokenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pass through immediately when auth is not needed or user is already authenticated
  if (!authRequired || isAuthenticated) {
    return <>{children}</>;
  }

  // Show a loading state while checking a persisted token
  if (isLoading) {
    return (
      <StandardPageLayout>
        <div
          role='status'
          aria-live='polite'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            color: theme.semanticColors.text.primary,
            fontFamily: theme.typography.fonts.body.fontFamily,
            fontSize: theme.typography.fonts.body.fontSize,
          }}
        >
          Loading&hellip;
        </div>
      </StandardPageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !tokenInput.trim()) return;

    setIsSubmitting(true);
    const success = await submitToken(tokenInput.trim());
    setIsSubmitting(false);

    if (!success) {
      setTokenInput('');
    }
  };

  return (
    <StandardPageLayout>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: isDark ? theme.palette.black : theme.palette.white,
            borderRadius: theme.borderRadius.l,
            boxShadow: theme.shadows.xl,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography
              variant='h2'
              style={{
                color: theme.semanticColors.link.default,
                marginBottom: '0.5rem',
              }}
            >
              Terence Waters
            </Typography>
            <Typography
              variant='h4'
              style={{ color: theme.semanticColors.text.muted }}
            >
              {environment === 'dev' ? 'Development' : 'Test'} Environment
            </Typography>
          </div>

          {/* Body */}
          <Typography
            variant='body'
            style={{
              color: theme.semanticColors.text.muted,
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            This is a protected environment. Please enter your access token to
            continue.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Input
              type='password'
              placeholder='Enter access token'
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              disabled={isSubmitting}
              error={error || undefined}
              autoComplete='current-password'
              autoFocus
              fullWidth
              style={{ marginBottom: '1rem' }}
            />

            <Button
              type='submit'
              variant='primary'
              size='large'
              fullWidth
              loading={isSubmitting}
              disabled={!tokenInput.trim() || isSubmitting}
            >
              {isSubmitting ? 'Validating…' : 'Access Site'}
            </Button>
          </form>

          {/* Footer note */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${theme.palette.neutralQuaternary}`,
            }}
          >
            <Typography
              variant='bodySmall'
              style={{
                color: theme.semanticColors.text.disabled,
                textAlign: 'center',
              }}
            >
              Need access? Contact the site administrator for an access token.
            </Typography>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
};
