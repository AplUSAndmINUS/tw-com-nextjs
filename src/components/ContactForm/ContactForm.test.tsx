import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { ContactForm } from './ContactForm';

const doc = new JSDOM(renderToStaticMarkup(<ContactForm />)).window.document;

describe('ContactForm (moved from the homepage in Slice 5a)', () => {
  it('renders the same three fields as before', () => {
    const fields = Array.from(doc.querySelectorAll('input, textarea')).map(
      (f) => [
        f.tagName.toLowerCase(),
        f.getAttribute('name'),
        f.getAttribute('type'),
        f.getAttribute('maxlength'),
        f.hasAttribute('required'),
      ]
    );
    expect(fields).toEqual([
      ['input', 'name', null, '200', true],
      ['input', 'email', 'email', '254', true],
      ['textarea', 'message', null, '5000', true],
    ]);
  });

  it('labels every field (label for=id) and keeps the wording', () => {
    const labels = Array.from(doc.querySelectorAll('label')).map((l) => {
      const field = doc.getElementById(l.getAttribute('for') ?? '');
      return [
        l.textContent?.trim(),
        field?.getAttribute('name'),
        field?.getAttribute('placeholder'),
      ];
    });
    expect(labels).toEqual([
      // "(min. 10 characters)" dropped: the minimum is 2 now (Checkpoint 5a).
      ['Name', 'name', 'Your name'],
      ['Email', 'email', 'you@example.com'],
      ['Message', 'message', 'What are you working on? (min. 15 characters)'],
    ]);
    expect(doc.querySelector('button[type="submit"]')?.textContent).toBe(
      'Send message'
    );
  });

  it('starts with no errors and nothing described', () => {
    expect(
      doc.querySelectorAll('[aria-invalid="true"], [aria-describedby]')
    ).toHaveLength(0);
  });

  it('offers no second booking button (Book a Conversation lives beside the form)', () => {
    expect(doc.body.textContent).not.toMatch(/free consultation/i);
    expect(doc.querySelectorAll('a')).toHaveLength(0);
  });
});
