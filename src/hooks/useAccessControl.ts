'use client';

/**
 * useAccessControl hook
 *
 * Manages token-based access control for DEV and TEST environments.
 * Persists the validated token in browser localStorage so that
 * authenticated users are not prompted again on return visits.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getEnvironment,
  requiresAuthentication,
  getApiBaseUrl,
} from '@/lib/environment';

const STORAGE_KEY = 'tw_access_token';

interface ValidationResponse {
  valid: boolean;
  environment?: string;
  message?: string;
  error?: string;
}

export function useAccessControl() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const environment = getEnvironment();
  const authRequired = requiresAuthentication();

  /**
   * Validates a token against the server-side Azure Function.
   */
  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `${getApiBaseUrl()}/auth/validate-token`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Invalid or expired token');
        } else if (response.status === 404) {
          setError('Authentication service not found');
        } else if (response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Request failed with status ${response.status}`);
        }
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }

      let data: ValidationResponse;
      try {
        data = await response.json();
      } catch {
        setError('Invalid response from server');
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }

      if (data.valid) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, token);
        }
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }

      setError(data.error || 'Invalid token');
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    } catch {
      setError('Failed to validate token. Please check your connection.');
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  // On mount, check for a previously stored token
  useEffect(() => {
    const initializeAuth = async () => {
      if (!authRequired) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem(STORAGE_KEY);
      if (storedToken) {
        await validateToken(storedToken);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // validateToken is memoized with no changing deps — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authRequired]);

  /**
   * Submits a new token for validation.
   */
  const submitToken = async (token: string): Promise<boolean> => {
    return validateToken(token);
  };

  /**
   * Clears the stored token and resets authentication state.
   */
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setError('');
  };

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
