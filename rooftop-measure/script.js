// Global variables
let map;
let drawingManager;
let currentPolygon = null;

// Initialize Google Maps
function initMap() {
    // Map configuration using environment variables
    const mapOptions = {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        mapTypeId: MAP_CONFIG.mapTypeId,
        tilt: MAP_CONFIG.tilt,
        heading: MAP_CONFIG.heading
    };

    // Apply control settings from configuration
    Object.assign(mapOptions, MAP_CONFIG.controls);

    // Create the map instance
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize drawing manager
    initDrawingManager();

    // Update status
    document.getElementById('status').textContent = 'Map loaded successfully - Ready for polygon drawing';

    console.log('Google Maps initialized successfully');
    console.log('Map center:', MAP_CONFIG.center);
    console.log('Map zoom:', MAP_CONFIG.zoom);
}

// Initialize Drawing Manager
function initDrawingManager() {
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null, // No drawing mode by default
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        polygonOptions: { ...POLYGON_CONFIG }
    });

    // Set the drawing manager to work with our map
    drawingManager.setMap(map);

    // Add event listener for polygon completion
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        onPolygonComplete(polygon);
    });
}

// Handle polygon completion
function onPolygonComplete(polygon) {
    // Clear any existing polygon
    if (currentPolygon) {
        currentPolygon.setMap(null);
    }

    // Set the new polygon as current
    currentPolygon = polygon;

    // Calculate area
    const area = calculateArea(polygon);

    // Display area
    displayArea(area);

    // Update status
    document.getElementById('status').textContent = 'Polygon drawn - Area calculated';

    console.log('Polygon completed');
    console.log('Area:', area);
}

// Calculate polygon area using Google Maps geometry library
function calculateArea(polygon) {
    const path = polygon.getPath();
    const coordinates = [];

    // Convert Google Maps LatLng to standard coordinates for area calculation
    for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push([point.lng(), point.lat()]); // [lng, lat] format
    }

    // Close the polygon if it's not already closed
    if (coordinates.length > 0 && (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
        coordinates.push([coordinates[0][0], coordinates[0][1]]);
    }

    // Calculate area using Google Maps geometry library
    const polygonForArea = coordinates.map(coord => new google.maps.LatLng(coord[1], coord[0]));
    const area = google.maps.geometry.spherical.computeArea(polygonForArea);

    // Convert to square meters and square feet
    const areaInSqm = area;
    const areaInSqft = area * 10.764;

    return {
        squareMeters: Math.round(areaInSqm),
        squareFeet: Math.round(areaInSqft)
    };
}

// Display area in the UI
function displayArea(area) {
    const areaElement = document.getElementById('area');
    if (!areaElement) {
        // Create area display element if it doesn't exist
        const infoDiv = document.querySelector('.info') || document.querySelector('.controls');
        const areaDiv = document.createElement('div');
        areaDiv.id = 'area';
        areaDiv.className = 'area-display';
        areaDiv.style.fontWeight = 'bold';
        areaDiv.style.color = '#4285f4';
        areaDiv.style.marginTop = '5px';
        infoDiv.appendChild(areaDiv);
    }

    document.getElementById('area').innerHTML = `${area.squareMeters.toLocaleString()} m² (${area.squareFeet.toLocaleString()} ft²)`;
}

// Clear current polygon
function clearPolygon() {
    if (currentPolygon) {
        currentPolygon.setMap(null);
        currentPolygon = null;
    }

    // Clear area display
    const areaElement = document.getElementById('area');
    if (areaElement) {
        areaElement.textContent = '';
    }

    // Reset status
    document.getElementById('status').textContent = 'Map loaded successfully - Ready for polygon drawing';
}

// Export polygon data (for future use)
function exportPolygonData() {
    if (!currentPolygon) {
        return null;
    }

    const path = currentPolygon.getPath();
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({
            lat: point.lat(),
            lng: point.lng()
        });
    }

    const area = calculateArea(currentPolygon);

    return {
        coordinates: coordinates,
        area: area,
        timestamp: new Date().toISOString()
    };
}

// Initialize map when Google Maps API is loaded
function initMap() {
    // Map configuration using environment variables
    const mapOptions = {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        mapTypeId: MAP_CONFIG.mapTypeId,
        tilt: MAP_CONFIG.tilt,
        heading: MAP_CONFIG.heading
    };

    // Apply control settings from configuration
    Object.assign(mapOptions, MAP_CONFIG.controls);

    // Create the map instance
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize drawing manager
    initDrawingManager();

    // Update status
    document.getElementById('status').textContent = 'Map loaded successfully - Ready for polygon drawing';

    console.log('Google Maps initialized successfully');
    console.log('Map center:', MAP_CONFIG.center);
    console.log('Map zoom:', MAP_CONFIG.zoom);
}

// Make initMap globally available for the HTML script
window.initMap = initMap;

// Error handling for Google Maps API
window.gm_authFailure = function() {
    document.getElementById('status').textContent = 'Google Maps API Error: Check your API key';
    console.error('Google Maps API authentication failed');
};

// Global functions for HTML buttons
function startDrawing() {
    if (drawingManager) {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        document.getElementById('status').textContent = 'Click on the map to start drawing your rooftop polygon';
    }
}

// Handle API loading errors
if (typeof google === 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('status').textContent = 'Google Maps API not loaded';
    });
}
