// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { BookingFlow } from './BookingFlow';
import {
  CONTACT_STEP_TEXT,
  LOCAL_STORAGE_KEY,
  MEETING_LENGTHS,
  QUESTION_SETS,
  SERVICE_OPTIONS,
  TIDYCAL_LINKS,
} from '@/components/ConsultationStepper/constants';
import { BOOKING_FLOW } from '@/content/site/booking';
import { FORM_ERRORS } from '@/content/site/contact';
import { json, mount, type Mounted } from '@/test/formHarness';

/**
 * Book a Conversation on /contact (redesign Slice 7): the old stepper's
 * steps and content, inline, with /api/leads mocked and TidyCal never called.
 */
let flow: Mounted;
const text = () => flow.container.textContent ?? '';
const button = (label: string) =>
  Array.from(flow.container.querySelectorAll('button')).find((b) =>
    (b.textContent ?? '').includes(label)
  )!;
const byLabel = (label: string) => {
  const l = Array.from(flow.container.querySelectorAll('label')).find((x) =>
    (x.textContent ?? '').trim().startsWith(label)
  )!;
  return flow.container.querySelector<HTMLInputElement>(
    `[id=\"${l.getAttribute('for')!}\"]`
  )!;
};
const serviceBox = (label: string) =>
  Array.from(flow.container.querySelectorAll('label'))
    .find((l) => (l.textContent ?? '').includes(label))!
    .querySelector('input')!;

/** Fill step 3 with a valid booking. */
function fillContact() {
  flow.type(`[id=\"${byLabel('Full Name').id}\"]`, 'Ana Li');
  flow.type(`[id=\"${byLabel('Email Address').id}\"]`, 'ana@example.com');
  flow.choose(`[id=\"${byLabel(CONTACT_STEP_TEXT.referral).id}\"]`, 'podcast');
}

async function toStep3(service = 'I don\u2019t know') {
  await flow.click(serviceBox(service === 'help' ? "I don't know" : service));
  await flow.click(button(BOOKING_FLOW.step1.next));
  await flow.click(button(BOOKING_FLOW.step2.next));
}

async function consentAndSchedule() {
  const consent = flow.container.querySelector<HTMLInputElement>(
    'input[type="checkbox"][required]'
  )!;
  await flow.click(consent);
  await flow.click(button(BOOKING_FLOW.step3.submit));
}

beforeEach(() => {
  localStorage.clear();
  flow = mount(<BookingFlow />);
});

afterEach(() => {
  flow.unmount();
  vi.unstubAllGlobals();
});

describe('step 1: services (unchanged content)', () => {
  it('lists every service from constants.ts, with its description', () => {
    for (const option of SERVICE_OPTIONS) {
      expect(text()).toContain(option.label);
      expect(text()).toContain(option.description);
    }
    expect(
      flow.container.querySelectorAll('input[type="checkbox"]')
    ).toHaveLength(SERVICE_OPTIONS.length);
  });

  it('shows progress: "Step 1 of 3" and the current step in the list', () => {
    expect(text()).toContain('Step 1 of 3');
    expect(
      flow.container.querySelector('[aria-current="step"]')?.textContent
    ).toContain('Services');
  });

  it('blocks Next until something is picked', async () => {
    await flow.click(button(BOOKING_FLOW.step1.next));
    expect(flow.container.querySelector('[role="alert"]')?.textContent).toBe(
      BOOKING_FLOW.step1.error
    );
    expect(text()).toContain('Step 1 of 3');
  });

  it('"Help me choose" clears the other picks', async () => {
    await flow.click(serviceBox('Web Development'));
    await flow.click(serviceBox("I don't know"));
    const checked = Array.from(
      flow.container.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]'
      )
    ).filter((c) => c.checked);
    expect(checked).toHaveLength(1);
  });
});

describe('step 2: the questions for the chosen service (unchanged content)', () => {
  it('asks the Resonance Core Framework questions, and requires the required ones', async () => {
    await flow.click(serviceBox('The Resonance Core Framework'));
    await flow.click(button(BOOKING_FLOW.step1.next));
    for (const q of QUESTION_SETS.resonance_coaching.questions)
      expect(text()).toContain(q.label);
    await flow.click(button(BOOKING_FLOW.step2.next));
    const required = QUESTION_SETS.resonance_coaching.questions.filter(
      (q) => q.required
    ).length;
    expect(
      flow.container.querySelectorAll('[aria-invalid="true"]')
    ).toHaveLength(required);
    expect(text()).toContain('Step 2 of 3');
  });

  it('keeps answers through Back and Next', async () => {
    await flow.click(serviceBox('The Resonance Core Framework'));
    await flow.click(button(BOOKING_FLOW.step1.next));
    const focus = byLabel(QUESTION_SETS.resonance_coaching.questions[0].label);
    flow.type(`[id=\"${focus.id}\"]`, 'Career clarity');
    await flow.click(button(BOOKING_FLOW.back));
    await flow.click(button(BOOKING_FLOW.step1.next));
    expect(
      byLabel(QUESTION_SETS.resonance_coaching.questions[0].label).value
    ).toBe('Career clarity');
  });

  it('saves a draft and restores it on the next visit', async () => {
    await flow.click(serviceBox('Web Development'));
    expect(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!).step1.services
    ).toEqual(['web_development']);
    flow.unmount();
    flow = mount(<BookingFlow />);
    await act(async () => {});
    expect(serviceBox('Web Development').checked).toBe(true);
  });
});

describe('step 3: contact, then /api/leads (mocked)', () => {
  it('shows the three meeting lengths and the consent text, unchanged', async () => {
    await toStep3('help');
    for (const m of MEETING_LENGTHS) {
      expect(text()).toContain(m.label);
      expect(text()).toContain(m.description);
    }
    expect(text()).toContain(CONTACT_STEP_TEXT.consentBefore);
  });

  it('requires name, email, how you heard, and consent', async () => {
    await toStep3('help');
    await flow.click(button(BOOKING_FLOW.step3.submit));
    expect(
      flow.container.querySelectorAll('[aria-invalid="true"]')
    ).toHaveLength(4);
    expect(text()).toContain(CONTACT_STEP_TEXT.errors.consent);
  });

  it('success: posts the lead, then shows the schedule step with TidyCal not yet loaded', async () => {
    const fetchMock = vi.fn(async () => json(200, { success: true }));
    vi.stubGlobal('fetch', fetchMock);
    await toStep3('help');
    fillContact();
    await consentAndSchedule();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/leads',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string
    );
    expect(body).toMatchObject({
      fullName: 'Ana Li',
      email: 'ana@example.com',
      services: ['help_me_choose'],
      preferredMeetingLength: '30',
      referralSource: 'podcast',
      consent: true,
    });
    expect(text()).toContain(BOOKING_FLOW.schedule.title);
    expect(flow.container.querySelector('iframe')).toBe(null);
  });

  it.each([
    [400, { error: 'Validation failed' }, BOOKING_FLOW.errors.generic],
    [429, { error: 'Too Many Requests' }, FORM_ERRORS.rateLimited],
    [
      504,
      { error: 'The request timed out. Please try again.' },
      'The request timed out. Please try again.',
    ],
  ])(
    '%i: says what happened, offers a message instead, and keeps the answers',
    async (status, body, shown) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => json(status, body))
      );
      await toStep3('help');
      fillContact();
      await consentAndSchedule();
      const alert = flow.container.querySelector('[role="alert"]')!;
      expect(alert.textContent).toContain(shown);
      expect(alert.querySelector('a')?.getAttribute('href')).toBe(
        '/contact/#message'
      );
      expect(byLabel('Full Name').value).toBe('Ana Li');
    }
  );

  it('no network: says so in plain words', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch')))
    );
    await toStep3('help');
    fillContact();
    await consentAndSchedule();
    expect(
      flow.container.querySelector('[role="alert"]')?.textContent
    ).toContain(FORM_ERRORS.network);
  });
});

describe('the TidyCal step (click to load, no live call)', () => {
  beforeEach(async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json(200, {}))
    );
    await toStep3('help');
    fillContact();
    await consentAndSchedule();
  });

  it('builds the prefilled link for the chosen length, with the note capped at 500 characters', () => {
    const link = flow.container.querySelector<HTMLAnchorElement>(
      'a[target="_blank"][href*="tidycal"]'
    )!;
    const url = new URL(link.href);
    expect(`${url.origin}${url.pathname}`).toBe(TIDYCAL_LINKS['30']);
    expect(url.searchParams.get('name')).toBe('Ana Li');
    expect(url.searchParams.get('email')).toBe('ana@example.com');
    expect(url.searchParams.get('notes')!.length).toBeLessThanOrEqual(500);
  });

  it('loads the calendar frame only when asked', async () => {
    expect(flow.container.querySelector('iframe')).toBe(null);
    await flow.click(button(BOOKING_FLOW.schedule.load));
    expect(
      flow.container.querySelector('iframe')?.getAttribute('src')
    ).toContain(TIDYCAL_LINKS['30']);
  });

  it('"I\'ve Scheduled My Time" clears the draft and says you\'re booked', async () => {
    await flow.click(button(BOOKING_FLOW.schedule.done));
    expect(text()).toContain(BOOKING_FLOW.success.title);
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(null);
  });
});
