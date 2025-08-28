// Library Updater System
// This system allows adding new libraries without affecting user data

// Version tracking for library updates
const LIBRARY_VERSION_KEY = 'libraryTrackerVersion';
const CURRENT_LIBRARY_VERSION = '1.5.0';

// Library update batches - each batch can be applied independently
const LIBRARY_UPDATES = {
    '1.0.0': {
        name: 'Initial California Libraries',
        libraries: [
            // Los Angeles Public Library System
            {
                name: "Los Angeles Public Library - Central Library",
                library_system: "Los Angeles Public Library",
                branch_name: "Central Library",
                address: "630 W 5th St",
                city: "Los Angeles",
                county: "Los Angeles",
                zip_code: "90071",
                phone: "(213) 228-7000",
                website: "https://www.lapl.org/",
                latitude: 34.0505,
                longitude: -118.2544,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Los Angeles Public Library - Echo Park Branch",
                library_system: "Los Angeles Public Library",
                branch_name: "Echo Park Branch",
                address: "1410 W Temple St",
                city: "Los Angeles",
                county: "Los Angeles",
                zip_code: "90026",
                phone: "(213) 250-7808",
                website: "https://www.lapl.org/branches/echo-park",
                latitude: 34.0777,
                longitude: -118.2589,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Los Angeles Public Library - Hollywood Branch",
                library_system: "Los Angeles Public Library",
                branch_name: "Hollywood Branch",
                address: "1623 Ivar Ave",
                city: "Los Angeles",
                county: "Los Angeles",
                zip_code: "90028",
                phone: "(323) 856-8260",
                website: "https://www.lapl.org/branches/hollywood",
                latitude: 34.1016,
                longitude: -118.3264,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Los Angeles Public Library - Venice Branch",
                library_system: "Los Angeles Public Library",
                branch_name: "Venice Branch",
                address: "501 S Venice Blvd",
                city: "Los Angeles",
                county: "Los Angeles",
                zip_code: "90291",
                phone: "(310) 821-1769",
                website: "https://www.lapl.org/branches/venice",
                latitude: 33.9850,
                longitude: -118.4695,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Los Angeles Public Library - Westwood Branch",
                library_system: "Los Angeles Public Library",
                branch_name: "Westwood Branch",
                address: "1246 Glendon Ave",
                city: "Los Angeles",
                county: "Los Angeles",
                zip_code: "90024",
                phone: "(310) 575-9423",
                website: "https://www.lapl.org/branches/westwood",
                latitude: 34.0597,
                longitude: -118.4428,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    },
    '1.1.0': {
        name: 'San Francisco Libraries',
        libraries: [
            {
                name: "San Francisco Public Library - Main Library",
                library_system: "San Francisco Public Library",
                branch_name: "Main Library",
                address: "100 Larkin St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94102",
                phone: "(415) 557-4400",
                website: "https://sfpl.org/locations/main-library",
                latitude: 37.7793,
                longitude: -122.4163,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Mission Bay Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Mission Bay Branch",
                address: "960 4th St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94158",
                phone: "(415) 355-2838",
                website: "https://sfpl.org/locations/mission-bay-branch",
                latitude: 37.7701,
                longitude: -122.3874,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - North Beach Branch",
                library_system: "San Francisco Public Library",
                branch_name: "North Beach Branch",
                address: "850 Columbus Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94133",
                phone: "(415) 355-5626",
                website: "https://sfpl.org/locations/north-beach-branch",
                latitude: 37.8037,
                longitude: -122.4098,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Chinatown Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Chinatown Branch",
                address: "1135 Powell St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94108",
                phone: "(415) 355-2888",
                website: "https://sfpl.org/locations/chinatown-branch",
                latitude: 37.7941,
                longitude: -122.4079,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Richmond Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Richmond Branch",
                address: "351 9th Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94118",
                phone: "(415) 355-5600",
                website: "https://sfpl.org/locations/richmond-branch",
                latitude: 37.7833,
                longitude: -122.4667,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    },
    '1.2.0': {
        name: 'San Diego Libraries',
        libraries: [
            {
                name: "San Diego Public Library - Central Library",
                library_system: "San Diego Public Library",
                branch_name: "Central Library",
                address: "330 Park Blvd",
                city: "San Diego",
                county: "San Diego",
                zip_code: "92101",
                phone: "(619) 236-5800",
                website: "https://www.sandiego.gov/public-library/locations/central",
                latitude: 32.7157,
                longitude: -117.1611,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Diego Public Library - Mission Valley Branch",
                library_system: "San Diego Public Library",
                branch_name: "Mission Valley Branch",
                address: "2123 Fenton Pkwy",
                city: "San Diego",
                county: "San Diego",
                zip_code: "92108",
                phone: "(619) 235-5275",
                website: "https://www.sandiego.gov/public-library/locations/mission-valley",
                latitude: 32.7833,
                longitude: -117.1333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Diego Public Library - La Jolla Branch",
                library_system: "San Diego Public Library",
                branch_name: "La Jolla Branch",
                address: "7555 Draper Ave",
                city: "San Diego",
                county: "San Diego",
                zip_code: "92037",
                phone: "(858) 552-1657",
                website: "https://www.sandiego.gov/public-library/locations/la-jolla",
                latitude: 32.8328,
                longitude: -117.2713,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    },
    '1.3.0': {
        name: 'Additional California Libraries',
        libraries: [
            // Sacramento Public Library System
            {
                name: "Sacramento Public Library - Central Library",
                library_system: "Sacramento Public Library",
                branch_name: "Central Library",
                address: "828 I St",
                city: "Sacramento",
                county: "Sacramento",
                zip_code: "95814",
                phone: "(916) 264-2700",
                website: "https://www.saclibrary.org/locations/central-library",
                latitude: 38.5816,
                longitude: -121.4944,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Sacramento Public Library - Belle Cooledge Branch",
                library_system: "Sacramento Public Library",
                branch_name: "Belle Cooledge Branch",
                address: "5600 S Land Park Dr",
                city: "Sacramento",
                county: "Sacramento",
                zip_code: "95822",
                phone: "(916) 264-2920",
                website: "https://www.saclibrary.org/locations/belle-cooledge",
                latitude: 38.5500,
                longitude: -121.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Sacramento Public Library - Colonial Heights Branch",
                library_system: "Sacramento Public Library",
                branch_name: "Colonial Heights Branch",
                address: "4799 Stockton Blvd",
                city: "Sacramento",
                county: "Sacramento",
                zip_code: "95820",
                phone: "(916) 264-2920",
                website: "https://www.saclibrary.org/locations/colonial-heights",
                latitude: 38.5333,
                longitude: -121.4500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Oakland Public Library System
            {
                name: "Oakland Public Library - Main Library",
                library_system: "Oakland Public Library",
                branch_name: "Main Library",
                address: "125 14th St",
                city: "Oakland",
                county: "Alameda",
                zip_code: "94612",
                phone: "(510) 238-3134",
                website: "https://oaklandlibrary.org/locations/main-library",
                latitude: 37.8044,
                longitude: -122.2711,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Oakland Public Library - Rockridge Branch",
                library_system: "Oakland Public Library",
                branch_name: "Rockridge Branch",
                address: "5366 College Ave",
                city: "Oakland",
                county: "Alameda",
                zip_code: "94618",
                phone: "(510) 597-5017",
                website: "https://oaklandlibrary.org/locations/rockridge",
                latitude: 37.8500,
                longitude: -122.2500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Oakland Public Library - Temescal Branch",
                library_system: "Oakland Public Library",
                branch_name: "Temescal Branch",
                address: "5205 Telegraph Ave",
                city: "Oakland",
                county: "Alameda",
                zip_code: "94609",
                phone: "(510) 597-5049",
                website: "https://oaklandlibrary.org/locations/temescal",
                latitude: 37.8333,
                longitude: -122.2667,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Fresno County Public Library System
            {
                name: "Fresno County Public Library - Central Library",
                library_system: "Fresno County Public Library",
                branch_name: "Central Library",
                address: "2420 Mariposa St",
                city: "Fresno",
                county: "Fresno",
                zip_code: "93721",
                phone: "(559) 600-7323",
                website: "https://www.fresnolibrary.org/locations/central",
                latitude: 36.7378,
                longitude: -119.7871,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Fresno County Public Library - Fig Garden Branch",
                library_system: "Fresno County Public Library",
                branch_name: "Fig Garden Branch",
                address: "3071 W Bullard Ave",
                city: "Fresno",
                county: "Fresno",
                zip_code: "93711",
                phone: "(559) 600-7323",
                website: "https://www.fresnolibrary.org/locations/fig-garden",
                latitude: 36.8000,
                longitude: -119.8167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Long Beach Public Library System
            {
                name: "Long Beach Public Library - Main Library",
                library_system: "Long Beach Public Library",
                branch_name: "Main Library",
                address: "101 Pacific Ave",
                city: "Long Beach",
                county: "Los Angeles",
                zip_code: "90802",
                phone: "(562) 570-7500",
                website: "https://www.lbpl.org/locations/main",
                latitude: 33.7701,
                longitude: -118.1937,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Long Beach Public Library - Alamitos Branch",
                library_system: "Long Beach Public Library",
                branch_name: "Alamitos Branch",
                address: "1836 E 3rd St",
                city: "Long Beach",
                county: "Los Angeles",
                zip_code: "90802",
                phone: "(562) 570-1037",
                website: "https://www.lbpl.org/locations/alamitos",
                latitude: 33.7667,
                longitude: -118.1833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Santa Monica Public Library System
            {
                name: "Santa Monica Public Library - Main Library",
                library_system: "Santa Monica Public Library",
                branch_name: "Main Library",
                address: "601 Santa Monica Blvd",
                city: "Santa Monica",
                county: "Los Angeles",
                zip_code: "90401",
                phone: "(310) 458-8600",
                website: "https://smpl.org/locations/main-library",
                latitude: 34.0195,
                longitude: -118.4912,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Santa Monica Public Library - Montana Branch",
                library_system: "Santa Monica Public Library",
                branch_name: "Montana Branch",
                address: "1704 Montana Ave",
                city: "Santa Monica",
                county: "Los Angeles",
                zip_code: "90403",
                phone: "(310) 458-8682",
                website: "https://smpl.org/locations/montana-branch",
                latitude: 34.0333,
                longitude: -118.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Santa Monica Public Library - Ocean Park Branch",
                library_system: "Santa Monica Public Library",
                branch_name: "Ocean Park Branch",
                address: "2601 Main St",
                city: "Santa Monica",
                county: "Los Angeles",
                zip_code: "90405",
                phone: "(310) 458-8683",
                website: "https://smpl.org/locations/ocean-park-branch",
                latitude: 34.0000,
                longitude: -118.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Pasadena Public Library System
            {
                name: "Pasadena Public Library - Central Library",
                library_system: "Pasadena Public Library",
                branch_name: "Central Library",
                address: "285 E Walnut St",
                city: "Pasadena",
                county: "Los Angeles",
                zip_code: "91101",
                phone: "(626) 744-4066",
                website: "https://www.cityofpasadena.net/library/locations/central-library",
                latitude: 34.1478,
                longitude: -118.1445,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Pasadena Public Library - Hastings Branch",
                library_system: "Pasadena Public Library",
                branch_name: "Hastings Branch",
                address: "3325 E Orange Grove Blvd",
                city: "Pasadena",
                county: "Los Angeles",
                zip_code: "91107",
                phone: "(626) 744-7262",
                website: "https://www.cityofpasadena.net/library/locations/hastings-branch",
                latitude: 34.1667,
                longitude: -118.1167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Berkeley Public Library System
            {
                name: "Berkeley Public Library - Central Library",
                library_system: "Berkeley Public Library",
                branch_name: "Central Library",
                address: "2090 Kittredge St",
                city: "Berkeley",
                county: "Alameda",
                zip_code: "94704",
                phone: "(510) 981-6100",
                website: "https://www.berkeleypubliclibrary.org/locations/central",
                latitude: 37.8716,
                longitude: -122.2727,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Berkeley Public Library - North Branch",
                library_system: "Berkeley Public Library",
                branch_name: "North Branch",
                address: "1170 The Alameda",
                city: "Berkeley",
                county: "Alameda",
                zip_code: "94707",
                phone: "(510) 981-6250",
                website: "https://www.berkeleypubliclibrary.org/locations/north",
                latitude: 37.8833,
                longitude: -122.2833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // San Jose Public Library System
            {
                name: "San Jose Public Library - Dr. Martin Luther King Jr. Library",
                library_system: "San Jose Public Library",
                branch_name: "Dr. Martin Luther King Jr. Library",
                address: "150 E San Fernando St",
                city: "San Jose",
                county: "Santa Clara",
                zip_code: "95112",
                phone: "(408) 808-2000",
                website: "https://www.sjpl.org/locations/mlk",
                latitude: 37.3382,
                longitude: -121.8863,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Jose Public Library - Alum Rock Branch",
                library_system: "San Jose Public Library",
                branch_name: "Alum Rock Branch",
                address: "3090 Alum Rock Ave",
                city: "San Jose",
                county: "Santa Clara",
                zip_code: "95127",
                phone: "(408) 808-3040",
                website: "https://www.sjpl.org/locations/alum-rock",
                latitude: 37.3667,
                longitude: -121.8167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Anaheim Public Library System
            {
                name: "Anaheim Public Library - Central Library",
                library_system: "Anaheim Public Library",
                branch_name: "Central Library",
                address: "500 W Broadway",
                city: "Anaheim",
                county: "Orange",
                zip_code: "92805",
                phone: "(714) 765-1880",
                website: "https://www.anaheim.net/354/Library",
                latitude: 33.8366,
                longitude: -117.9143,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Anaheim Public Library - Euclid Branch",
                library_system: "Anaheim Public Library",
                branch_name: "Euclid Branch",
                address: "1340 S Euclid St",
                city: "Anaheim",
                county: "Orange",
                zip_code: "92802",
                phone: "(714) 765-1880",
                website: "https://www.anaheim.net/354/Library",
                latitude: 33.8167,
                longitude: -117.9167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Riverside Public Library System
            {
                name: "Riverside Public Library - Main Library",
                library_system: "Riverside Public Library",
                branch_name: "Main Library",
                address: "3581 Mission Inn Ave",
                city: "Riverside",
                county: "Riverside",
                zip_code: "92501",
                phone: "(951) 826-5201",
                website: "https://www.riversideca.gov/library/locations/main",
                latitude: 33.9533,
                longitude: -117.3962,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Riverside Public Library - Arlington Branch",
                library_system: "Riverside Public Library",
                branch_name: "Arlington Branch",
                address: "9556 Magnolia Ave",
                city: "Riverside",
                county: "Riverside",
                zip_code: "92503",
                phone: "(951) 826-5201",
                website: "https://www.riversideca.gov/library/locations/arlington",
                latitude: 33.9333,
                longitude: -117.4167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Bakersfield Public Library System
            {
                name: "Bakersfield Public Library - Beale Memorial Library",
                library_system: "Bakersfield Public Library",
                branch_name: "Beale Memorial Library",
                address: "701 Truxtun Ave",
                city: "Bakersfield",
                county: "Kern",
                zip_code: "93301",
                phone: "(661) 868-0701",
                website: "https://www.bakersfieldpubliclibrary.org/locations/beale",
                latitude: 35.3733,
                longitude: -119.0187,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Bakersfield Public Library - Southwest Branch",
                library_system: "Bakersfield Public Library",
                branch_name: "Southwest Branch",
                address: "8301 Ming Ave",
                city: "Bakersfield",
                county: "Kern",
                zip_code: "93311",
                phone: "(661) 868-0701",
                website: "https://www.bakersfieldpubliclibrary.org/locations/southwest",
                latitude: 35.3500,
                longitude: -119.0500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Stockton Public Library System
            {
                name: "Stockton Public Library - Cesar Chavez Central Library",
                library_system: "Stockton Public Library",
                branch_name: "Cesar Chavez Central Library",
                address: "605 N El Dorado St",
                city: "Stockton",
                county: "San Joaquin",
                zip_code: "95202",
                phone: "(209) 937-8221",
                website: "https://www.stocktonca.gov/libraries",
                latitude: 37.9577,
                longitude: -121.2908,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Stockton Public Library - Troke Branch",
                library_system: "Stockton Public Library",
                branch_name: "Troke Branch",
                address: "502 W Benjamin Holt Dr",
                city: "Stockton",
                county: "San Joaquin",
                zip_code: "95207",
                phone: "(209) 937-8221",
                website: "https://www.stocktonca.gov/libraries",
                latitude: 37.9667,
                longitude: -121.3167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Modesto Public Library System
            {
                name: "Modesto Public Library - Modesto Library",
                library_system: "Modesto Public Library",
                branch_name: "Modesto Library",
                address: "1500 I St",
                city: "Modesto",
                county: "Stanislaus",
                zip_code: "95354",
                phone: "(209) 558-7800",
                website: "https://www.modestogov.com/library",
                latitude: 37.6391,
                longitude: -120.9969,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Modesto Public Library - Salida Branch",
                library_system: "Modesto Public Library",
                branch_name: "Salida Branch",
                address: "4835 Sisk Rd",
                city: "Modesto",
                county: "Stanislaus",
                zip_code: "95356",
                phone: "(209) 558-7800",
                website: "https://www.modestogov.com/library",
                latitude: 37.7000,
                longitude: -121.0167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    },
    '1.4.0': {
        name: 'Additional California Libraries from Library Technology Directory',
        libraries: [
            // Alameda County Library System
            {
                name: "Alameda County Library - Albany Library",
                library_system: "Alameda County Library",
                branch_name: "Albany Library",
                address: "1247 Marin Ave",
                city: "Albany",
                county: "Alameda",
                zip_code: "94706",
                phone: "(510) 526-3720",
                website: "https://aclibrary.org/locations/albany",
                latitude: 37.8867,
                longitude: -122.2972,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Alameda County Library - Castro Valley Library",
                library_system: "Alameda County Library",
                branch_name: "Castro Valley Library",
                address: "3600 Norbridge Ave",
                city: "Castro Valley",
                county: "Alameda",
                zip_code: "94546",
                phone: "(510) 670-6280",
                website: "https://aclibrary.org/locations/castro-valley",
                latitude: 37.6944,
                longitude: -122.0864,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Alameda County Library - Dublin Library",
                library_system: "Alameda County Library",
                branch_name: "Dublin Library",
                address: "200 Civic Plaza",
                city: "Dublin",
                county: "Alameda",
                zip_code: "94568",
                phone: "(925) 828-1315",
                website: "https://aclibrary.org/locations/dublin",
                latitude: 37.7021,
                longitude: -121.9358,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Alameda County Library - Union City Library",
                library_system: "Alameda County Library",
                branch_name: "Union City Library",
                address: "34007 Alvarado-Niles Rd",
                city: "Union City",
                county: "Alameda",
                zip_code: "94587",
                phone: "(510) 745-1464",
                website: "https://aclibrary.org/locations/union-city",
                latitude: 37.5933,
                longitude: -122.0172,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Alameda Free Library System
            {
                name: "Alameda Free Library - Main Library",
                library_system: "Alameda Free Library",
                branch_name: "Main Library",
                address: "1550 Oak St",
                city: "Alameda",
                county: "Alameda",
                zip_code: "94501",
                phone: "(510) 747-7740",
                website: "https://alamedaca.gov/library",
                latitude: 37.7653,
                longitude: -122.2416,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Alameda Free Library - Bay Farm Island Branch",
                library_system: "Alameda Free Library",
                branch_name: "Bay Farm Island Branch",
                address: "3221 Mecartney Rd",
                city: "Alameda",
                county: "Alameda",
                zip_code: "94502",
                phone: "(510) 747-7780",
                website: "https://alamedaca.gov/library",
                latitude: 37.7300,
                longitude: -122.2500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Beverly Hills Public Library System
            {
                name: "Beverly Hills Public Library - Main Library",
                library_system: "Beverly Hills Public Library",
                branch_name: "Main Library",
                address: "444 N Rexford Dr",
                city: "Beverly Hills",
                county: "Los Angeles",
                zip_code: "90210",
                phone: "(310) 288-2244",
                website: "https://www.beverlyhills.org/library",
                latitude: 34.0736,
                longitude: -118.4004,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Beverly Hills Public Library - Roxbury Park Library",
                library_system: "Beverly Hills Public Library",
                branch_name: "Roxbury Park Library",
                address: "471 S Roxbury Dr",
                city: "Beverly Hills",
                county: "Los Angeles",
                zip_code: "90212",
                phone: "(310) 550-4947",
                website: "https://www.beverlyhills.org/library",
                latitude: 34.0667,
                longitude: -118.4000,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Torrance Public Library System
            {
                name: "Torrance Public Library - Main Library",
                library_system: "Torrance Public Library",
                branch_name: "Main Library",
                address: "3301 Torrance Blvd",
                city: "Torrance",
                county: "Los Angeles",
                zip_code: "90503",
                phone: "(310) 618-5950",
                website: "https://www.torranceca.gov/library",
                latitude: 33.8353,
                longitude: -118.3404,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Torrance Public Library - North Torrance Branch",
                library_system: "Torrance Public Library",
                branch_name: "North Torrance Branch",
                address: "3604 Artesia Blvd",
                city: "Torrance",
                county: "Los Angeles",
                zip_code: "90504",
                phone: "(310) 323-7200",
                website: "https://www.torranceca.gov/library",
                latitude: 33.8833,
                longitude: -118.3333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Torrance Public Library - Southeast Branch",
                library_system: "Torrance Public Library",
                branch_name: "Southeast Branch",
                address: "23115 Arlington Ave",
                city: "Torrance",
                county: "Los Angeles",
                zip_code: "90501",
                phone: "(310) 530-5044",
                website: "https://www.torranceca.gov/library",
                latitude: 33.8167,
                longitude: -118.3167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Thousand Oaks Library System
            {
                name: "Thousand Oaks Library - Main Library",
                library_system: "Thousand Oaks Library",
                branch_name: "Main Library",
                address: "1401 E Janss Rd",
                city: "Thousand Oaks",
                county: "Ventura",
                zip_code: "91362",
                phone: "(805) 449-2660",
                website: "https://www.toaks.org/library",
                latitude: 34.1706,
                longitude: -118.8376,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Thousand Oaks Library - Newbury Park Branch",
                library_system: "Thousand Oaks Library",
                branch_name: "Newbury Park Branch",
                address: "2331 Borchard Rd",
                city: "Newbury Park",
                county: "Ventura",
                zip_code: "91320",
                phone: "(805) 498-2139",
                website: "https://www.toaks.org/library",
                latitude: 34.1833,
                longitude: -118.9167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Ventura County Library System
            {
                name: "Ventura County Library - E. P. Foster Library",
                library_system: "Ventura County Library",
                branch_name: "E. P. Foster Library",
                address: "651 E Main St",
                city: "Ventura",
                county: "Ventura",
                zip_code: "93001",
                phone: "(805) 626-READ",
                website: "https://www.vencolibrary.org/locations/ep-foster",
                latitude: 34.2744,
                longitude: -119.2311,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Ventura County Library - H. P. Wright Library",
                library_system: "Ventura County Library",
                branch_name: "H. P. Wright Library",
                address: "57 Day Rd",
                city: "Ventura",
                county: "Ventura",
                zip_code: "93003",
                phone: "(805) 642-0336",
                website: "https://www.vencolibrary.org/locations/hp-wright",
                latitude: 34.2833,
                longitude: -119.2167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Ventura County Library - Ojai Library",
                library_system: "Ventura County Library",
                branch_name: "Ojai Library",
                address: "111 E Ojai Ave",
                city: "Ojai",
                county: "Ventura",
                zip_code: "93023",
                phone: "(805) 626-READ",
                website: "https://www.vencolibrary.org/locations/ojai",
                latitude: 34.4481,
                longitude: -119.2429,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Tulare County Public Library System
            {
                name: "Tulare County Public Library - Main Library",
                library_system: "Tulare County Public Library",
                branch_name: "Main Library",
                address: "200 W Oak Ave",
                city: "Visalia",
                county: "Tulare",
                zip_code: "93291",
                phone: "(559) 713-2700",
                website: "https://www.tularecountylibrary.org",
                latitude: 36.3302,
                longitude: -119.2921,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Tulare County Public Library - Dinuba Branch",
                library_system: "Tulare County Public Library",
                branch_name: "Dinuba Branch",
                address: "209 S Alta Ave",
                city: "Dinuba",
                county: "Tulare",
                zip_code: "93618",
                phone: "(559) 591-5828",
                website: "https://www.tularecountylibrary.org",
                latitude: 36.5433,
                longitude: -119.3867,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Tulare County Public Library - Lindsay Branch",
                library_system: "Tulare County Public Library",
                branch_name: "Lindsay Branch",
                address: "245 E Honolulu St",
                city: "Lindsay",
                county: "Tulare",
                zip_code: "93247",
                phone: "(559) 562-3021",
                website: "https://www.tularecountylibrary.org",
                latitude: 36.2033,
                longitude: -119.0867,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Amador County Library System
            {
                name: "Amador County Library - Main Library",
                library_system: "Amador County Library",
                branch_name: "Main Library",
                address: "530 Sutter St",
                city: "Jackson",
                county: "Amador",
                zip_code: "95642",
                phone: "(209) 223-6400",
                website: "https://www.amadorcountylibrary.org",
                latitude: 38.3489,
                longitude: -120.7744,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Amador County Library - Sutter Creek Branch",
                library_system: "Amador County Library",
                branch_name: "Sutter Creek Branch",
                address: "35 Main St",
                city: "Sutter Creek",
                county: "Amador",
                zip_code: "95685",
                phone: "(209) 267-5489",
                website: "https://www.amadorcountylibrary.org",
                latitude: 38.3928,
                longitude: -120.8028,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Trinity County Library System
            {
                name: "Trinity County Library - Main Library",
                library_system: "Trinity County Library",
                branch_name: "Main Library",
                address: "351 Main St",
                city: "Weaverville",
                county: "Trinity",
                zip_code: "96093",
                phone: "(530) 623-4427",
                website: "https://www.trinitycountylibrary.org",
                latitude: 40.7308,
                longitude: -122.9367,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Trinity County Library - Hayfork Branch",
                library_system: "Trinity County Library",
                branch_name: "Hayfork Branch",
                address: "702 Main St",
                city: "Hayfork",
                county: "Trinity",
                zip_code: "96041",
                phone: "(530) 628-5427",
                website: "https://www.trinitycountylibrary.org",
                latitude: 40.5500,
                longitude: -123.1833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Tuolumne County Library System
            {
                name: "Tuolumne County Library - Main Library",
                library_system: "Tuolumne County Library",
                branch_name: "Main Library",
                address: "480 Greenley Rd",
                city: "Sonora",
                county: "Tuolumne",
                zip_code: "95370",
                phone: "(209) 533-5507",
                website: "https://www.tuolumnecounty.ca.gov/library",
                latitude: 37.9847,
                longitude: -120.3822,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Tuolumne County Library - Groveland Branch",
                library_system: "Tuolumne County Library",
                branch_name: "Groveland Branch",
                address: "18990 Main St",
                city: "Groveland",
                county: "Tuolumne",
                zip_code: "95321",
                phone: "(209) 962-6144",
                website: "https://www.tuolumnecounty.ca.gov/library",
                latitude: 37.8406,
                longitude: -120.2289,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Sutter County Library System
            {
                name: "Sutter County Library - Main Library",
                library_system: "Sutter County Library",
                branch_name: "Main Library",
                address: "750 Forbes Ave",
                city: "Yuba City",
                county: "Sutter",
                zip_code: "95991",
                phone: "(530) 822-7137",
                website: "https://www.suttercounty.org/library",
                latitude: 39.1408,
                longitude: -121.6169,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Sutter County Library - Sutter Branch",
                library_system: "Sutter County Library",
                branch_name: "Sutter Branch",
                address: "7500 Butte House Rd",
                city: "Sutter",
                county: "Sutter",
                zip_code: "95982",
                phone: "(530) 755-0485",
                website: "https://www.suttercounty.org/library",
                latitude: 39.1667,
                longitude: -121.7500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Tehama County Library System
            {
                name: "Tehama County Library - Main Library",
                library_system: "Tehama County Library",
                branch_name: "Main Library",
                address: "645 Madison St",
                city: "Red Bluff",
                county: "Tehama",
                zip_code: "96080",
                phone: "(530) 527-0604",
                website: "https://www.tehamacountylibrary.org",
                latitude: 40.1783,
                longitude: -122.2358,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Tehama County Library - Corning Branch",
                library_system: "Tehama County Library",
                branch_name: "Corning Branch",
                address: "740 3rd St",
                city: "Corning",
                county: "Tehama",
                zip_code: "96021",
                phone: "(530) 824-7050",
                website: "https://www.tehamacountylibrary.org",
                latitude: 39.9278,
                longitude: -122.1792,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Lassen Public Library System
            {
                name: "Lassen Public Library - Main Library",
                library_system: "Lassen Public Library",
                branch_name: "Main Library",
                address: "1618 Main St",
                city: "Susanville",
                county: "Lassen",
                zip_code: "96130",
                phone: "(530) 251-8127",
                website: "https://www.lassencounty.org/library",
                latitude: 40.4167,
                longitude: -120.6500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            
            // Alpine County Library System
            {
                name: "Alpine County Library - Main Library",
                library_system: "Alpine County Library",
                branch_name: "Main Library",
                address: "1752 Highway 88",
                city: "Markleeville",
                county: "Alpine",
                zip_code: "96120",
                phone: "(530) 694-2120",
                website: "https://www.alpinecountyca.gov/library",
                latitude: 38.6947,
                longitude: -119.7808,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "Alpine County Library - Bear Valley Library Station",
                library_system: "Alpine County Library",
                branch_name: "Bear Valley Library Station",
                address: "Bear Valley",
                city: "Bear Valley",
                county: "Alpine",
                zip_code: "95223",
                phone: "(209) 753-6219",
                website: "https://www.alpinecountyca.gov/library",
                latitude: 38.4667,
                longitude: -120.0333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    },
    '1.5.0': {
        name: 'Complete San Francisco Public Library System',
        libraries: [
            // Additional San Francisco Public Library Branches
            {
                name: "San Francisco Public Library - Mission Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Mission Branch",
                address: "300 Bartlett St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94110",
                phone: "(415) 355-2800",
                website: "https://sfpl.org/locations/mission",
                latitude: 37.7500,
                longitude: -122.4167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Potrero Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Potrero Branch",
                address: "1616 20th St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94107",
                phone: "(415) 355-2822",
                website: "https://sfpl.org/locations/potrero",
                latitude: 37.7667,
                longitude: -122.4000,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Bernal Heights Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Bernal Heights Branch",
                address: "500 Cortland Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94110",
                phone: "(415) 355-2810",
                website: "https://sfpl.org/locations/bernal-heights",
                latitude: 37.7333,
                longitude: -122.4167,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Glen Park Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Glen Park Branch",
                address: "2825 Diamond St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94131",
                phone: "(415) 355-2858",
                website: "https://sfpl.org/locations/glen-park",
                latitude: 37.7333,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Excelsior Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Excelsior Branch",
                address: "4400 Mission St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94112",
                phone: "(415) 355-2868",
                website: "https://sfpl.org/locations/excelsior",
                latitude: 37.7167,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Visitacion Valley Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Visitacion Valley Branch",
                address: "201 Leland Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94134",
                phone: "(415) 355-2848",
                website: "https://sfpl.org/locations/visitacion-valley",
                latitude: 37.7167,
                longitude: -122.4000,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Portola Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Portola Branch",
                address: "380 Bacon St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94134",
                phone: "(415) 355-5660",
                website: "https://sfpl.org/locations/portola",
                latitude: 37.7167,
                longitude: -122.4000,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Ocean View Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Ocean View Branch",
                address: "345 Randolph St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94132",
                phone: "(415) 355-5615",
                website: "https://sfpl.org/locations/ocean-view",
                latitude: 37.7167,
                longitude: -122.4667,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Ingleside Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Ingleside Branch",
                address: "1298 Ocean Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94112",
                phone: "(415) 355-2898",
                website: "https://sfpl.org/locations/ingleside",
                latitude: 37.7167,
                longitude: -122.4500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Sunset Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Sunset Branch",
                address: "1305 18th Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94122",
                phone: "(415) 355-2808",
                website: "https://sfpl.org/locations/sunset",
                latitude: 37.7333,
                longitude: -122.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Parkside Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Parkside Branch",
                address: "1200 Taraval St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94116",
                phone: "(415) 355-5656",
                website: "https://sfpl.org/locations/parkside",
                latitude: 37.7333,
                longitude: -122.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Ortega Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Ortega Branch",
                address: "3223 Ortega St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94122",
                phone: "(415) 355-5700",
                website: "https://sfpl.org/locations/ortega",
                latitude: 37.7333,
                longitude: -122.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Anza Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Anza Branch",
                address: "550 37th Ave",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94121",
                phone: "(415) 355-5717",
                website: "https://sfpl.org/locations/anza",
                latitude: 37.7833,
                longitude: -122.4833,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Golden Gate Valley Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Golden Gate Valley Branch",
                address: "1801 Green St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94123",
                phone: "(415) 355-5666",
                website: "https://sfpl.org/locations/golden-gate-valley",
                latitude: 37.8000,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Marina Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Marina Branch",
                address: "1890 Chestnut St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94123",
                phone: "(415) 355-2823",
                website: "https://sfpl.org/locations/marina",
                latitude: 37.8000,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Presidio Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Presidio Branch",
                address: "3150 Sacramento St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94115",
                phone: "(415) 355-2880",
                website: "https://sfpl.org/locations/presidio",
                latitude: 37.7833,
                longitude: -122.4500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Western Addition Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Western Addition Branch",
                address: "1550 Scott St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94115",
                phone: "(415) 355-5727",
                website: "https://sfpl.org/locations/western-addition",
                latitude: 37.7833,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Eureka Valley Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Eureka Valley Branch",
                address: "1 Jose Sarria Ct",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94114",
                phone: "(415) 355-5616",
                website: "https://sfpl.org/locations/eureka-valley",
                latitude: 37.7667,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Noe Valley Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Noe Valley Branch",
                address: "451 Jersey St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94114",
                phone: "(415) 355-5707",
                website: "https://sfpl.org/locations/noe-valley",
                latitude: 37.7500,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Castro Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Castro Branch",
                address: "501 Castro St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94114",
                phone: "(415) 355-2800",
                website: "https://sfpl.org/locations/castro",
                latitude: 37.7667,
                longitude: -122.4333,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Haight-Ashbury Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Haight-Ashbury Branch",
                address: "1833 Page St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94117",
                phone: "(415) 355-5618",
                website: "https://sfpl.org/locations/haight-ashbury",
                latitude: 37.7667,
                longitude: -122.4500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            },
            {
                name: "San Francisco Public Library - Park Branch",
                library_system: "San Francisco Public Library",
                branch_name: "Park Branch",
                address: "1833 Page St",
                city: "San Francisco",
                county: "San Francisco",
                zip_code: "94117",
                phone: "(415) 355-5656",
                website: "https://sfpl.org/locations/park",
                latitude: 37.7667,
                longitude: -122.4500,
                created_at: new Date().toISOString(),
                image_count: 0,
                visit_count: 0
            }
        ]
    }
};

// Library updater system
const libraryUpdater = {
    // Get current version from localStorage
    getCurrentVersion() {
        return localStorage.getItem(LIBRARY_VERSION_KEY) || '0.0.0';
    },
    
    // Set current version in localStorage
    setCurrentVersion(version) {
        localStorage.setItem(LIBRARY_VERSION_KEY, version);
    },
    
    // Check if library already exists (by name and address)
    async libraryExists(library) {
        try {
            const existingLibraries = await storage.getLibraries();
            return existingLibraries.some(existing => 
                existing.name === library.name && 
                existing.address === library.address
            );
        } catch (error) {
            console.error('Error checking if library exists:', error);
            return false;
        }
    },
    
    // Apply a specific version update
    async applyVersionUpdate(version) {
        try {
            const update = LIBRARY_UPDATES[version];
            if (!update) {
                console.warn(`No update found for version ${version}`);
                return { success: false, message: `No update found for version ${version}` };
            }
            
            console.log(`Applying update ${version}: ${update.name}`);
            let added = 0;
            let skipped = 0;
            
            for (const library of update.libraries) {
                const exists = await this.libraryExists(library);
                if (exists) {
                    skipped++;
                    console.log(`Skipping existing library: ${library.name}`);
                } else {
                    await storage.addLibrary(library);
                    added++;
                    console.log(`Added library: ${library.name}`);
                }
            }
            
            return { 
                success: true, 
                added, 
                skipped, 
                message: `Added ${added} libraries, skipped ${skipped} existing libraries` 
            };
        } catch (error) {
            console.error(`Error applying version ${version}:`, error);
            return { success: false, message: error.message };
        }
    },
    
    // Check for and apply pending updates
    async checkForUpdates() {
        try {
            const currentVersion = this.getCurrentVersion();
            console.log(`Current library version: ${currentVersion}`);
            
            const versions = Object.keys(LIBRARY_UPDATES).sort();
            const pendingVersions = versions.filter(version => version > currentVersion);
            
            if (pendingVersions.length === 0) {
                console.log('No pending library updates');
                return { success: true, message: 'No pending updates' };
            }
            
            console.log(`Found ${pendingVersions.length} pending updates:`, pendingVersions);
            
            let totalAdded = 0;
            let totalSkipped = 0;
            
            for (const version of pendingVersions) {
                const result = await this.applyVersionUpdate(version);
                if (result.success) {
                    totalAdded += result.added || 0;
                    totalSkipped += result.skipped || 0;
                } else {
                    console.error(`Failed to apply version ${version}:`, result.message);
                }
            }
            
            // Update to latest version
            this.setCurrentVersion(CURRENT_LIBRARY_VERSION);
            
            return { 
                success: true, 
                totalAdded, 
                totalSkipped, 
                message: `Updated libraries: ${totalAdded} added, ${totalSkipped} skipped` 
            };
        } catch (error) {
            console.error('Error checking for updates:', error);
            return { success: false, message: error.message };
        }
    },
    
    // Add a single library safely
    async addSingleLibrary(library) {
        try {
            const exists = await this.libraryExists(library);
            if (exists) {
                return { success: false, message: 'Library already exists' };
            }
            
            await storage.addLibrary(library);
            return { success: true, message: 'Library added successfully' };
        } catch (error) {
            console.error('Error adding single library:', error);
            return { success: false, message: error.message };
        }
    },
    
    // Add multiple libraries safely
    async addMultipleLibraries(libraries) {
        try {
            let added = 0;
            let skipped = 0;
            
            for (const library of libraries) {
                const result = await this.addSingleLibrary(library);
                if (result.success) {
                    added++;
                } else {
                    skipped++;
                }
            }
            
            return { 
                success: true, 
                added, 
                skipped, 
                message: `Added ${added} libraries, skipped ${skipped} existing libraries` 
            };
        } catch (error) {
            console.error('Error adding multiple libraries:', error);
            return { success: false, message: error.message };
        }
    },
    
    // Get update history
    getUpdateHistory() {
        const currentVersion = this.getCurrentVersion();
        const versions = Object.keys(LIBRARY_UPDATES).sort();
        
        return versions.map(version => ({
            version,
            name: LIBRARY_UPDATES[version].name,
            libraryCount: LIBRARY_UPDATES[version].libraries.length,
            applied: version <= currentVersion
        }));
    },
    
    // Reset to specific version (for testing)
    async resetToVersion(version) {
        try {
            // Clear all libraries
            const existingLibraries = await storage.getLibraries();
            for (const library of existingLibraries) {
                await storage.delete('libraries', library.id);
            }
            
            // Apply updates up to the specified version
            const versions = Object.keys(LIBRARY_UPDATES).sort();
            const targetVersions = versions.filter(v => v <= version);
            
            for (const v of targetVersions) {
                await this.applyVersionUpdate(v);
            }
            
            this.setCurrentVersion(version);
            
            return { success: true, message: `Reset to version ${version}` };
        } catch (error) {
            console.error('Error resetting to version:', error);
            return { success: false, message: error.message };
        }
    }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    window.libraryUpdater = libraryUpdater;
    window.LIBRARY_UPDATES = LIBRARY_UPDATES;
    
    // Convenience functions
    window.checkForLibraryUpdates = () => libraryUpdater.checkForUpdates();
    window.getLibraryUpdateHistory = () => libraryUpdater.getUpdateHistory();
    window.addSingleLibrary = (library) => libraryUpdater.addSingleLibrary(library);
    window.addMultipleLibraries = (libraries) => libraryUpdater.addMultipleLibraries(libraries);
    window.resetToLibraryVersion = (version) => libraryUpdater.resetToVersion(version);
}

console.log('Library updater system loaded!');
console.log('Available functions:');
console.log('- checkForLibraryUpdates() - Check and apply pending updates');
console.log('- getLibraryUpdateHistory() - Get update history');
console.log('- addSingleLibrary(library) - Add one library safely');
console.log('- addMultipleLibraries(libraries) - Add multiple libraries safely');
console.log('- resetToLibraryVersion(version) - Reset to specific version'); 