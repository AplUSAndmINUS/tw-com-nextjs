import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwShiftTrack, type TwShiftTrackStep } from './TwShiftTrack';

const steps: TwShiftTrackStep[] = [
  {
    id: 'a',
    number: 'Shift 0',
    title: 'The exit',
    short: 'One.',
    roles: ['Myself'],
  },
  {
    id: 'b',
    number: '',
    title: 'The middle',
    short: 'Two.',
    roles: ['Creator', 'Musician'],
  },
  {
    id: 'c',
    number: 'Shift 3',
    title: 'The launch',
    short: 'Three.',
    roles: ['Author'],
    href: '/about/#c',
  },
];

const doc = new JSDOM(
  renderToStaticMarkup(
    <TwShiftTrack
      steps={steps}
      rolesLabel='Roles added'
      stackLabel='So far'
      moreLabel='Read more'
    />
  )
).window.document;

describe('TwShiftTrack', () => {
  it('renders the steps in order as a list', () => {
    const titles = Array.from(doc.querySelectorAll('ol > li h3')).map(
      (h) => h.textContent
    );
    expect(titles).toEqual(['The exit', 'The middle', 'The launch']);
  });

  it('shows every step as reached in the server render (no-JS safe)', () => {
    const reached = Array.from(doc.querySelectorAll('ol > li')).map((li) =>
      li.getAttribute('data-reached')
    );
    expect(reached).toEqual(['true', 'true', 'true']);
  });

  it('skips the number for an unnumbered beat', () => {
    const second = doc.querySelectorAll('ol > li')[1];
    expect(second.textContent).not.toMatch(/Shift/);
    // An invisible placeholder keeps the titles aligned; hidden from AT.
    expect(second.querySelector('p[aria-hidden="true"]')).not.toBe(null);
  });

  it('labels each role list and builds the running total in order', () => {
    expect(doc.querySelectorAll('ul[aria-label="Roles added"]')).toHaveLength(
      3
    );
    const stack = doc.querySelector('ol + p')!;
    expect(stack.textContent).toContain('So far');
    expect(stack.textContent).toContain('MyselfCreatorMusicianAuthor');
  });

  it('links a step to its full telling when an href is given', () => {
    const links = Array.from(doc.querySelectorAll('ol a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/about/#c']);
  });
});
