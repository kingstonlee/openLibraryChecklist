const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Sample California public libraries data with library systems and branches
const californiaLibraries = [
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
        longitude: -118.2544
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
        longitude: -118.2589
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
        longitude: -118.3264
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
        longitude: -118.4695
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
        longitude: -118.4428
    },
    {
        name: "Los Angeles Public Library - Brentwood Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Brentwood Branch",
        address: "11820 San Vicente Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90049",
        phone: "(310) 575-8273",
        website: "https://www.lapl.org/branches/brentwood",
        latitude: 34.0736,
        longitude: -118.4700
    },
    {
        name: "Los Angeles Public Library - Palisades Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Palisades Branch",
        address: "861 Alma Real Dr",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90272",
        phone: "(310) 459-2754",
        website: "https://www.lapl.org/branches/palisades",
        latitude: 34.0467,
        longitude: -118.5267
    },
    {
        name: "Los Angeles Public Library - Mar Vista Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Mar Vista Branch",
        address: "12006 Venice Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90066",
        phone: "(310) 390-3454",
        website: "https://www.lapl.org/branches/mar-vista",
        latitude: 34.0000,
        longitude: -118.4333
    },
    {
        name: "Los Angeles Public Library - West Los Angeles Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "West Los Angeles Branch",
        address: "11360 Santa Monica Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90025",
        phone: "(310) 575-8323",
        website: "https://www.lapl.org/branches/west-los-angeles",
        latitude: 34.0500,
        longitude: -118.4500
    },
    {
        name: "Los Angeles Public Library - Fairfax Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Fairfax Branch",
        address: "161 S Gardner St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90036",
        phone: "(323) 936-6191",
        website: "https://www.lapl.org/branches/fairfax",
        latitude: 34.0833,
        longitude: -118.3667
    },
    {
        name: "Los Angeles Public Library - Robertson Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Robertson Branch",
        address: "1719 S Robertson Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90035",
        phone: "(310) 840-2147",
        website: "https://www.lapl.org/branches/robertson",
        latitude: 34.0667,
        longitude: -118.3833
    },
    {
        name: "Los Angeles Public Library - Pico Union Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Pico Union Branch",
        address: "1030 S Alvarado St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90006",
        phone: "(213) 368-7546",
        website: "https://www.lapl.org/branches/pico-union",
        latitude: 34.0667,
        longitude: -118.2833
    },
    {
        name: "Los Angeles Public Library - Wilshire Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Wilshire Branch",
        address: "149 N St Andrews Pl",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90004",
        phone: "(323) 957-4550",
        website: "https://www.lapl.org/branches/wilshire",
        latitude: 34.0833,
        longitude: -118.3000
    },
    {
        name: "Los Angeles Public Library - John C. Fremont Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "John C. Fremont Branch",
        address: "6121 Melrose Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90038",
        phone: "(323) 962-3521",
        website: "https://www.lapl.org/branches/john-c-fremont",
        latitude: 34.0833,
        longitude: -118.3167
    },
    {
        name: "Los Angeles Public Library - Los Feliz Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Los Feliz Branch",
        address: "1874 Hillhurst Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90027",
        phone: "(323) 913-4710",
        website: "https://www.lapl.org/branches/los-feliz",
        latitude: 34.1167,
        longitude: -118.2833
    },
    {
        name: "Los Angeles Public Library - Atwater Village Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Atwater Village Branch",
        address: "3379 Glendale Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90039",
        phone: "(323) 664-1353",
        website: "https://www.lapl.org/branches/atwater-village",
        latitude: 34.1167,
        longitude: -118.2667
    },
    {
        name: "Los Angeles Public Library - Silver Lake Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Silver Lake Branch",
        address: "2411 Glendale Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90039",
        phone: "(323) 913-7451",
        website: "https://www.lapl.org/branches/silver-lake",
        latitude: 34.1000,
        longitude: -118.2667
    },
    {
        name: "Los Angeles Public Library - Eagle Rock Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Eagle Rock Branch",
        address: "5027 Caspar Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90041",
        phone: "(323) 258-8078",
        website: "https://www.lapl.org/branches/eagle-rock",
        latitude: 34.1333,
        longitude: -118.2167
    },
    {
        name: "Los Angeles Public Library - Highland Park Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Highland Park Branch",
        address: "5110 N Figueroa St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90042",
        phone: "(323) 255-3137",
        website: "https://www.lapl.org/branches/highland-park",
        latitude: 34.1167,
        longitude: -118.2000
    },
    {
        name: "Los Angeles Public Library - Cypress Park Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Cypress Park Branch",
        address: "1150 Cypress Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90065",
        phone: "(323) 224-0039",
        website: "https://www.lapl.org/branches/cypress-park",
        latitude: 34.1000,
        longitude: -118.2167
    },
    {
        name: "Los Angeles Public Library - Glassell Park Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Glassell Park Branch",
        address: "3755 Verdugo Rd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "90065",
        phone: "(323) 255-8397",
        website: "https://www.lapl.org/branches/glassell-park",
        latitude: 34.1167,
        longitude: -118.2333
    },
    {
        name: "Los Angeles Public Library - Sunland-Tujunga Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Sunland-Tujunga Branch",
        address: "7771 Foothill Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91040",
        phone: "(818) 352-4481",
        website: "https://www.lapl.org/branches/sunland-tujunga",
        latitude: 34.2500,
        longitude: -118.2833
    },
    {
        name: "Los Angeles Public Library - Sun Valley Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Sun Valley Branch",
        address: "7935 Vineland Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91352",
        phone: "(818) 764-1335",
        website: "https://www.lapl.org/branches/sun-valley",
        latitude: 34.2167,
        longitude: -118.3667
    },
    {
        name: "Los Angeles Public Library - Pacoima Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Pacoima Branch",
        address: "13605 Van Nuys Blvd",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91331",
        phone: "(818) 899-5203",
        website: "https://www.lapl.org/branches/pacoima",
        latitude: 34.2667,
        longitude: -118.4167
    },
    {
        name: "Los Angeles Public Library - Sylmar Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Sylmar Branch",
        address: "14561 Polk St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91342",
        phone: "(818) 367-6102",
        website: "https://www.lapl.org/branches/sylmar",
        latitude: 34.3000,
        longitude: -118.4500
    },
    {
        name: "Los Angeles Public Library - Granada Hills Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Granada Hills Branch",
        address: "10640 Petit Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91344",
        phone: "(818) 368-5687",
        website: "https://www.lapl.org/branches/granada-hills",
        latitude: 34.2833,
        longitude: -118.5000
    },
    {
        name: "Los Angeles Public Library - Chatsworth Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Chatsworth Branch",
        address: "21052 Devonshire St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91311",
        phone: "(818) 341-4276",
        website: "https://www.lapl.org/branches/chatsworth",
        latitude: 34.2667,
        longitude: -118.6000
    },
    {
        name: "Los Angeles Public Library - Northridge Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Northridge Branch",
        address: "9051 Darby Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91325",
        phone: "(818) 886-3640",
        website: "https://www.lapl.org/branches/northridge",
        latitude: 34.2333,
        longitude: -118.5333
    },
    {
        name: "Los Angeles Public Library - Porter Ranch Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Porter Ranch Branch",
        address: "11371 Tampa Ave",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91326",
        phone: "(818) 360-5706",
        website: "https://www.lapl.org/branches/porter-ranch",
        latitude: 34.2833,
        longitude: -118.5500
    },
    {
        name: "Los Angeles Public Library - Lake View Terrace Branch",
        library_system: "Los Angeles Public Library",
        branch_name: "Lake View Terrace Branch",
        address: "12002 Osborne St",
        city: "Los Angeles",
        county: "Los Angeles",
        zip_code: "91342",
        phone: "(818) 890-7404",
        website: "https://www.lapl.org/branches/lake-view-terrace",
        latitude: 34.2667,
        longitude: -118.3833
    },

    // San Francisco Public Library System
    {
        name: "San Francisco Public Library - Main Library",
        library_system: "San Francisco Public Library",
        branch_name: "Main Library",
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
        longitude: -122.3874
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
        longitude: -122.4098
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
        longitude: -122.4073
    },
    {
        name: "San Francisco Public Library - Mission Branch",
        library_system: "San Francisco Public Library",
        branch_name: "Mission Branch",
        address: "300 Bartlett St",
        city: "San Francisco",
        county: "San Francisco",
        zip_code: "94110",
        phone: "(415) 355-2800",
        website: "https://sfpl.org/locations/mission-branch",
        latitude: 37.7589,
        longitude: -122.4194
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
        website: "https://sfpl.org/locations/potrero-branch",
        latitude: 37.7625,
        longitude: -122.3972
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
        website: "https://sfpl.org/locations/bernal-heights-branch",
        latitude: 37.7417,
        longitude: -122.4167
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
        website: "https://sfpl.org/locations/glen-park-branch",
        latitude: 37.7333,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/excelsior-branch",
        latitude: 37.7167,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/visitacion-valley-branch",
        latitude: 37.7167,
        longitude: -122.4000
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
        website: "https://sfpl.org/locations/portola-branch",
        latitude: 37.7167,
        longitude: -122.4000
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
        website: "https://sfpl.org/locations/ocean-view-branch",
        latitude: 37.7167,
        longitude: -122.4667
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
        website: "https://sfpl.org/locations/ingleside-branch",
        latitude: 37.7167,
        longitude: -122.4667
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
        website: "https://sfpl.org/locations/sunset-branch",
        latitude: 37.7333,
        longitude: -122.4833
    },
    {
        name: "San Francisco Public Library - Parkside Branch",
        library_system: "San Francisco Public Library",
        branch_name: "Parkside Branch",
        address: "1200 Taraval St",
        city: "San Francisco",
        county: "San Francisco",
        zip_code: "94116",
        phone: "(415) 355-5650",
        website: "https://sfpl.org/locations/parkside-branch",
        latitude: 37.7333,
        longitude: -122.4833
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
        website: "https://sfpl.org/locations/ortega-branch",
        latitude: 37.7333,
        longitude: -122.4833
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
        longitude: -122.4667
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
        website: "https://sfpl.org/locations/anza-branch",
        latitude: 37.7833,
        longitude: -122.4833
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
        website: "https://sfpl.org/locations/golden-gate-valley-branch",
        latitude: 37.8000,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/marina-branch",
        latitude: 37.8000,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/presidio-branch",
        latitude: 37.7833,
        longitude: -122.4500
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
        website: "https://sfpl.org/locations/western-addition-branch",
        latitude: 37.7833,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/eureka-valley-branch",
        latitude: 37.7667,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/noe-valley-branch",
        latitude: 37.7500,
        longitude: -122.4333
    },
    {
        name: "San Francisco Public Library - Castro Branch",
        library_system: "San Francisco Public Library",
        branch_name: "Castro Branch",
        address: "501 Castro St",
        city: "San Francisco",
        county: "San Francisco",
        zip_code: "94114",
        phone: "(415) 355-2806",
        website: "https://sfpl.org/locations/castro-branch",
        latitude: 37.7667,
        longitude: -122.4333
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
        website: "https://sfpl.org/locations/haight-ashbury-branch",
        latitude: 37.7667,
        longitude: -122.4500
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
        website: "https://sfpl.org/locations/park-branch",
        latitude: 37.7667,
        longitude: -122.4500
    },

    // San Diego Public Library System
    {
        name: "San Diego Public Library - Central Library",
        library_system: "San Diego Public Library",
        branch_name: "Central Library",
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
        longitude: -117.2713
    },
    {
        name: "San Diego Public Library - Pacific Beach Branch",
        library_system: "San Diego Public Library",
        branch_name: "Pacific Beach Branch",
        address: "4275 Cass St",
        city: "San Diego",
        county: "San Diego",
        zip_code: "92109",
        phone: "(858) 581-9934",
        website: "https://www.sandiego.gov/public-library/locations/pacific-beach",
        latitude: 32.7977,
        longitude: -117.2344
    },

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
        website: "https://www.saclibrary.org/",
        latitude: 38.5816,
        longitude: -121.4944
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
        website: "https://www.saclibrary.org/Locations/Belle-Cooledge",
        latitude: 38.5567,
        longitude: -121.4934
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
        website: "https://oaklandlibrary.org/",
        latitude: 37.8044,
        longitude: -122.2711
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
        website: "https://oaklandlibrary.org/locations/rockridge-branch",
        latitude: 37.8476,
        longitude: -122.2518
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
        website: "https://www.fresnolibrary.org/",
        latitude: 36.7378,
        longitude: -119.7871
    },
    {
        name: "Fresno County Public Library - Fig Garden Branch",
        library_system: "Fresno County Public Library",
        branch_name: "Fig Garden Branch",
        address: "3071 W Bullard Ave",
        city: "Fresno",
        county: "Fresno",
        zip_code: "93711",
        phone: "(559) 600-9295",
        website: "https://www.fresnolibrary.org/locations/fig-garden",
        latitude: 36.8317,
        longitude: -119.8234
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
        website: "https://www.longbeach.gov/library/",
        latitude: 33.7701,
        longitude: -118.1937
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
        website: "https://www.longbeach.gov/library/locations/alamitos-branch",
        latitude: 33.7701,
        longitude: -118.1756
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
        website: "https://www.kerncountylibrary.org/",
        latitude: 35.3733,
        longitude: -119.0187
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
        website: "https://www.anaheim.net/155/Library",
        latitude: 33.8366,
        longitude: -117.9143
    },
    {
        name: "Anaheim Public Library - Canyon Hills Branch",
        library_system: "Anaheim Public Library",
        branch_name: "Canyon Hills Branch",
        address: "400 Scout Trail",
        city: "Anaheim",
        county: "Orange",
        zip_code: "92807",
        phone: "(714) 765-6444",
        website: "https://www.anaheim.net/155/Library",
        latitude: 33.8567,
        longitude: -117.8843
    },

    // Santa Ana Public Library System
    {
        name: "Santa Ana Public Library - Main Library",
        library_system: "Santa Ana Public Library",
        branch_name: "Main Library",
        address: "26 Civic Center Plaza",
        city: "Santa Ana",
        county: "Orange",
        zip_code: "92701",
        phone: "(714) 647-5250",
        website: "https://www.santa-ana.org/library/",
        latitude: 33.7455,
        longitude: -117.8677
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
        website: "https://riversideca.gov/library/",
        latitude: 33.9533,
        longitude: -117.3962
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
        website: "https://www.stocktonca.gov/library/",
        latitude: 37.9577,
        longitude: -121.2908
    },

    // Irvine Public Library System
    {
        name: "Irvine Public Library - Heritage Park Regional Library",
        library_system: "Irvine Public Library",
        branch_name: "Heritage Park Regional Library",
        address: "14361 Yale Ave",
        city: "Irvine",
        county: "Orange",
        zip_code: "92604",
        phone: "(949) 551-7150",
        website: "https://www.cityofirvine.org/irvine-public-library",
        latitude: 33.6846,
        longitude: -117.8265
    },

    // Fremont Public Library System
    {
        name: "Fremont Public Library - Main Library",
        library_system: "Fremont Public Library",
        branch_name: "Main Library",
        address: "2400 Stevenson Blvd",
        city: "Fremont",
        county: "Alameda",
        zip_code: "94538",
        phone: "(510) 745-1400",
        website: "https://fremont.gov/Government/Departments/Library",
        latitude: 37.5485,
        longitude: -121.9886
    },

    // San Bernardino Public Library System
    {
        name: "San Bernardino Public Library - Feldheym Central Library",
        library_system: "San Bernardino Public Library",
        branch_name: "Feldheym Central Library",
        address: "555 W 6th St",
        city: "San Bernardino",
        county: "San Bernardino",
        zip_code: "92410",
        phone: "(909) 381-8201",
        website: "https://www.sbpl.org/",
        latitude: 34.1083,
        longitude: -117.2898
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
        website: "https://www.stanislauslibrary.org/",
        latitude: 37.6391,
        longitude: -120.9969
    },

    // Fontana Public Library System
    {
        name: "Fontana Public Library - Lewis Library and Technology Center",
        library_system: "Fontana Public Library",
        branch_name: "Lewis Library and Technology Center",
        address: "8437 Sierra Ave",
        city: "Fontana",
        county: "San Bernardino",
        zip_code: "92335",
        phone: "(909) 574-4500",
        website: "https://www.fontanalibrary.org/",
        latitude: 34.0922,
        longitude: -117.4350
    },

    // Oxnard Public Library System
    {
        name: "Oxnard Public Library - Main Library",
        library_system: "Oxnard Public Library",
        branch_name: "Main Library",
        address: "251 S A St",
        city: "Oxnard",
        county: "Ventura",
        zip_code: "93030",
        phone: "(805) 385-7500",
        website: "https://www.oxnard.org/library/",
        latitude: 34.1975,
        longitude: -119.1771
    },

    // Moreno Valley Public Library System
    {
        name: "Moreno Valley Public Library - Moreno Valley Public Library",
        library_system: "Moreno Valley Public Library",
        branch_name: "Moreno Valley Public Library",
        address: "25480 Alessandro Blvd",
        city: "Moreno Valley",
        county: "Riverside",
        zip_code: "92553",
        phone: "(951) 413-3880",
        website: "https://www.moval.org/library",
        latitude: 33.9425,
        longitude: -117.2297
    },

    // Glendale Public Library System
    {
        name: "Glendale Public Library - Central Library",
        library_system: "Glendale Public Library",
        branch_name: "Central Library",
        address: "222 E Harvard St",
        city: "Glendale",
        county: "Los Angeles",
        zip_code: "91205",
        phone: "(818) 548-2021",
        website: "https://www.glendaleca.gov/government/departments/library-arts-culture/library",
        latitude: 34.1425,
        longitude: -118.2551
    },

    // Huntington Beach Public Library System
    {
        name: "Huntington Beach Public Library - Central Library",
        library_system: "Huntington Beach Public Library",
        branch_name: "Central Library",
        address: "7111 Talbert Ave",
        city: "Huntington Beach",
        county: "Orange",
        zip_code: "92648",
        phone: "(714) 842-4481",
        website: "https://www.huntingtonbeachca.gov/residents/library/",
        latitude: 33.6595,
        longitude: -118.0047
    },

    // Santa Clarita Public Library System
    {
        name: "Santa Clarita Public Library - Valencia Library",
        library_system: "Santa Clarita Public Library",
        branch_name: "Valencia Library",
        address: "23743 W Valencia Blvd",
        city: "Santa Clarita",
        county: "Los Angeles",
        zip_code: "91355",
        phone: "(661) 259-8942",
        website: "https://www.santaclaritalibrary.com/",
        latitude: 34.3917,
        longitude: -118.5426
    },

    // Garden Grove Public Library System
    {
        name: "Garden Grove Public Library - Main Library",
        library_system: "Garden Grove Public Library",
        branch_name: "Main Library",
        address: "11200 Stanford Ave",
        city: "Garden Grove",
        county: "Orange",
        zip_code: "92840",
        phone: "(714) 530-0711",
        website: "https://www.ggpl.org/",
        latitude: 33.7745,
        longitude: -117.9384
    },

    // Oceanside Public Library System
    {
        name: "Oceanside Public Library - Civic Center Library",
        library_system: "Oceanside Public Library",
        branch_name: "Civic Center Library",
        address: "330 N Coast Hwy",
        city: "Oceanside",
        county: "San Diego",
        zip_code: "92054",
        phone: "(760) 435-5600",
        website: "https://www.oceansidepubliclibrary.org/",
        latitude: 33.1959,
        longitude: -117.3795
    },

    // Ontario Public Library System
    {
        name: "Ontario Public Library - Ovitt Family Community Library",
        library_system: "Ontario Public Library",
        branch_name: "Ovitt Family Community Library",
        address: "215 E C St",
        city: "Ontario",
        county: "San Bernardino",
        zip_code: "91764",
        phone: "(909) 395-2005",
        website: "https://www.ontarioca.gov/library",
        latitude: 34.0633,
        longitude: -117.6509
    },

    // Elk Grove Public Library System
    {
        name: "Elk Grove Public Library - Elk Grove Public Library",
        library_system: "Elk Grove Public Library",
        branch_name: "Elk Grove Public Library",
        address: "8900 Elk Grove Blvd",
        city: "Elk Grove",
        county: "Sacramento",
        zip_code: "95624",
        phone: "(916) 264-2700",
        website: "https://www.saclibrary.org/",
        latitude: 38.4088,
        longitude: -121.3716
    },

    // Lancaster Public Library System
    {
        name: "Lancaster Public Library - Lancaster Library",
        library_system: "Lancaster Public Library",
        branch_name: "Lancaster Library",
        address: "601 W Lancaster Blvd",
        city: "Lancaster",
        county: "Los Angeles",
        zip_code: "93534",
        phone: "(661) 948-5029",
        website: "https://www.cityoflancasterca.org/residents/library",
        latitude: 34.6868,
        longitude: -118.1542
    },

    // Palmdale Public Library System
    {
        name: "Palmdale Public Library - Palmdale City Library",
        library_system: "Palmdale Public Library",
        branch_name: "Palmdale City Library",
        address: "700 E Palmdale Blvd",
        city: "Palmdale",
        county: "Los Angeles",
        zip_code: "93550",
        phone: "(661) 267-5600",
        website: "https://www.cityofpalmdale.org/Government/Departments/Library",
        latitude: 34.5794,
        longitude: -118.1165
    },

    // Salinas Public Library System
    {
        name: "Salinas Public Library - John Steinbeck Library",
        library_system: "Salinas Public Library",
        branch_name: "John Steinbeck Library",
        address: "350 Lincoln Ave",
        city: "Salinas",
        county: "Monterey",
        zip_code: "93901",
        phone: "(831) 758-7311",
        website: "https://www.salinaspubliclibrary.org/",
        latitude: 36.6777,
        longitude: -121.6555
    },

    // Hayward Public Library System
    {
        name: "Hayward Public Library - Hayward Public Library",
        library_system: "Hayward Public Library",
        branch_name: "Hayward Public Library",
        address: "835 C St",
        city: "Hayward",
        county: "Alameda",
        zip_code: "94541",
        phone: "(510) 881-7980",
        website: "https://www.hayward-ca.gov/discover/libraries",
        latitude: 37.6688,
        longitude: -122.0810
    },

    // Pomona Public Library System
    {
        name: "Pomona Public Library - Pomona Public Library",
        library_system: "Pomona Public Library",
        branch_name: "Pomona Public Library",
        address: "625 S Garey Ave",
        city: "Pomona",
        county: "Los Angeles",
        zip_code: "91766",
        phone: "(909) 620-2043",
        website: "https://www.pomonalibrary.org/",
        latitude: 34.0551,
        longitude: -117.7498
    },

    // Escondido Public Library System
    {
        name: "Escondido Public Library - Escondido Public Library",
        library_system: "Escondido Public Library",
        branch_name: "Escondido Public Library",
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

// Run the population script
populateLibraries(); 