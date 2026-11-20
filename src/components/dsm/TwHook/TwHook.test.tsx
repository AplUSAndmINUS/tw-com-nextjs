import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { TwHook } from './TwHook';
import { TwCredo } from '../TwCredo';

const render = (el: React.ReactElement) =>
  new JSDOM(renderToStaticMarkup(el)).window.document;

describe('TwHook', () => {
  it('renders the statement as an h2 by default, with follow-up copy', () => {
    const doc = render(
      <TwHook statement='I hate self-help books.' kicker='The book'>
        <p>Follow.</p>
      </TwHook>
    );
    expect(doc.querySelector('h2')?.textContent).toBe(
      'I hate self-help books.'
    );
    expect(doc.body.textContent).toContain('The book');
    expect(doc.body.textContent).toContain('Follow.');
  });

  it('can render as a paragraph when a heading would break the outline', () => {
    const doc = render(<TwHook statement='x' as='p' />);
    expect(doc.querySelector('h2')).toBe(null);
  });
});

describe('TwCredo', () => {
  it('renders a labelled section with the credo', () => {
    const doc = render(
      <TwCredo
        statement='Humans FIRST. AI and Systems SECOND.'
        aria-label='Credo'
      >
        <p>Body</p>
      </TwCredo>
    );
    const section = doc.querySelector('section[aria-label="Credo"]');
    expect(section?.textContent).toContain(
      'Humans FIRST. AI and Systems SECOND.'
    );
  });
});
