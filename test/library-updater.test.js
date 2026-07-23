'use strict';

const test = require('node:test');
const assert = require('node:assert');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(
  path.join(__dirname, '..', 'static-version', 'library-updater.js'),
  'utf8'
);
const CANONICAL = require('../data/libraries.json');

function makeLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
}

function makeStorage() {
  const libs = [];
  return {
    libs,
    async getLibraries() { return libs; },
    async getAll() { return libs; },
    async addLibrary(lib) { libs.push(lib); return libs.length; }
  };
}

// Load library-updater.js in an isolated context with browser globals faked.
function loadUpdater({ version, libraries = CANONICAL } = {}) {
  const storage = makeStorage();
  const localStorage = makeLocalStorage(version ? { libraryTrackerVersion: version } : {});
  const context = {
    console: { log() {}, warn() {}, error() {} },
    window: {},
    Date,
    CALIFORNIA_LIBRARIES: libraries,
    localStorage,
    storage
  };
  vm.createContext(context);
  vm.runInContext(SRC, context);
  return { context, storage, localStorage };
}

test('LIBRARY_UPDATES includes a 1.6.0 entry sourced from CALIFORNIA_LIBRARIES', () => {
  const { context } = loadUpdater();
  const updates = context.window.LIBRARY_UPDATES;
  assert.ok(updates['1.6.0'], 'expected a 1.6.0 update');
  assert.strictEqual(updates['1.6.0'].libraries.length, CANONICAL.length);
});

test('a fresh install receives every canonical library', async () => {
  const { context, storage, localStorage } = loadUpdater(); // no stored version → 0.0.0
  const result = await context.window.libraryUpdater.checkForUpdates();
  assert.strictEqual(result.success, true);

  const names = new Set(storage.libs.map((l) => l.name));
  for (const lib of CANONICAL) {
    assert.ok(names.has(lib.name), `missing canonical library: ${lib.name}`);
  }
  // checkForUpdates advances the stored version to the latest.
  assert.strictEqual(localStorage.getItem('libraryTrackerVersion'), '1.6.0');
});

test('an existing 1.5.0 user is upgraded to the full set via 1.6.0', async () => {
  const { context, storage, localStorage } = loadUpdater({ version: '1.5.0' });
  const result = await context.window.libraryUpdater.checkForUpdates();
  assert.strictEqual(result.success, true);
  // Only the new 1.6.0 batch applies; it adds the full canonical set.
  assert.strictEqual(storage.libs.length, CANONICAL.length);
  assert.strictEqual(localStorage.getItem('libraryTrackerVersion'), '1.6.0');
});

test('re-running updates is a no-op once on the latest version', async () => {
  const { context, storage } = loadUpdater({ version: '1.6.0' });
  const result = await context.window.libraryUpdater.checkForUpdates();
  assert.strictEqual(result.success, true);
  assert.strictEqual(storage.libs.length, 0); // nothing pending, nothing added
});
