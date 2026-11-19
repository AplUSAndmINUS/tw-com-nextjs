// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { BookingModalProvider, BookingTrigger } from './BookingModal';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { mount, type Mounted } from '@/test/formHarness';

/** The full-screen Book a Conversation modal (#278). */
let page: Mounted;
afterEach(() => page?.unmount());

const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');
const trigger = () => page.container.querySelector<HTMLAnchorElement>('a')!;
const press = (key: string) =>
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true })
    );
  });
const nextFrame = () =>
  act(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  );

function renderWithProvider() {
  page = mount(
    <BookingModalProvider>
      <BookingTrigger />
    </BookingModalProvider>
  );
}

describe('BookingModal (#278)', () => {
  it('opens a labelled, modal dialog with the booking flow and locks the page', async () => {
    renderWithProvider();
    expect(dialog()).toBeNull();
    await page.click(trigger());
    const d = dialog()!;
    expect(d.getAttribute('aria-modal')).toBe('true');
    const title = document.getElementById(d.getAttribute('aria-labelledby')!);
    expect(title?.textContent).toBe(BOOK_A_CONVERSATION.label);
    // The stepper's first step is inside the dialog.
    expect(d.querySelectorAll('button').length).toBeGreaterThan(1);
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.documentElement.hasAttribute('data-booking-open')).toBe(
      true
    );
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close');
  });

  it('closes on Escape and gives focus back to the opener', async () => {
    renderWithProvider();
    trigger().focus();
    await page.click(trigger());
    await press('Escape');
    expect(dialog()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.documentElement.hasAttribute('data-booking-open')).toBe(
      false
    );
    await nextFrame();
    expect(document.activeElement).toBe(trigger());
  });

  it('closes with the X and with a tap outside the panel, but not inside it', async () => {
    renderWithProvider();
    await page.click(trigger());
    await page.click(
      document.querySelector<HTMLElement>('[aria-label="Close"]')!
    );
    expect(dialog()).toBeNull();

    await page.click(trigger());
    const panel = dialog()!;
    const overlay = panel.parentElement!;
    Object.defineProperty(overlay, 'clientWidth', { value: 1000 });
    // A press inside the panel never closes it.
    await act(() => {
      panel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(dialog()).not.toBeNull();
    // A tap on the dim area does.
    await act(() => {
      overlay.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientX: 10 })
      );
      overlay.dispatchEvent(
        new MouseEvent('click', { bubbles: true, clientX: 10 })
      );
    });
    expect(dialog()).toBeNull();
  });

  it("does not close on a press on the overlay's scrollbar (keeps a filled-in form)", async () => {
    renderWithProvider();
    await page.click(trigger());
    const overlay = dialog()!.parentElement!;
    Object.defineProperty(overlay, 'clientWidth', { value: 1000 });
    await act(() => {
      overlay.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientX: 1005 })
      );
      overlay.dispatchEvent(
        new MouseEvent('click', { bubbles: true, clientX: 1005 })
      );
    });
    expect(dialog()).not.toBeNull();
  });

  it('keeps Tab inside the dialog', async () => {
    renderWithProvider();
    await page.click(trigger());
    const items = Array.from(
      dialog()!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    const last = items[items.length - 1];
    last.focus();
    await act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
      );
    });
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close');
    await act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        })
      );
    });
    expect(document.activeElement).toBe(last);
  });

  it('closes when a link inside the flow is followed', async () => {
    renderWithProvider();
    await page.click(trigger());
    const link = document.createElement('a');
    link.href = '/#contact';
    link.addEventListener('click', (e) => e.preventDefault());
    dialog()!.querySelector('div:last-child')!.appendChild(link);
    await act(() => {
      link.click();
    });
    expect(dialog()).toBeNull();
  });

  it('stays open for links that open a new tab (TidyCal, Privacy Policy)', async () => {
    renderWithProvider();
    await page.click(trigger());
    const link = document.createElement('a');
    link.href = 'https://tidycal.com/terencewaters';
    link.target = '_blank';
    link.addEventListener('click', (e) => e.preventDefault());
    dialog()!.querySelector('div:last-child')!.appendChild(link);
    await act(() => {
      link.click();
    });
    expect(dialog()).not.toBeNull();
  });

  it('opts the trigger out of the page transition (no navigation as it opens)', () => {
    renderWithProvider();
    expect(trigger().hasAttribute('data-no-route-transition')).toBe(true);
  });

  it('is a plain link outside the provider (no JavaScript fallback)', async () => {
    page = mount(<BookingTrigger />);
    const link = trigger();
    expect(link.getAttribute('href')).toBe(BOOK_A_CONVERSATION.href);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    await act(() => {
      link.dispatchEvent(click);
    });
    expect(click.defaultPrevented).toBe(false);
    expect(dialog()).toBeNull();
  });
});
