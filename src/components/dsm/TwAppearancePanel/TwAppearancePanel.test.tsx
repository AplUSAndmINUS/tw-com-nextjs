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
