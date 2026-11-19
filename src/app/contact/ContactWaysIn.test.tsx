// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { BookingModalProvider } from '@/components/BookingFlow';
import { mount, type Mounted } from '@/test/formHarness';
import { ContactWaysIn } from './ContactWaysIn';

/** The /contact jump list (#295): Book a Conversation opens the dialog. */
let page: Mounted;
afterEach(() => page?.unmount());

const bookLink = () =>
  Array.from(page.container.querySelectorAll('a')).find((a) =>
    a.textContent?.includes('Book a Conversation')
  )!;
const dialog = () =>
  document.querySelector('[role="dialog"][aria-modal="true"]');

describe('ContactWaysIn', () => {
  it('opens the booking dialog inside the provider', async () => {
    page = mount(
      <BookingModalProvider>
        <ContactWaysIn />
      </BookingModalProvider>
    );
    expect(dialog()).toBeNull();
    await page.click(bookLink());
    expect(dialog()).not.toBeNull();
  });

  it('falls back to the #conversation jump without the provider', () => {
    page = mount(<ContactWaysIn />);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    bookLink().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(bookLink().getAttribute('href')).toBe('#conversation');
  });
});
