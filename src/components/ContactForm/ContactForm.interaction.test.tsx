// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ContactForm } from './ContactForm';
import { MICROCOPY } from '@/content/site/microcopy';

/**
 * The form's states in a real (jsdom) DOM with /api/contact mocked: errors
 * tied to their fields, focus moved to what needs fixing, and the sent and
 * failed states (redesign Slice 5b). reCAPTCHA has no site key in tests, so
 * it is a no-op, as in local development.
 */
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<ContactForm />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

const field = (name: string) =>
  container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${name}"]`
  )!;

/** Type into a React-controlled field. */
function type(name: string, value: string) {
  const el = field(name);
  const proto = Object.getPrototypeOf(el);
  Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value);
  act(() => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function submit() {
  await act(async () => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

describe('ContactForm states', () => {
  it('labels each field by id', () => {
    for (const name of ['name', 'email', 'message']) {
      const label = container.querySelector(`label[for="${field(name).id}"]`);
      expect(label, name).not.toBe(null);
    }
  });

  it('on an empty submit, shows each error, ties it to its field, and focuses the first', async () => {
    await submit();
    for (const name of ['name', 'email', 'message']) {
      const el = field(name);
      expect(el.getAttribute('aria-invalid')).toBe('true');
      const error = document.getElementById(
        el.getAttribute('aria-describedby')!
      );
      expect(error?.textContent).toMatch(/required/);
    }
    expect(document.activeElement).toBe(field('name'));
  });

  it('does not flag an empty field just because you tabbed past it', () => {
    act(() => {
      field('name').focus();
      field('email').focus();
    });
    expect(field('name').getAttribute('aria-invalid')).toBe('false');
    expect(container.querySelector('[id$="-error"]')).toBe(null);
  });

  it('checks a field you typed in when you leave it', () => {
    type('email', 'ana@');
    act(() => {
      field('email').focus();
      field('message').focus();
    });
    expect(field('email').getAttribute('aria-invalid')).toBe('true');
  });

  it('announces "Sending…" while the message is on its way', async () => {
    let release: (r: Response) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((r) => (release = r)))
    );
    type('name', 'Ana Li');
    type('email', 'ana@example.com');
    type('message', 'I would love to talk about the book.');
    await submit();
    expect(container.querySelector('form')?.getAttribute('aria-busy')).toBe(
      'true'
    );
    expect(
      Array.from(container.querySelectorAll('[role="status"]')).map(
        (s) => s.textContent
      )
    ).toContain('Sending…');
    await act(async () => release(new Response('{}', { status: 200 })));
  });

  it('accepts a short name (the minimum is 2 characters)', async () => {
    type('name', 'Bo');
    await submit();
    expect(field('name').getAttribute('aria-invalid')).toBe('false');
    expect(document.activeElement).toBe(field('email'));
  });

  it('posts to /api/contact, then shows "Message sent" with focus on it', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    type('name', 'Ana Li');
    type('email', 'ana@example.com');
    type('message', 'I would love to talk about the book.');
    await submit();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string
    );
    expect(body).toMatchObject({ name: 'Ana Li', email: 'ana@example.com' });
    const heading = container.querySelector('h3');
    expect(heading?.textContent).toBe('Message sent');
    expect(document.activeElement).toBe(heading);
    expect(container.textContent).toContain(MICROCOPY.formSuccess);
  });

  it('keeps what was typed and says what went wrong when the send fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'Mail service unavailable' }), {
            status: 502,
          })
      )
    );
    type('name', 'Ana Li');
    type('email', 'ana@example.com');
    type('message', 'I would love to talk about the book.');
    await submit();
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'Mail service unavailable'
    );
    expect(field('message').value).toBe('I would love to talk about the book.');
    expect(container.querySelector('form')?.getAttribute('aria-busy')).toBe(
      null
    );
  });
});
