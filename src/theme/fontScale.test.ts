import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEPS,
  clampFontScale,
} from './fontScale';
import { buildThemeScript } from './themeScript';
import { rootFontSizeFor } from './providers/FontScaleProvider';
import { defaultUserPreferences } from '@/store/userPreferencesStore';

describe('text size (up to 150%, owner, Checkpoint 4)', () => {
  it('offers 100% to 150% in three steps', () => {
    expect(FONT_SCALE_STEPS).toEqual([1, 1.25, 1.5]);
    expect(FONT_SCALE_MAX).toBe(1.5);
    expect(defaultUserPreferences.maxFontScale).toBe(1.5);
  });

  it('clamps out-of-range and invalid values', () => {
    expect(clampFontScale(3)).toBe(FONT_SCALE_MAX);
    expect(clampFontScale(0.2)).toBe(FONT_SCALE_MIN);
    expect(clampFontScale(Number.NaN)).toBe(1);
    expect(clampFontScale('2')).toBe(1);
    expect(clampFontScale(1.5)).toBe(1.5);
  });

  it('maps a scale to a root font size in px', () => {
    expect(rootFontSizeFor(1)).toBe(16);
    expect(rootFontSizeFor(1.5)).toBe(24);
    expect(rootFontSizeFor(2)).toBe(24);
    expect(rootFontSizeFor(9)).toBe(24);
  });
});

/** Run the pre-paint theme script in a fresh document at `url`. */
function runThemeScript(url: string, stored?: object) {
  const dom = new JSDOM(
    '<!doctype html><html><head></head><body></body></html>',
    {
      url,
      runScripts: 'outside-only',
    }
  );
  if (stored) {
    dom.window.localStorage.setItem(
      'tw-user-preferences',
      JSON.stringify({ state: { preferences: stored }, version: 0 })
    );
  }
  dom.window.eval(buildThemeScript());
  return dom.window.document.documentElement;
}

describe('pre-paint theme script', () => {
  it('no longer forces dark mode on the homepage', () => {
    const html = runThemeScript('https://terencewaters.com/', {
      themeMode: 'light',
    });
    expect(html.getAttribute('data-theme')).toBe('light');
  });

  it('applies a stored text size before first paint', () => {
    const html = runThemeScript('https://terencewaters.com/about/', {
      fontScale: 1.5,
    });
    expect(html.style.fontSize).toBe('24px');
  });

  it('clamps a tampered text size and leaves 100% alone', () => {
    expect(
      runThemeScript('https://x.test/', { fontScale: 50 }).style.fontSize
    ).toBe('24px');
    // A 200% left over from a preview build is brought down to 150%.
    expect(
      runThemeScript('https://x.test/', { fontScale: 2 }).style.fontSize
    ).toBe('24px');
    expect(
      runThemeScript('https://x.test/', { fontScale: 1 }).style.fontSize
    ).toBe('');
    expect(runThemeScript('https://x.test/').getAttribute('data-theme')).toBe(
      'dark'
    );
  });
});
