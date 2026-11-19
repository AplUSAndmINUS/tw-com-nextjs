import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact/' }));

import ContactPage, { metadata } from './page';
import stackStyles from '@/components/dsm/TwLinkStack/TwLinkStack.module.scss';
import { BOOK_A_CONVERSATION, CONTACT, MICROCOPY } from '@/content/site';

const doc = new JSDOM(renderToStaticMarkup(<ContactPage />)).window.document;
const main = doc.querySelector('main#main')!;
const text = main.textContent ?? '';

describe('/contact structure', () => {
  it('has one h1 and the sections in order: intro, conversation, message, newsletter, socials', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe("Let's talk");
    const ids = Array.from(main.querySelectorAll(':scope > section')).map((s) => s.id);
    expect(ids).toEqual(['', 'conversation', 'message', 'newsletter', 'elsewhere']);
  });

  it('opens with a jump list to the three ways in, each pointing at a real anchor', () => {
    const nav = main.querySelector(`nav[aria-label="${CONTACT.intro.jumpLabel}"]`)!;
    const links = Array.from(nav.querySelectorAll('a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#conversation', '#message', '#newsletter']);
    for (const a of links) expect(doc.getElementById(a.getAttribute('href')!.slice(1))).not.toBe(null);
    expect(links[0].classList.contains(stackStyles.primary)).toBe(true);
  });

  it('hosts the booking steps under #conversation, where every "Book a Conversation" lands (Slice 7)', () => {
    const section = doc.getElementById('conversation')!;
    expect(section.querySelector('h2')?.textContent).toBe(BOOK_A_CONVERSATION.label);
    expect(BOOK_A_CONVERSATION.href).toBe('/contact/#conversation');
    expect(section.textContent).toContain('(No sales pitch. Just a conversation.)');
    // Step 1 is in the server HTML: the services, as checkboxes.
    expect(section.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(3);
    expect(section.textContent).toContain('Step 1 of 3');
    // Without JavaScript, TidyCal itself is the way to book.
    expect(section.querySelector('noscript')?.innerHTML).toContain('tidycal.com/terencewaters');
  });

  it('has the full contact form under #message, with "I read every message"', () => {
    const section = doc.getElementById('message')!;
    expect(section.textContent).toContain(MICROCOPY.readEveryMessage);
    expect(section.querySelectorAll('input[name="name"], input[name="email"], textarea[name="message"]')).toHaveLength(3);
  });

  it('has the inline newsletter signup under #newsletter (never a pop-up)', () => {
    const section = doc.getElementById('newsletter')!;
    expect(section.textContent).toContain(MICROCOPY.newsletter);
    expect(section.querySelector('input[type="email"]')).not.toBe(null);
  });

  it('lists email first, then the socials, each labelled', () => {
    const icons = Array.from(doc.querySelectorAll('#elsewhere a'));
    expect(icons[0].getAttribute('href')).toBe('mailto:terence@terencewaters.com');
    expect(icons.length).toBeGreaterThan(5);
    icons.forEach((a) => expect(a.getAttribute('aria-label')).toBeTruthy());
  });
});

describe('/contact voice', () => {
  it('uses no retired or banned words', () => {
    expect(doc.body.textContent).not.toMatch(/free consultation|\bCEO\b|stakeholder/i);
  });

  it('has no duplicate ids and trailing slashes on internal links', () => {
    const ids = Array.from(doc.querySelectorAll('[id]')).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const hrefs = Array.from(main.querySelectorAll('a'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('/') && !h.startsWith('//'));
    for (const h of hrefs) expect(h.split('#')[0].endsWith('/'), h).toBe(true);
  });

  it('keeps the intro in the homepage contact section’s own words', () => {
    expect(text).toContain("I'd genuinely love to hear from you.");
  });
});

describe('/contact search data', () => {
  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map((s) =>
    JSON.parse(s.textContent ?? '{}')
  );

  it('emits ContactPage and BreadcrumbList, and no second Person', () => {
    expect(scripts.map((s) => s['@type'])).toEqual(['ContactPage', 'BreadcrumbList']);
    expect(scripts[0].url).toBe('https://terencewaters.com/contact/');
    expect(scripts[0].mainEntity['@id']).toBe('https://terencewaters.com/#person');
    expect(scripts[1].itemListElement.map((c: { item: string }) => c.item)).toEqual([
      'https://terencewaters.com/',
      'https://terencewaters.com/contact/',
    ]);
  });

  it('sets the title, description and a trailing-slash canonical', () => {
    expect(metadata.alternates?.canonical).toBe('/contact/');
    expect(JSON.stringify(metadata.title)).toContain("Contact Terence Waters: Let's Talk");
    expect(metadata.description).toBe(CONTACT.meta.description);
  });
});
