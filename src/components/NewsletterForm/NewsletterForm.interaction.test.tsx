// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { NewsletterForm } from './NewsletterForm';
import { useNewsletterStore } from '@/store/newsletterStore';

/** The signup's states with /api/subscribe mocked (redesign Slice 5b). */
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  localStorage.clear();
  useNewsletterStore.setState({ newsletterSubscribed: false });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<NewsletterForm />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

const input = () =>
  container.querySelector<HTMLInputElement>('input[type="email"]')!;

function type(value: string) {
  const el = input();
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )!.set!.call(el, value);
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

describe('NewsletterForm states', () => {
  it('ties the error to the field when the email is not valid', async () => {
    type('not-an-email');
    await submit();
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(input().getAttribute('aria-describedby')!)
        ?.textContent
    ).toBe('A valid email is required');
  });

  it('subscribes, then focuses the thank-you note', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    type('Reader@Example.com');
    await submit();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/subscribe',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string
    );
    expect(body.email).toBe('reader@example.com');
    const note = container.querySelector('[role="status"]');
    expect(note?.textContent).toContain("You're in.");
    expect(document.activeElement).toBe(note);
  });

  it('shows the API error when the signup fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'Try again later' }), {
            status: 500,
          })
      )
    );
    type('reader@example.com');
    await submit();
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'Try again later'
    );
  });
});
