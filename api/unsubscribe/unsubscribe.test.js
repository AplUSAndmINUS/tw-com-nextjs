'use strict';

/**
 * Unit tests for api/unsubscribe/index.js
 *
 * Run with: node api/unsubscribe/unsubscribe.test.js
 * (from the repository root, or adjust the require path accordingly)
 */

const assert = require('assert');
const { escapeODataString } = require('./index');

// --- escapeODataString ---

// Plain email — no single quotes, value must be unchanged.
assert.strictEqual(
  escapeODataString('user@example.com'),
  'user@example.com',
  'Plain email should pass through unchanged'
);

// Email with a single quote (valid in RFC 5321, e.g. o'hara@example.com).
// The quote must be doubled so OData parses it as a literal character.
assert.strictEqual(
  escapeODataString("o'hara@example.com"),
  "o''hara@example.com",
  "Single quote in email must be doubled"
);

// Classic filter-injection attempt: user@example.com' or '1'='1
// Every single quote must be doubled so the injected fragment stays inside
// the string literal and cannot alter the filter predicate.
assert.strictEqual(
  escapeODataString("user@example.com' or '1'='1"),
  "user@example.com'' or ''1''=''1",
  'Injection attempt must have all single quotes doubled'
);

// Multiple consecutive single quotes.
assert.strictEqual(
  escapeODataString("a''b@example.com"),
  "a''''b@example.com",
  'Consecutive single quotes must each be doubled'
);

// Empty string — edge case, must return empty string unchanged.
assert.strictEqual(
  escapeODataString(''),
  '',
  'Empty string must remain empty'
);

console.log('All escapeODataString tests passed.');
