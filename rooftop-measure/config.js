// Google Maps API Configuration
// Environment variables are loaded from .env file

// Load environment variables
if (typeof process !== 'undefined' && process.env) {
    require('dotenv').config();
}

// =============================================================================
// MAP CONFIGURATION
// =============================================================================
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.DEFAULT_API_KEY || 'AIzaSyAA7J2yuZpz8yy_Zo3Bu6ljZYk3L5C6OO8';

// Map settings
const MAP_CONFIG = {
    center: {
        lat: parseFloat(process.env.DEFAULT_MAP_CENTER_LAT) || 19.076,
        lng: parseFloat(process.env.DEFAULT_MAP_CENTER_LNG) || 72.8777
    },
    zoom: parseInt(process.env.DEFAULT_ZOOM_LEVEL) || 20,
    tilt: parseInt(process.env.DEFAULT_MAP_TILT) || 0,
    heading: parseInt(process.env.DEFAULT_MAP_HEADING) || 0,
    mapTypeId: 'satellite',
    controls: {
        zoomControl: process.env.MAP_ZOOM_CONTROL === 'true',
        mapTypeControl: process.env.MAP_TYPE_CONTROL === 'true',
        scaleControl: process.env.MAP_SCALE_CONTROL === 'true',
        streetViewControl: process.env.MAP_STREET_VIEW_CONTROL === 'true',
        rotateControl: process.env.MAP_ROTATE_CONTROL === 'true',
        fullscreenControl: process.env.MAP_FULLSCREEN_CONTROL === 'true',
        disableDefaultUI: process.env.MAP_DISABLE_DEFAULT_UI === 'true'
    }
};

// Polygon styling configuration
const POLYGON_CONFIG = {
    fillColor: process.env.POLYGON_FILL_COLOR || '#4285f4',
    fillOpacity: parseFloat(process.env.POLYGON_FILL_OPACITY) || 0.3,
    strokeColor: process.env.POLYGON_STROKE_COLOR || '#4285f4',
    strokeWeight: parseInt(process.env.POLYGON_STROKE_WEIGHT) || 2,
    clickable: process.env.POLYGON_CLICKABLE === 'true',
    editable: process.env.POLYGON_EDITABLE === 'true',
    zIndex: 1
};

// UI styling configuration
const UI_CONFIG = {
    primaryColor: process.env.UI_PRIMARY_COLOR || '#4285f4',
    primaryHoverColor: process.env.UI_PRIMARY_HOVER_COLOR || '#3367d6',
    dangerColor: process.env.UI_DANGER_COLOR || '#db4437',
    dangerHoverColor: process.env.UI_DANGER_HOVER_COLOR || '#c23321',
    infoBackground: process.env.UI_INFO_BACKGROUND || '#f8f9fa',
    areaTextColor: process.env.UI_AREA_TEXT_COLOR || '#4285f4'
};

// Function to validate API key format (basic validation)
function validateApiKey() {
    const defaultKey = process.env.DEFAULT_API_KEY || 'AIzaSyAA7J2yuZpz8yy_Zo3Bu6ljZYk3L5C6OO8';
    if (GOOGLE_MAPS_API_KEY === defaultKey || GOOGLE_MAPS_API_KEY.length < 20) {
        console.error('Please set a valid Google Maps API key in .env file');
        return false;
    }
    return true;
}

// Make it available globally
window.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;
window.MAP_CONFIG = MAP_CONFIG;
window.POLYGON_CONFIG = POLYGON_CONFIG;
window.UI_CONFIG = UI_CONFIG;
window.validateApiKey = validateApiKey;
