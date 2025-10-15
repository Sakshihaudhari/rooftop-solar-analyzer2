// Rooftop Measurement Tool - Industry Standard Google Maps Integration
class RooftopMeasurementTool {
    constructor() {
        this.map = null;
        this.drawingManager = null;
        this.currentPolygon = null;
        this.isDrawing = false;
        this.searchBox = null;
    }

    // Initialize method to be called after Google Maps API loads
    initialize() {
        this.initMap();
        this.initSearchBox();
        this.initDrawingManager();
    }

    initMap() {
        // Initialize Google Map with configurable settings
        const mapOptions = {
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            mapTypeId: MAP_CONFIG.mapTypeId,
            tilt: MAP_CONFIG.tilt,
            heading: MAP_CONFIG.heading
        };

        // Apply control settings if not using default UI
        if (MAP_CONFIG.controls.disableDefaultUI) {
            Object.assign(mapOptions, MAP_CONFIG.controls);
        } else {
            // Apply individual control settings
            Object.assign(mapOptions, MAP_CONFIG.controls);
        }

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    initSearchBox() {
        try {
            // Create search input element
            const input = document.getElementById('searchInput');

            if (!input) {
                console.warn('Search input element not found');
                return;
            }

            // Check if Places API is available
            if (typeof google.maps.places === 'undefined') {
                console.warn('Google Places API not loaded. Search functionality disabled.');
                input.placeholder = 'Search not available (Enable Places API in Google Cloud)';
                input.disabled = true;
                document.getElementById('search-status').textContent = 'Places API not enabled - Enable in Google Cloud Console';
                return;
            }

            // Initialize Places Autocomplete
            this.searchBox = new google.maps.places.Autocomplete(input, {
                types: ['geocode'], // Restrict to geographical locations
                fields: ['place_id', 'geometry', 'name', 'formatted_address', 'types']
            });

            // Bias search results towards current map viewport
            this.searchBox.bindTo('bounds', this.map);

            // Listen for place selection
            this.searchBox.addListener('place_changed', () => {
                const place = this.searchBox.getPlace();

                console.log("Place selected:", place);
                console.log("Place geometry:", place?.geometry);

                if (!place) {
                    console.log("No place selected");
                    return;
                }

                // Try to use geometry if available
                if (place.geometry && place.geometry.location) {
                    // If the place has a geometry, then present it on a map
                    if (place.geometry.viewport) {
                        this.map.fitBounds(place.geometry.viewport);
                    } else {
                        this.map.setCenter(place.geometry.location);
                        this.map.setZoom(17); // Zoom in for rooftop detail
                    }

                    console.log("Successfully searched for location:", place.name || place.formatted_address);
                } else {
                    // Fallback: Use Geocoding API to get coordinates
                    console.log("No geometry available, trying geocoding for:", place.formatted_address);

                    if (place.formatted_address) {
                        this.geocodeAddress(place.formatted_address);
                    } else {
                        alert('Unable to find location coordinates. Please try a more specific location name.');
                    }
                }
            });

            console.log('Places Autocomplete initialized successfully');

            // Update status to show search is available
            document.getElementById('search-status').textContent = 'Search enabled - Start typing to find locations';
        } catch (error) {
            console.error('Error initializing search box:', error);
            const input = document.getElementById('searchInput');
            if (input) {
                input.placeholder = 'Search initialization failed';
                input.disabled = true;
            }
        }
    }

    // Geocoding fallback when Places API doesn't return geometry
    geocodeAddress(address) {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;

                // Center map on the geocoded location
                this.map.setCenter(location);
                this.map.setZoom(17); // Zoom in for rooftop detail

                console.log("Successfully geocoded address:", address, "to:", location.toString());
            } else {
                console.error("Geocoding failed for address:", address, "Status:", status);
                alert(`Unable to find coordinates for "${address}". Please try a more specific location name or check your internet connection.`);
            }
        });
    }

    initDrawingManager() {
        // Configure drawing manager with industry-standard options
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null, // No drawing mode by default
            drawingControl: true, // Show drawing controls
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON
                ]
            },
            polygonOptions: {
                ...POLYGON_CONFIG,
                strokeColor: POLYGON_CONFIG.strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: POLYGON_CONFIG.strokeWeight,
                fillColor: POLYGON_CONFIG.fillColor,
                fillOpacity: POLYGON_CONFIG.fillOpacity,
                editable: POLYGON_CONFIG.editable,
                draggable: false // Prevent accidental dragging
            }
        });

        this.drawingManager.setMap(this.map);

        // Listen for polygon completion
        google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {
            this.onPolygonComplete(polygon);
        });
    }

    startDrawing() {
        if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
            this.currentPolygon = null;
        }

        // Clear any existing measurements
        document.getElementById('area').textContent = '0 m²';
        document.getElementById('perimeter').textContent = '0 m';

        document.getElementById('status').textContent = 'Click on the map to start drawing your rooftop polygon';

        // Start polygon drawing mode using the drawing manager
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    onPolygonComplete(polygon) {
        this.currentPolygon = polygon;
        this.isDrawing = false;
        this.drawingManager.setDrawingMode(null);

        // Calculate and display area
        const area = this.calculateArea(polygon);
        this.displayArea(area);

        document.getElementById('status').textContent = 'Polygon completed - Ready for editing';

        // Add listener for polygon modifications
        google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
            const newArea = this.calculateArea(polygon);
            this.displayArea(newArea);
        });

        google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
            const newArea = this.calculateArea(polygon);
            this.displayArea(newArea);
        });
    }

    calculateArea(polygon) {
        // Get the paths of the polygon
        const path = polygon.getPath();
        const coordinates = [];

        // Convert Google Maps LatLng to standard coordinates for area calculation
        for (let i = 0; i < path.getLength(); i++) {
            const point = path.getAt(i);
            coordinates.push([point.lng(), point.lat()]); // [lng, lat] format for proper polygon area calculation
        }

        // Close the polygon if it's not already closed
        if (coordinates.length > 0 && (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
            coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
            coordinates.push([coordinates[0][0], coordinates[0][1]]);
        }

        // Calculate area and perimeter using Google Maps geometry library
        const polygonForArea = coordinates.map(coord => new google.maps.LatLng(coord[1], coord[0]));
        const area = google.maps.geometry.spherical.computeArea(polygonForArea);
        const perimeter = google.maps.geometry.spherical.computeLength(polygonForArea);

        // Convert measurements for display
        const areaInSqm = area;
        const areaInSqft = area * 10.764; // Convert m² to ft²
        const perimeterInMeters = perimeter;

        return {
            squareMeters: Math.round(areaInSqm),
            squareFeet: Math.round(areaInSqft),
            perimeterMeters: Math.round(perimeterInMeters)
        };
    }

    displayArea(area) {
        const areaElement = document.getElementById('area');
        const perimeterElement = document.getElementById('perimeter');

        areaElement.innerHTML = `${area.squareMeters.toLocaleString()} m² (${area.squareFeet.toLocaleString()} ft²)`;
        perimeterElement.textContent = `${area.perimeterMeters.toLocaleString()} m`;
    }

    clearPolygon() {
        if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
            this.currentPolygon = null;
        }

        document.getElementById('status').textContent = 'Ready';
        document.getElementById('area').textContent = '0 m²';
        document.getElementById('perimeter').textContent = '0 m';
    }


    // Method to export polygon data (useful for integration)
    exportPolygonData() {
        if (!this.currentPolygon) {
            return null;
        }

        const path = this.currentPolygon.getPath();
        const coordinates = [];

        for (let i = 0; i < path.getLength(); i++) {
            const point = path.getAt(i);
            coordinates.push({
                lat: point.lat(),
                lng: point.lng()
            });
        }

        const area = this.calculateArea(this.currentPolygon);

        return {
            coordinates: coordinates,
            area: area,
            timestamp: new Date().toISOString()
        };
    }
}

// Make functions globally available
function startDrawing() {
    if (window.measurementTool) {
        window.measurementTool.startDrawing();
    }
}

function clearPolygon() {
    if (window.measurementTool) {
        window.measurementTool.clearPolygon();
    }
}

// Test Places API functionality
function testPlacesAPI() {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.places !== 'undefined') {
        console.log('✅ Places API is available');

        // Try to create a test autocomplete
        const testInput = document.createElement('input');
        testInput.style.position = 'absolute';
        testInput.style.left = '-9999px';
        document.body.appendChild(testInput);

        try {
            const testAutocomplete = new google.maps.places.Autocomplete(testInput);
            console.log('✅ Places Autocomplete can be created');
            document.body.removeChild(testInput);
            return true;
        } catch (error) {
            console.error('❌ Places Autocomplete creation failed:', error);
            document.body.removeChild(testInput);
            return false;
        }
    } else {
        console.log('❌ Places API not available');
        return false;
    }
}

// Initialize search functionality when Google Places loads
function initializePlaces() {
    console.log('Checking Places API availability...');
    const placesAvailable = testPlacesAPI();

    if (window.measurementTool && placesAvailable) {
        console.log('Places API initialized and working');
        document.getElementById('search-status').textContent = 'Search enabled - Start typing to find locations';
    } else {
        console.log('Places API not working properly');
        document.getElementById('search-status').textContent = 'Places API not working - Check Google Cloud Console';
    }
}
