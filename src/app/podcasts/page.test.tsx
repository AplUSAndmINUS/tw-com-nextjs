import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

vi.mock('next/navigation', () => ({ usePathname: () => '/podcasts/' }));

import PodcastsPage, { metadata } from './page';
import { TRI_LINKS } from './theresonantid/constants';

const doc = new JSDOM(renderToStaticMarkup(<PodcastsPage />)).window.document;
const main = doc.querySelector('main#main')!;

describe('/podcasts directory', () => {
  it('renders on the design system: main#main and one h1', () => {
    expect(main).not.toBe(null);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe('Podcasts');
    // No legacy PageLayout: its <main> was #main-content.
    expect(doc.querySelector('#main-content')).toBe(null);
  });

  it('shows The Resonant Identity as a card with its two actions', () => {
    const card = main.querySelector('article')!;
    expect(card.querySelector('h2')?.textContent).toBe('The Resonant Identity');
    expect(card.querySelector('img')?.getAttribute('src')).toBe(
      '/images/ResonantIdentity_logo.png'
    );

    const links = Array.from(card.querySelectorAll('a'));
    const episodes = links.find((a) => a.textContent === 'View episodes')!;
    expect(episodes.getAttribute('href')).toBe('/podcasts/theresonantid/');
    expect(episodes.hasAttribute('target')).toBe(false);

    const about = links.find((a) =>
      a.textContent?.startsWith('About The Resonant Identity')
    )!;
    expect(about.getAttribute('href')).toBe(TRI_LINKS.about);
    expect(about.getAttribute('target')).toBe('_blank');
    // Our own site: keep the referrer.
    expect(about.getAttribute('rel')).toBe('noopener');
    expect(about.textContent).toContain('(opens in a new tab)');
  });

  it('has no duplicate ids and trailing slashes on internal links', () => {
    const ids = Array.from(doc.querySelectorAll('[id]')).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const hrefs = Array.from(main.querySelectorAll('a'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('/') && !h.startsWith('//'));
    for (const h of hrefs) expect(h.split('#')[0].endsWith('/'), h).toBe(true);
  });

  it('keeps the existing metadata', () => {
    expect(metadata.title).toBe('Podcasts on Identity and Transformation');
    expect(metadata.openGraph?.url).toBe('https://terencewaters.com/podcasts');
  });
});
