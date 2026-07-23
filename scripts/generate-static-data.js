'use strict';

// Generates static-version/data.js from the canonical data/libraries.json so
// the browser build and the server seed share one source of truth.
//
// Run after editing data/libraries.json:  npm run generate:data

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'libraries.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'static-version', 'data.js');

// Build the exact contents of static-version/data.js for a given library array.
function buildStaticDataFile(libraries) {
  return `// AUTO-GENERATED from data/libraries.json by scripts/generate-static-data.js.
// Do not edit by hand — edit data/libraries.json and run: npm run generate:data
const CALIFORNIA_LIBRARIES = ${JSON.stringify(libraries, null, 2)};

// Export for use in other files / tests.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CALIFORNIA_LIBRARIES };
}
`;
}

function loadLibraries() {
  return JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
}

if (require.main === module) {
  const libraries = loadLibraries();
  fs.writeFileSync(OUTPUT_PATH, buildStaticDataFile(libraries));
  console.log(`Generated ${OUTPUT_PATH} with ${libraries.length} libraries.`);
}

module.exports = { buildStaticDataFile, loadLibraries, JSON_PATH, OUTPUT_PATH };
