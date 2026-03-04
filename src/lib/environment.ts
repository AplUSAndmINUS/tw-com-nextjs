/**
 * Environment detection utility
 *
 * Determines the current environment at build time using the
 * NEXT_PUBLIC_ENVIRONMENT variable set in the GitHub Actions workflows.
 */

export type Environment = 'dev' | 'test' | 'prod';

/**
 * Returns the current deployment environment.
 * Value is baked in at build time via NEXT_PUBLIC_ENVIRONMENT.
 */
export function getEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();

  if (env === 'dev' || env === 'development') {
    return 'dev';
  }

  if (env === 'test') {
    return 'test';
  }

  return 'prod';
}

/**
 * Returns true when the current environment requires token authentication
 * (i.e. DEV or TEST).
 */
export function requiresAuthentication(): boolean {
  const env = getEnvironment();
  return env === 'dev' || env === 'test';
}

/**
 * Returns the base URL for the Azure Functions API.
 *
 * For local development (localhost:3000), uses NEXT_PUBLIC_API_URL if set
 * (should point to http://localhost:7071 for local Azure Functions).
 *
 * For deployed environments (Azure Static Web Apps), returns empty string
 * because Azure SWA automatically prefixes function routes with /api.
 */
export function getApiBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return '';
  }

  // For localhost development, check for explicit API URL
  if (window.location.hostname === 'localhost') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl;
    }
  }

  // Default: Azure SWA handles /api prefix automatically
  return '';
}
