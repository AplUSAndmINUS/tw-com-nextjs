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
