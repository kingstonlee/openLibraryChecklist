'use strict';

/**
 * Stateless signed session tokens.
 *
 * A token is `<payloadB64url>.<signatureB64url>` where the signature is an
 * HMAC-SHA256 of the payload segment keyed by a server-side secret. Because the
 * secret never leaves the server, clients cannot forge or tamper with a token
 * (e.g. to claim another user's id) — which is what makes it safe to derive the
 * acting user from the token instead of a client-supplied header.
 *
 * This uses only Node's built-in `crypto`, so there is no external dependency
 * and it is fully unit-testable.
 */

const crypto = require('crypto');

function base64urlEncode(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sign(payloadSegment, secret) {
  return base64urlEncode(crypto.createHmac('sha256', secret).update(payloadSegment).digest());
}

/**
 * Create a signed token embedding the given payload plus an expiry.
 * @param {object} payload  e.g. { userId, username }
 * @param {string} secret
 * @param {{expiresInMs?: number, now?: number}} [opts]
 * @returns {string}
 */
function signToken(payload, secret, opts = {}) {
  if (!secret) throw new Error('A signing secret is required');
  const now = opts.now ?? Date.now();
  const expiresInMs = opts.expiresInMs ?? 7 * 24 * 60 * 60 * 1000; // 7 days
  const body = { ...payload, iat: now, exp: now + expiresInMs };
  const payloadSegment = base64urlEncode(JSON.stringify(body));
  return `${payloadSegment}.${sign(payloadSegment, secret)}`;
}

/**
 * Verify a token's signature and expiry. Returns the payload on success, or
 * null for any malformed/tampered/expired token (never throws on bad input).
 * @param {string} token
 * @param {string} secret
 * @param {{now?: number}} [opts]
 * @returns {object|null}
 */
function verifyToken(token, secret, opts = {}) {
  if (typeof token !== 'string' || !secret) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadSegment, signature] = parts;
  const expected = sign(payloadSegment, secret);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(base64urlDecode(payloadSegment).toString('utf8'));
  } catch (_err) {
    return null;
  }

  const now = opts.now ?? Date.now();
  if (typeof payload.exp !== 'number' || now >= payload.exp) {
    return null;
  }

  return payload;
}

module.exports = { signToken, verifyToken };
