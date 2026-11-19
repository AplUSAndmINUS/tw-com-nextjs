// @vitest-environment jsdom
import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { NewsletterForm } from './NewsletterForm';
import { FORM_ERRORS } from '@/content/site/contact';
import { useNewsletterStore } from '@/store/newsletterStore';
import { json, mount, type Mounted } from '@/test/formHarness';

/**
 * Redesign Slice 6.1 / 6.2: the newsletter signup against a mocked
 * /api/subscribe, and its payload through the real handler.
 */
let form: Mounted;

beforeEach(() => {
  localStorage.clear();
  useNewsletterStore.setState({ newsletterSubscribed: false });
  form = mount(<NewsletterForm />);
  form.type('input[type="email"]', ' Reader@Example.com ');
});

afterEach(() => {
  form.unmount();
  vi.unstubAllGlobals();
});

const alertText = () =>
  form.container.querySelector('[role="alert"]')?.textContent;
const sentBody = (mock: ReturnType<typeof vi.fn>) =>
  JSON.parse(
    (mock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string
  );

describe('newsletter form × /api/subscribe (mocked)', () => {
  it('200: sends the trimmed, lower-cased email and says thanks', async () => {
    const fetchMock = vi.fn(async () =>
      json(200, { message: 'Subscribed successfully' })
    );
    vi.stubGlobal('fetch', fetchMock);
    await form.submit();
    expect(sentBody(fetchMock)).toEqual({ email: 'reader@example.com' });
    expect(
      form.container.querySelector('[role="status"]')?.textContent
    ).toContain("You're in.");
    expect(useNewsletterStore.getState().newsletterSubscribed).toBe(true);
  });

  it.each([
    [400, { error: 'Invalid email address' }, 'Invalid email address'],
    [
      429,
      { error: 'Too Many Requests', retryAfter: 600 },
      FORM_ERRORS.rateLimited,
    ],
    [
      504,
      { error: 'The request timed out. Please try again.' },
      'The request timed out. Please try again.',
    ],
    [500, {}, 'Failed to subscribe. Please try again.'],
  ])(
    '%i: shows a message and stays subscribable',
    async (status, body, shown) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => json(status, body))
      );
      await form.submit();
      expect(alertText()).toBe(shown);
      expect(useNewsletterStore.getState().newsletterSubscribed).toBe(false);
    }
  );

  it('no network: says so in plain words', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch')))
    );
    await form.submit();
    expect(alertText()).toBe(FORM_ERRORS.network);
  });

  it('no reCAPTCHA key: posts without a token', async () => {
    const fetchMock = vi.fn(async () => json(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    await form.submit();
    expect(sentBody(fetchMock)).not.toHaveProperty('recaptchaToken');
  });

  it('disables the button while subscribing', async () => {
    let release: (r: Response) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((r) => (release = r)))
    );
    await form.submit();
    const button = form.container.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Subscribing…');
    await act(async () => release(json(200, {})));
  });
});

describe('payload contract with api/subscribe (6.2)', () => {
  it('what the form sends is accepted by the real handler', async () => {
    const browserFetch = vi.fn(async () => json(200, {}));
    vi.stubGlobal('fetch', browserFetch);
    await form.submit();
    const payload = sentBody(browserFetch);

    const require = createRequire(import.meta.url);
    const subscribe = require('../../../api/subscribe/index.js');
    const {
      resetNewsletterRateLimitStore,
    } = require('../../../api/newsletterRateLimit.js');
    resetNewsletterRateLimitStore();
    const env: Record<string, string | undefined> = {
      ENTRAID_TENANT_ID: 't',
      ENTRAID_SP_APP_REGISTRATION_CLIENT_ID: 'c',
      ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET: 's',
      SHAREPOINT_SITE_ID: 'site',
      SHAREPOINT_LIST_ID: 'list',
      RECAPTCHA_SECRET_KEY: undefined,
    };
    const saved = Object.fromEntries(
      Object.keys(env).map((k) => [k, process.env[k]])
    );
    for (const [k, v] of Object.entries(env)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    const created: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, opts: RequestInit) => {
        if (String(url).includes('login.microsoftonline.com'))
          return json(200, { access_token: 'token' });
        created.push(JSON.parse(opts.body as string).fields.Email);
        return json(201, { id: '1' });
      })
    );
    const log = Object.assign(() => {}, { warn: () => {}, error: () => {} });
    try {
      // The Functions runtime parses a JSON body into an object.
      const res = await subscribe(
        { log },
        {
          method: 'POST',
          headers: {
            origin: 'https://terencewaters.com',
            'x-forwarded-for': '203.0.113.50',
          },
          body: payload,
        }
      );
      expect(res.status).toBe(200);
      expect(created).toEqual(['reader@example.com']);
    } finally {
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  });
});
