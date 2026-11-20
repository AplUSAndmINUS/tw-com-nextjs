// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

vi.mock('next/navigation', () => ({ usePathname: () => '/book/' }));

import BookPage, { metadata } from './page';
import { BookAutoOpen } from './BookAutoOpen';
import { BookingModalProvider } from '@/components/BookingFlow';
import {
  BOOK_A_CONVERSATION,
  BOOK_PAGE,
  TIDYCAL_URL,
} from '@/content/site/booking';
import { mount, type Mounted } from '@/test/formHarness';

/** /book: like fluxline.pro/book, it opens the booking dialog on load. */
describe('/book page', () => {
  const doc = new JSDOM(renderToStaticMarkup(<BookPage />)).window.document;
  const main = doc.querySelector('main#main')!;

  it('has one h1, the button that opens the dialog, and the steps', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe(
      BOOK_A_CONVERSATION.label
    );
    const button = main.querySelector<HTMLAnchorElement>('a[href="/book/"]');
    expect(button?.textContent).toContain(BOOK_A_CONVERSATION.label);
    expect(main.querySelectorAll('ol li')).toHaveLength(BOOK_PAGE.steps.length);
  });

  it('offers TidyCal without JavaScript', () => {
    expect(main.querySelector('noscript')?.innerHTML).toContain(TIDYCAL_URL);
  });

  it('is its own canonical page, and every opener links here', () => {
    expect(metadata.alternates?.canonical).toBe('/book/');
    expect(BOOK_A_CONVERSATION.href).toBe('/book/');
  });
});

describe('BookAutoOpen', () => {
  let page: Mounted;
  afterEach(() => page?.unmount());

  it('opens the dialog shortly after the page loads', async () => {
    page = mount(
      <BookingModalProvider>
        <BookAutoOpen />
      </BookingModalProvider>
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    await act(() => new Promise<void>((resolve) => setTimeout(resolve, 200)));
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  });
});
