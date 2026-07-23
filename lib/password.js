'use strict';

/**
 * Password hashing utilities.
 *
 * Uses Node's built-in scrypt (no external dependencies) to derive a salted
 * hash for each password. The stored value is self-describing:
 *
 *   scrypt$<N>$<saltHex>$<hashHex>
 *
 * so the parameters used at creation time travel with the hash and can be
 * changed later without breaking existing accounts.
 */

const crypto = require('crypto');

// scrypt cost parameter. 2^15 is a reasonable default for interactive logins.
const DEFAULT_COST = 15;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

/**
 * Hash a plaintext password. Returns a self-describing string safe to store.
 * @param {string} password
 * @param {number} [cost] scrypt cost exponent (N = 2^cost)
 * @returns {Promise<string>}
 */
function hashPassword(password, cost = DEFAULT_COST) {
  return new Promise((resolve, reject) => {
    if (typeof password !== 'string' || password.length === 0) {
      reject(new Error('Password must be a non-empty string'));
      return;
    }

    const salt = crypto.randomBytes(SALT_BYTES);
    const N = 2 ** cost;

    crypto.scrypt(password, salt, KEY_LENGTH, { N, maxmem: 256 * N * 8 }, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`scrypt$${cost}$${salt.toString('hex')}$${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify a plaintext password against a stored hash. Uses a constant-time
 * comparison to avoid timing attacks. Returns false for malformed hashes
 * instead of throwing.
 * @param {string} password
 * @param {string} stored
 * @returns {Promise<boolean>}
 */
function verifyPassword(password, stored) {
  return new Promise((resolve, reject) => {
    if (typeof password !== 'string' || typeof stored !== 'string') {
      resolve(false);
      return;
    }

    const parts = stored.split('$');
    if (parts.length !== 4 || parts[0] !== 'scrypt') {
      resolve(false);
      return;
    }

    const cost = Number.parseInt(parts[1], 10);
    if (!Number.isInteger(cost) || cost < 1 || cost > 30) {
      resolve(false);
      return;
    }

    let salt;
    let expected;
    try {
      salt = Buffer.from(parts[2], 'hex');
      expected = Buffer.from(parts[3], 'hex');
    } catch (_err) {
      resolve(false);
      return;
    }

    const N = 2 ** cost;
    crypto.scrypt(password, salt, expected.length, { N, maxmem: 256 * N * 8 }, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        derivedKey.length === expected.length &&
          crypto.timingSafeEqual(derivedKey, expected)
      );
    });
  });
}

module.exports = { hashPassword, verifyPassword };
