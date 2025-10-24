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
  const renderPolygonsOnMap = () => {
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
  };

  // Re-render polygons when they change
  useEffect(() => {
    renderPolygonsOnMap();
  }, [rooftops, obstacles, solarPanels]);

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
    // The map will automatically center on the selected location
    // You can add additional logic here if needed
  }, []);

  // Handle optimize panels
  const handleOptimizePanels = () => {
    optimizePanels();
  };

  // Handle clear all
  const handleClearAll = () => {
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