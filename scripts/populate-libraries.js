const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Canonical library data lives in data/libraries.json (shared with the static
// build via scripts/generate-static-data.js).
const californiaLibraries = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'libraries.json'), 'utf8')
);

// Connect to database
const dbPath = path.join(__dirname, '..', 'library.db');
const db = new sqlite3.Database(dbPath);

console.log('Starting to populate California libraries with branches...');

// Insert libraries
const insertLibrary = (library) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO libraries (name, library_system, branch_name, address, city, county, zip_code, phone, website, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(query, [
            library.name,
            library.library_system,
            library.branch_name,
            library.address,
            library.city,
            library.county,
            library.zip_code,
            library.phone,
            library.website,
            library.latitude,
            library.longitude
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// Main function to populate database
async function populateLibraries() {
    try {
        console.log(`Found ${californiaLibraries.length} library branches to insert...`);

        let insertedCount = 0;
        for (const library of californiaLibraries) {
            try {
                await insertLibrary(library);
                insertedCount++;
                console.log(`✓ Inserted: ${library.library_system} - ${library.branch_name}`);
            } catch (error) {
                console.error(`✗ Failed to insert ${library.library_system} - ${library.branch_name}:`, error.message);
            }
        }

        console.log(`\n✅ Successfully inserted ${insertedCount} library branches!`);

        // Show library system summary
        console.log('\n📚 Library Systems Summary:');
        const systems = {};
        californiaLibraries.forEach(lib => {
            if (!systems[lib.library_system]) {
                systems[lib.library_system] = 0;
            }
            systems[lib.library_system]++;
        });

        Object.entries(systems).forEach(([system, count]) => {
            console.log(`  • ${system}: ${count} branch${count > 1 ? 'es' : ''}`);
        });

    } catch (error) {
        console.error('Error populating libraries:', error);
    } finally {
        db.close();
    }
}

populateLibraries();
