// Utility script to add more libraries to the static version
// This can be run in the browser console to add additional libraries

const ADDITIONAL_LIBRARIES = [
    // Add more libraries here as needed
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
        longitude: -122.4833,
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
        website: "https://sfpl.org/locations/glen-park-branch",
        latitude: 37.7333,
        longitude: -122.4333,
        created_at: new Date().toISOString(),
        image_count: 0,
        visit_count: 0
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
        longitude: -118.4700,
        created_at: new Date().toISOString(),
        image_count: 0,
        visit_count: 0
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
        longitude: -118.5267,
        created_at: new Date().toISOString(),
        image_count: 0,
        visit_count: 0
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
        longitude: -118.4333,
        created_at: new Date().toISOString(),
        image_count: 0,
        visit_count: 0
    }
];

// Function to add libraries (can be called from browser console)
async function addMoreLibraries() {
    try {
        console.log('Adding additional libraries...');
        
        for (const library of ADDITIONAL_LIBRARIES) {
            await storage.addLibrary(library);
        }
        
        console.log(`Added ${ADDITIONAL_LIBRARIES.length} additional libraries`);
        
        // Refresh the display
        await libraryManager.loadLibraries();
        await searchManager.loadFilters();
        
        utils.showNotification(`Added ${ADDITIONAL_LIBRARIES.length} more libraries!`, 'success');
        
        return true;
    } catch (error) {
        console.error('Error adding libraries:', error);
        utils.showNotification('Error adding libraries', 'error');
        return false;
    }
}

// Function to clear all libraries (for testing)
async function clearAllLibraries() {
    try {
        const libraries = await storage.getLibraries();
        
        for (const library of libraries) {
            await storage.delete('libraries', library.id);
        }
        
        console.log('Cleared all libraries');
        await libraryManager.loadLibraries();
        await searchManager.loadFilters();
        
        utils.showNotification('Cleared all libraries', 'success');
        
        return true;
    } catch (error) {
        console.error('Error clearing libraries:', error);
        utils.showNotification('Error clearing libraries', 'error');
        return false;
    }
}

// Function to reload preset libraries
async function reloadPresetLibraries() {
    try {
        // Clear existing libraries
        await clearAllLibraries();
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Load preset libraries
        await loadPresetLibraries();
        
        // Refresh display
        await libraryManager.loadLibraries();
        await searchManager.loadFilters();
        
        return true;
    } catch (error) {
        console.error('Error reloading preset libraries:', error);
        utils.showNotification('Error reloading libraries', 'error');
        return false;
    }
}

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    window.addMoreLibraries = addMoreLibraries;
    window.clearAllLibraries = clearAllLibraries;
    window.reloadPresetLibraries = reloadPresetLibraries;
    window.ADDITIONAL_LIBRARIES = ADDITIONAL_LIBRARIES;
}

console.log('Library management utilities loaded!');
console.log('Available functions:');
console.log('- addMoreLibraries() - Add more libraries');
console.log('- clearAllLibraries() - Clear all libraries');
console.log('- reloadPresetLibraries() - Reload preset libraries'); 