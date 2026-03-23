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
 * Returns true when running on localhost (browser only).
 * Used to bypass token authentication during local development.
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const { hostname } = window.location;
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  );
}

/**
 * Returns true when the current environment requires token authentication
 * (i.e. DEV or TEST), but not when running on localhost.
 */
export function requiresAuthentication(): boolean {
  const env = getEnvironment();
  if (env !== 'dev' && env !== 'test') {
    return false;
  }
  // Skip token gate on localhost — Azure Function API is only available if the local Functions runtime is running
  return !isLocalhost();
}

/**
 * Returns the base URL for the Azure Functions API.
 *
 * If NEXT_PUBLIC_API_URL is set (e.g. http://localhost:7071), it is always
 * used — regardless of the current hostname. This supports both standard
 * localhost dev and custom hosts-file hostnames used when testing the token
 * gate locally (since the token gate bypasses on `localhost` only).
 *
 * For deployed environments (Azure Static Web Apps), leave NEXT_PUBLIC_API_URL
 * unset and this returns an empty string; Azure SWA routes /api automatically.
 */
export function getApiBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return '';
  }

  // Always honour an explicit API URL when provided (covers localhost and
  // custom hosts-file hostnames used for local token-gate testing).
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  // Default: Azure SWA handles /api prefix automatically
  return '';
}
