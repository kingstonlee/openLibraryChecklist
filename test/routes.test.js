'use strict';

// Integration tests that exercise the real Express app over HTTP with an
// injected fake database, so no native modules (sqlite3/sharp) are needed.

process.env.SESSION_SECRET = 'test-secret-for-routes';
process.env.CORS_ORIGINS = 'https://allowed.example';

const test = require('node:test');
const assert = require('node:assert');
const { after, before } = require('node:test');

const { app, setDatabaseForTest } = require('../server.js');
const { signToken } = require('../lib/token');
const { hashPassword } = require('../lib/password');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => {
  if (server) server.close();
});

// Build a fake sqlite3-style handle from simple handler functions.
// run() invokes its callback with `this` bound to { lastID, changes }.
function fakeDb({ get, all, run } = {}) {
  return {
    get(sql, params, cb) {
      try {
        cb(null, get ? get(sql, params) : undefined);
      } catch (err) {
        cb(err);
      }
    },
    all(sql, params, cb) {
      try {
        cb(null, all ? all(sql, params) : []);
      } catch (err) {
        cb(err);
      }
    },
    run(sql, params, cb) {
      const ctx = { lastID: 1, changes: 1 };
      let result = ctx;
      try {
        if (run) result = run(sql, params) || ctx;
      } catch (err) {
        if (cb) cb.call(ctx, err);
        return;
      }
      if (cb) cb.call(result, null);
    }
  };
}

const token = (payload) => signToken(payload, 'test-secret-for-routes');

test('GET /api/libraries returns the rows as JSON', async () => {
  setDatabaseForTest(fakeDb({ all: () => [{ id: 1, name: 'Central' }] }));
  const res = await fetch(`${baseUrl}/api/libraries`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(body, [{ id: 1, name: 'Central' }]);
});

test('POST /api/libraries rejects an invalid submission with 400', async () => {
  setDatabaseForTest(fakeDb({}));
  const res = await fetch(`${baseUrl}/api/libraries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.error, 'Validation failed');
  assert.ok(Array.isArray(body.details));
});

test('POST /api/libraries stores a valid submission and returns its id', async () => {
  setDatabaseForTest(fakeDb({ run: () => ({ lastID: 99, changes: 1 }) }));
  const res = await fetch(`${baseUrl}/api/libraries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New Library', city: 'Fresno', county: 'Fresno' })
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.id, 99);
});

test('admin endpoint returns 401 without a token', async () => {
  setDatabaseForTest(fakeDb({}));
  const res = await fetch(`${baseUrl}/api/admin/pending-libraries`);
  assert.strictEqual(res.status, 401);
});

test('admin endpoint returns 403 for a non-admin token', async () => {
  setDatabaseForTest(fakeDb({ get: () => undefined })); // no admin_users row
  const res = await fetch(`${baseUrl}/api/admin/pending-libraries`, {
    headers: { Authorization: `Bearer ${token({ userId: 2, username: 'bob' })}` }
  });
  assert.strictEqual(res.status, 403);
});

test('admin endpoint returns 200 for an admin token', async () => {
  setDatabaseForTest(fakeDb({
    get: (sql) => (sql.includes('admin_users') ? { role: 'admin' } : undefined),
    all: () => []
  }));
  const res = await fetch(`${baseUrl}/api/admin/pending-libraries`, {
    headers: { Authorization: `Bearer ${token({ userId: 1, username: 'admin' })}` }
  });
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), []);
});

test('admin endpoint rejects a token signed with the wrong secret', async () => {
  setDatabaseForTest(fakeDb({ get: () => ({ role: 'admin' }) }));
  const forged = signToken({ userId: 1 }, 'wrong-secret');
  const res = await fetch(`${baseUrl}/api/admin/pending-libraries`, {
    headers: { Authorization: `Bearer ${forged}` }
  });
  assert.strictEqual(res.status, 401);
});

test('POST /api/auth/login rejects bad credentials with 401', async () => {
  setDatabaseForTest(fakeDb({ get: () => undefined })); // user not found
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'ghost', password: 'whatever' })
  });
  assert.strictEqual(res.status, 401);
});

test('POST /api/auth/login issues a token for valid credentials', async () => {
  const password_hash = await hashPassword('correct-password', 12);
  setDatabaseForTest(fakeDb({
    get: () => ({ id: 7, username: 'ada', password_hash, display_name: 'Ada' })
  }));
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'ada', password: 'correct-password' })
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(typeof body.token === 'string' && body.token.length > 0);
  assert.strictEqual(body.user.id, 7);
});

test('POST /api/auth/register rejects a weak password with 400', async () => {
  setDatabaseForTest(fakeDb({}));
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'newuser', password: '123' })
  });
  assert.strictEqual(res.status, 400);
});

test('unknown routes return a 404 JSON error', async () => {
  setDatabaseForTest(fakeDb({}));
  const res = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.strictEqual(res.status, 404);
});
