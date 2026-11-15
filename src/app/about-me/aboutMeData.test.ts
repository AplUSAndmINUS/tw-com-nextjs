import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ContentItem } from '@/content/types';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { getAllContent } from '@/lib/content';
import {
  ABOUT_ME_SOCIALS,
  PODCAST_SOCIALS,
  PROJECT_SLUGS,
  TALENT_SKILL_NAMES,
  formatPostMeta,
  pickProjects,
  pickSkills,
} from './aboutMeData';

const item = (slug: string, featured?: boolean): ContentItem => ({
  slug,
  title: slug,
  date: '',
  excerpt: '',
  tags: [],
  content: '',
  featured,
});

describe('talent bars', () => {
  it('resolves every chosen skill against ABOUT_SKILLS, in order', () => {
    const picked = pickSkills(TALENT_SKILL_NAMES);
    // A rename in aboutSkills.ts would silently drop a bar otherwise.
    expect(picked.map((s) => s.name)).toEqual([...TALENT_SKILL_NAMES]);
  });

  it('takes scores from ABOUT_SKILLS so /about and /about-me agree', () => {
    for (const skill of pickSkills(TALENT_SKILL_NAMES)) {
      const source = ABOUT_SKILLS.find((s) => s.name === skill.name);
      expect(skill.percentage).toBe(source?.percentage);
      expect(skill.percentage).toBeGreaterThanOrEqual(0);
      expect(skill.percentage).toBeLessThanOrEqual(100);
    }
  });

  it('skips names that are not in the list', () => {
    expect(pickSkills(['Not a skill', 'Design thinking'])).toEqual(
      ABOUT_SKILLS.filter((s) => s.name === 'Design thinking')
    );
  });
});

describe('pickProjects', () => {
  it('puts curated slugs first, in the order given', () => {
    const items = [item('a'), item('b'), item('c'), item('d')];
    expect(pickProjects(items, ['c', 'a'], 2).map((p) => p.slug)).toEqual([
      'c',
      'a',
    ]);
  });

  it('tops up from featured entries, then from anything, without repeats', () => {
    const items = [item('x'), item('f1', true), item('y'), item('f2', true)];
    expect(
      pickProjects(items, ['missing', 'f2'], 4).map((p) => p.slug)
    ).toEqual(['f2', 'f1', 'x', 'y']);
  });

  it('returns what exists when there are fewer items than the limit', () => {
    expect(pickProjects([item('only')], ['nope'], 3)).toHaveLength(1);
    expect(pickProjects([], ['nope'], 3)).toEqual([]);
  });

  it('finds every curated slug in the real portfolio', async () => {
    const slugs = (await getAllContent('portfolio')).map((p) => p.slug);
    for (const slug of PROJECT_SLUGS) expect(slugs).toContain(slug);
  });
});

describe('social icons', () => {
  it('only uses icons that exist in public/assets/icons', () => {
    const dir = path.join(process.cwd(), 'public', 'assets', 'icons');
    for (const social of [...ABOUT_ME_SOCIALS, ...PODCAST_SOCIALS]) {
      expect(fs.existsSync(path.join(dir, `${social.icon}.svg`))).toBe(true);
      expect(social.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});

describe('formatPostMeta', () => {
  it('joins the date and read time', () => {
    expect(formatPostMeta('2026-11-14', '6 min read')).toBe(
      '2026.11.14 · 6 min read'
    );
  });

  it.each([undefined, '', 'not a date'])(
    'drops a missing or invalid date (%s) instead of leaving a stray separator',
    (date) => {
      expect(formatPostMeta(date, '6 min read')).toBe('6 min read');
    }
  );
});
