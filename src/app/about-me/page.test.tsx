import { beforeAll, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { getAllContent } from '@/lib/content';
import {
  RCF_PATH,
  RCF_PREORDER_HREF,
  RCF_PREORDERS_OPEN,
  TRI_URL,
} from '@/lib/rcf';
import buttonStyles from '@/components/dsm/TwButton/TwButton.module.scss';
import heroStyles from '@/components/dsm/TwHero/TwHero.module.scss';
import AboutMePage from './page';
import {
  ABOUT_ME_SOCIALS,
  POST_LIMIT,
  PODCAST_FACTS,
  PROJECT_SLUGS,
  TALENT_SKILL_NAMES,
} from './aboutMeData';

/**
 * /about-me rendered the way the static export renders it (the page is an
 * async server component that reads the real blog and portfolio content),
 * then parsed so the owner's requirements can be checked section by section.
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
const hrefs = (root: Element) =>
  Array.from(root.querySelectorAll('a')).map((a) => a.getAttribute('href'));
/** The TwButtons inside `root`, as [label, href, variant]. */
const buttons = (root: Element) =>
  Array.from(root.querySelectorAll(`a.${buttonStyles.button}`)).map((a) => [
    a.textContent?.trim(),
    a.getAttribute('href'),
    (['gold', 'primary', 'outline', 'quiet'] as const).find((v) =>
      a.classList.contains(buttonStyles[v])
    ),
  ]);

describe('/about-me hero callout', () => {
  const hero = () => $('main > section');

  it('has no action buttons or links', () => {
    expect(hero().querySelectorAll('a, button')).toHaveLength(0);
  });

  it('says who, in one line', () => {
    expect(hero().querySelector('h1')?.textContent).toBe('Terence Waters');
    expect(hero().textContent).toContain(
      'Podcaster · Systems Architect · Business Consultant'
    );
    expect(hero().textContent).toContain('The Resonance Core Framework™');
  });

  it('uses the sticky scroll-reveal layout on mobile', () => {
    expect(hero().classList.contains(heroStyles.stacked)).toBe(true);
    expect(hero().classList.contains(heroStyles.scrollReveal)).toBe(true);
  });
});

describe('/about-me book and podcast cards', () => {
  it('leads the book card with a Mythic Gold pre-order button once pre-orders are announced, then outline', () => {
    if (RCF_PREORDERS_OPEN) {
      expect(buttons($('#the-book'))).toEqual([
        ['Pre-order the book', RCF_PREORDER_HREF, 'gold'],
        ['Explore the framework →', RCF_PATH, 'outline'],
      ]);
      expect($('#the-book').textContent).toContain('Pre-orders open');
    } else {
      // Hidden until pre-orders are announced (#273).
      expect(buttons($('#the-book'))).toEqual([
        ['Explore the framework →', RCF_PATH, 'outline'],
      ]);
      expect($('#the-book').textContent).not.toMatch(/pre-?order/i);
    }
  });

  it('shows the chapter line without the part names', () => {
    const book = $('#the-book').textContent ?? '';
    expect(book).toContain('31 chapters in three parts');
    expect(book).not.toContain('(The Self');
  });

  it('leads the podcast card with a primary listen button, then outline', () => {
    expect(buttons($('#podcast'))).toEqual([
      ['Listen to the podcast', TRI_URL, 'primary'],
      ['Browse episodes →', '/podcasts/theresonantid', 'outline'],
    ]);
  });

  it('gives the podcast card three facts, like the book card', () => {
    const facts = Array.from($('#podcast').querySelectorAll('ul li')).map(
      (li) => li.textContent
    );
    expect(facts).toEqual([...PODCAST_FACTS]);
    expect(facts).toHaveLength(3);
  });

  it('opens the external buttons in a new tab, safely', () => {
    for (const href of RCF_PREORDERS_OPEN
      ? [RCF_PREORDER_HREF, TRI_URL]
      : [TRI_URL]) {
      const link = $(`main a[href="${href}"].${buttonStyles.button}`);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});

describe('/about-me talent bars', () => {
  it('shows each chosen skill scored out of 100, matching /about', () => {
    const meters = Array.from($('#skills').querySelectorAll('[role="meter"]'));
    expect(meters).toHaveLength(TALENT_SKILL_NAMES.length);
    meters.forEach((meter, i) => {
      const skill = ABOUT_SKILLS.find((s) => s.name === TALENT_SKILL_NAMES[i]);
      expect(meter.getAttribute('aria-valuenow')).toBe(
        String(skill?.percentage)
      );
      expect(meter.getAttribute('aria-valuemax')).toBe('100');
    });
    expect($('#skills').textContent).toContain('/ 100');
  });
});

describe('/about-me projects and writing', () => {
  it('links the curated portfolio projects', () => {
    const projectLinks = hrefs($('#projects')).filter((h) =>
      h?.startsWith('/portfolio/')
    );
    expect(projectLinks).toEqual(PROJECT_SLUGS.map((s) => `/portfolio/${s}`));
  });

  it('links the latest blog posts, newest first', async () => {
    const latest = (await getAllContent('blog')).slice(0, POST_LIMIT);
    const postLinks = hrefs($('#writing')).filter((h) =>
      h?.startsWith('/blog/')
    );
    expect(postLinks).toEqual(latest.map((p) => `/blog/${p.slug}`));
  });
});

describe('/about-me closing: actions, contact, socials', () => {
  it('moves the actions to the bottom: full story, get in touch, the framework', () => {
    expect(buttons($('#connect'))).toEqual([
      ['Read my full story', '/about', 'primary'],
      ['Get in touch', '/#contact', 'outline'],
      ['The Resonance Core Framework™', RCF_PATH, 'outline'],
    ]);
  });

  it('lists ways to get in touch', () => {
    const links = hrefs($('#connect'));
    expect(links).toContain('mailto:terence@terencewaters.com');
    expect(links).toContain('https://tidycal.com/terencewaters');
  });

  it('ends with every social icon, each labelled', () => {
    const icons = Array.from($('#connect').querySelectorAll('a[aria-label]'));
    for (const social of ABOUT_ME_SOCIALS) {
      const icon = icons.find((a) => a.getAttribute('href') === social.href);
      expect(icon?.getAttribute('aria-label')).toBe(social.name);
    }
  });
});

describe('/about-me document structure', () => {
  it('has one h1 and no duplicate ids', () => {
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const ids = Array.from(document.querySelectorAll('[id]')).map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
});
