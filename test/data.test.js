'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const libraries = require('../data/libraries.json');
const { buildStaticDataFile, OUTPUT_PATH } = require('../scripts/generate-static-data.js');

const REQUIRED_FIELDS = [
  'name', 'library_system', 'branch_name', 'address',
  'city', 'county', 'zip_code', 'phone', 'website', 'latitude', 'longitude'
];

test('data/libraries.json is a non-empty array', () => {
  assert.ok(Array.isArray(libraries));
  assert.ok(libraries.length > 0);
});

test('every library has the required fields', () => {
  for (const lib of libraries) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(field in lib, `missing ${field} in ${JSON.stringify(lib.name)}`);
    }
    assert.ok(lib.name && lib.city && lib.county, `name/city/county required: ${lib.name}`);
  }
});

test('coordinates are within valid ranges', () => {
  for (const lib of libraries) {
    assert.ok(typeof lib.latitude === 'number' && lib.latitude >= -90 && lib.latitude <= 90,
      `bad latitude for ${lib.name}`);
    assert.ok(typeof lib.longitude === 'number' && lib.longitude >= -180 && lib.longitude <= 180,
      `bad longitude for ${lib.name}`);
  }
});

test('websites, when present, use http(s)', () => {
  for (const lib of libraries) {
    if (lib.website) {
      assert.match(lib.website, /^https?:\/\//, `bad website for ${lib.name}`);
    }
  }
});

test('there are no duplicate library names', () => {
  const names = libraries.map((l) => l.name);
  assert.strictEqual(new Set(names).size, names.length);
});

test('static-version/data.js is in sync with data/libraries.json', () => {
  const expected = buildStaticDataFile(libraries);
  const actual = fs.readFileSync(OUTPUT_PATH, 'utf8');
  assert.strictEqual(
    actual,
    expected,
    'static-version/data.js is stale — run `npm run generate:data`'
  );
});
