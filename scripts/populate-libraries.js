const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Sample California public libraries data
const californiaLibraries = [
    {
        name: "Los Angeles Public Library - Central Library",
        address: "630 W 5th St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90071",
        phone: "(213) 228-7000",
        website: "https://www.lapl.org/",
        latitude: 34.0505,
        longitude: -118.2544
    },
    {
        name: "San Francisco Public Library - Main Library",
        address: "100 Larkin St",
        city: "San Francisco",
        county: "San Francisco",
        zip_code: "94102",
        phone: "(415) 557-4400",
        website: "https://sfpl.org/",
        latitude: 37.7793,
        longitude: -122.4163
    },
    {
        name: "San Diego Public Library - Central Library",
        address: "330 Park Blvd",
        city: "San Diego",
        county: "San Diego",
        zip_code: "92101",
        phone: "(619) 236-5800",
        website: "https://www.sandiego.gov/public-library",
        latitude: 32.7157,
        longitude: -117.1611
    },
    {
        name: "Sacramento Public Library - Central Library",
        address: "828 I St",
        city: "Sacramento",
        county: "Sacramento",
        zip_code: "95814",
        phone: "(916) 264-2700",
        website: "https://www.saclibrary.org/",
        latitude: 38.5816,
        longitude: -121.4944
    },
    {
        name: "Oakland Public Library - Main Library",
        address: "125 14th St",
        city: "Oakland",
        county: "Alameda",
        zip_code: "94612",
        phone: "(510) 238-3134",
        website: "https://oaklandlibrary.org/",
        latitude: 37.8044,
        longitude: -122.2711
    },
    {
        name: "Fresno County Public Library - Central Library",
        address: "2420 Mariposa St",
        city: "Fresno",
        county: "Fresno",
        zip_code: "93721",
        phone: "(559) 600-7323",
        website: "https://www.fresnolibrary.org/",
        latitude: 36.7378,
        longitude: -119.7871
    },
    {
        name: "Long Beach Public Library - Main Library",
        address: "101 Pacific Ave",
        city: "Long Beach",
        county: "Los Angeles",
        zip_code: "90802",
        phone: "(562) 570-7500",
        website: "https://www.longbeach.gov/library/",
        latitude: 33.7701,
        longitude: -118.1937
    },
    {
        name: "Bakersfield Public Library - Beale Memorial Library",
        address: "701 Truxtun Ave",
        city: "Bakersfield",
        county: "Kern",
        zip_code: "93301",
        phone: "(661) 868-0701",
        website: "https://www.kerncountylibrary.org/",
        latitude: 35.3733,
        longitude: -119.0187
    },
    {
        name: "Anaheim Public Library - Central Library",
        address: "500 W Broadway",
        city: "Anaheim",
        county: "Orange",
        zip_code: "92805",
        phone: "(714) 765-1880",
        website: "https://www.anaheim.net/155/Library",
        latitude: 33.8366,
        longitude: -117.9143
    },
    {
        name: "Santa Ana Public Library - Main Library",
        address: "26 Civic Center Plaza",
        city: "Santa Ana",
        county: "Orange",
        zip_code: "92701",
        phone: "(714) 647-5250",
        website: "https://www.santa-ana.org/library/",
        latitude: 33.7455,
        longitude: -117.8677
    },
    {
        name: "Riverside Public Library - Main Library",
        address: "3581 Mission Inn Ave",
        city: "Riverside",
        county: "Riverside",
        zip_code: "92501",
        phone: "(951) 826-5201",
        website: "https://riversideca.gov/library/",
        latitude: 33.9533,
        longitude: -117.3962
    },
    {
        name: "Stockton Public Library - Cesar Chavez Central Library",
        address: "605 N El Dorado St",
        city: "Stockton",
        county: "San Joaquin",
        zip_code: "95202",
        phone: "(209) 937-8221",
        website: "https://www.stocktonca.gov/library/",
        latitude: 37.9577,
        longitude: -121.2908
    },
    {
        name: "Irvine Public Library - Heritage Park Regional Library",
        address: "14361 Yale Ave",
        city: "Irvine",
        county: "Orange",
        zip_code: "92604",
        phone: "(949) 551-7150",
        website: "https://www.cityofirvine.org/irvine-public-library",
        latitude: 33.6846,
        longitude: -117.8265
    },
    {
        name: "Fremont Public Library - Main Library",
        address: "2400 Stevenson Blvd",
        city: "Fremont",
        county: "Alameda",
        zip_code: "94538",
        phone: "(510) 745-1400",
        website: "https://fremont.gov/Government/Departments/Library",
        latitude: 37.5485,
        longitude: -121.9886
    },
    {
        name: "San Bernardino Public Library - Feldheym Central Library",
        address: "555 W 6th St",
        city: "San Bernardino",
        county: "San Bernardino",
        zip_code: "92410",
        phone: "(909) 381-8201",
        website: "https://www.sbpl.org/",
        latitude: 34.1083,
        longitude: -117.2898
    },
    {
        name: "Modesto Public Library - Modesto Library",
        address: "1500 I St",
        city: "Modesto",
        county: "Stanislaus",
        zip_code: "95354",
        phone: "(209) 558-7800",
        website: "https://www.stanislauslibrary.org/",
        latitude: 37.6391,
        longitude: -120.9969
    },
    {
        name: "Fontana Public Library - Lewis Library and Technology Center",
        address: "8437 Sierra Ave",
        city: "Fontana",
        county: "San Bernardino",
        zip_code: "92335",
        phone: "(909) 574-4500",
        website: "https://www.fontanalibrary.org/",
        latitude: 34.0922,
        longitude: -117.4350
    },
    {
        name: "Oxnard Public Library - Main Library",
        address: "251 S A St",
        city: "Oxnard",
        county: "Ventura",
        zip_code: "93030",
        phone: "(805) 385-7500",
        website: "https://www.oxnard.org/library/",
        latitude: 34.1975,
        longitude: -119.1771
    },
    {
        name: "Moreno Valley Public Library - Moreno Valley Public Library",
        address: "25480 Alessandro Blvd",
        city: "Moreno Valley",
        county: "Riverside",
        zip_code: "92553",
        phone: "(951) 413-3880",
        website: "https://www.moval.org/library",
        latitude: 33.9425,
        longitude: -117.2297
    },
    {
        name: "Glendale Public Library - Central Library",
        address: "222 E Harvard St",
        city: "Glendale",
        county: "Los Angeles",
        zip_code: "91205",
        phone: "(818) 548-2021",
        website: "https://www.glendaleca.gov/government/departments/library-arts-culture/library",
        latitude: 34.1425,
        longitude: -118.2551
    },
    {
        name: "Huntington Beach Public Library - Central Library",
        address: "7111 Talbert Ave",
        city: "Huntington Beach",
        county: "Orange",
        zip_code: "92648",
        phone: "(714) 842-4481",
        website: "https://www.huntingtonbeachca.gov/residents/library/",
        latitude: 33.6595,
        longitude: -118.0047
    },
    {
        name: "Santa Clarita Public Library - Valencia Library",
        address: "23743 W Valencia Blvd",
        city: "Santa Clarita",
        county: "Los Angeles",
        zip_code: "91355",
        phone: "(661) 259-8942",
        website: "https://www.santaclaritalibrary.com/",
        latitude: 34.3917,
        longitude: -118.5426
    },
    {
        name: "Garden Grove Public Library - Main Library",
        address: "11200 Stanford Ave",
        city: "Garden Grove",
        county: "Orange",
        zip_code: "92840",
        phone: "(714) 530-0711",
        website: "https://www.ggpl.org/",
        latitude: 33.7745,
        longitude: -117.9384
    },
    {
        name: "Oceanside Public Library - Civic Center Library",
        address: "330 N Coast Hwy",
        city: "Oceanside",
        county: "San Diego",
        zip_code: "92054",
        phone: "(760) 435-5600",
        website: "https://www.oceansidepubliclibrary.org/",
        latitude: 33.1959,
        longitude: -117.3795
    },
    {
        name: "Ontario Public Library - Ovitt Family Community Library",
        address: "215 E C St",
        city: "Ontario",
        county: "San Bernardino",
        zip_code: "91764",
        phone: "(909) 395-2005",
        website: "https://www.ontarioca.gov/library",
        latitude: 34.0633,
        longitude: -117.6509
    },
    {
        name: "Elk Grove Public Library - Elk Grove Public Library",
        address: "8900 Elk Grove Blvd",
        city: "Elk Grove",
        county: "Sacramento",
        zip_code: "95624",
        phone: "(916) 264-2700",
        website: "https://www.saclibrary.org/",
        latitude: 38.4088,
        longitude: -121.3716
    },
    {
        name: "Lancaster Public Library - Lancaster Library",
        address: "601 W Lancaster Blvd",
        city: "Lancaster",
        county: "Los Angeles",
        zip_code: "93534",
        phone: "(661) 948-5029",
        website: "https://www.cityoflancasterca.org/residents/library",
        latitude: 34.6868,
        longitude: -118.1542
    },
    {
        name: "Palmdale Public Library - Palmdale City Library",
        address: "700 E Palmdale Blvd",
        city: "Palmdale",
        county: "Los Angeles",
        zip_code: "93550",
        phone: "(661) 267-5600",
        website: "https://www.cityofpalmdale.org/Government/Departments/Library",
        latitude: 34.5794,
        longitude: -118.1165
    },
    {
        name: "Salinas Public Library - John Steinbeck Library",
        address: "350 Lincoln Ave",
        city: "Salinas",
        county: "Monterey",
        zip_code: "93901",
        phone: "(831) 758-7311",
        website: "https://www.salinaspubliclibrary.org/",
        latitude: 36.6777,
        longitude: -121.6555
    },
    {
        name: "Hayward Public Library - Hayward Public Library",
        address: "835 C St",
        city: "Hayward",
        county: "Alameda",
        zip_code: "94541",
        phone: "(510) 881-7980",
        website: "https://www.hayward-ca.gov/discover/libraries",
        latitude: 37.6688,
        longitude: -122.0810
    },
    {
        name: "Pomona Public Library - Pomona Public Library",
        address: "625 S Garey Ave",
        city: "Pomona",
        county: "Los Angeles",
        zip_code: "91766",
        phone: "(909) 620-2043",
        website: "https://www.pomonalibrary.org/",
        latitude: 34.0551,
        longitude: -117.7498
    },
    {
        name: "Escondido Public Library - Escondido Public Library",
        address: "239 S Kalmia St",
        city: "Escondido",
        county: "San Diego",
        zip_code: "92025",
        phone: "(760) 839-4684",
        website: "https://library.escondido.org/",
        latitude: 33.1192,
        longitude: -117.0864
    }
];

// Connect to database
const dbPath = path.join(__dirname, '..', 'library.db');
const db = new sqlite3.Database(dbPath);

console.log('Starting to populate California libraries...');

// Insert libraries
const insertLibrary = (library) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO libraries (name, address, city, county, zip_code, phone, website, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            library.name,
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
        console.log(`Found ${californiaLibraries.length} libraries to insert...`);
        
        let insertedCount = 0;
        for (const library of californiaLibraries) {
            try {
                await insertLibrary(library);
                insertedCount++;
                console.log(`✓ Inserted: ${library.name}`);
            } catch (error) {
                console.error(`✗ Failed to insert ${library.name}:`, error.message);
            }
        }
        
        console.log(`\n✅ Successfully inserted ${insertedCount} libraries!`);
        
    } catch (error) {
        console.error('Error populating libraries:', error);
    } finally {
        db.close();
    }
}

// Run the population script
populateLibraries(); 