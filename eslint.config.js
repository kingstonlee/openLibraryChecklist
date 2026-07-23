'use strict';

// Flat ESLint config, intentionally self-contained (no plugin packages) so it
// can be run with `npx eslint .` without installing project dependencies.
//
// Rule philosophy: errors are reserved for things that are almost always real
// bugs (undefined references in Node code, duplicate keys, unreachable code).
// Stylistic / hygiene issues are warnings so they surface without failing CI.

const NODE_GLOBALS = {
  require: 'readonly',
  module: 'writable',
  exports: 'writable',
  process: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  Buffer: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  URL: 'readonly',
  fetch: 'readonly',
  FormData: 'readonly',
  Blob: 'readonly',
  Uint8Array: 'readonly'
};

const BROWSER_GLOBALS = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  prompt: 'readonly',
  fetch: 'readonly',
  FormData: 'readonly',
  FileReader: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  indexedDB: 'readonly',
  IDBKeyRange: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly'
};

// Rules that catch genuine bugs — applied everywhere as errors.
const CORRECTNESS_RULES = {
  'no-dupe-keys': 'error',
  'no-dupe-args': 'error',
  'no-func-assign': 'error',
  'no-unreachable': 'error',
  'no-cond-assign': 'error',
  'no-constant-condition': ['error', { checkLoops: false }],
  'valid-typeof': 'error',
  'use-isnan': 'error',
  'no-redeclare': 'error',
  'no-unsafe-negation': 'error',
  'no-unused-vars': ['warn', {
    args: 'none',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_'
  }]
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'package-lock.json',
      '**/*.min.js',
      '**/*.min.css',
      'coverage/**'
    ]
  },
  // Node.js (CommonJS) sources — strict about undefined references.
  {
    files: ['server.js', 'lib/**/*.js', 'scripts/**/*.js', 'test/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: NODE_GLOBALS
    },
    rules: {
      ...CORRECTNESS_RULES,
      'no-undef': 'error'
    }
  },
  // Browser sources — script tags share globals across files, so `no-undef`
  // would produce false positives; keep the correctness rules instead.
  {
    files: ['public/js/**/*.js', 'static-version/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: BROWSER_GLOBALS
    },
    rules: {
      ...CORRECTNESS_RULES,
      'no-undef': 'off'
    }
  }
];
