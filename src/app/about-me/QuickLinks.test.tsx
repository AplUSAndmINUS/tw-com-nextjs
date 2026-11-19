// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { BookingModalProvider } from '@/components/BookingFlow';
import { mount, type Mounted } from '@/test/formHarness';
import { QuickLinks, type QuickLink } from './QuickLinks';
import styles from './QuickLinks.module.scss';

/** /about-me quick links (#288). */
let page: Mounted;
afterEach(() => page?.unmount());

const ITEMS: QuickLink[] = [
  {
    label: 'Pre-order my book!',
    href: 'https://store.example/book',
    icon: 'book',
    external: true,
    highlight: true,
  },
  {
    label: 'Book a Conversation',
    href: '/#contact',
    icon: 'calendar',
    booking: true,
  },
  { label: 'Read my full story', href: '/about/', icon: 'person' },
];

const link = (label: string) =>
  Array.from(page.container.querySelectorAll('a')).find(
    (a) => a.textContent?.trim() === label
  )!;

describe('QuickLinks', () => {
  it('renders a labelled nav of cards, with only the highlight card gold', () => {
    page = mount(<QuickLinks label='Start here' items={ITEMS} />);
    expect(
      page.container.querySelector('nav')?.getAttribute('aria-label')
    ).toBe('Start here');
    expect(
      Array.from(page.container.querySelectorAll('a'))
        .filter((a) => a.classList.contains(styles.highlight))
        .map((a) => a.textContent?.trim())
    ).toEqual(['Pre-order my book!']);
    expect(link('Pre-order my book!').getAttribute('target')).toBe('_blank');
  });

  it('opens the booking dialog from Book a Conversation instead of navigating', async () => {
    page = mount(
      <BookingModalProvider>
        <QuickLinks label='Start here' items={ITEMS} />
      </BookingModalProvider>
    );
    expect(
      document.querySelector('[role="dialog"][aria-modal="true"]')
    ).toBeNull();
    await page.click(link('Book a Conversation'));
    expect(
      document.querySelector('[role="dialog"][aria-modal="true"]')
    ).not.toBeNull();
    expect(window.location.hash).toBe('');
  });
});
