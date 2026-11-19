import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwAppearancePanel } from './TwAppearancePanel';

describe('TwAppearancePanel (closed)', () => {
  it('marks the panel inert so its controls leave the tab order', () => {
    const { document } = new JSDOM(renderToStaticMarkup(<TwAppearancePanel />))
      .window;
    const panel = document.querySelector(
      '[aria-label="Display and appearance"]'
    );
    expect(panel).not.toBe(null);
    // Regression: `inert: ''` used to be passed. React 19 reads '' as false,
    // so the attribute was dropped (and the browser logged a warning on
    // hydration; the server renderer doesn't, so this checks the markup).
    expect(panel?.hasAttribute('inert')).toBe(true);
    expect(panel?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('TwAppearancePanel text size', () => {
  const { document } = new JSDOM(renderToStaticMarkup(<TwAppearancePanel />))
    .window;

  it('offers 100% to 150% as a labelled group of toggle buttons', () => {
    const group = Array.from(document.querySelectorAll('[role="group"]')).find(
      (g) => g.getAttribute('aria-labelledby')?.endsWith('-size')
    );
    expect(group).toBeTruthy();
    const label = document.getElementById(
      group!.getAttribute('aria-labelledby')!
    );
    expect(label?.textContent?.trim()).toBe('Text size');
    const buttons = Array.from(group!.querySelectorAll('button'));
    expect(buttons.map((b) => b.textContent)).toEqual(['100%', '125%', '150%']);
  });

  it('marks 100% as the current size by default', () => {
    const pressed = Array.from(
      document.querySelectorAll('button[aria-pressed="true"]')
    ).map((b) => b.textContent);
    expect(pressed).toContain('100%');
  });
});
