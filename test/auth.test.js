'use strict';

const test = require('node:test');
const assert = require('node:assert');
const {
  getAdminRole,
  requireAdmin,
  canManageAdmins,
  createRateLimiter
} = require('../lib/auth');

// --- Fakes -----------------------------------------------------------------

// A fake sqlite handle. `admins` maps user_id -> role. Setting `err` makes
// every query fail.
function fakeDb({ admins = {}, err = null } = {}) {
  return {
    get(_sql, params, cb) {
      if (err) {
        cb(err);
        return;
      }
      const userId = params[0];
      const role = admins[userId];
      cb(null, role ? { role } : undefined);
    }
  };
}

// A fake Express req with a header bag.
function fakeReq(headers = {}, extra = {}) {
  const lower = {};
  for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = v;
  return { get: (name) => lower[name.toLowerCase()], ...extra };
}

// A fake Express res that records status/json and whether next() ran.
function fakeRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

// --- getAdminRole ----------------------------------------------------------

test('getAdminRole resolves the role for an admin', async () => {
  const db = fakeDb({ admins: { 7: 'admin' } });
  assert.strictEqual(await getAdminRole(db, 7), 'admin');
});

test('getAdminRole resolves null for a non-admin', async () => {
  const db = fakeDb({ admins: { 7: 'admin' } });
  assert.strictEqual(await getAdminRole(db, 99), null);
});

test('getAdminRole resolves null for a missing user id without querying', async () => {
  let queried = false;
  const db = { get: () => { queried = true; } };
  assert.strictEqual(await getAdminRole(db, undefined), null);
  assert.strictEqual(queried, false);
});

test('getAdminRole rejects when the query errors', async () => {
  const db = fakeDb({ err: new Error('db down') });
  await assert.rejects(() => getAdminRole(db, 1), /db down/);
});

// --- requireAdmin ----------------------------------------------------------

// The middleware resolves the acting user via an injected extractor; here we
// read a plain property off the fake request.
const actingIdFrom = (req) => req.actingId || null;

test('requireAdmin returns 401 when no acting user is resolved', async () => {
  const mw = requireAdmin(fakeDb(), actingIdFrom);
  const res = fakeRes();
  let nextCalled = false;
  await mw(fakeReq({}), res, () => { nextCalled = true; });
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(nextCalled, false);
});

test('requireAdmin returns 403 for a non-admin user', async () => {
  const mw = requireAdmin(fakeDb({ admins: { 1: 'admin' } }), actingIdFrom);
  const res = fakeRes();
  let nextCalled = false;
  await mw(fakeReq({}, { actingId: '2' }), res, () => { nextCalled = true; });
  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(nextCalled, false);
});

test('requireAdmin calls next and sets acting fields for an admin', async () => {
  const mw = requireAdmin(fakeDb({ admins: { 5: 'moderator' } }), actingIdFrom);
  const res = fakeRes();
  const req = fakeReq({}, { actingId: '5' });
  let nextCalled = false;
  await mw(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true);
  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(req.actingUserId, '5');
  assert.strictEqual(req.actingRole, 'moderator');
});

test('requireAdmin returns 500 when the lookup errors', async () => {
  const mw = requireAdmin(fakeDb({ err: new Error('boom') }), actingIdFrom);
  const res = fakeRes();
  await mw(fakeReq({}, { actingId: '1' }), res, () => {});
  assert.strictEqual(res.statusCode, 500);
});

// --- canManageAdmins -------------------------------------------------------

test('canManageAdmins allows an existing admin', () => {
  assert.strictEqual(canManageAdmins({ callerIsAdmin: true }), true);
});

test('canManageAdmins allows a matching setup token', () => {
  assert.strictEqual(
    canManageAdmins({ callerIsAdmin: false, configuredToken: 'secret', providedToken: 'secret' }),
    true
  );
});

test('canManageAdmins rejects a non-admin without a valid token', () => {
  assert.strictEqual(
    canManageAdmins({ callerIsAdmin: false, configuredToken: 'secret', providedToken: 'wrong' }),
    false
  );
  // No token configured: a provided token must never grant access.
  assert.strictEqual(
    canManageAdmins({ callerIsAdmin: false, configuredToken: undefined, providedToken: 'anything' }),
    false
  );
});

// --- createRateLimiter -----------------------------------------------------

test('createRateLimiter allows up to max requests then blocks with 429', () => {
  let clock = 1000;
  const mw = createRateLimiter({ windowMs: 1000, max: 3, now: () => clock });
  const req = fakeReq({}, { ip: '1.2.3.4' });

  for (let i = 0; i < 3; i++) {
    const res = fakeRes();
    let passed = false;
    mw(req, res, () => { passed = true; });
    assert.strictEqual(passed, true, `request ${i + 1} should pass`);
    assert.strictEqual(res.statusCode, null);
  }

  const res = fakeRes();
  let passed = false;
  mw(req, res, () => { passed = true; });
  assert.strictEqual(passed, false);
  assert.strictEqual(res.statusCode, 429);
});

test('createRateLimiter forgets old hits once the window passes', () => {
  let clock = 0;
  const mw = createRateLimiter({ windowMs: 1000, max: 1, now: () => clock });
  const req = fakeReq({}, { ip: '9.9.9.9' });

  let res = fakeRes();
  mw(req, res, () => {});
  assert.strictEqual(res.statusCode, null); // first allowed

  res = fakeRes();
  mw(req, res, () => {});
  assert.strictEqual(res.statusCode, 429); // second blocked within window

  clock += 1001; // advance past the window
  res = fakeRes();
  let passed = false;
  mw(req, res, () => { passed = true; });
  assert.strictEqual(passed, true);
  assert.strictEqual(res.statusCode, null);
});

test('createRateLimiter tracks clients independently by IP', () => {
  const clock = 0;
  const mw = createRateLimiter({ windowMs: 1000, max: 1, now: () => clock });

  let res = fakeRes();
  mw(fakeReq({}, { ip: 'a' }), res, () => {});
  assert.strictEqual(res.statusCode, null);

  // Different IP still gets its own allowance.
  res = fakeRes();
  let passed = false;
  mw(fakeReq({}, { ip: 'b' }), res, () => { passed = true; });
  assert.strictEqual(passed, true);
  assert.strictEqual(res.statusCode, null);
});
