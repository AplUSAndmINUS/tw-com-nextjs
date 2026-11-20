// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type Mounted } from '@/test/formHarness';
import { TwLinkStack } from './TwLinkStack';

/** TwLinkStack's optional per-item click handler (#295). */
let page: Mounted;
afterEach(() => page?.unmount());

describe('TwLinkStack item onClick', () => {
  it('calls the handler and opts only that link out of the route transition', async () => {
    const onClick = vi.fn((event: { preventDefault(): void }) =>
      event.preventDefault()
    );
    page = mount(
      <TwLinkStack
        label='Ways in'
        items={[
          { label: 'Book', href: '#conversation', onClick },
          { label: 'Message', href: '#message' },
        ]}
      />
    );
    const [book, message] = Array.from(page.container.querySelectorAll('a'));
    expect(book.hasAttribute('data-no-route-transition')).toBe(true);
    expect(message.hasAttribute('data-no-route-transition')).toBe(false);
    await page.click(book);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
