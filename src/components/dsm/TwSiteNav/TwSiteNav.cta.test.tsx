// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { mount, type Mounted } from '@/test/formHarness';

vi.mock('next/navigation', () => ({ usePathname: () => '/about/' }));

import { TwSiteNav } from './TwSiteNav';

/** The nav's "Book a Conversation" opening an in-page dialog (#281). */
let page: Mounted;
afterEach(() => page?.unmount());

function renderNav(onClick: (event: { preventDefault(): void }) => void) {
  page = mount(
    <TwSiteNav
      brand='Terence Waters'
      links={[{ label: 'About', href: '/about/', pinned: true }]}
      cta={{
        label: 'Book a Conversation',
        href: '/#contact',
        onClick: (event) => {
          event.preventDefault();
          onClick(event);
        },
      }}
    />
  );
}

const ctas = () =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>('a')).filter((a) =>
    a.textContent?.includes('Book a Conversation')
  );

describe('TwSiteNav CTA with onClick (#281)', () => {
  it('opts every copy (bar, menu, phone pill) out of the route transition', () => {
    renderNav(() => {});
    expect(ctas()).toHaveLength(3);
    for (const a of ctas()) {
      expect(a.hasAttribute('data-no-route-transition')).toBe(true);
    }
  });

  it('calls onClick from each copy and keeps the page where it is', async () => {
    const opened = vi.fn();
    renderNav(opened);
    for (const a of ctas()) await page.click(a);
    expect(opened).toHaveBeenCalledTimes(3);
    expect(window.location.hash).toBe('');
  });

  it('closes the phone menu and moves focus to the burger before opening', async () => {
    let focusedWhenOpened: Element | null = null;
    renderNav(() => {
      focusedWhenOpened = document.activeElement;
    });
    const burger = document.querySelector<HTMLButtonElement>(
      'button[aria-controls="site-mobile-menu"]'
    )!;
    await page.click(burger);
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    const menuCta = document.querySelector<HTMLAnchorElement>(
      '#site-mobile-menu a[data-no-route-transition]'
    )!;
    await page.click(menuCta);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(focusedWhenOpened).toBe(burger);
  });

  it('returns focus to the burger when Escape closes the menu', async () => {
    renderNav(() => {});
    const burger = document.querySelector<HTMLButtonElement>(
      'button[aria-controls="site-mobile-menu"]'
    )!;
    await page.click(burger);
    (
      document.querySelector('#site-mobile-menu a') as HTMLAnchorElement
    ).focus();
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(burger);
  });
});
