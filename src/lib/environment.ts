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
 * For static exports the API is co-hosted with the site.
 */
export function getApiBaseUrl(): string {
  return '/api';
}
