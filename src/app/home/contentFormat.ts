/**
 * Small presentation helpers shared by the design-system content pages.
 */

/** Words an average reader gets through per minute. */
const WORDS_PER_MINUTE = 220;

/** "6 min read" from a markdown body. Minimum one minute. */
export function readTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/**
 * Format a podcast duration for display. Spreaker's itunes:duration comes
 * through as either a raw seconds count ("4754") or an "h:mm:ss" string; this
 * normalises both to "1h 19m" / "48 min".
 */
export function formatDuration(raw?: string): string {
  if (!raw) return '';
  let seconds: number;
  if (/^\d+$/.test(raw.trim())) {
    seconds = Number(raw.trim());
  } else {
    // h:mm:ss or mm:ss
    const parts = raw.split(':').map((p) => Number(p));
    if (parts.some((n) => Number.isNaN(n))) return raw;
    seconds = parts.reduce((acc, n) => acc * 60 + n, 0);
  }
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Format an ISO date as the design system's dotted form (2026.02.15). Returns
 * an empty string for missing/invalid dates rather than "Invalid Date".
 */
export function formatDotDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
