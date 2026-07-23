'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { signToken, verifyToken } = require('../lib/token');

const SECRET = 'test-secret';

test('a freshly signed token verifies and returns its payload', () => {
  const now = 1_000_000;
  const token = signToken({ userId: 42, username: 'ada' }, SECRET, { now });
  const payload = verifyToken(token, SECRET, { now });
  assert.ok(payload);
  assert.strictEqual(payload.userId, 42);
  assert.strictEqual(payload.username, 'ada');
  assert.strictEqual(payload.iat, now);
  assert.ok(payload.exp > now);
});

test('verifyToken rejects a token signed with a different secret', () => {
  const token = signToken({ userId: 1 }, SECRET, { now: 0 });
  assert.strictEqual(verifyToken(token, 'other-secret', { now: 0 }), null);
});

test('verifyToken rejects a tampered payload', () => {
  const token = signToken({ userId: 1 }, SECRET, { now: 0 });
  const [, sig] = token.split('.');
  // Swap in a forged payload while keeping the original signature.
  const forgedPayload = Buffer.from(JSON.stringify({ userId: 999, exp: 9e15 }))
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  assert.strictEqual(verifyToken(`${forgedPayload}.${sig}`, SECRET, { now: 0 }), null);
});

test('verifyToken rejects an expired token', () => {
  const token = signToken({ userId: 1 }, SECRET, { now: 0, expiresInMs: 1000 });
  assert.ok(verifyToken(token, SECRET, { now: 999 }));      // still valid
  assert.strictEqual(verifyToken(token, SECRET, { now: 1000 }), null); // at expiry
  assert.strictEqual(verifyToken(token, SECRET, { now: 5000 }), null); // well past
});

test('verifyToken returns null for malformed input instead of throwing', () => {
  assert.strictEqual(verifyToken('', SECRET), null);
  assert.strictEqual(verifyToken('no-dot', SECRET), null);
  assert.strictEqual(verifyToken('a.b.c', SECRET), null);
  assert.strictEqual(verifyToken(null, SECRET), null);
  assert.strictEqual(verifyToken('x.y', SECRET), null);
});

test('signToken requires a secret', () => {
  assert.throws(() => signToken({ userId: 1 }, ''), /secret/);
});

test('tokens for the same payload differ only if inputs differ (deterministic given now)', () => {
  const a = signToken({ userId: 7 }, SECRET, { now: 123 });
  const b = signToken({ userId: 7 }, SECRET, { now: 123 });
  assert.strictEqual(a, b);
  const c = signToken({ userId: 7 }, SECRET, { now: 124 });
  assert.notStrictEqual(a, c);
});
