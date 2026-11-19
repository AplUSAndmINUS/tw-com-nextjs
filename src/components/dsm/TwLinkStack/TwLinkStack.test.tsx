import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwLinkStack } from './TwLinkStack';
import styles from './TwLinkStack.module.scss';

const doc = new JSDOM(
  renderToStaticMarkup(
    <TwLinkStack
      label='Start here'
      items={[
        {
          label: 'Pre-order the book',
          href: 'https://store.example/book',
          tone: 'gold',
          external: true,
        },
        {
          label: 'Book a Conversation',
          href: '/contact/#conversation',
          tone: 'primary',
        },
        {
          label: 'Listen',
          href: '/podcasts/',
          description: 'The Resonant Identity',
        },
      ]}
    />
  )
).window.document;

describe('TwLinkStack', () => {
  it('is a labelled nav with one link per row, in the given order', () => {
    expect(doc.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Start here'
    );
    const labels = Array.from(doc.querySelectorAll('li a')).map(
      (a) => a.querySelector('span span')?.textContent
    );
    expect(labels).toEqual([
      'Pre-order the book',
      'Book a Conversation',
      'Listen',
    ]);
  });

  it('keeps gold for the pre-order link only', () => {
    const gold = doc.querySelectorAll(`a.${styles.gold}`);
    expect(gold).toHaveLength(1);
    expect(gold[0].textContent).toContain('Pre-order the book');
  });

  it('opens external links safely and says so to screen readers', () => {
    const ext = doc.querySelector('a[target="_blank"]')!;
    expect(ext.getAttribute('rel')).toBe('noopener noreferrer');
    expect(ext.textContent).toContain('(opens in a new tab)');
    const internal = doc.querySelector('a[href="/podcasts/"]')!;
    expect(internal.hasAttribute('target')).toBe(false);
  });
});

describe('TwLinkStack columns', () => {
  it('adds the two-column layout only when asked', () => {
    const two = new JSDOM(
      renderToStaticMarkup(
        <TwLinkStack
          label='x'
          columns={2}
          items={[{ label: 'a', href: '/a/' }]}
        />
      )
    ).window.document.querySelector('ul')!;
    expect(two.classList.contains(styles.stackTwo)).toBe(true);
    const one = new JSDOM(
      renderToStaticMarkup(
        <TwLinkStack label='x' items={[{ label: 'a', href: '/a/' }]} />
      )
    ).window.document.querySelector('ul')!;
    expect(one.classList.contains(styles.stackTwo)).toBe(false);
  });
});
