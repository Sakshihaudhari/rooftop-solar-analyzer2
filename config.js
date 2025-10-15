// Configuration file for Google Maps API
// Works in both Node.js (server) and browser environments

// Load environment variables if in Node.js environment
if (typeof process !== 'undefined' && process.env && typeof require === 'function') {
    try {
        require('dotenv').config({ path: '.env' });
    } catch (e) {
        // .env file might not exist or be readable, continue with defaults
        if (typeof console !== 'undefined') {
            console.log('Note: .env file not found, using default configuration');
        }
    }
}

// =============================================================================
// MAP CONFIGURATION
// =============================================================================
// Get environment variables with fallbacks for browser compatibility
const getEnvVar = (key, defaultValue) => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return defaultValue;
};

const GOOGLE_MAPS_API_KEY = getEnvVar('GOOGLE_MAPS_API_KEY', getEnvVar('DEFAULT_API_KEY', 'AIzaSyAA7J2yuZpz8yy_Zo3Bu6ljZYk3L5C6OO8'));

// Map settings
const MAP_CONFIG = {
    center: {
        lat: parseFloat(getEnvVar('DEFAULT_MAP_CENTER_LAT', '19.076')),
        lng: parseFloat(getEnvVar('DEFAULT_MAP_CENTER_LNG', '72.8777'))
    },
    zoom: parseInt(getEnvVar('DEFAULT_ZOOM_LEVEL', '20')),
    tilt: parseInt(getEnvVar('DEFAULT_MAP_TILT', '0')),
    heading: parseInt(getEnvVar('DEFAULT_MAP_HEADING', '0')),
    mapTypeId: 'satellite',
    controls: {
        zoomControl: getEnvVar('MAP_ZOOM_CONTROL', 'true') === 'true',
        mapTypeControl: getEnvVar('MAP_TYPE_CONTROL', 'true') === 'true',
        scaleControl: getEnvVar('MAP_SCALE_CONTROL', 'true') === 'true',
        streetViewControl: getEnvVar('MAP_STREET_VIEW_CONTROL', 'false') === 'true',
        rotateControl: getEnvVar('MAP_ROTATE_CONTROL', 'true') === 'true',
        fullscreenControl: getEnvVar('MAP_FULLSCREEN_CONTROL', 'true') === 'true',
        disableDefaultUI: getEnvVar('MAP_DISABLE_DEFAULT_UI', 'false') === 'true'
    }
};

// Polygon styling configuration
const POLYGON_CONFIG = {
    fillColor: getEnvVar('POLYGON_FILL_COLOR', '#4285f4'),
    fillOpacity: parseFloat(getEnvVar('POLYGON_FILL_OPACITY', '0.3')),
    strokeColor: getEnvVar('POLYGON_STROKE_COLOR', '#4285f4'),
    strokeWeight: parseInt(getEnvVar('POLYGON_STROKE_WEIGHT', '2')),
    clickable: getEnvVar('POLYGON_CLICKABLE', 'true') === 'true',
    editable: getEnvVar('POLYGON_EDITABLE', 'true') === 'true',
    zIndex: 1
};

// UI styling configuration
const UI_CONFIG = {
    primaryColor: getEnvVar('UI_PRIMARY_COLOR', '#4285f4'),
    primaryHoverColor: getEnvVar('UI_PRIMARY_HOVER_COLOR', '#3367d6'),
    dangerColor: getEnvVar('UI_DANGER_COLOR', '#db4437'),
    dangerHoverColor: getEnvVar('UI_DANGER_HOVER_COLOR', '#c23321'),
    infoBackground: getEnvVar('UI_INFO_BACKGROUND', '#f8f9fa'),
    areaTextColor: getEnvVar('UI_AREA_TEXT_COLOR', '#4285f4')
};

// Function to validate API key format (basic validation)
function validateApiKey() {
    // Check if API key looks like a placeholder (contains common placeholder text)
    const placeholderPatterns = [
        'YOUR_GOOGLE_MAPS_API_KEY',
        'your_google_maps_api_key',
        'API_KEY_HERE',
        'your_api_key_here',
        'REPLACE_WITH_YOUR_KEY'
    ];

    const isPlaceholder = placeholderPatterns.some(pattern =>
        GOOGLE_MAPS_API_KEY.includes(pattern) || GOOGLE_MAPS_API_KEY === pattern
    );

    if (isPlaceholder || GOOGLE_MAPS_API_KEY.length < 20) {
        if (typeof console !== 'undefined') {
            console.error('Please set a valid Google Maps API key in .env file');
        }
        return false;
    }
    return true;
}

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_MAPS_API_KEY,
        validateApiKey,
        MAP_CONFIG,
        POLYGON_CONFIG,
        UI_CONFIG
    };
}

// Make configuration available globally for browser scripts
if (typeof window !== 'undefined') {
    window.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;
    window.MAP_CONFIG = MAP_CONFIG;
    window.POLYGON_CONFIG = POLYGON_CONFIG;
    window.UI_CONFIG = UI_CONFIG;
    window.validateApiKey = validateApiKey;
}
