'use strict';

/**
 * Input validation for API request bodies.
 *
 * Each validator returns `{ errors: string[], value: object }`. `errors` is
 * empty when the input is valid; `value` holds the cleaned/normalized fields
 * (trimmed strings, parsed numbers) ready to persist. Pure functions with no
 * dependencies, so they are trivial to unit-test.
 */

const LIMITS = {
  name: 200,
  library_system: 200,
  branch_name: 200,
  address: 300,
  city: 120,
  county: 120,
  zip_code: 20,
  phone: 40,
  website: 500,
  username: 50,
  display_name: 120,
  email: 254,
  visitor_name: 120,
  notes: 2000,
  password: 200
};

function isString(v) {
  return typeof v === 'string';
}

// Normalize to a trimmed string ('' for null/undefined/other types).
function str(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

// Validate an optional URL field: allow empty, otherwise require http(s).
function optionalHttpUrl(value, field, errors) {
  const v = str(value);
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) {
    errors.push(`${field} must start with http:// or https://`);
  } else if (v.length > LIMITS.website) {
    errors.push(`${field} must be at most ${LIMITS.website} characters`);
  }
  return v;
}

// Validate an optional coordinate within [min, max]. Returns null if absent.
function optionalCoordinate(value, field, min, max, errors) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) {
    errors.push(`${field} must be a number`);
    return null;
  }
  if (n < min || n > max) {
    errors.push(`${field} must be between ${min} and ${max}`);
    return null;
  }
  return n;
}

// Enforce a max length on an optional string field.
function optionalCapped(value, field, max, errors) {
  const v = str(value);
  if (v.length > max) {
    errors.push(`${field} must be at most ${max} characters`);
  }
  return v;
}

/**
 * Validate a library submission (POST /api/libraries).
 */
function validateLibrary(body = {}) {
  const errors = [];

  const name = str(body.name);
  if (!name) errors.push('name is required');
  else if (name.length > LIMITS.name) errors.push(`name must be at most ${LIMITS.name} characters`);

  const city = str(body.city);
  if (!city) errors.push('city is required');
  else if (city.length > LIMITS.city) errors.push(`city must be at most ${LIMITS.city} characters`);

  const county = str(body.county);
  if (!county) errors.push('county is required');
  else if (county.length > LIMITS.county) errors.push(`county must be at most ${LIMITS.county} characters`);

  const value = {
    name,
    city,
    county,
    library_system: optionalCapped(body.library_system, 'library_system', LIMITS.library_system, errors),
    branch_name: optionalCapped(body.branch_name, 'branch_name', LIMITS.branch_name, errors),
    address: optionalCapped(body.address, 'address', LIMITS.address, errors),
    zip_code: optionalCapped(body.zip_code, 'zip_code', LIMITS.zip_code, errors),
    phone: optionalCapped(body.phone, 'phone', LIMITS.phone, errors),
    website: optionalHttpUrl(body.website, 'website', errors),
    latitude: optionalCoordinate(body.latitude, 'latitude', -90, 90, errors),
    longitude: optionalCoordinate(body.longitude, 'longitude', -180, 180, errors)
  };

  return { errors, value };
}

/**
 * Validate a visit (POST /api/libraries/:id/visits).
 */
function validateVisit(body = {}) {
  const errors = [];

  let rating = null;
  if (body.rating !== undefined && body.rating !== null && body.rating !== '') {
    const n = Number(body.rating);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      errors.push('rating must be an integer between 1 and 5');
    } else {
      rating = n;
    }
  }

  const value = {
    visitor_name: optionalCapped(body.visitor_name, 'visitor_name', LIMITS.visitor_name, errors),
    notes: optionalCapped(body.notes, 'notes', LIMITS.notes, errors),
    rating
  };

  return { errors, value };
}

/**
 * Validate a registration (POST /api/auth/register).
 */
function validateRegistration(body = {}) {
  const errors = [];

  const username = str(body.username);
  if (!username) {
    errors.push('username is required');
  } else if (username.length < 3 || username.length > LIMITS.username) {
    errors.push(`username must be between 3 and ${LIMITS.username} characters`);
  } else if (!/^[A-Za-z0-9_.-]+$/.test(username)) {
    errors.push('username may only contain letters, numbers, and _ . -');
  }

  if (!isString(body.password) || body.password.length < 6) {
    errors.push('password must be at least 6 characters');
  } else if (body.password.length > LIMITS.password) {
    errors.push(`password must be at most ${LIMITS.password} characters`);
  }

  const email = str(body.email);
  if (email) {
    if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email must be a valid email address');
    }
  }

  const value = {
    username,
    email,
    password: isString(body.password) ? body.password : '',
    display_name: optionalCapped(body.display_name, 'display_name', LIMITS.display_name, errors)
  };

  return { errors, value };
}

module.exports = { validateLibrary, validateVisit, validateRegistration, LIMITS };
