// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, useState } from 'react';
import {
  BOOKING_EXIT_MS,
  BookingModalProvider,
  BookingTrigger,
  useBookingModal,
} from './BookingModal';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { mount, type Mounted } from '@/test/formHarness';

const motion = vi.hoisted(() => ({ reduce: false }));
const nav = vi.hoisted(() => ({ path: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.path }));
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: motion.reduce }),
}));

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
/** Let the closing fade finish (the dialog unmounts after it). */
const closed = () =>
  act(
    () =>
      new Promise<void>((resolve) => setTimeout(resolve, BOOKING_EXIT_MS + 20))
  );
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
    await closed();
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
    await closed();
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
    await closed();
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
    await closed();
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

  it('brings Tab back inside when focus has left the panel (#303)', async () => {
    renderWithProvider();
    await page.click(trigger());
    (document.activeElement as HTMLElement).blur();
    expect(document.activeElement).toBe(document.body);
    await act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
      );
    });
    expect(dialog()!.contains(document.activeElement)).toBe(true);
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close');
  });

  it('Shift+Tab from outside the panel goes to its last item (#303)', async () => {
    renderWithProvider();
    await page.click(trigger());
    const items = Array.from(
      dialog()!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    (document.activeElement as HTMLElement).blur();
    await act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        })
      );
    });
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('closes at once with reduced motion (no fade)', async () => {
    motion.reduce = true;
    try {
      renderWithProvider();
      await page.click(trigger());
      await press('Escape');
      expect(dialog()).toBeNull();
    } finally {
      motion.reduce = false;
    }
  });

  it('stays open when reopened during the fade-out', async () => {
    function Reopen() {
      const modal = useBookingModal();
      return <button type='button' id='reopen' onClick={() => modal?.open()} />;
    }
    page = mount(
      <BookingModalProvider>
        <BookingTrigger />
        <Reopen />
      </BookingModalProvider>
    );
    await page.click(trigger());
    await press('Escape');
    expect(dialog()!.parentElement!.getAttribute('data-closing')).toBe('true');
    await page.click('#reopen');
    await closed();
    expect(dialog()).not.toBeNull();
    expect(dialog()!.parentElement!.hasAttribute('data-closing')).toBe(false);
  });

  it('a second Escape during the fade changes nothing', async () => {
    renderWithProvider();
    await page.click(trigger());
    await press('Escape');
    await press('Escape');
    expect(dialog()).not.toBeNull();
    await closed();
    expect(dialog()).toBeNull();
  });

  it('fades out before it unmounts', async () => {
    renderWithProvider();
    await page.click(trigger());
    await press('Escape');
    // Still there, marked as closing, while the fade runs.
    expect(dialog()).not.toBeNull();
    expect(dialog()!.parentElement!.getAttribute('data-closing')).toBe('true');
    // The page behind stays locked until the dialog is gone.
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.documentElement.hasAttribute('data-booking-open')).toBe(
      true
    );
    await closed();
    expect(dialog()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('a page change during the fade closes it at once', async () => {
    function Harness() {
      const [, setTick] = useState(0);
      return (
        <BookingModalProvider>
          <BookingTrigger />
          <button
            type='button'
            id='rerender'
            onClick={() => setTick((t) => t + 1)}
          />
        </BookingModalProvider>
      );
    }
    try {
      page = mount(<Harness />);
      await page.click(trigger());
      await press('Escape');
      expect(dialog()).not.toBeNull();
      nav.path = '/about/';
      await page.click('#rerender');
      expect(dialog()).toBeNull();
    } finally {
      nav.path = '/';
    }
  });

  it('with no opener (e.g. /book), focus lands on <main> after closing', async () => {
    function AutoOpen() {
      const modal = useBookingModal();
      return <button type='button' id='auto' onClick={() => modal?.open()} />;
    }
    page = mount(
      <BookingModalProvider>
        <main>
          <AutoOpen />
        </main>
      </BookingModalProvider>
    );
    // Open without focusing anything first (as a page load would).
    (document.activeElement as HTMLElement | null)?.blur();
    await act(async () => {
      document
        .getElementById('auto')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await press('Escape');
    await closed();
    await nextFrame();
    expect(document.activeElement?.tagName).toBe('MAIN');
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
