'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { validateLibrary, validateVisit, validateRegistration } = require('../lib/validation');

// --- validateLibrary -------------------------------------------------------

test('validateLibrary accepts a well-formed submission and trims/parses', () => {
  const { errors, value } = validateLibrary({
    name: '  Central Library  ',
    city: 'Los Angeles',
    county: 'Los Angeles',
    website: 'https://lapl.org',
    latitude: '34.05',
    longitude: '-118.25'
  });
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(value.name, 'Central Library');
  assert.strictEqual(value.latitude, 34.05);
  assert.strictEqual(value.longitude, -118.25);
});

test('validateLibrary requires name, city, and county', () => {
  const { errors } = validateLibrary({});
  assert.ok(errors.some((e) => e.includes('name')));
  assert.ok(errors.some((e) => e.includes('city')));
  assert.ok(errors.some((e) => e.includes('county')));
});

test('validateLibrary rejects out-of-range coordinates', () => {
  const { errors } = validateLibrary({ name: 'X', city: 'Y', county: 'Z', latitude: 200, longitude: 5 });
  assert.ok(errors.some((e) => e.includes('latitude')));
});

test('validateLibrary rejects a non-numeric coordinate', () => {
  const { errors } = validateLibrary({ name: 'X', city: 'Y', county: 'Z', latitude: 'abc' });
  assert.ok(errors.some((e) => e.includes('latitude')));
});

test('validateLibrary rejects a non-http website but allows empty', () => {
  const bad = validateLibrary({ name: 'X', city: 'Y', county: 'Z', website: 'javascript:alert(1)' });
  assert.ok(bad.errors.some((e) => e.includes('website')));
  const ok = validateLibrary({ name: 'X', city: 'Y', county: 'Z', website: '' });
  assert.deepStrictEqual(ok.errors, []);
});

test('validateLibrary enforces max lengths', () => {
  const { errors } = validateLibrary({ name: 'a'.repeat(201), city: 'Y', county: 'Z' });
  assert.ok(errors.some((e) => e.includes('name')));
});

// --- validateVisit ---------------------------------------------------------

test('validateVisit allows an absent rating', () => {
  const { errors, value } = validateVisit({ notes: 'nice' });
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(value.rating, null);
});

test('validateVisit accepts ratings 1..5 and rejects others', () => {
  assert.deepStrictEqual(validateVisit({ rating: 5 }).errors, []);
  assert.ok(validateVisit({ rating: 0 }).errors.length > 0);
  assert.ok(validateVisit({ rating: 6 }).errors.length > 0);
  assert.ok(validateVisit({ rating: 3.5 }).errors.length > 0);
});

test('validateVisit caps notes length', () => {
  const { errors } = validateVisit({ notes: 'x'.repeat(2001) });
  assert.ok(errors.some((e) => e.includes('notes')));
});

// --- validateRegistration --------------------------------------------------

test('validateRegistration accepts a valid registration', () => {
  const { errors, value } = validateRegistration({
    username: 'ada_lovelace',
    password: 'secret123',
    email: 'ada@example.com',
    display_name: 'Ada'
  });
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(value.username, 'ada_lovelace');
});

test('validateRegistration rejects short usernames and passwords', () => {
  assert.ok(validateRegistration({ username: 'ab', password: 'secret123' }).errors.some((e) => e.includes('username')));
  assert.ok(validateRegistration({ username: 'abc', password: '123' }).errors.some((e) => e.includes('password')));
});

test('validateRegistration rejects illegal username characters', () => {
  const { errors } = validateRegistration({ username: 'bad name!', password: 'secret123' });
  assert.ok(errors.some((e) => e.includes('username')));
});

test('validateRegistration rejects a malformed email but allows none', () => {
  assert.ok(validateRegistration({ username: 'abc', password: 'secret123', email: 'not-an-email' }).errors.some((e) => e.includes('email')));
  assert.deepStrictEqual(validateRegistration({ username: 'abc', password: 'secret123' }).errors, []);
});
