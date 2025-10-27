import { useState, useCallback, useEffect } from 'react';

// Panel specifications (width x height in meters)
const PANEL_SIZES = {
  small: { width: 1.2, height: 0.8, capacity: 0.3 }, // 300W
  standard: { width: 1.6, height: 1.0, capacity: 0.4 }, // 400W
  large: { width: 2.0, height: 1.0, capacity: 0.5 } // 500W
};

const useSolarAnalyzer = () => {
  // Core state
  const [rooftops, setRooftops] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [currentDrawingMode, setCurrentDrawingMode] = useState('rooftop');
  const [selectedPanelSize, setSelectedPanelSize] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculated measurements
  const [measurements, setMeasurements] = useState({
    totalArea: 0,
    usableArea: 0,
    obstacleArea: 0,
    perimeter: 0,
  });

  // Solar analysis results
  const [solarAnalysis, setSolarAnalysis] = useState(null);

  // Calculate measurements
  const calculateMeasurements = useCallback(() => {
    if (rooftops.length === 0) {
      setMeasurements({
        totalArea: 0,
        usableArea: 0,
        obstacleArea: 0,
        perimeter: 0,
      });
      return;
    }

    const rooftop = rooftops[0];
    const totalArea = calculatePolygonArea(rooftop);

    let obstacleArea = 0;
    obstacles.forEach(obstacle => {
      obstacleArea += calculatePolygonArea(obstacle);
    });

    const usableArea = Math.max(0, totalArea - obstacleArea);
    const perimeter = calculatePolygonPerimeter(rooftop);

    setMeasurements({
      totalArea,
      usableArea,
      obstacleArea,
      perimeter,
    });
  }, [rooftops, obstacles]);

  // Calculate measurements whenever rooftops or obstacles change
  useEffect(() => {
    calculateMeasurements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooftops, obstacles]); // calculateMeasurements is stable within this component

  // Add rooftop polygon
  const addRooftop = useCallback((polygon) => {
    // Remove existing rooftops
    rooftops.forEach(rooftop => {
      rooftop.setMap(null);
    });

    setRooftops([polygon]);

    // Update styling
    polygon.setOptions({
      fillColor: '#4285f4',
      strokeColor: '#4285f4',
      strokeWeight: 2,
    });

    // Reset drawing mode
    setCurrentDrawingMode('none');
  }, [rooftops, setCurrentDrawingMode]); // Need rooftops for iteration and setCurrentDrawingMode for state update

  // Add obstacle polygon
  const addObstacle = useCallback((polygon) => {
    if (rooftops.length === 0) {
      setError('Please draw a rooftop first before adding obstacles.');
      polygon.setMap(null);
      return;
    }

    setObstacles(prev => [...prev, polygon]);

    // Update styling
    polygon.setOptions({
      fillColor: '#db4437',
      strokeColor: '#db4437',
      strokeWeight: 2,
    });

    // Reset drawing mode
    setCurrentDrawingMode('none');
    setError(null);
  }, [rooftops.length, setCurrentDrawingMode, setError]); // Need these setters

  // Helper function to get polygon bounds
  const getPolygonBounds = useCallback((coordinates) => {
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });

    return {
      minLat, maxLat, minLng, maxLng,
      width: maxLng - minLng,
      height: maxLat - minLat
    };
  }, []);

  // Helper function to check if point is in polygon
  const isPointInPolygon = useCallback((point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].lat > point.lat) !== (polygon[j].lat > point.lat)) &&
          (point.lng < (polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat) / (polygon[j].lat - polygon[i].lat) + polygon[i].lng)) {
        inside = !inside;
      }
    }
    return inside;
  }, []);

  // Helper function to get polygon coordinates
  const getPolygonCoordinates = useCallback((polygon) => {
    const path = polygon.getPath();
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({ lat: point.lat(), lng: point.lng() });
    }

    return coordinates;
  }, []);

  // Helper function to create solar panel
  const createSolarPanel = useCallback((centerX, centerY, width, height, capacity) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const panelCoords = [
      new window.google.maps.LatLng(centerY - halfHeight, centerX - halfWidth),
      new window.google.maps.LatLng(centerY - halfHeight, centerX + halfWidth),
      new window.google.maps.LatLng(centerY + halfHeight, centerX + halfWidth),
      new window.google.maps.LatLng(centerY + halfHeight, centerX - halfWidth)
    ];

    const panelPolygon = new window.google.maps.Polygon({
      paths: panelCoords,
      strokeColor: '#34a853',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#34a853',
      fillOpacity: 0.6
    });

    return panelPolygon;
  }, []);

  // Helper function to check if panel intersects obstacle
  const doesPanelIntersectObstacle = useCallback((panelCenterX, panelCenterY, panelWidth, panelHeight, obstaclePolygon) => {
    const halfWidth = panelWidth / 2;
    const halfHeight = panelHeight / 2;

    const panelCorners = [
      { lat: panelCenterY - halfHeight, lng: panelCenterX - halfWidth },
      { lat: panelCenterY - halfHeight, lng: panelCenterX + halfWidth },
      { lat: panelCenterY + halfHeight, lng: panelCenterX + halfWidth },
      { lat: panelCenterY + halfHeight, lng: panelCenterX - halfWidth }
    ];

    // Check if any panel corner is inside the obstacle
    for (const corner of panelCorners) {
      if (isPointInPolygon(corner, getPolygonCoordinates(obstaclePolygon))) {
        return true;
      }
    }

    return false;
  }, [isPointInPolygon, getPolygonCoordinates]);

  // Place panels in polygon using grid algorithm
  const placePanelsInPolygon = useCallback((rooftopCoords, panelSize) => {
    const bounds = getPolygonBounds(rooftopCoords);
    const panelWidth = panelSize.width;
    const panelHeight = panelSize.height;

    // Calculate number of panels that can fit
    const widthCount = Math.floor(bounds.width / panelWidth);
    const heightCount = Math.floor(bounds.height / panelHeight);

    const newPanels = [];

    // Place panels in a grid pattern
    for (let row = 0; row < heightCount; row++) {
      for (let col = 0; col < widthCount; col++) {
        const centerX = bounds.minLng + (col * panelWidth) + (panelWidth / 2);
        const centerY = bounds.minLat + (row * panelHeight) + (panelHeight / 2);

        // Check if this panel position is within the rooftop polygon
        if (isPointInPolygon({ lat: centerY, lng: centerX }, rooftopCoords)) {
          // Check for obstacle intersections
          let intersectsObstacle = false;
          for (const obstacle of obstacles) {
            if (doesPanelIntersectObstacle(centerX, centerY, panelWidth, panelHeight, obstacle)) {
              intersectsObstacle = true;
              break;
            }
          }

          if (!intersectsObstacle) {
            const panel = createSolarPanel(centerX, centerY, panelWidth, panelHeight, panelSize.capacity);
            newPanels.push(panel);
          }
        }
      }
    }

    return newPanels;
  }, [obstacles, getPolygonBounds, isPointInPolygon, createSolarPanel, doesPanelIntersectObstacle]);

  // Update solar analysis
  const updateSolarAnalysis = useCallback((panels, panelSize) => {
    const panelCount = panels.length;
    const totalCapacity = panelCount * panelSize.capacity;
    const estimatedGeneration = totalCapacity * 1500; // kWh/year (average 4 hours of sun per day)

    const efficiency = rooftops.length > 0 ?
      (measurements.totalArea > 0 ?
        (totalCapacity / (measurements.totalArea * 0.15)) * 100 : 0) : 0;

    setSolarAnalysis({
      panelCount,
      totalCapacity,
      estimatedGeneration,
      efficiency,
    });
  }, [setSolarAnalysis, measurements.totalArea, rooftops.length]); // Need these for the calculation

  // Optimize panel layout
  const optimizePanels = useCallback(() => {
    if (rooftops.length === 0) {
      setError('Please draw a rooftop first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear existing panels
      solarPanels.forEach(panel => {
        panel.setMap(null);
      });

      const panelSize = PANEL_SIZES[selectedPanelSize];

      if (measurements.usableArea < (panelSize.width * panelSize.height)) {
        setError('The usable area is too small for even one panel of the selected size.');
        setIsLoading(false);
        return;
      }

      // Get rooftop coordinates for panel placement
      const rooftopPath = rooftops[0].getPath();
      const rooftopCoords = [];

      for (let i = 0; i < rooftopPath.getLength(); i++) {
        const point = rooftopPath.getAt(i);
        rooftopCoords.push({ lat: point.lat(), lng: point.lng() });
      }

      // Place panels using the grid algorithm
      const newPanels = placePanelsInPolygon(rooftopCoords, panelSize);

      setSolarPanels(newPanels);

      // Update solar analysis
      updateSolarAnalysis(newPanels, panelSize);

      setIsLoading(false);
    } catch (err) {
      setError('Error optimizing panel layout: ' + err.message);
      setIsLoading(false);
    }
  }, [rooftops, measurements.usableArea, selectedPanelSize, placePanelsInPolygon, updateSolarAnalysis, setError, setIsLoading, setSolarPanels, solarPanels]); // Need solarPanels for clearing

  // Clear all polygons and panels
  const clearAll = useCallback(() => {
    // Clear existing polygons from map
    rooftops.forEach(rooftop => {
      rooftop.setMap(null);
    });

    obstacles.forEach(obstacle => {
      obstacle.setMap(null);
    });

    solarPanels.forEach(panel => {
      panel.setMap(null);
    });

    // Reset state
    setRooftops([]);
    setObstacles([]);
    setSolarPanels([]);
    setMeasurements({
      totalArea: 0,
      usableArea: 0,
      obstacleArea: 0,
      perimeter: 0,
    });
    setSolarAnalysis(null);
    setError(null);
  }, [rooftops, obstacles, solarPanels, setRooftops, setObstacles, setSolarPanels, setMeasurements, setSolarAnalysis, setError]); // Need these for the operations

  return {
    // State
    rooftops,
    obstacles,
    solarPanels,
    measurements,
    solarAnalysis,
    currentDrawingMode,
    selectedPanelSize,
    isLoading,
    error,

    // Actions
    setCurrentDrawingMode,
    setSelectedPanelSize,
    addRooftop,
    addObstacle,
    optimizePanels,
    clearAll,
  };
};

// Google Earth-style measurement functions (same logic as Google Earth)
const calculatePolygonArea = (polygon) => {
  if (!polygon || !polygon.getPath) return 0;

  const path = polygon.getPath();

  // Use Google's spherical geometry - exactly like Google Earth
  return window.google.maps.geometry.spherical.computeArea(path);
};

const calculatePolygonPerimeter = (polygon) => {
  if (!polygon || !polygon.getPath) return 0;

  const path = polygon.getPath();

  // Use Google's spherical geometry for distance calculation - exactly like Google Earth
  let perimeter = 0;
  for (let i = 0; i < path.getLength(); i++) {
    const p1 = path.getAt(i);
    const p2 = path.getAt((i + 1) % path.getLength());
    perimeter += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
  }

  return perimeter;
};

// Format measurements like Google Earth (used in MeasurementsDisplay component)
export const formatArea = (area) => {
  return area > 1000000
    ? `${(area / 1000000).toFixed(2)} km²`
    : `${area.toFixed(2)} m²`;
};

export const formatPerimeter = (perimeter) => {
  return perimeter > 1000
    ? `${(perimeter / 1000).toFixed(2)} km`
    : `${perimeter.toFixed(2)} m`;
};

export default useSolarAnalyzer;
