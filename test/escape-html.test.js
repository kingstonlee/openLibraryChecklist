'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { escapeHtml, safeUrl } = require('../static-version/escape.js');

test('escapeHtml neutralizes HTML-significant characters', () => {
  assert.strictEqual(
    escapeHtml('<script>alert(1)</script>'),
    '&lt;script&gt;alert(1)&lt;/script&gt;'
  );
  assert.strictEqual(escapeHtml('a & b'), 'a &amp; b');
  assert.strictEqual(escapeHtml('"quoted"'), '&quot;quoted&quot;');
  assert.strictEqual(escapeHtml("it's"), 'it&#39;s');
});

test('escapeHtml defuses an attribute-breakout image payload', () => {
  const payload = '"><img src=x onerror=alert(1)>';
  const escaped = escapeHtml(payload);
  assert.ok(!escaped.includes('<img'));
  assert.ok(!escaped.includes('">'));
});

test('escapeHtml returns an empty string for null/undefined', () => {
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');
});

test('escapeHtml stringifies non-string input', () => {
  assert.strictEqual(escapeHtml(42), '42');
  assert.strictEqual(escapeHtml(0), '0');
});

test('safeUrl allows http, https, and root-relative URLs', () => {
  assert.strictEqual(safeUrl('https://example.com'), 'https://example.com');
  assert.strictEqual(safeUrl('http://example.com'), 'http://example.com');
  assert.strictEqual(safeUrl('/local/path'), '/local/path');
  assert.strictEqual(safeUrl('  https://example.com  '), 'https://example.com');
});

test('safeUrl blocks script-capable schemes', () => {
  assert.strictEqual(safeUrl('javascript:alert(1)'), '');
  assert.strictEqual(safeUrl('data:text/html,<script>'), '');
  assert.strictEqual(safeUrl('vbscript:msgbox'), '');
  assert.strictEqual(safeUrl(''), '');
  assert.strictEqual(safeUrl(null), '');
});
