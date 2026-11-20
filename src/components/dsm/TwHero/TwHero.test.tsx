import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwHero } from './TwHero';
import styles from './TwHero.module.scss';

/** Server-render, then parse, so tests can query the HTML the browser gets. */
function render(ui: React.ReactElement) {
  const { document } = new JSDOM(renderToStaticMarkup(ui)).window;
  const hero = document.querySelector('section');
  if (!hero) throw new Error('TwHero did not render a <section>');
  return hero;
}

const base = {
  title: 'Terence Waters',
  backgroundImage: '/assets/images/hero-landscape.jpg',
};

describe('TwHero mobile layouts', () => {
  it('defaults to the overlay layout: card over the photo', () => {
    const hero = render(<TwHero {...base} />);
    expect(hero.classList.contains(styles.hero)).toBe(true);
    expect(hero.classList.contains(styles.stacked)).toBe(false);
    expect(hero.classList.contains(styles.scrollReveal)).toBe(false);
  });

  it('stackOnMobile stacks the card under the photo, with no scroll effects', () => {
    const hero = render(<TwHero {...base} stackOnMobile />);
    expect(hero.classList.contains(styles.stacked)).toBe(true);
    expect(hero.classList.contains(styles.scrollReveal)).toBe(false);
  });

  it('scrollReveal builds on the stacked layout', () => {
    const hero = render(<TwHero {...base} scrollReveal />);
    expect(hero.classList.contains(styles.stacked)).toBe(true);
    expect(hero.classList.contains(styles.scrollReveal)).toBe(true);
  });

  it.each([
    ['overlay', {}],
    ['stackOnMobile', { stackOnMobile: true }],
    ['scrollReveal', { scrollReveal: true }],
  ])('%s keeps the copy in the server HTML', (_, mode) => {
    const hero = render(
      <TwHero {...base} {...mode} subtitle='Podcaster' body='Body copy' />
    );
    // scrollReveal routes the card through a client component; the copy
    // must still be in the initial HTML for LCP and search.
    expect(hero.querySelector('h1')?.textContent).toBe('Terence Waters');
    expect(hero.textContent).toContain('Podcaster');
    expect(hero.textContent).toContain('Body copy');
    expect(hero.querySelector(`.${styles.inner} .${styles.card}`)).not.toBe(
      null
    );
  });
});

describe('TwHero without a background photo', () => {
  const noPhoto = { title: 'Terence Waters' };

  it.each([
    ['stackOnMobile', { stackOnMobile: true }],
    ['scrollReveal', { scrollReveal: true }],
  ])(
    '%s is ignored, so the card is not pulled over the content above',
    (_, mode) => {
      const hero = render(<TwHero {...noPhoto} {...mode} />);
      expect(hero.classList.contains(styles.stacked)).toBe(false);
      expect(hero.classList.contains(styles.scrollReveal)).toBe(false);
      expect(hero.querySelector('h1')?.textContent).toBe('Terence Waters');
    }
  );
});

describe('TwHero actions', () => {
  it('renders no buttons or links when no CTAs are given', () => {
    const hero = render(<TwHero {...base} scrollReveal />);
    expect(hero.querySelectorAll('a, button')).toHaveLength(0);
    expect(hero.querySelector(`.${styles.actions}`)).toBe(null);
  });

  it('still renders primary then secondary CTAs when given', () => {
    const hero = render(
      <TwHero
        {...base}
        primaryCta={{ label: 'Who am I?', href: '#about' }}
        secondaryCta={{ label: 'View portfolio', href: '#portfolio' }}
      />
    );
    const links = Array.from(hero.querySelectorAll('a'));
    expect(links.map((a) => a.textContent)).toEqual([
      'Who am I?',
      'View portfolio',
    ]);
  });
});

describe('TwHero scrim', () => {
  const scrimOf = (hero: Element) =>
    hero.querySelector(`.${styles.scrim}`) as Element;

  it('uses the photo scrim by default', () => {
    const hero = render(<TwHero {...base} />);
    expect(scrimOf(hero).classList.contains(styles.scrimCardSide)).toBe(false);
  });

  it("darkens the card side with scrim='card-side' (banner with lettering)", () => {
    const hero = render(<TwHero {...base} scrim='card-side' />);
    expect(scrimOf(hero).classList.contains(styles.scrimCardSide)).toBe(true);
  });
});

describe('TwHero CTAs in a new tab', () => {
  it('opens a newTab CTA in a new tab, keeping the referrer', () => {
    const hero = render(
      <TwHero
        {...base}
        primaryCta={{
          label: 'Pre-order',
          href: 'https://store.example/',
          newTab: true,
        }}
        secondaryCta={{
          label: 'More',
          href: 'https://example.org/',
          newTab: true,
        }}
      />
    );
    for (const name of ['Pre-order', 'More']) {
      const link = Array.from(hero.querySelectorAll('a')).find((a) =>
        a.textContent?.startsWith(name)
      )!;
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener');
      expect(link.textContent).toContain('(opens in a new tab)');
    }
  });

  it('keeps a CTA in the same tab without newTab', () => {
    const hero = render(
      <TwHero {...base} primaryCta={{ label: 'Read', href: '/about/' }} />
    );
    const link = hero.querySelector('a')!;
    expect(link.hasAttribute('target')).toBe(false);
    expect(link.hasAttribute('rel')).toBe(false);
  });
});
