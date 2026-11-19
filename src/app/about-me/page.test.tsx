import { beforeAll, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { ABOUT_ME, ABOUT_ME_PROJECT_SLUGS } from '@/content/site/aboutMe';
import {
  RCF_PATH,
  RCF_PREORDER_HREF,
  RCF_PREORDERS_OPEN,
  TRI_URL,
} from '@/lib/rcf';
import buttonStyles from '@/components/dsm/TwButton/TwButton.module.scss';
import heroStyles from '@/components/dsm/TwHero/TwHero.module.scss';
import quickStyles from './QuickLinks.module.scss';
import AboutMePage from './page';
import {
  ABOUT_ME_SOCIALS,
  PODCAST_FACTS,
  ROLES,
  TALENT_SKILL_NAMES,
} from './aboutMeData';

/**
 * /about-me rendered the way the static export renders it (an async server
 * component reading the real portfolio content), then parsed so the owner's
 * spec (#288) can be checked section by section.
 */
let document: Document;

beforeAll(async () => {
  const markup = renderToStaticMarkup(await AboutMePage());
  document = new JSDOM(markup).window.document;
});

const $ = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Missing ${selector}`);
  return el;
};
/** Visible text: without the screen-reader-only "(opens in a new tab)". */
const text = (el: Element | null | undefined) =>
  el?.textContent
    ?.replace(' (opens in a new tab)', '')
    .replace(/\s+/g, ' ')
    .trim();
const hrefs = (root: Element) =>
  Array.from(root.querySelectorAll('a')).map((a) => a.getAttribute('href'));
/** The TwButtons inside `root`, as [label, href, variant]. */
const buttons = (root: Element) =>
  Array.from(root.querySelectorAll(`a.${buttonStyles.button}`)).map((a) => [
    text(a),
    a.getAttribute('href'),
    (['gold', 'primary', 'outline', 'quiet'] as const).find((v) =>
      a.classList.contains(buttonStyles[v])
    ),
  ]);

describe('/about-me (#288)', () => {
  it('has the sections in the owner’s order', () => {
    const ids = Array.from(document.querySelectorAll('main > section[id]')).map(
      (s) => s.id
    );
    expect(ids).toEqual([
      'links',
      'in-60-seconds',
      'book-and-podcast',
      'making',
      'projects',
      'instagram',
      'skills',
      'socials',
      'connect',
    ]);
    // Recent writing is gone.
    expect(document.getElementById('writing')).toBeNull();
  });

  it('keeps the compact pinned-photo hero, without the old blockquote', () => {
    const hero = $('main > section');
    // compact: the shorter sub-page hero (inline height variables).
    expect(hero.getAttribute('style')).toContain('--tw-hero-height:420px');
    expect(hero.classList.contains(heroStyles.scrollReveal)).toBe(true);
    expect(hero.querySelector('h1')?.textContent).toBe('Terence Waters');
    expect(hero.querySelector('blockquote')).toBeNull();
    expect(text(document.body)).not.toContain('I rejected the mission');
  });

  it('puts five quick links on one row, pre-order highlighted', () => {
    const cards = Array.from($('#links nav').querySelectorAll('a'));
    expect(cards.map((a) => text(a))).toEqual([
      ...(RCF_PREORDERS_OPEN ? ['Pre-order my book!'] : []),
      'Book a Conversation',
      'Read my full story',
      'Listen to the podcast',
      'Instagram',
    ]);
    const highlighted = cards.filter((a) =>
      a.classList.contains(quickStyles.highlight)
    );
    if (RCF_PREORDERS_OPEN) {
      expect(highlighted.map((a) => a.getAttribute('href'))).toEqual([
        RCF_PREORDER_HREF,
      ]);
    } else {
      expect(highlighted).toHaveLength(0);
    }
    // Book a Conversation opens the dialog, so it skips the route transition.
    const book = cards.find((a) => text(a) === 'Book a Conversation');
    expect(book?.hasAttribute('data-no-route-transition')).toBe(true);
  });

  it('swaps the In 60 seconds eyebrow and title, with the blurb and facts above the cards', () => {
    const section = $('#in-60-seconds');
    expect(text(section.querySelector('h2'))).toBe('In 60 seconds');
    expect(text(section.querySelector('h2')?.previousElementSibling)).toBe(
      'Three roles, one system'
    );
    expect(text(section)).toContain(ABOUT_ME.short.blurb);
    // The owner's second paragraph (#291), with his emphasis.
    expect(text(section)).toContain(
      'My goal is to help individuals, solopreneurs, and small- to medium-sized businesses find and establish why they do what they do so the decisions they make land with Maximum Impact with the people they serve every day. Because our goal is to Structure the Shift of our transformation and systemic impact.'
    );
    expect(
      Array.from(section.querySelectorAll('p em')).map((e) => [
        text(e),
        e.parentElement?.tagName,
      ])
    ).toEqual([
      ['why', 'P'],
      ['land', 'P'],
      ['Structure the Shift', 'STRONG'],
    ]);
    expect(section.querySelectorAll('li').length).toBeGreaterThanOrEqual(
      ABOUT_ME.short.facts.length
    );
    expect(text(section)).not.toContain('Everything I do traces back');
    // The blurb comes before the role cards.
    const blurb = Array.from(section.querySelectorAll('p')).find(
      (p) => text(p) === ABOUT_ME.short.blurb
    )!;
    const firstCard = section.querySelector('h3')!;
    expect(blurb.compareDocumentPosition(firstCard) & 4).toBeTruthy();
  });

  it('orders the role cards Founder, Host, 20+ years, each kept short', () => {
    const titles = Array.from($('#in-60-seconds').querySelectorAll('h3')).map(
      (h) => text(h)
    );
    expect(titles).toEqual([
      'Founder, Fluxline Resonance Group',
      'Host, The Resonant Identity',
      '20+ years building platforms',
    ]);
    // Three lines at most at card width: about 100 characters.
    for (const role of ROLES) expect(role.text.length).toBeLessThanOrEqual(100);
  });

  it('leads the book card with the pre-order button while pre-orders are open', () => {
    const book = buttons($('#the-book'));
    if (RCF_PREORDERS_OPEN) {
      expect(book[0]).toEqual([
        'Pre-order the book',
        RCF_PREORDER_HREF,
        'gold',
      ]);
      expect(text($('#the-book'))).toContain('Pre-orders open');
    } else {
      expect(text($('#the-book'))).not.toContain('Pre-orders open');
    }
    expect(book.at(-1)).toEqual([
      'Explore the framework →',
      `${RCF_PATH}/`,
      'outline',
    ]);
  });

  it('lists the podcast facts and links out to the show', () => {
    const podcast = $('#podcast');
    for (const fact of PODCAST_FACTS) expect(text(podcast)).toContain(fact);
    expect(hrefs(podcast)).toContain(TRI_URL);
  });

  it('shows the user copy’s portfolio set under Some of the work', () => {
    const projectLinks = hrefs($('#projects')).filter((h) =>
      /^\/portfolio\/.+\//.test(h ?? '')
    );
    expect(projectLinks).toEqual(
      ABOUT_ME_PROJECT_SLUGS.map((s) => `/portfolio/${s}/`)
    );
  });

  it('loads the Instagram feed into Off the page (loading state on the server)', () => {
    const section = $('#instagram');
    expect(text(section.querySelector('h2'))).toBe('Off the page');
    // Five placeholder tiles hold the lead-plus-four shape until posts load.
    expect(
      section.querySelectorAll('[aria-busy="true"] ul[aria-hidden="true"] li')
    ).toHaveLength(5);
  });

  it('adds the owner’s paragraph under I still build, with its emphasis', () => {
    const skills = $('#skills');
    expect(text(skills)).toContain(
      "I build, create, design, and architect because I love doing so! Seeing a unique identity unfold in story, build, design, and apps brings about a system's Identity Coherence into a tangible asset. That's what I do."
    );
    expect(
      Array.from(skills.querySelectorAll('strong > em')).map((e) => text(e))
    ).toEqual(['because I love doing so!', "That's what I do."]);
    // One talent bar per chosen skill, scored from ABOUT_SKILLS.
    const meters = Array.from(skills.querySelectorAll('[role="meter"]'));
    expect(meters).toHaveLength(TALENT_SKILL_NAMES.length);
    for (const meter of meters) {
      const name = meter.getAttribute('aria-label') ?? '';
      const skill = ABOUT_SKILLS.find((s) => name.startsWith(s.name));
      expect(Number(meter.getAttribute('aria-valuenow'))).toBe(
        skill?.percentage
      );
    }
  });

  it('keeps Find me online and the closing band', () => {
    expect($('#socials').querySelectorAll('a').length).toBeGreaterThanOrEqual(
      ABOUT_ME_SOCIALS.length
    );
    const closing = $('#connect');
    expect(text(closing)).toContain('Want to go deeper?');
    const book = Array.from(closing.querySelectorAll('a')).find(
      (a) => text(a) === 'Book a Conversation'
    );
    expect(book?.hasAttribute('data-no-route-transition')).toBe(true);
  });
});
