import { FORM_ERRORS } from '@/content/site/contact';

/**
 * What a form shows when /api/contact or /api/subscribe says no
 * (redesign Slice 6). The API's own message is used where it reads well;
 * a rate limit (429) gets a friendlier line than "Too Many Requests".
 */
export async function apiErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  if (response.status === 429) return FORM_ERRORS.rateLimited;
  const data = await response.json().catch(() => ({}));
  return typeof data?.error === 'string' && data.error ? data.error : fallback;
}

/**
 * fetch() rejects with a TypeError only when the request never got an
 * answer (offline, DNS, CORS). Show a human line instead of "Failed to fetch".
 */
export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

export const NETWORK_ERROR_MESSAGE = FORM_ERRORS.network;
