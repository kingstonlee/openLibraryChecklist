'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { hashPassword, verifyPassword } = require('../lib/password');

// Use a low cost in tests so they run quickly.
const TEST_COST = 12;

test('hashPassword produces a self-describing scrypt string', async () => {
  const hash = await hashPassword('correct horse battery staple', TEST_COST);
  const parts = hash.split('$');
  assert.strictEqual(parts.length, 4);
  assert.strictEqual(parts[0], 'scrypt');
  assert.strictEqual(parts[1], String(TEST_COST));
  assert.ok(parts[2].length > 0, 'salt should be present');
  assert.ok(parts[3].length > 0, 'derived key should be present');
});

test('the same password hashes to different values (unique salts)', async () => {
  const a = await hashPassword('same-password', TEST_COST);
  const b = await hashPassword('same-password', TEST_COST);
  assert.notStrictEqual(a, b);
});

test('verifyPassword accepts the correct password', async () => {
  const hash = await hashPassword('s3cret!', TEST_COST);
  assert.strictEqual(await verifyPassword('s3cret!', hash), true);
});

test('verifyPassword rejects an incorrect password', async () => {
  const hash = await hashPassword('s3cret!', TEST_COST);
  assert.strictEqual(await verifyPassword('wrong', hash), false);
});

test('verifyPassword returns false for malformed hashes instead of throwing', async () => {
  assert.strictEqual(await verifyPassword('anything', 'not-a-hash'), false);
  assert.strictEqual(await verifyPassword('anything', ''), false);
  assert.strictEqual(await verifyPassword('anything', 'scrypt$15$xyz'), false);
  // Legacy base64 values from the old scheme must never validate.
  assert.strictEqual(
    await verifyPassword('password', Buffer.from('password').toString('base64')),
    false
  );
});

test('hashPassword rejects empty passwords', async () => {
  await assert.rejects(() => hashPassword(''), /non-empty string/);
});
