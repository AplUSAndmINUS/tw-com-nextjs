import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { NewsletterForm } from './NewsletterForm';

const doc = new JSDOM(renderToStaticMarkup(<NewsletterForm />)).window.document;

describe('NewsletterForm (moved from the homepage in Slice 5a)', () => {
  it('renders the same single email field and button as before', () => {
    const input = doc.querySelector('form input')!;
    expect(doc.querySelectorAll('form input')).toHaveLength(1);
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('aria-label')).toBe('Email address');
    expect(input.getAttribute('placeholder')).toBe('you@example.com');
    expect(input.getAttribute('maxlength')).toBe('254');
    expect(doc.querySelector('button[type="submit"]')?.textContent).toBe(
      'Subscribe'
    );
  });
});
