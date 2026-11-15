import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import heroStyles from '@/components/dsm/TwHero/TwHero.module.scss';
import HomePageClient from './HomePageClient';

function renderHero() {
  const markup = renderToStaticMarkup(
    <HomePageClient content={[]} podcasts={[]} portfolio={[]} />
  );
  const { document } = new JSDOM(markup).window;
  const hero = document.querySelector(`#hero section.${heroStyles.hero}`);
  if (!hero) throw new Error('Home hero not rendered');
  return hero;
}

describe('Home page hero', () => {
  it('stacks the card under the photo on mobile, without the scroll reveal', () => {
    const hero = renderHero();
    expect(hero.classList.contains(heroStyles.stacked)).toBe(true);
    // Owner: card placement only on the home page, no pin, fade or parallax.
    expect(hero.classList.contains(heroStyles.scrollReveal)).toBe(false);
  });

  it('keeps its call-to-action buttons', () => {
    const labels = Array.from(renderHero().querySelectorAll('a')).map((a) =>
      a.textContent?.trim()
    );
    expect(labels).toEqual(
      expect.arrayContaining(['Who am I?', 'View portfolio'])
    );
  });
});
