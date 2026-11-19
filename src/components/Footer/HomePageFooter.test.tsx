import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

/**
 * The newsletter card sits above the footer's top line (#315), and only
 * Home's copy carries the #newsletter anchor (/contact has its own, #295).
 */
async function renderAt(path: string) {
  vi.resetModules();
  vi.doMock('next/navigation', () => ({ usePathname: () => path }));
  const { HomePageFooter } = await import('./HomePageFooter');
  return new JSDOM(`<body>${renderToStaticMarkup(<HomePageFooter />)}</body>`)
    .window.document;
}

afterEach(() => {
  vi.doUnmock('next/navigation');
  vi.resetModules();
});

describe('HomePageFooter newsletter card (#315)', () => {
  it('on Home: the #newsletter card comes before the footer, not inside it', async () => {
    const doc = await renderAt('/');
    const card = doc.getElementById('newsletter');
    const footer = doc.querySelector('footer')!;
    expect(card).not.toBeNull();
    expect(footer.querySelector('#newsletter')).toBeNull();
    expect(footer.querySelector('input[type="email"]')).toBeNull();
    expect(
      card!.compareDocumentPosition(footer) & 4 /* FOLLOWING */
    ).toBeTruthy();
  });

  it('elsewhere (e.g. /contact): the card is there, without the anchor', async () => {
    const doc = await renderAt('/contact/');
    expect(doc.getElementById('newsletter')).toBeNull();
    expect(doc.querySelector('input[type="email"]')).not.toBeNull();
  });
});
