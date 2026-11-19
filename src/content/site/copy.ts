/**
 * Copy registry
 * =============
 *
 * Every user-facing string on Home, /about, /about-me and /contact is defined
 * through one of the helpers below, so its approval status travels with it:
 *
 *   approved  Terence's own words, or confirmed by him (✅ in the redesign
 *             briefs). Use as written.
 *   existing  Already live on the site before the redesign and kept on
 *             purpose (e.g. CREATIVE_BRIEF.md §8.2 "KEEP" lines).
 *   draft     Researcher or AI wording built from his words (🟡). It may ship,
 *             but Terence must approve it. Every draft is listed in
 *             docs/redesign/COPY_LEDGER.md; copy.test.ts fails if one is not.
 *
 * The helpers return the plain string, so components just render text. The
 * registry is only read by tests and the ledger generator.
 *
 * `[TW: …]` items (things only Terence can supply) are never given stand-in
 * text. They are simply absent, and the section that needs them renders
 * nothing.
 */

export type CopyStatus = 'approved' | 'existing' | 'draft';

export interface CopyLine {
  /** Stable id, dot-separated by page and section: `home.hook.title`. */
  id: string;
  text: string;
  status: CopyStatus;
  /** Where the words come from (brief section, file, or "owner, 2026-11-18"). */
  source: string;
}

const registry = new Map<string, CopyLine>();

function register(
  status: CopyStatus,
  id: string,
  text: string,
  source: string
): string {
  const existing = registry.get(id);
  if (existing && existing.text !== text) {
    throw new Error(`Copy id "${id}" registered twice with different text.`);
  }
  registry.set(id, { id, text, status, source });
  return text;
}

/** ✅ Approved by Terence. */
export const approved = (id: string, text: string, source: string): string =>
  register('approved', id, text, source);

/** Live on the site before the redesign, kept on purpose. */
export const existing = (id: string, text: string, source: string): string =>
  register('existing', id, text, source);

/** 🟡 Draft. Ships only with a COPY_LEDGER.md entry, pending approval. */
export const draft = (id: string, text: string, source: string): string =>
  register('draft', id, text, source);

/** Every registered line, sorted by id. For tests and the ledger. */
export function allCopy(): CopyLine[] {
  return [...registry.values()].sort((a, b) => a.id.localeCompare(b.id));
}
