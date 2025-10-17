import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DrawingManager, Polygon } from '@react-google-maps/api';
import './App.css';

// Import components
import ControlPanel from './components/ControlPanel';
import MeasurementsDisplay from './components/MeasurementsDisplay';
import SolarAnalysisDisplay from './components/SolarAnalysisDisplay';

// Import hooks and utilities
import useSolarAnalyzer from './hooks/useSolarAnalyzer';

// Google Maps configuration - Static constants to prevent re-renders
const GOOGLE_MAPS_LIBRARIES = ['drawing', 'geometry', 'places'];

const MAP_CONFIG = {
  center: {
    lat: parseFloat(process.env.REACT_APP_MAP_CENTER_LAT) || 19.076,
    lng: parseFloat(process.env.REACT_APP_MAP_CENTER_LNG) || 72.8777
  },
  zoom: parseInt(process.env.REACT_APP_MAP_ZOOM) || 20,
  mapTypeId: 'satellite',
  tilt: 0,
  heading: 0,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: true,
  fullscreenControl: true,
};

// Fallback configuration in case environment variables aren't available
const FALLBACK_MAP_CONFIG = {
  center: { lat: 19.076, lng: 72.8777 },
  zoom: 20,
  mapTypeId: 'satellite',
  tilt: 0,
  heading: 0,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: true,
  fullscreenControl: true,
};

const POLYGON_CONFIG = {
  fillColor: '#4285f4',
  fillOpacity: 0.3,
  strokeColor: '#4285f4',
  strokeWeight: 2,
  clickable: true,
  editable: true,
  zIndex: 1,
};

const DRAWING_MANAGER_OPTIONS = {
  drawingMode: null,
  drawingControl: true,
  drawingControlOptions: {
    position: 9, // TOP_CENTER = 9 in Google Maps API
    drawingModes: ['polygon'],
  },
  polygonOptions: POLYGON_CONFIG,
};

function App() {
  // State for the solar analyzer
  const {
    rooftops,
    obstacles,
    solarPanels,
    measurements,
    solarAnalysis,
    currentDrawingMode,
    selectedPanelSize,
    isLoading,
    error,
    setCurrentDrawingMode,
    setSelectedPanelSize,
    addRooftop,
    addObstacle,
    optimizePanels,
    clearAll,
  } = useSolarAnalyzer();

  // Refs for Google Maps components
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Handle drawing manager load
  const handleDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;

    // Listen for polygon completion - use Google Maps API directly
    if (window.google && window.google.maps && drawingManager) {
      window.google.maps.event.addListener(
        drawingManager,
        'polygoncomplete',
        (polygon) => {
          // Inline the polygon completion logic to avoid circular dependency
          if (currentDrawingMode === 'rooftop') {
            addRooftop(polygon);
          } else if (currentDrawingMode === 'obstacle') {
            addObstacle(polygon);
          }

          // Reset drawing mode
          if (drawingManagerRef.current) {
            drawingManagerRef.current.setDrawingMode(null);
          }
        }
      );
    }
  }, [currentDrawingMode, addRooftop, addObstacle]);


  // Handle drawing mode change
  const handleDrawingModeChange = useCallback((mode) => {
    setCurrentDrawingMode(mode);

    // Reset drawing mode in drawing manager
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, [setCurrentDrawingMode]);

  // Handle panel size change
  const handlePanelSizeChange = useCallback((size) => {
    setSelectedPanelSize(size);
  }, [setSelectedPanelSize]);

  // Handle panel optimization
  const handleOptimizePanels = useCallback(() => {
    optimizePanels();
  }, [optimizePanels]);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    clearAll();

    // Clear any active drawing
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, [clearAll]);

  return (
    <div className="app">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyAA7J2yuZpz8yy_Zo3Bu6ljZYk3L5C6OO8"}
        libraries={GOOGLE_MAPS_LIBRARIES}
        loadingElement={<div className="loading-screen">Loading Google Maps...</div>}
      >
        <div className="app-container">
          {/* Control Panel */}
          <ControlPanel
            currentDrawingMode={currentDrawingMode}
            selectedPanelSize={selectedPanelSize}
            onDrawingModeChange={handleDrawingModeChange}
            onPanelSizeChange={handlePanelSizeChange}
            onOptimizePanels={handleOptimizePanels}
            onClearAll={handleClearAll}
            isLoading={isLoading}
            error={error}
          />

          {/* Google Map */}
          <div className="map-wrapper">
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100%',
              }}
              center={MAP_CONFIG.center || FALLBACK_MAP_CONFIG.center}
              zoom={MAP_CONFIG.zoom || FALLBACK_MAP_CONFIG.zoom}
              mapTypeId={MAP_CONFIG.mapTypeId || FALLBACK_MAP_CONFIG.mapTypeId}
              options={{
                disableDefaultUI: MAP_CONFIG.disableDefaultUI ?? FALLBACK_MAP_CONFIG.disableDefaultUI,
                zoomControl: MAP_CONFIG.zoomControl ?? FALLBACK_MAP_CONFIG.zoomControl,
                mapTypeControl: MAP_CONFIG.mapTypeControl ?? FALLBACK_MAP_CONFIG.mapTypeControl,
                scaleControl: MAP_CONFIG.scaleControl ?? FALLBACK_MAP_CONFIG.scaleControl,
                streetViewControl: MAP_CONFIG.streetViewControl ?? FALLBACK_MAP_CONFIG.streetViewControl,
                rotateControl: MAP_CONFIG.rotateControl ?? FALLBACK_MAP_CONFIG.rotateControl,
                fullscreenControl: MAP_CONFIG.fullscreenControl ?? FALLBACK_MAP_CONFIG.fullscreenControl,
                tilt: MAP_CONFIG.tilt ?? FALLBACK_MAP_CONFIG.tilt,
                heading: MAP_CONFIG.heading ?? FALLBACK_MAP_CONFIG.heading,
              }}
              onLoad={handleMapLoad}
            >
              {/* Drawing Manager */}
              <DrawingManager
                onLoad={handleDrawingManagerLoad}
                options={DRAWING_MANAGER_OPTIONS}
              />

              {/* Render existing polygons and panels */}
              {rooftops.map((rooftop, index) => (
                <Polygon
                  key={`rooftop-${index}`}
                  path={rooftop.getPath().getArray()}
                  options={{
                    ...POLYGON_CONFIG,
                    fillColor: '#4285f4',
                    strokeColor: '#4285f4',
                  }}
                />
              ))}

              {obstacles.map((obstacle, index) => (
                <Polygon
                  key={`obstacle-${index}`}
                  path={obstacle.getPath().getArray()}
                  options={{
                    ...POLYGON_CONFIG,
                    fillColor: '#db4437',
                    strokeColor: '#db4437',
                  }}
                />
              ))}

              {solarPanels.map((panel, index) => (
                <Polygon
                  key={`panel-${index}`}
                  path={panel.getPath().getArray()}
                  options={{
                    ...POLYGON_CONFIG,
                    fillColor: '#34a853',
                    strokeColor: '#34a853',
                    fillOpacity: 0.6,
                    strokeOpacity: 0.8,
                  }}
                />
              ))}
            </GoogleMap>
          </div>

          {/* Measurements Display */}
          <MeasurementsDisplay measurements={measurements} />

          {/* Solar Analysis Display */}
          {solarAnalysis && (
            <SolarAnalysisDisplay solarAnalysis={solarAnalysis} />
          )}
        </div>
      </LoadScript>
    </div>
  );
}

export default App;
