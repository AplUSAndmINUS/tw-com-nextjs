import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('links to the page’s <main id="main">', () => {
    const a = new JSDOM(
      renderToStaticMarkup(<SkipLink />)
    ).window.document.querySelector('a');
    expect(a?.getAttribute('href')).toBe('#main');
    expect(a?.textContent).toBe('Skip to content');
  });
});
