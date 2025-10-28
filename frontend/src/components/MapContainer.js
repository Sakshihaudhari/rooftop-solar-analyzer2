import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

// Static libraries array - prevents LoadScript from reloading on every render
const GOOGLE_MAPS_LIBRARIES = ['geometry', 'places', 'drawing'];

// Create zoom control function
const createZoomControl = (map) => {
  const zoomControlDiv = document.createElement('div');
  zoomControlDiv.style.cssText = `
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
    border-radius: 2px;
    overflow: hidden;
    font-size: 14px;
  `;

  const zoomInButton = document.createElement('button');
  zoomInButton.innerHTML = '+';
  zoomInButton.style.cssText = `
    width: 32px;
    height: 32px;
    border: none;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    user-select: none;
  `;
  zoomInButton.title = 'Zoom in';
  zoomInButton.onclick = () => map.setZoom(map.getZoom() + 1);

  const zoomOutButton = document.createElement('button');
  zoomOutButton.innerHTML = '−';
  zoomOutButton.style.cssText = `
    width: 32px;
    height: 32px;
    border: none;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    user-select: none;
  `;
  zoomOutButton.title = 'Zoom out';
  zoomOutButton.onclick = () => map.setZoom(map.getZoom() - 1);

  zoomControlDiv.appendChild(zoomInButton);
  zoomControlDiv.appendChild(zoomOutButton);

  return zoomControlDiv;
};

// Create scale control function
const createScaleControl = (map) => {
  const scaleControlDiv = document.createElement('div');

  const updateScale = () => {
    const zoom = map.getZoom();
    const center = map.getCenter();
    const lat = center.lat();

    // Calculate meters per pixel based on zoom level and latitude
    const metersPerPixel = (156543.03392 * Math.cos(lat * Math.PI / 180)) / Math.pow(2, zoom);

    // Define scale distances based on zoom level (5m to 2000km range)
    let targetDistance;
    if (zoom >= 20) {
      targetDistance = 5; // 5m
    } else if (zoom >= 19) {
      targetDistance = 10; // 10m
    } else if (zoom >= 18) {
      targetDistance = 20; // 20m
    } else if (zoom >= 17) {
      targetDistance = 50; // 50m
    } else if (zoom >= 16) {
      targetDistance = 100; // 100m
    } else if (zoom >= 15) {
      targetDistance = 200; // 200m
    } else if (zoom >= 14) {
      targetDistance = 500; // 500m
    } else if (zoom >= 13) {
      targetDistance = 1000; // 1km
    } else if (zoom >= 12) {
      targetDistance = 2000; // 2km
    } else if (zoom >= 11) {
      targetDistance = 5000; // 5km
    } else if (zoom >= 10) {
      targetDistance = 10000; // 10km
    } else if (zoom >= 9) {
      targetDistance = 20000; // 20km
    } else if (zoom >= 8) {
      targetDistance = 50000; // 50km
    } else if (zoom >= 7) {
      targetDistance = 100000; // 100km
    } else if (zoom >= 6) {
      targetDistance = 200000; // 200km
    } else if (zoom >= 5) {
      targetDistance = 500000; // 500km
    } else if (zoom >= 4) {
      targetDistance = 1000000; // 1000km
    } else if (zoom >= 3) {
      targetDistance = 2000000; // 2000km
    } else {
      targetDistance = 2000000; // 2000km max
    }

    // Calculate scale bar width (target around 80px)
    const scaleWidth = Math.min(80, Math.max(20, (targetDistance / metersPerPixel) * 10));

    // Format distance text
    let distanceText;
    if (targetDistance >= 1000000) {
      distanceText = `${(targetDistance / 1000).toLocaleString()}km`;
    } else if (targetDistance >= 1000) {
      distanceText = `${(targetDistance / 1000).toLocaleString()}km`;
    } else {
      distanceText = `${targetDistance}m`;
    }

    // Update the scale bar content
    scaleControlDiv.innerHTML = `
      <div style="height: 2px; background-color: #000; width: ${scaleWidth}px; margin-right: 4px;"></div>
      <span>${distanceText}</span>
    `;
  };

  // Initial update
  updateScale();

  // Add listeners
  const zoomListener = map.addListener('zoom_changed', updateScale);
  const idleListener = map.addListener('idle', updateScale);

  // Cleanup function
  scaleControlDiv.cleanup = () => {
    window.google.maps.event.removeListener(zoomListener);
    window.google.maps.event.removeListener(idleListener);
  };

  return scaleControlDiv;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

const MapContainer = ({
  rooftops,
  obstacles,
  solarPanels,
  currentDrawingMode,
  onPolygonComplete,
  onMapLoad,
  onStartDrawing,
  onMapInstanceReady
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
  const [liveMeasurements, setLiveMeasurements] = useState(null);

  // Function to clear measurements
  const clearMeasurements = useCallback(() => {
    setLiveMeasurements(null);
    // Close any existing InfoWindow
    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null);
    }
  }, [currentInfoWindow]);

  // Google Earth-style measurement display function
  const showPolygonMeasurements = useCallback((polygon) => {
    if (!polygon || !map) return;

    const path = polygon.getPath();

    // Calculate area using Google's spherical geometry (same as Google Earth)
    const area = window.google.maps.geometry.spherical.computeArea(path);

    // Calculate perimeter using Google's spherical geometry (same as Google Earth)
    let perimeter = 0;
    for (let i = 0; i < path.getLength(); i++) {
      const p1 = path.getAt(i);
      const p2 = path.getAt((i + 1) % path.getLength());
      perimeter += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    }

    // Format area display (same logic as Google Earth)
    const areaDisplay = area > 1000000
      ? `${(area / 1000000).toFixed(2)} km²`
      : `${area.toFixed(2)} m²`;

    // Format perimeter display (same logic as Google Earth)
    const perimeterDisplay = perimeter > 1000
      ? `${(perimeter / 1000).toFixed(2)} km`
      : `${perimeter.toFixed(2)} m`;

    // Store measurements for fixed-position display
    setLiveMeasurements({
      area: areaDisplay,
      perimeter: perimeterDisplay,
      areaRaw: `${Math.round(area).toLocaleString()} m²`,
      perimeterRaw: `${Math.round(perimeter).toLocaleString()} m`
    });

    // Close existing InfoWindow (if any)
    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null);
    }
  }, [map, currentInfoWindow]);

  // Show measurements for obstacles
  const showObstacleMeasurements = useCallback((obstacle) => {
    if (!obstacle || !map) return;

    const path = obstacle.getPath();

    // Calculate area using Google's spherical geometry
    const area = window.google.maps.geometry.spherical.computeArea(path);

    // Calculate perimeter using Google's spherical geometry
    let perimeter = 0;
    for (let i = 0; i < path.getLength(); i++) {
      const p1 = path.getAt(i);
      const p2 = path.getAt((i + 1) % path.getLength());
      perimeter += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    }

    // Format measurements like Google Earth
    const areaDisplay = area > 1000000
      ? `${(area / 1000000).toFixed(2)} km²`
      : `${area.toFixed(2)} m²`;

    const perimeterDisplay = perimeter > 1000
      ? `${(perimeter / 1000).toFixed(2)} km`
      : `${perimeter.toFixed(2)} m`;

    // Store measurements for fixed-position display (obstacle style)
    setLiveMeasurements({
      area: areaDisplay,
      perimeter: perimeterDisplay,
      areaRaw: `${Math.round(area).toLocaleString()} m²`,
      perimeterRaw: `${Math.round(perimeter).toLocaleString()} m`,
      isObstacle: true
    });

    // Close existing InfoWindow (if any)
    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null);
    }
  }, [map, currentInfoWindow]);

  // Initialize map
  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);

    // Initialize drawing manager
    const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: currentDrawingMode === 'rooftop' ? '#4285f4' : '#db4437',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManagerInstance.setMap(mapInstance);
    setDrawingManager(drawingManagerInstance);

    // Setup search functionality - this will be handled by the SearchBox component
    // The search box is added to the map controls by the SearchBox component itself

    if (onMapLoad) {
      onMapLoad(mapInstance, drawingManagerInstance);
    }

    if (onMapInstanceReady) {
      onMapInstanceReady(mapInstance);
    }
  };

  // Add custom controls to map
  useEffect(() => {
    if (map) {
      // Create zoom control container (matches Google Maps exactly)
      const zoomContainer = document.createElement('div');
      zoomContainer.style.cssText = `
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,.3);
        overflow: hidden;
        font-size: 14px;
        margin-bottom: 8px;
      `;

      // Create scale control container (matches Google Maps exactly)
      const scaleContainer = document.createElement('div');
      scaleContainer.style.cssText = `
        background: white;
        border: 1px solid #ccc;
        border-radius: 2px;
        padding: 2px 4px;
        font-size: 11px;
        color: #333;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        display: flex;
        align-items: center;
        gap: 4px;
      `;

      // Create main container for both controls (positioned like Google Maps)
      const controlsContainer = document.createElement('div');
      controlsContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      `;

      // Add zoom control
      const zoomControl = createZoomControl(map);
      zoomContainer.appendChild(zoomControl);
      controlsContainer.appendChild(zoomContainer);

      // Add scale control
      const scaleControl = createScaleControl(map);
      scaleContainer.appendChild(scaleControl);
      controlsContainer.appendChild(scaleContainer);

      // Add to map DOM directly (not using Google Maps control system)
      map.getDiv().appendChild(controlsContainer);

      return () => {
        if (controlsContainer && controlsContainer.parentNode) {
          // Clean up scale control listeners
          if (scaleControl.cleanup) {
            scaleControl.cleanup();
          }
          controlsContainer.parentNode.removeChild(controlsContainer);
        }
      };
    }
  }, [map]);

  // Handle drawing mode changes and start drawing
  useEffect(() => {
    if (drawingManager && currentDrawingMode !== 'none') {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    } else if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
  }, [currentDrawingMode, drawingManager]);

  // Handle polygon completion
  useEffect(() => {
    if (drawingManager && map) {
      const handleOverlayComplete = (event) => {
        if (event.type === 'polygon') {
          drawingManager.setDrawingMode(null);

          // Clear any existing measurements before showing new ones
          clearMeasurements();

          // Show live measurements immediately
          showPolygonMeasurements(event.overlay);

          // Add edit listeners for real-time updates
          const path = event.overlay.getPath();
          const updateMeasurements = () => showPolygonMeasurements(event.overlay);

          window.google.maps.event.addListener(path, 'set_at', updateMeasurements);
          window.google.maps.event.addListener(path, 'insert_at', updateMeasurements);
          window.google.maps.event.addListener(path, 'remove_at', updateMeasurements);

          if (onPolygonComplete) {
            onPolygonComplete(event.overlay, currentDrawingMode);
          }
        }
      };

      const listener = window.google.maps.event.addListener(
        drawingManager,
        'overlaycomplete',
        handleOverlayComplete
      );

      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [drawingManager, map, currentDrawingMode, onPolygonComplete, showPolygonMeasurements, showObstacleMeasurements, clearMeasurements]);

  // Update drawing options based on mode
  useEffect(() => {
    if (drawingManager) {
      drawingManager.setOptions({
        polygonOptions: {
          fillColor: currentDrawingMode === 'rooftop' ? '#4285f4' : '#db4437',
          fillOpacity: 0.5,
          strokeWeight: 2,
          clickable: true,
          editable: true,
          zIndex: 1,
        },
      });
    }
  }, [currentDrawingMode, drawingManager]);

  // Add click listeners to existing polygons for measurement display
  useEffect(() => {
    if (!map || rooftops.length === 0) return;

    const clickListeners = rooftops.map(rooftop => {
      const handlePolygonClick = () => {
        clearMeasurements(); // Clear existing measurements first
        showPolygonMeasurements(rooftop);
      };
      const listener = rooftop.addListener('click', handlePolygonClick);
      return { polygon: rooftop, listener };
    });

    return () => {
      clickListeners.forEach(({ listener }) => {
        window.google.maps.event.removeListener(listener);
      });
    };
  }, [map, rooftops, showPolygonMeasurements, clearMeasurements]);

  // Add click listeners to existing obstacles for measurement display
  useEffect(() => {
    if (!map || obstacles.length === 0) return;

    const clickListeners = obstacles.map(obstacle => {
      const handleObstacleClick = () => {
        clearMeasurements(); // Clear existing measurements first
        showObstacleMeasurements(obstacle);
      };
      const listener = obstacle.addListener('click', handleObstacleClick);
      return { obstacle, listener };
    });

    return () => {
      clickListeners.forEach(({ listener }) => {
        window.google.maps.event.removeListener(listener);
      });
    };
  }, [map, obstacles, showObstacleMeasurements, clearMeasurements]);

  // Clear measurements when drawing mode is cancelled or polygons are removed
  useEffect(() => {
    if (currentDrawingMode === 'none') {
      clearMeasurements();
    }
  }, [currentDrawingMode, clearMeasurements]);

  // Clear measurements when all polygons are cleared
  useEffect(() => {
    if (rooftops.length === 0 && obstacles.length === 0) {
      clearMeasurements();
    }
  }, [rooftops.length, obstacles.length, clearMeasurements]);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <h3>Google Maps API Key Required</h3>
          <p>Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        loadingElement={<div style={{ height: '100%' }} />}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={18}
          options={{
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: false,
            scaleControl: false,
            gestureHandling: 'greedy',
            mapTypeId: 'satellite',
            minZoom: 15,
            maxZoom: 22,
            tilt: 0,
            restriction: {
              latLngBounds: null,
              strictBounds: false,
            },
          }}
          onLoad={handleMapLoad}
        >
          {/* Render existing polygons */}
          {rooftops.map((rooftop, index) => (
            <React.Fragment key={`rooftop-${index}`}>
              {/* Polygons are managed by the useSolarAnalyzer hook */}
            </React.Fragment>
          ))}

          {obstacles.map((obstacle, index) => (
            <React.Fragment key={`obstacle-${index}`}>
              {/* Obstacles are managed by the useSolarAnalyzer hook */}
            </React.Fragment>
          ))}

          {solarPanels.map((panel, index) => (
            <React.Fragment key={`panel-${index}`}>
              {/* Solar panels are managed by the useSolarAnalyzer hook */}
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Fixed-position measurements display at bottom-left */}
      {liveMeasurements && (
        <div className="live-measurements-display" style={{
          position: 'absolute',
          bottom: '80px',
          left: '20px',
          padding: '12px 16px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: liveMeasurements.isObstacle ? '#dc3545' : '#333', fontSize: '14px' }}>
              {liveMeasurements.isObstacle ? 'Obstacle ' : ''}Area:
            </strong>
            <span style={{ color: '#666', marginLeft: '6px', fontSize: '14px' }}>
              {liveMeasurements.area}
            </span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: '#333', fontSize: '14px' }}>Perimeter:</strong>
            <span style={{ color: '#666', marginLeft: '6px', fontSize: '14px' }}>
              {liveMeasurements.perimeter}
            </span>
          </div>
          <div style={{
            fontSize: '10px',
            color: '#999',
            fontFamily: 'monospace',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '6px',
            marginTop: '6px',
            lineHeight: '1.3'
          }}>
            <div>Raw: {liveMeasurements.areaRaw}</div>
            <div>Raw: {liveMeasurements.perimeterRaw}</div>
          </div>
        </div>
      )}

      {/* Start drawing instruction overlay */}
      {currentDrawingMode !== 'none' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Click on the map to draw a {currentDrawingMode}. Double-click to finish.
        </div>
      )}
    </div>
  );
};

export default MapContainer;
