import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

interface AccessControlState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  token: string | null;
  // Track in-flight validation to prevent duplicate requests
  validationPromise: Promise<boolean> | null;

  // Actions
  validateToken: (token: string) => Promise<boolean>;
  submitToken: (token: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAccessControlStore = create<AccessControlState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      error: '',
      token: null,
      validationPromise: null,

      validateToken: async (token: string): Promise<boolean> => {
        // Check if there's already a validation in progress
        const currentPromise = get().validationPromise;
        if (currentPromise) {
          return currentPromise;
        }

        // Create new validation promise
        const validationPromise = (async () => {
          set({ isLoading: true, error: '' });

          try {
            const apiUrl = `${getApiBaseUrl()}/auth/validate-token`;
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });

            if (!response.ok) {
              let errorMessage = '';
              if (response.status === 401 || response.status === 403) {
                errorMessage = 'Invalid or expired token';
              } else if (response.status === 404) {
                errorMessage = 'Authentication service not found';
              } else if (response.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
              } else {
                errorMessage = `Request failed with status ${response.status}`;
              }

              set({
                error: errorMessage,
                isAuthenticated: false,
                isLoading: false,
                token: null,
                validationPromise: null,
              });
              return false;
            }

            let data: ValidationResponse;
            try {
              data = await response.json();
            } catch {
              set({
                error: 'Invalid response from server',
                isAuthenticated: false,
                isLoading: false,
                token: null,
                validationPromise: null,
              });
              return false;
            }

            if (data.valid) {
              set({
                isAuthenticated: true,
                isLoading: false,
                token,
                error: '',
                validationPromise: null,
              });
              return true;
            }

            set({
              error: data.error || 'Invalid token',
              isAuthenticated: false,
              isLoading: false,
              token: null,
              validationPromise: null,
            });
            return false;
          } catch {
            set({
              error: 'Failed to validate token. Please check your connection.',
              isAuthenticated: false,
              isLoading: false,
              token: null,
              validationPromise: null,
            });
            return false;
          }
        })();

        // Store the promise so other components can reuse it
        set({ validationPromise });

        return validationPromise;
      },

      submitToken: async (token: string): Promise<boolean> => {
        return get().validateToken(token);
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: '',
          token: null,
          validationPromise: null,
        });
      },

      initializeAuth: async () => {
        const authRequired = requiresAuthentication();

        if (!authRequired) {
          set({ isAuthenticated: true, isLoading: false });
          return;
        }

        if (typeof window === 'undefined') {
          set({ isLoading: false });
          return;
        }

        const storedToken = get().token;
        if (storedToken) {
          await get().validateToken(storedToken);
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      // Only persist the token, not the validation state
      partialize: (state) => ({ token: state.token }),
      skipHydration: true,
    }
  )
);
