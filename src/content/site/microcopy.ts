/**
 * Microcopy: small lines where the humor lives
 * ============================================
 *
 * CREATIVE_BRIEF.md §7.5: humor goes in small places (asides, microcopy,
 * footer), never next to heavy story beats. These are the brief's drafts,
 * registered so each one is tracked in docs/redesign/COPY_LEDGER.md until
 * Terence approves it.
 */

import { approved, draft } from './copy';

const mc = 'CREATIVE_BRIEF §7.5 (microcopy draft)';

export const MICROCOPY = {
  newsletter: approved(
    'micro.newsletter',
    'Occasional notes on resonance, systems, and the work in progress. No spam. (I dislike spam almost as much as self-help books.)',
    `${mc}; approved by Terence at Checkpoint 2a (2026-11-18)`
  ),
  formSuccess: draft(
    'micro.formSuccess',
    'Got it. I read every message myself. (Humans first, remember?)',
    mc
  ),
  talentCaption: draft(
    'micro.talentCaption',
    "Self-rated, out of 100. (I'm a data guy. I also know myself pretty well.)",
    mc
  ),
  themePanel: draft(
    'micro.themePanel',
    "Make it yours. Left-handed, colorblind, night owl, or just picky? There's a mode for that.",
    `${mc}. Not used yet: left-handed mode doesn't exist, so the line would overpromise (parked, INITIAL_PLAN §9)`
  ),
  emptyState: approved(
    'micro.emptyState',
    "Nothing here yet. I'm probably writing it right now.",
    `${mc}; approved by Terence at Checkpoint 2a (2026-11-18)`
  ),
  loading: draft('micro.loading', 'Warming up the synths…', mc),
  readEveryMessage: approved(
    'micro.readEveryMessage',
    "Tell me what you're working on. I read every message.",
    'CREATIVE_BRIEF §8.2 (KEEP)'
  ),
  copyright: approved(
    'micro.copyright',
    'Terence Waters and his awesomeness.',
    'CREATIVE_BRIEF §7.5 (approved humor)'
  ),
} as const;
