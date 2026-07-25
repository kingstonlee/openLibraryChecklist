'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { paginate } = require('../static-version/paginate.js');

const nums = (n) => Array.from({ length: n }, (_, i) => i + 1);

test('splits a list into pages of the given size', () => {
  const r = paginate(nums(10), 1, 4);
  assert.deepStrictEqual(r.items, [1, 2, 3, 4]);
  assert.strictEqual(r.page, 1);
  assert.strictEqual(r.totalPages, 3);
  assert.strictEqual(r.total, 10);
  assert.strictEqual(r.start, 0);
  assert.strictEqual(r.end, 4);
});

test('returns the correct slice for a middle page', () => {
  const r = paginate(nums(10), 2, 4);
  assert.deepStrictEqual(r.items, [5, 6, 7, 8]);
  assert.strictEqual(r.end, 8);
});

test('the last page may be partial', () => {
  const r = paginate(nums(10), 3, 4);
  assert.deepStrictEqual(r.items, [9, 10]);
  assert.strictEqual(r.page, 3);
  assert.strictEqual(r.end, 10);
});

test('clamps a too-large page to the last page', () => {
  const r = paginate(nums(10), 99, 4);
  assert.strictEqual(r.page, 3);
  assert.deepStrictEqual(r.items, [9, 10]);
});

test('clamps a non-positive or non-numeric page to 1', () => {
  assert.strictEqual(paginate(nums(10), 0, 4).page, 1);
  assert.strictEqual(paginate(nums(10), -5, 4).page, 1);
  assert.strictEqual(paginate(nums(10), 'abc', 4).page, 1);
});

test('an empty list yields one empty page', () => {
  const r = paginate([], 1, 10);
  assert.deepStrictEqual(r.items, []);
  assert.strictEqual(r.totalPages, 1);
  assert.strictEqual(r.total, 0);
  assert.strictEqual(r.end, 0);
});

test('a non-positive page size puts everything on one page', () => {
  const r = paginate(nums(5), 1, 0);
  assert.strictEqual(r.totalPages, 1);
  assert.deepStrictEqual(r.items, [1, 2, 3, 4, 5]);
});

test('is safe when given a non-array', () => {
  const r = paginate(null, 1, 10);
  assert.deepStrictEqual(r.items, []);
  assert.strictEqual(r.total, 0);
});
