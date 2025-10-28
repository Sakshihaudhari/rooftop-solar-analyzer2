import React, { useEffect, useRef, useState, useCallback } from 'react';
import useSolarAnalyzer from './hooks/useSolarAnalyzer';
import MapContainer from './components/MapContainer';
import ControlPanel from './components/ControlPanel';
import MeasurementsDisplay from './components/MeasurementsDisplay';
import SolarAnalysisDisplay from './components/SolarAnalysisDisplay';
import SearchBox from './components/SearchBox';
import './App.css';

function App() {
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
    rooftopFillColor,
    rooftopFillOpacity,
    updateRooftopStyle,
    setCurrentDrawingMode,
    setSelectedPanelSize,
    addRooftop,
    addObstacle,
    optimizePanels,
    clearAll,
  } = useSolarAnalyzer();

  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [locationMarker, setLocationMarker] = useState(null);

  // Handle polygon completion from map
  const handlePolygonComplete = (polygon, mode) => {
    if (mode === 'rooftop') {
      addRooftop(polygon);
    } else if (mode === 'obstacle') {
      addObstacle(polygon);
    }
  };

  // Handle map load
  const handleMapLoad = (mapInstance, drawingManagerInstance) => {
    mapRef.current = mapInstance;
    drawingManagerRef.current = drawingManagerInstance;
    setMapInstance(mapInstance);

    // Render existing polygons on the map
    renderPolygonsOnMap();
  };

  // Render all polygons on the map
  const renderPolygonsOnMap = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing polygons from map and re-add them
    rooftops.forEach(rooftop => {
      rooftop.setMap(null);
      rooftop.setMap(mapRef.current);
    });

    obstacles.forEach(obstacle => {
      obstacle.setMap(null);
      obstacle.setMap(mapRef.current);
    });

    solarPanels.forEach(panel => {
      panel.setMap(null);
      panel.setMap(mapRef.current);
    });

    // Ensure location marker is on the map
    if (locationMarker) {
      locationMarker.setMap(mapRef.current);
    }
  }, [rooftops, obstacles, solarPanels, locationMarker]);

  // Re-render polygons when they change
  useEffect(() => {
    renderPolygonsOnMap();
  }, [renderPolygonsOnMap]);

  // Cleanup location marker on unmount
  useEffect(() => {
    return () => {
      if (locationMarker) {
        locationMarker.setMap(null);
      }
    };
  }, [locationMarker]);

  // Handle drawing mode changes
  const handleDrawingModeChange = (mode) => {
    if (mode === 'none') {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    }
    setCurrentDrawingMode(mode);
  };

  // Handle place selection from search
  const handlePlaceSelect = useCallback((place) => {
    console.log('Selected place:', place);

    if (!place || !place.geometry || !place.geometry.location || !mapInstance) {
      return;
    }

    const location = place.geometry.location;
    const mapCenter = {
      lat: location.lat(),
      lng: location.lng()
    };

    // Center map on selected place
    mapInstance.setCenter(mapCenter);
    mapInstance.setZoom(18);

    // Create a marker at the location
    const marker = new window.google.maps.Marker({
      position: mapCenter,
      map: mapInstance,
      title: place.name || 'Selected Location'
    });

    // Store the marker reference
    setLocationMarker(marker);

    // Skip showing detailed location panel
    // setSelectedLocation(place);
    // setShowLocationPanel(true);

    // Optional: Add click listener to show place details
    marker.addListener('click', () => {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <strong>${place.name || 'Location'}</strong><br/>
            ${place.formatted_address || ''}
          </div>
        `
      });
      infoWindow.open(mapInstance, marker);
    });

    console.log('✅ Location marker placed on map');
  }, [mapInstance, locationMarker]);

  // Handle optimize panels
  const handleOptimizePanels = () => {
    optimizePanels();
  };

  // Handle clear all
  const handleClearAll = () => {
    // Clear location marker
    if (locationMarker) {
      locationMarker.setMap(null);
      setLocationMarker(null);
    }
    clearAll();
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  console.log("🚀 App component rendering...");
  console.log("🔑 Frontend - API Key:", apiKey ? "[LOADED]" : "[MISSING]");
  console.log("📊 Measurements:", measurements);
  console.log("🏠 Rooftops:", rooftops.length);
  console.log("🪨 Obstacles:", obstacles.length);
  console.log("⚡ Solar Panels:", solarPanels.length);

  return (
    <div className="app">
      <div className="app-header">
        <h1 style={{ margin: 0, padding: '16px 24px', color: '#333', fontSize: '20px', fontWeight: '600' }}>
          Rooftop Solar Analyzer
        </h1>
      </div>

      <div className="app-container">
        <div className="sidebar">
          <div className="sidebar-section">
            <ControlPanel
              currentDrawingMode={currentDrawingMode}
              selectedPanelSize={selectedPanelSize}
              rooftops={rooftops}
              rooftopFillColor={rooftopFillColor}
              rooftopFillOpacity={rooftopFillOpacity}
              onDrawingModeChange={handleDrawingModeChange}
              onPanelSizeChange={setSelectedPanelSize}
              onOptimizePanels={handleOptimizePanels}
              onClearAll={handleClearAll}
              onUpdateRooftopStyle={updateRooftopStyle}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="sidebar-section">
            <MeasurementsDisplay measurements={measurements} />
          </div>

          {solarAnalysis && (
            <div className="sidebar-section">
              <SolarAnalysisDisplay solarAnalysis={solarAnalysis} />
            </div>
          )}
        </div>

        <div className="map-wrapper">
          <MapContainer
            rooftops={rooftops}
            obstacles={obstacles}
            solarPanels={solarPanels}
            currentDrawingMode={currentDrawingMode}
            onPolygonComplete={handlePolygonComplete}
            onMapLoad={handleMapLoad}
            onMapInstanceReady={setMapInstance}
          />
          <SearchBox map={mapInstance} onPlaceSelect={handlePlaceSelect} />
        </div>
      </div>
    </div>
  );
}

export default App;
