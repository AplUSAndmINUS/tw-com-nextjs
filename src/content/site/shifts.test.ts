import { describe, expect, it } from 'vitest';
import { ALL_ROLES, SHIFTS } from './shifts';

const allText = SHIFTS.flatMap((s) => [
  s.title,
  s.short,
  ...s.story,
  s.quote ?? '',
]);

describe('the Shifts', () => {
  it('runs exit → dark middle → build → refusal → launch', () => {
    expect(SHIFTS.map((s) => s.id)).toEqual([
      'shift-exit',
      'shift-middle',
      'shift-build',
      'shift-refusal',
      'shift-launch',
    ]);
  });

  it('adds roles without replacing any, ending with Author', () => {
    expect(new Set(ALL_ROLES).size).toBe(ALL_ROLES.length);
    expect(ALL_ROLES.at(-1)).toBe('Author');
    SHIFTS.forEach((s) => expect(s.roles.length).toBeGreaterThan(0));
  });

  // Story boundaries (CREATIVE_BRIEF §11): health gets one approved phrase,
  // no more detail, ever.
  it('mentions health only in the approved wording', () => {
    const healthLines = allText.filter((t) =>
      /health|illness|hospital|diagnos/i.test(t)
    );
    expect(healthLines).toEqual([
      'I dealt with significant health issues that nearly cost me my life.',
    ]);
  });

  it('never names the hometown: only "a small town" (of 4,000 people)', () => {
    const townLines = allText.filter((t) => /town/i.test(t));
    expect(townLines.length).toBeGreaterThan(0);
    for (const line of townLines) {
      expect(line).toMatch(/small town(,| of 4,000 people)/i);
    }
  });

  it('keeps the career exit to the approved wording (no pay, roles or names)', () => {
    expect(allText.join(' ')).not.toMatch(
      /salary|laid off|fired|Intermountain|manager/i
    );
  });
});
