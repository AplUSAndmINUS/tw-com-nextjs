// @vitest-environment jsdom
import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { ContactForm } from './ContactForm';
import { FORM_ERRORS } from '@/content/site/contact';
import { json, mount, type Mounted } from '@/test/formHarness';

/**
 * Redesign Slice 6.1 / 6.2: the contact form against a mocked /api/contact
 * (success, 400, 429, 504, no network, no reCAPTCHA key), and the payload it
 * sends run through the real Azure Function handler.
 */
let form: Mounted;

beforeEach(() => {
  form = mount(<ContactForm />);
  form.type('[name="name"]', 'Ana Li');
  form.type('[name="email"]', 'ana@example.com');
  form.type('[name="message"]', 'I would love to talk about the book.');
});

afterEach(() => {
  form.unmount();
  vi.unstubAllGlobals();
});

const alertText = () => form.container.querySelector('[role="alert"]')?.textContent;
const sentBody = (mock: ReturnType<typeof vi.fn>) =>
  JSON.parse((mock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);

describe('contact form × /api/contact (mocked)', () => {
  it('200: sends name, email and message, then says "Message sent"', async () => {
    const fetchMock = vi.fn(async () => json(200, { success: true }));
    vi.stubGlobal('fetch', fetchMock);
    await form.submit();
    expect(sentBody(fetchMock)).toEqual({
      name: 'Ana Li',
      email: 'ana@example.com',
      message: 'I would love to talk about the book.',
    });
    expect(form.container.querySelector('h3')?.textContent).toBe('Message sent');
  });

  it.each([
    [400, { error: 'Invalid email address' }, 'Invalid email address'],
    [429, { error: 'Too Many Requests' }, FORM_ERRORS.rateLimited],
    [504, { error: 'The request timed out. Please try again later.' }, 'The request timed out. Please try again later.'],
    [500, {}, 'Failed to send message. Please try again.'],
  ])('%i: shows a message and keeps what was typed', async (status, body, shown) => {
    vi.stubGlobal('fetch', vi.fn(async () => json(status, body)));
    await form.submit();
    expect(alertText()).toBe(shown);
    expect(form.container.querySelector<HTMLTextAreaElement>('[name="message"]')?.value).toBe(
      'I would love to talk about the book.'
    );
  });

  it('no network: says so in plain words, not "Failed to fetch"', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))));
    await form.submit();
    expect(alertText()).toBe(FORM_ERRORS.network);
  });

  it('no reCAPTCHA key: posts without a token (the API skips the check when it has no secret)', async () => {
    const fetchMock = vi.fn(async () => json(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    await form.submit();
    expect(sentBody(fetchMock)).not.toHaveProperty('recaptchaToken');
  });

  it('disables the button while sending', async () => {
    let release: (r: Response) => void = () => {};
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((r) => (release = r))));
    await form.submit();
    const button = form.container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Sending…');
    await act(async () => release(json(200, {})));
  });
});

describe('payload contract with api/contact (6.2)', () => {
  it('what the form sends is accepted by the real handler', async () => {
    const browserFetch = vi.fn(async () => json(200, {}));
    vi.stubGlobal('fetch', browserFetch);
    await form.submit();
    const payload = sentBody(browserFetch);

    // The handler, with SMTP2Go stubbed and no reCAPTCHA secret (as locally).
    const require = createRequire(import.meta.url);
    const contact = require('../../../api/contact/index.js');
    const env = {
      SMTP2GO_API_KEY: 'key',
      CONTACT_FROM_EMAIL: 'from@terencewaters.com',
      CONTACT_TO_EMAIL: 'to@terencewaters.com',
      RECAPTCHA_SECRET_KEY: undefined,
    };
    const saved = Object.fromEntries(Object.keys(env).map((k) => [k, process.env[k]]));
    for (const [k, v] of Object.entries(env)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    const smtp = vi.fn(async () => json(200, { data: { succeeded: 1 } }));
    vi.stubGlobal('fetch', smtp);
    const log = Object.assign(() => {}, { warn: () => {}, error: () => {} });
    try {
      const res = await contact({ log }, {
        method: 'POST',
        headers: { origin: 'https://terencewaters.com' },
        body: JSON.stringify(payload),
      });
      expect(res.status).toBe(200);
      expect(smtp).toHaveBeenCalledTimes(1);
    } finally {
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  });
});
