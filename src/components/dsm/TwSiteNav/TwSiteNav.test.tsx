import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

vi.mock('next/navigation', () => ({ usePathname: () => '/about/' }));

import { TwSiteNav } from './TwSiteNav';

const links = [
  { label: 'About', href: '/about/', pinned: true },
  { label: 'The Book', href: '/resonance-core-framework/' },
  {
    label: 'Content',
    href: '/content-hub/',
    children: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Portfolio', href: '/portfolio/' },
    ],
  },
];

function render(
  cta = {
    label: 'Book a Conversation',
    href: 'https://tidycal.com/x',
    external: true,
  }
) {
  return new JSDOM(
    renderToStaticMarkup(
      <TwSiteNav
        brand='Terence Waters'
        links={links}
        cta={cta}
        activeHref={(p) => (p.startsWith('/about/') ? '/about/' : undefined)}
      />
    )
  ).window.document;
}

describe('TwSiteNav', () => {
  it('links the brand home', () => {
    const brand = Array.from(render().querySelectorAll('a')).find(
      (a) => a.textContent === 'Terence Waters'
    );
    expect(brand?.getAttribute('href')).toBe('/');
  });

  it('keeps pinned links (About) in the bar at every width, not in the menu', () => {
    const doc = render();
    const pinned = doc.querySelector('nav[aria-label="Primary (pinned)"]');
    expect(
      Array.from(pinned!.querySelectorAll('a')).map((a) => a.textContent)
    ).toEqual(['About']);
    const menu = doc.getElementById('site-mobile-menu')!;
    expect(menu.textContent).not.toContain('About');
    expect(menu.textContent).toContain('The Book');
  });

  it('marks the current page with aria-current', () => {
    const current = render().querySelectorAll('[aria-current="page"]');
    // The full desktop list and the pinned list both mark it.
    expect(current).toHaveLength(2);
    current.forEach((a) => expect(a.getAttribute('href')).toBe('/about/'));
  });

  it('always shows the main button, opening off-site targets in a new tab', () => {
    const cta = Array.from(render().querySelectorAll('a')).find(
      (a) => a.textContent === 'Book a Conversation'
    );
    expect(cta?.getAttribute('target')).toBe('_blank');
    expect(cta?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('pins a thumb-reach copy of the button outside the header for phones', () => {
    const doc = render();
    const outside = Array.from(doc.querySelectorAll('body > a')).filter(
      (a) => a.textContent === 'Book a Conversation'
    );
    // Outside <header>: its backdrop-filter would trap position: fixed.
    expect(outside).toHaveLength(1);
    // And the mobile menu lists it too, for when the pill is covered.
    expect(doc.getElementById('site-mobile-menu')?.textContent).toContain(
      'Book a Conversation'
    );
  });

  it('keeps an on-site button in the same tab', () => {
    const doc = render({
      label: 'Book a Conversation',
      href: '/contact/#conversation',
      external: false,
    });
    const cta = Array.from(doc.querySelectorAll('a')).find(
      (a) => a.textContent === 'Book a Conversation'
    );
    expect(cta?.hasAttribute('target')).toBe(false);
  });

  it('keeps the closed mobile menu out of the tab order', () => {
    const menu = render().getElementById('site-mobile-menu');
    expect(menu?.hasAttribute('inert')).toBe(true);
  });

  it('has no Newsletter button (Book a Conversation replaced it)', () => {
    expect(render().body.textContent).not.toContain('Newsletter');
  });
});

describe('TwSiteNav Content dropdown', () => {
  const doc = render();
  const primary = doc.querySelector('nav[aria-label="Primary"]')!;

  it('keeps "Content" a real link to the hub', () => {
    const content = Array.from(primary.querySelectorAll('a')).find(
      (a) => a.textContent === 'Content'
    );
    expect(content?.getAttribute('href')).toBe('/content-hub/');
  });

  it('opens the sub-pages from a separate, labelled disclosure button', () => {
    const button = primary.querySelector('button[aria-label="Content pages"]')!;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const menu = doc.getElementById(button.getAttribute('aria-controls')!)!;
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(
      Array.from(menu.querySelectorAll('a')).map(
        (a) => `${a.textContent} ${a.getAttribute('href')}`
      )
    ).toEqual(['Blog /blog/', 'Portfolio /portfolio/']);
  });

  it('puts the same sub-pages in a drawer inside the phone menu', () => {
    const mobile = doc.getElementById('site-mobile-menu')!;
    const toggle = mobile.querySelector('button[aria-label="Content pages"]')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const drawer = doc.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(drawer.hasAttribute('hidden')).toBe(true);
    expect(drawer.textContent).toBe('BlogPortfolio');
    // The Content link in the menu still goes to the hub.
    const link = Array.from(mobile.querySelectorAll('a')).find(
      (a) => a.textContent === 'Content'
    );
    expect(link?.getAttribute('href')).toBe('/content-hub/');
  });
});
