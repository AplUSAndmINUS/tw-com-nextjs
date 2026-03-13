'use client';

import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'tw_newsletter_submissions';
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

function getActiveTimestamps(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const all: unknown[] = Array.isArray(parsed?.timestamps)
      ? parsed.timestamps
      : [];
    const now = Date.now();
    return (all as number[]).filter(
      (t) => typeof t === 'number' && now - t < WINDOW_MS
    );
  } catch {
    return [];
  }
}

export interface NewsletterRateLimitResult {
  /** Whether another submission is allowed right now */
  canSubmit: boolean;
  /** Number of submissions left in the current window (0–3) */
  attemptsLeft: number;
  /** Milliseconds until the oldest submission expires (0 when not limited) */
  msUntilReset: number;
  /** Human-readable time remaining, e.g. "45 minutes" or "less than a minute" */
  timeUntilReset: string;
  /** Record a new submission attempt — call this just before making the API request */
  recordSubmit: () => void;
}

/**
 * Brute-force prevention hook for newsletter forms.
 *
 * Tracks submission timestamps in localStorage and blocks further submissions
 * once MAX_ATTEMPTS (3) have been made within a rolling WINDOW_MS (1 hour) window.
 * The limit is shared across all newsletter forms (subscribe + unsubscribe).
 */
export function useNewsletterRateLimit(): NewsletterRateLimitResult {
  // `tick` is incremented by recordSubmit so useMemo re-reads localStorage.
  const [tick, setTick] = useState(0);

  const active = useMemo(() => getActiveTimestamps(), [tick]);

  const canSubmit = active.length < MAX_ATTEMPTS;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - active.length);

  const msUntilReset =
    active.length >= MAX_ATTEMPTS
      ? Math.max(0, WINDOW_MS - (Date.now() - active[0]))
      : 0;

  const minutes = Math.ceil(msUntilReset / 60000);
  const timeUntilReset =
    msUntilReset === 0
      ? ''
      : minutes <= 1
        ? 'less than a minute'
        : `${minutes} minutes`;

  const recordSubmit = useCallback(() => {
    const now = Date.now();
    const current = getActiveTimestamps();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timestamps: [...current, now] })
      );
    } catch {
      // localStorage unavailable — degrade gracefully
    }
    setTick((t) => t + 1);
  }, []);

  return {
    canSubmit,
    attemptsLeft,
    recordSubmit,
    msUntilReset,
    timeUntilReset,
  };
}
