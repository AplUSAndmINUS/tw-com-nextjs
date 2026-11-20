'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { decodeEntities } = require('./index');

test('decodes the entities YouTube search puts in titles (#334)', () => {
  assert.equal(
    decodeEntities('You&#39;re Listening, But You&#39;re Not'),
    "You're Listening, But You're Not"
  );
  assert.equal(decodeEntities('Q&amp;A &quot;live&quot; &#x2019;'), 'Q&A "live" ’');
});

test('decodes &amp; last, so "&amp;#39;" stays literal text', () => {
  assert.equal(decodeEntities('&amp;#39;'), '&#39;');
});

test('leaves non-strings and out-of-range code points alone', () => {
  assert.equal(decodeEntities(undefined), undefined);
  assert.equal(decodeEntities('&#99999999;'), '&#99999999;');
});
