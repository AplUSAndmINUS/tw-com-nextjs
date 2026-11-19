import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact/' }));

import ContactPage, { metadata } from './page';
import stackStyles from '@/components/dsm/TwLinkStack/TwLinkStack.module.scss';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { CONTACT } from '@/content/site/contact';
import { MICROCOPY } from '@/content/site/microcopy';

const doc = new JSDOM(renderToStaticMarkup(<ContactPage />)).window.document;
const main = doc.querySelector('main#main')!;
const text = main.textContent ?? '';

describe('/contact structure', () => {
  it('has one h1 and the sections in order: intro, conversation, message, newsletter, socials', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe("Let's talk");
    const ids = Array.from(main.querySelectorAll(':scope > section')).map(
      (s) => s.id
    );
    expect(ids).toEqual([
      '',
      'conversation',
      'message',
      'newsletter',
      'elsewhere',
    ]);
  });

  it('opens with a jump list to the three ways in, each pointing at a real anchor', () => {
    const nav = main.querySelector(
      `nav[aria-label="${CONTACT.intro.jumpLabel}"]`
    )!;
    const links = Array.from(nav.querySelectorAll('a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '#conversation',
      '#message',
      '#newsletter',
    ]);
    for (const a of links)
      expect(doc.getElementById(a.getAttribute('href')!.slice(1))).not.toBe(
        null
      );
    expect(links[0].classList.contains(stackStyles.primary)).toBe(true);
  });

  it('opens the booking dialog from #conversation instead of the steps inline (#295)', () => {
    const section = doc.getElementById('conversation')!;
    expect(section.querySelector('h2')?.textContent).toBe(
      BOOK_A_CONVERSATION.label
    );
    // Without JavaScript, Book a Conversation links go to /book/.
    expect(BOOK_A_CONVERSATION.href).toBe('/book/');
    expect(section.textContent).toContain(
      '(No sales pitch. Just a conversation.)'
    );
    // No inline stepper: one button that opens the full-screen dialog.
    expect(section.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
    const button = Array.from(section.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === BOOK_A_CONVERSATION.label
    );
    expect(button?.hasAttribute('data-no-route-transition')).toBe(true);
    // Without JavaScript, TidyCal itself is the way to book.
    expect(section.querySelector('noscript')?.innerHTML).toContain(
      'tidycal.com/terencewaters'
    );
  });

  it('opens the dialog from the jump list too', () => {
    const nav = main.querySelector(
      `nav[aria-label="${CONTACT.intro.jumpLabel}"]`
    )!;
    expect(
      nav.querySelector('a')?.hasAttribute('data-no-route-transition')
    ).toBe(true);
  });

  it('has the full contact form under #message, with "I read every message"', () => {
    const section = doc.getElementById('message')!;
    expect(section.textContent).toContain(MICROCOPY.readEveryMessage);
    expect(
      section.querySelectorAll(
        'input[name="name"], input[name="email"], textarea[name="message"]'
      )
    ).toHaveLength(3);
  });

  it('has the inline newsletter signup under #newsletter (never a pop-up)', () => {
    const section = doc.getElementById('newsletter')!;
    expect(section.textContent).toContain(MICROCOPY.newsletter);
    expect(section.querySelector('input[type="email"]')).not.toBe(null);
  });

  it('lists email first, then the socials, each labelled', () => {
    const icons = Array.from(doc.querySelectorAll('#elsewhere a'));
    expect(icons[0].getAttribute('href')).toBe(
      'mailto:terence@terencewaters.com'
    );
    expect(icons.length).toBeGreaterThan(5);
    icons.forEach((a) => expect(a.getAttribute('aria-label')).toBeTruthy());
  });
});

describe('/contact voice', () => {
  it('uses no retired or banned words', () => {
    expect(doc.body.textContent).not.toMatch(
      /free consultation|\bCEO\b|stakeholder/i
    );
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
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent ?? '{}'));

  it('emits ContactPage and BreadcrumbList, and no second Person', () => {
    expect(scripts.map((s) => s['@type'])).toEqual([
      'ContactPage',
      'BreadcrumbList',
    ]);
    expect(scripts[0].url).toBe('https://terencewaters.com/contact/');
    expect(scripts[0].mainEntity['@id']).toBe(
      'https://terencewaters.com/#person'
    );
    expect(
      scripts[1].itemListElement.map((c: { item: string }) => c.item)
    ).toEqual([
      'https://terencewaters.com/',
      'https://terencewaters.com/contact/',
    ]);
  });

  it('sets the title, description and a trailing-slash canonical', () => {
    expect(metadata.alternates?.canonical).toBe('/contact/');
    expect(JSON.stringify(metadata.title)).toContain(
      "Contact Terence Waters: Let's Talk"
    );
    expect(metadata.description).toBe(CONTACT.meta.description);
  });
});
