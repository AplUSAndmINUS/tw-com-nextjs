import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import heroStyles from '@/components/dsm/TwHero/TwHero.module.scss';
import { ABOUT } from '@/content/site/about';
import { CANONICAL_STATEMENT_TEXT } from '@/content/site/identity';
import styles from './page.module.scss';
import AboutPage from './page';

/**
 * /about rendered as the static export renders it, then checked against the
 * owner's spec (#294).
 */
const document = new JSDOM(renderToStaticMarkup(<AboutPage />)).window.document;

const $ = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Missing ${selector}`);
  return el;
};
const text = (el: Element | null | undefined) =>
  el?.textContent?.replace(/\s+/g, ' ').trim();

describe('/about (#294)', () => {
  it('numbers every section 01–09 with a one-word category and a title', () => {
    const rows = Array.from(
      document.querySelectorAll(`main section .${styles.numRow}`)
    );
    expect(rows.map((r) => text(r))).toEqual([
      '01 Intro',
      '02 Story',
      '03 Music',
      '04 Body',
      '05 Values',
      '06 Method',
      '07 Build',
      '08 Experience',
      '09 Credentials',
    ]);
    for (const row of rows) {
      expect(row.querySelector(`.${styles.secNum}`)).not.toBeNull();
    }
  });

  it('keeps the compact hero and breaks its two sentences onto two lines', () => {
    const hero = $('main > section');
    expect(hero.getAttribute('style')).toContain('--tw-hero-height:420px');
    expect(hero.classList.contains(heroStyles.scrollReveal)).toBe(true);
    const body = Array.from(hero.querySelectorAll('p')).find((p) =>
      text(p)?.startsWith("Most people don't need more information.")
    )!;
    expect(body.querySelector('br')).not.toBeNull();
  });

  it('tells the short version in one paragraph, statement then season line', () => {
    const paragraphs = $('#intro').querySelectorAll(`.${styles.statementOne}`);
    expect(paragraphs).toHaveLength(1);
    expect(text(paragraphs[0])).toBe(
      `${CANONICAL_STATEMENT_TEXT} ${ABOUT.intro.season}`.replace(/\s+/g, ' ')
    );
  });

  it('drops the music "back seat" line and gives the music its own section', () => {
    const byFeel = $('#by-feel');
    expect(text(byFeel)).not.toContain('back seat');
    expect(byFeel.querySelector('img')).toBeNull();
    expect(text(byFeel.querySelector('blockquote'))).toContain(
      'Music is universally understood.'
    );
  });

  it('puts the body in its own section, the photo beside its story', () => {
    const body = $('#body');
    const img = body.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(
      '/assets/images/personal-training-portrait.jpg'
    );
    expect(img.getAttribute('alt')).toBeTruthy();
    expect(text(body.querySelector('h2'))).toBe('The body');
    expect(text(body)).toContain('In 2012 I weighed 120 pounds.');
  });

  it('combines the values sentence with the owner’s emphasis and drops "Accepting people…"', () => {
    const values = $('#values');
    expect(text(values)).toContain(
      "In the book, every person has the same basic needs. Shelter, food and water, being heard, feeling safe and trusted. And it's through that shared layer of emotion, sensation, and intuition that shapes how people respond to us and make relationships in our world."
    );
    expect(
      Array.from(values.querySelectorAll('strong > em')).map((e) => text(e))
    ).toEqual([
      'every person has the same basic needs.',
      'shapes how people respond to us and make relationships in our world',
    ]);
    expect(text(values)).not.toContain('In plain words');
    expect(text(values)).not.toContain('Accepting people');
  });

  it('leads How I work with the Humans First callout, a two-line quote and glow cards', () => {
    const how = $('#how-i-work');
    const callout = how.querySelector(`.${styles.hcsaCallout}`)!;
    expect(text(callout.querySelector('h3'))).toBe('Humans First. AI Second.');
    // The callout comes before the lede and the approach cards.
    const cards = how.querySelectorAll(`.${styles.glowCard}`);
    expect(cards).toHaveLength(4);
    expect(callout.compareDocumentPosition(cards[0]) & 4).toBeTruthy();
    // The website note is a note, not a nested landmark.
    expect(how.querySelector('aside')).toBeNull();
    expect(how.querySelector('[role="note"]')).not.toBeNull();
    const quote = how.querySelector('blockquote')!;
    expect(quote.querySelector('br')).not.toBeNull();
    expect(text(quote)).toBe(
      'Your job is to find your resonant identity. My job is to help you get there and express it.'
    );
  });

  it('keeps the TEST design for credentials, full width, without the books image', () => {
    const creds = $('#credentials');
    expect(creds.querySelector('img')).toBeNull();
    expect(creds.querySelectorAll('[role="meter"]')).toHaveLength(12);
    expect(text(creds)).toContain('Degrees');
    expect(text(creds)).toContain('Certifications');
  });

  it('books a conversation in the dialog and sends messages to the contact form', () => {
    const closing = $('#closing');
    const book = Array.from(closing.querySelectorAll('a')).find(
      (a) => text(a) === 'Book a Conversation'
    );
    expect(book?.hasAttribute('data-no-route-transition')).toBe(true);
    expect(
      Array.from(closing.querySelectorAll('a'))
        .find((a) => text(a) === 'Send a message')
        ?.getAttribute('href')
    ).toBe('/contact/#message');
    expect(document.querySelector('a[href*="tidycal.com"]')).toBeNull();
  });
});
