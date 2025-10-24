import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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
  }, [drawingManager, map, currentDrawingMode, onPolygonComplete]);

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
        libraries={['geometry', 'places', 'drawing']}
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
            zoomControl: true,
            gestureHandling: 'cooperative',
            mapTypeId: 'satellite',
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
