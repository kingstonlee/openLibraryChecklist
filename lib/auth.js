'use strict';

/**
 * Authorization helpers for the server API.
 *
 * These are dependency-injected (the SQLite handle and a clock are passed in)
 * so they can be unit-tested without booting Express or installing native
 * modules like sqlite3 / sharp.
 */

/**
 * Look up whether a user id has an admin_users row.
 * @param {{get: Function}} db  sqlite3-style handle with .get(sql, params, cb)
 * @param {number|string|null|undefined} userId
 * @returns {Promise<string|null>} the role, or null if not an admin
 */
function getAdminRole(db, userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve(null);
      return;
    }
    db.get('SELECT role FROM admin_users WHERE user_id = ?', [userId], (err, admin) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(admin ? admin.role : null);
    });
  });
}

/**
 * Build an Express middleware that only allows admins through. The acting user
 * is identified by the `x-user-id` request header and must have an admin_users
 * row. Sets req.actingUserId / req.actingRole on success.
 * @param {{get: Function}} db
 * @returns {Function} Express middleware
 */
function requireAdmin(db) {
  return async function (req, res, next) {
    const actingUserId = req.get('x-user-id');
    if (!actingUserId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    try {
      const role = await getAdminRole(db, actingUserId);
      if (!role) {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }
      req.actingUserId = actingUserId;
      req.actingRole = role;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

/**
 * Decide whether a caller may grant/revoke admin rights. A caller qualifies if
 * they are already an admin, or they present a setup token matching the
 * server-configured secret.
 * @param {{callerIsAdmin: boolean, configuredToken?: string, providedToken?: string}} opts
 * @returns {boolean}
 */
function canManageAdmins({ callerIsAdmin, configuredToken, providedToken }) {
  if (callerIsAdmin) return true;
  return !!configuredToken && providedToken === configuredToken;
}

/**
 * Create a simple in-memory rate limiter middleware (no external dependency).
 * @param {{windowMs: number, max: number, message?: string, now?: Function}} opts
 * @returns {Function} Express middleware
 */
function createRateLimiter({ windowMs, max, message, now = () => Date.now() }) {
  const hits = new Map();
  return (req, res, next) => {
    const current = now();
    const key = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
    const timestamps = (hits.get(key) || []).filter((t) => current - t < windowMs);
    timestamps.push(current);
    hits.set(key, timestamps);

    // Opportunistic cleanup so the map doesn't grow unbounded.
    if (hits.size > 5000) {
      for (const [k, ts] of hits) {
        if (ts.every((t) => current - t >= windowMs)) hits.delete(k);
      }
    }

    if (timestamps.length > max) {
      res.status(429).json({ error: message || 'Too many requests, please try again later.' });
      return;
    }
    next();
  };
}

module.exports = { getAdminRole, requireAdmin, canManageAdmins, createRateLimiter };
