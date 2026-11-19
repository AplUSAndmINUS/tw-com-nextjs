import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import heroStyles from '@/components/dsm/TwHero/TwHero.module.scss';
import styles from './HomePageClient.module.scss';
import HomePageClient, { type HomeCard } from './HomePageClient';
import { RCF_PREORDER_HREF } from '@/lib/rcf';

const card = (n: number, image?: string): HomeCard => ({
  slug: `item-${n}`,
  title: `Item ${n}`,
  excerpt: `Excerpt ${n}`,
  category: 'Writing',
  date: '2026-11-01',
  href: `/blog/item-${n}`,
  image,
});

function render(content: HomeCard[] = []) {
  const markup = renderToStaticMarkup(<HomePageClient content={content} />);
  return new JSDOM(markup).window.document;
}

const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim();

describe('Home page (#285)', () => {
  it('has the sections in the owner’s order', () => {
    const ids = Array.from(
      render().querySelectorAll('main > section[id], main > [id]')
    ).map((el) => el.id);
    expect(ids).toEqual([
      'hero',
      'book',
      'shifts',
      'humans-first',
      'values',
      'work',
      'content',
      'contact',
    ]);
  });

  it('pins the hero photo and scrolls the card over it, as on /about-me', () => {
    const hero = render().querySelector(`#hero.${heroStyles.hero}`);
    expect(hero?.classList.contains(heroStyles.scrollReveal)).toBe(true);
  });

  it('gives the hero card the pre-order and full-story buttons', () => {
    const links = Array.from(render().querySelectorAll('#hero a'));
    const preorder = links.find((a) => text(a) === 'Pre-order the book');
    expect(preorder?.getAttribute('href')).toBe(RCF_PREORDER_HREF);
    expect(
      links.find((a) => text(a) === 'Read my full story')?.getAttribute('href')
    ).toBe('/about/');
  });

  it('opens the book section with the owner’s eyebrow, subtitle and paragraph', () => {
    const book = render().querySelector('#book');
    // The region is named by its heading, not the whole block.
    const label = book?.ownerDocument.getElementById(
      book.getAttribute('aria-labelledby')!
    );
    expect(label?.tagName).toBe('H2');
    expect(text(book)).toContain('MY RCF BOOK');
    expect(text(book)).toContain('“Because I hate self-help books.”');
    expect(text(book)).toContain(
      "That's why I wrote The Resonance Core Framework™ to be a “self-action” book, not a “self no-help” one."
    );
    // The pre-order card is always shown.
    expect(text(book)).toContain('Now open for pre-order');
  });

  it('puts the old About paragraphs and the new blockquote before the timeline', () => {
    const shifts = render().querySelector('#shifts')!;
    expect(text(shifts.querySelector('blockquote'))).toBe(
      'Structure. Clarity. A way to understand who I was becoming and why.'
    );
    expect(text(shifts)).toContain('a coach by necessity');
    const quote = shifts.querySelector('blockquote')!;
    const track = shifts.querySelector('ol')!;
    expect(
      quote.compareDocumentPosition(track) & 4 // DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('colours each credo period and animates the band', () => {
    const credo = render().querySelector('#humans-first')!;
    expect(credo.querySelectorAll(`.${styles.period}`)).toHaveLength(2);
    expect(text(credo.querySelector('p'))).toBe(
      'Humans FIRST. AI and Systems SECOND.'
    );
    // The decorative light traces (TwCredo `animated`).
    expect(credo.querySelector('[aria-hidden="true"] span')).not.toBeNull();
  });

  it('gives the Human Element paragraph a heading', () => {
    const values = render().querySelector('#values')!;
    expect(text(values.querySelector('h2'))).toBe('What I stand for');
    expect(text(values)).toContain('It all starts with The Human Element:');
  });

  it('shows three Content Hub cards at most, with previews, and the hub CTA', () => {
    const doc = render([card(1, '/a.jpg'), card(2), card(3), card(4)]);
    const hub = doc.querySelector('#content')!;
    // Exactly three cards: one link each to /blog/item-1..3.
    expect(
      new Set(
        Array.from(hub.querySelectorAll('a[href^="/blog/"]')).map((a) =>
          a.getAttribute('href')
        )
      ).size
    ).toBe(3);
    expect(text(hub)).not.toContain('Item 4');
    expect(hub.querySelector('img[src="/a.jpg"]')).not.toBeNull();
    expect(
      Array.from(hub.querySelectorAll('a'))
        .find((a) => text(a)?.startsWith("See what I've been building"))
        ?.getAttribute('href')
    ).toBe('/content-hub/');
  });

  it("swaps the newsletter band for Let's talk, with booking in the dialog", () => {
    const doc = render();
    const talk = doc.querySelector('#contact')!;
    expect(text(talk.querySelector('h2'))).toBe("Let's talk");
    const book = Array.from(talk.querySelectorAll('a')).find(
      (a) => text(a) === 'Book a Conversation'
    );
    expect(book?.hasAttribute('data-no-route-transition')).toBe(true);
    // The big newsletter band is gone from the page (the footer has it).
    expect(text(doc.querySelector('main'))).not.toContain(
      'Get new writing in your inbox'
    );
    // Every booking opener on the page goes through the dialog.
    expect(doc.querySelector('a[href*="tidycal.com"]')).toBeNull();
  });

  it('drops the About, Portfolio and "What I\'m building" sections', () => {
    const doc = render();
    expect(doc.getElementById('about')).toBeNull();
    expect(doc.getElementById('portfolio')).toBeNull();
    expect(text(doc.body)).not.toContain("What I'm building");
  });
});
