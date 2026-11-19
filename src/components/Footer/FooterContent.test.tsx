import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { FooterContent } from './FooterContent';
import { RCF_PREORDERS_OPEN } from '@/lib/rcf';
import styles from './FooterContent.module.scss';

function renderFooter() {
  return new JSDOM(renderToStaticMarkup(<FooterContent />)).window.document;
}

/** The link section whose heading reads `title`. */
function sectionTitled(document: Document, title: string) {
  const heading = Array.from(document.querySelectorAll('h5')).find(
    (h) => h.textContent?.trim() === title
  );
  return heading?.closest(`.${styles.linkSection}`) ?? null;
}

describe('Footer "More from Terence Waters"', () => {
  const ecosystem = () =>
    renderFooter().querySelector('nav[aria-label="More from Terence Waters"]');

  it('uses the short link names', () => {
    const links = Array.from(ecosystem()?.querySelectorAll('a') ?? []);
    expect(
      links.map((a) => [
        a.textContent?.replace(' (opens in a new tab)', '').trim(),
        a.getAttribute('href'),
      ])
    ).toEqual([
      ['The Resonant Identity', 'https://theresonantidentity.com/start-here'],
      // The store link shows only once pre-orders are announced (#273).
      ...(RCF_PREORDERS_OPEN
        ? [['Pre-order the Book', 'https://store.fluxline.pro/book']]
        : []),
      ['Fluxline Resonance Group', 'https://www.fluxline.pro'],
    ]);
  });

  it('keeps rel="me" on the owned sites (identity links for search)', () => {
    const rel = (label: string) =>
      Array.from(ecosystem()?.querySelectorAll('a') ?? [])
        .find(
          (a) =>
            a.textContent?.replace(' (opens in a new tab)', '').trim() === label
        )
        ?.getAttribute('rel');
    expect(rel('The Resonant Identity')).toBe('me');
    expect(rel('Fluxline Resonance Group')).toBe('me');
    // The store opens in a new tab (owner, 2026-11-19): noopener, and the
    // referrer kept so the store sees where visitors came from.
    if (RCF_PREORDERS_OPEN) expect(rel('Pre-order the Book')).toBe('noopener');
  });

  it('styles the links like the other footer links (ThemedLink, Merriweather)', () => {
    const document = renderFooter();
    const listLink = document.querySelector('ul a');
    for (const link of Array.from(ecosystem()?.querySelectorAll('a') ?? [])) {
      // Regression: these were bare <a> tags with no font, which fell back
      // to the system sans-serif.
      expect(link.classList.contains('footer-link')).toBe(true);
      expect(link.getAttribute('style')).toMatch(
        /font-family:\s*merriweather/i
      );
      expect(link.getAttribute('style')).toBe(listLink?.getAttribute('style'));
    }
  });
});

describe('Footer link sections on mobile', () => {
  it('hides Work on phones, as Content already is', () => {
    const document = renderFooter();
    expect(
      sectionTitled(document, 'Work')?.classList.contains(styles.mdOnly)
    ).toBe(true);
    expect(
      sectionTitled(document, 'Content')?.classList.contains(styles.mdOnly)
    ).toBe(true);
  });

  it('keeps Social visible on phones', () => {
    const social = sectionTitled(renderFooter(), 'Social');
    expect(social).not.toBe(null);
    expect(social?.classList.contains(styles.mdOnly)).toBe(false);
  });
});

describe('Footer newsletter and links (#285)', () => {
  it('leads with a labelled newsletter block, the /#newsletter target', () => {
    const block = renderFooter().getElementById('newsletter');
    expect(block?.tagName).toBe('SECTION');
    expect(block?.querySelector('h2')?.textContent).toBe(
      'Get new writing in your inbox'
    );
    expect(
      block?.querySelector('input[type="email"]')?.getAttribute('aria-label')
    ).toBe('Newsletter email address');
    expect(block?.querySelector('button[type="submit"]')?.textContent).toBe(
      'Subscribe'
    );
  });

  it('no longer links to Case Studies', () => {
    const labels = Array.from(renderFooter().querySelectorAll('a')).map((a) =>
      a.textContent?.replace(' (opens in a new tab)', '').trim()
    );
    expect(labels).not.toContain('Case Studies');
  });
});

describe('Footer #newsletter anchor (#295)', () => {
  afterEach(() => {
    vi.doUnmock('next/navigation');
    vi.resetModules();
  });

  it('is only on Home; other pages (and /contact) have their own or none', async () => {
    vi.resetModules();
    vi.doMock('next/navigation', () => ({ usePathname: () => '/blog/' }));
    const { FooterContent: OffHome } = await import('./FooterContent');
    const doc = new JSDOM(renderToStaticMarkup(<OffHome />)).window.document;
    expect(doc.getElementById('newsletter')).toBeNull();
    // The block itself is still there, just without the anchor.
    expect(doc.querySelector('input[type="email"]')).not.toBeNull();
  });
});
