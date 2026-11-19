import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CANONICAL_PARAGRAPHS,
  CANONICAL_STATEMENT,
  CANONICAL_STATEMENT_TEXT,
  META_DESCRIPTION,
  ROLE_LINE,
  ROLE_LINE_PARTS,
  VALUES,
} from './identity';

const PERSONA = path.join(
  process.cwd(),
  'docs/redesign/USER_PERSONA_TERENCE.md'
);

describe('identity', () => {
  it('uses the approved role line (Decision C)', () => {
    expect(ROLE_LINE).toBe(
      'Creator · Researcher · Author · Architect of human-centered systems'
    );
    expect(ROLE_LINE_PARTS).toHaveLength(4);
  });

  it('keeps the meta description within 160 characters', () => {
    expect(META_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(META_DESCRIPTION).toMatch(/^Terence Waters/);
  });

  it('keeps the statement’s emphasis (bold-italic and italic runs)', () => {
    const strong = CANONICAL_STATEMENT.filter((s) => s.strong).map(
      (s) => s.text
    );
    expect(strong).toEqual([
      'empowering',
      'twice',
      'to act on it',
      'a self-action',
      'self no-help series',
      'begins in the body and with a human mind to think it through',
      'he can help build your idea or identity, too.',
    ]);
    const italicOnly = CANONICAL_STATEMENT.filter((s) => s.em && !s.strong).map(
      (s) => s.text
    );
    expect(italicOnly).toEqual(['you return to', 'you perform']);
  });

  it('reads as three paragraphs, each ending a sentence (owner, Checkpoint 3a)', () => {
    expect(CANONICAL_PARAGRAPHS).toHaveLength(3);
    for (const paragraph of CANONICAL_PARAGRAPHS) {
      const text = paragraph.map((s) => s.text).join('');
      expect(text).toMatch(/[.]$/);
      expect(text.startsWith(' ')).toBe(false);
    }
  });

  it('has three values, each in his words', () => {
    expect(VALUES.map((v) => v.name)).toEqual([
      'Intellectualism',
      'Futurism',
      'Integrity',
    ]);
  });
});

// "Never paraphrase" (persona §2): compare with the source document itself.
describe.skipIf(!existsSync(PERSONA))('Canonical Identity Statement', () => {
  it('matches USER_PERSONA_TERENCE.md §2 word for word', () => {
    const md = readFileSync(PERSONA, 'utf8');
    const start = md.indexOf('> Terence Waters is a creator, researcher');
    const end = md.indexOf('\n\n', start);
    const source = md
      .slice(start, end)
      .replace(/^> ?/gm, '')
      .replace(/[_*]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    expect(CANONICAL_STATEMENT_TEXT).toBe(source);
  });
});
