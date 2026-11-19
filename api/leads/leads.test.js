'use strict';

/**
 * Tests for the leads handler (the Book a Conversation flow posts here before
 * the schedule step). Added in redesign Slice 7; the handler had none.
 *
 * Graph (Entra ID token + SharePoint list item create) is stubbed through
 * global fetch; nothing leaves the machine. Each test uses its own client IP
 * so the in-memory rate limit doesn't leak between tests.
 *
 * Run with: node --test leads/leads.test.js (from api/), or `npm test`.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const leads = require('./index');

const FAST_HTTP_ENV = {
  API_HTTP_TIMEOUT_MS: '20',
  API_HTTP_RETRY_BASE_DELAY_MS: '1',
};

const GRAPH_ENV = {
  ...FAST_HTTP_ENV,
  ENTRAID_TENANT_ID: 'tenant-id',
  ENTRAID_SP_APP_REGISTRATION_CLIENT_ID: 'client-id',
  ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET: 'client-secret',
  SHAREPOINT_SITE_ID: 'site-id',
  LEADS_LIST_ID: 'leads-list-id',
};

/** The payload the /contact booking flow sends (see ConsultationStepper/lead.ts). */
function validPayload(overrides = {}) {
  return {
    fullName: 'Ana Li',
    email: 'ana@example.com',
    phone: '',
    company: '',
    services: ['resonance_coaching'],
    answers: { rc_focus: 'Career clarity' },
    preferredMeetingLength: '30',
    referralSource: 'podcast',
    consent: true,
    submittedAt: '2026-11-18T20:00:00.000Z',
    ...overrides,
  };
}

function withEnv(vars) {
  const previous = Object.entries(vars).map(([k, v]) => [k, process.env[k]]);
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return () => {
    for (const [k, v] of previous) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
}

function createContext() {
  const logs = [];
  const log = (...args) => logs.push(args.join(' '));
  log.warn = (...args) => logs.push(args.join(' '));
  log.error = (...args) => logs.push(args.join(' '));
  return { log, logs, res: undefined };
}

function post(ip, body, headers = {}) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://terencewaters.com',
      'x-forwarded-for': ip,
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

/** Stubs fetch: token → 200; list item create → `create(opts)`. */
function stubGraph(create) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = (url, opts) => {
    const target = String(url);
    calls.push(target);
    if (target.includes('login.microsoftonline.com')) {
      return Promise.resolve(new Response(JSON.stringify({ access_token: 'token' }), { status: 200 }));
    }
    return create(opts);
  };
  return { calls, restore: () => (globalThis.fetch = original) };
}

test('leads: a valid booking is written to the SharePoint list (200)', async () => {
  const restoreEnv = withEnv(GRAPH_ENV);
  let sentFields;
  const graph = stubGraph((opts) => {
    sentFields = JSON.parse(opts.body).fields;
    return Promise.resolve(new Response(JSON.stringify({ id: '7', webUrl: 'https://sp/item/7' }), { status: 201 }));
  });
  const context = createContext();
  try {
    await leads(context, post('198.51.100.1', validPayload()));
    assert.equal(context.res.status, 200);
    assert.equal(JSON.parse(context.res.body).success, true);
    assert.deepEqual(sentFields.ServicesSelected, ['Resonance Core Framework Coaching']);
    assert.equal(sentFields.ConsentGiven, true);
    assert.equal(sentFields.PreferredMeetingLength, '30');
    assert.equal(sentFields.SubmittedAt, '2026-11-18T20:00:00Z', 'milliseconds are stripped');
    assert.equal('Phone' in sentFields, false, 'empty strings are not sent to Graph');
  } finally {
    graph.restore();
    restoreEnv();
  }
});

test('leads: missing consent, bad email or meeting length is a 400 with details', async () => {
  const restoreEnv = withEnv(GRAPH_ENV);
  const context = createContext();
  try {
    await leads(
      context,
      post('198.51.100.2', validPayload({ consent: false, email: 'nope', preferredMeetingLength: '60', services: [] }))
    );
    assert.equal(context.res.status, 400);
    const body = JSON.parse(context.res.body);
    assert.equal(body.error, 'Validation failed');
    assert.equal(body.details.length, 4);
  } finally {
    restoreEnv();
  }
});

test('leads: malformed JSON is a 400', async () => {
  const context = createContext();
  await leads(context, { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.3' }, body: '{not json' });
  assert.equal(context.res.status, 400);
});

test('leads: a disallowed origin is refused (403), an allowed one passes the preflight (204)', async () => {
  const restoreEnv = withEnv({ LEAD_ALLOWED_ORIGINS: 'https://terencewaters.com,https://www.terencewaters.com' });
  try {
    const refused = createContext();
    await leads(refused, post('198.51.100.4', validPayload(), { origin: 'https://evil.example' }));
    assert.equal(refused.res.status, 403);

    const preflight = createContext();
    await leads(preflight, { method: 'OPTIONS', headers: { origin: 'https://www.terencewaters.com/' } });
    assert.equal(preflight.res.status, 204);
    assert.equal(preflight.res.headers['Access-Control-Allow-Origin'], 'https://www.terencewaters.com');
  } finally {
    restoreEnv();
  }
});

test('leads: too many requests from one address is a 429 with Retry-After', async () => {
  const restoreEnv = withEnv({ LEAD_RATE_LIMIT_MAX_REQUESTS: '1', ...Object.fromEntries(Object.keys(GRAPH_ENV).map((k) => [k, undefined])) });
  try {
    const first = createContext();
    await leads(first, post('198.51.100.5', validPayload()));
    assert.equal(first.res.status, 200, 'accepted (not persisted: no Graph config)');

    const second = createContext();
    await leads(second, post('198.51.100.5', validPayload()));
    assert.equal(second.res.status, 429);
    assert.ok(Number(second.res.headers['Retry-After']) > 0);
  } finally {
    restoreEnv();
  }
});

test('leads: a Graph create that never answers surfaces as 504, tried once', async () => {
  const restoreEnv = withEnv(GRAPH_ENV);
  let creates = 0;
  const graph = stubGraph(
    (opts) =>
      new Promise((_resolve, reject) => {
        creates += 1;
        opts.signal.addEventListener('abort', () => {
          const err = new Error('This operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      })
  );
  const context = createContext();
  try {
    await leads(context, post('198.51.100.6', validPayload()));
    assert.equal(context.res.status, 504);
    assert.match(JSON.parse(context.res.body).error, /timed out/i);
    assert.equal(creates, 1, 'a timeout is not retried (it may have been written)');
  } finally {
    graph.restore();
    restoreEnv();
  }
});

test('leads: without SharePoint settings the lead is accepted but not persisted (200)', async () => {
  const restoreEnv = withEnv(Object.fromEntries(Object.keys(GRAPH_ENV).map((k) => [k, undefined])));
  const context = createContext();
  try {
    await leads(context, post('198.51.100.7', validPayload()));
    assert.equal(context.res.status, 200);
    assert.equal(JSON.parse(context.res.body).note, 'accepted but not persisted');
  } finally {
    restoreEnv();
  }
});
