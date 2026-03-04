'use client';

/**
 * useAccessControl hook
 *
 * Manages token-based access control for DEV and TEST environments.
 * Uses a shared Zustand store to prevent duplicate validation requests
 * when multiple components consume this hook simultaneously.
 *
 * The store implements single-flight behavior: if a validation is already
 * in progress, subsequent calls will reuse the same promise instead of
 * triggering new API requests.
 */

import { useEffect } from 'react';
import { useAccessControlStore } from '@/store/accessControlStore';
import { getEnvironment, requiresAuthentication } from '@/lib/environment';

export function useAccessControl() {
  const {
    isAuthenticated,
    isLoading,
    error,
    submitToken,
    logout,
    initializeAuth,
  } = useAccessControlStore();

  const environment = getEnvironment();
  const authRequired = requiresAuthentication();

  // Initialize auth on mount, but only once via the store
  useEffect(() => {
    // Only initialize if we're still in loading state and haven't checked yet
    if (isLoading && !useAccessControlStore.getState().validationPromise) {
      initializeAuth();
    }
  }, [initializeAuth, isLoading]);

  return {
    isAuthenticated,
    isLoading,
    error,
    environment,
    authRequired,
    submitToken,
    logout,
  };
}
