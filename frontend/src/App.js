import React, { useEffect, useRef, useState, useCallback } from "react";
import MapContainer from "./components/MapContainer";
import ControlPanel from "./components/ControlPanel";
import MeasurementsDisplay from "./components/MeasurementsDisplay";
import SolarAnalysisDisplay from "./components/SolarAnalysisDisplay";
import SearchBox from "./components/SearchBox";
import useSolarAnalyzer from "./hooks/useSolarAnalyzer";
import "./App.css";

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

    // Clear existing location marker
    if (locationMarker) {
      locationMarker.setMap(null);
    }

    // Create new location marker (EXACT Google Maps design)
    const marker = new window.google.maps.Marker({
      position: place.geometry.location,
      map: mapInstance,
      title: place.name || place.formatted_address,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <!-- Drop shadow -->
            <ellipse cx="20" cy="38" rx="4" ry="1.5" fill="#000000" opacity="0.2"/>
            <!-- Main marker body with black outline -->
            <path fill="#ea4335" stroke="#000000" stroke-width="1" d="M20 3c-5.5 0-10 4.5-10 10 0 8 10 24 10 24s10-16 10-24c0-5.5-4.5-10-10-10z"/>
            <!-- White center circle with black border -->
            <circle fill="#ffffff" stroke="#000000" stroke-width="1" cx="20" cy="13" r="5.5"/>
            <!-- Inner red circle -->
            <circle fill="#ea4335" cx="20" cy="13" r="2"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 40)
      },
      animation: window.google.maps.Animation.DROP
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
              onDrawingModeChange={handleDrawingModeChange}
              onPanelSizeChange={setSelectedPanelSize}
              onOptimizePanels={handleOptimizePanels}
              onClearAll={handleClearAll}
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