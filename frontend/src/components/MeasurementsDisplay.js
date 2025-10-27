import React from 'react';
import { formatArea, formatPerimeter } from '../hooks/useSolarAnalyzer';

const MeasurementsDisplay = ({ measurements }) => {
  if (!measurements || measurements.totalArea === 0) {
    return (
      <div className="measurements-display">
        <h4>📐 Measurements</h4>
        <div className="measurements-placeholder">
          <p>Draw a rooftop to see measurements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="measurements-display">
      <h4>📐 Measurements</h4>
      <div className="measurements-grid">
        <div className="measurement-item">
          <div className="measurement-label">Total Area</div>
          <div className="measurement-value">
            {formatArea(measurements.totalArea)}
          </div>
          <div className="measurement-raw">
            {Math.round(measurements.totalArea).toLocaleString()} m²
          </div>
        </div>

        <div className="measurement-item">
          <div className="measurement-label">Usable Area</div>
          <div className="measurement-value" style={{ color: '#28a745' }}>
            {formatArea(measurements.usableArea)}
          </div>
          <div className="measurement-raw">
            {Math.round(measurements.usableArea).toLocaleString()} m²
          </div>
        </div>

        <div className="measurement-item">
          <div className="measurement-label">Obstacle Area</div>
          <div className="measurement-value" style={{ color: '#dc3545' }}>
            {formatArea(measurements.obstacleArea)}
          </div>
          <div className="measurement-raw">
            {Math.round(measurements.obstacleArea).toLocaleString()} m²
          </div>
        </div>

        <div className="measurement-item">
          <div className="measurement-label">Perimeter</div>
          <div className="measurement-value">
            {formatPerimeter(measurements.perimeter)}
          </div>
          <div className="measurement-raw">
            {Math.round(measurements.perimeter).toLocaleString()} m
          </div>
        </div>

        <div className="measurement-item">
          <div className="measurement-label">Usable %</div>
          <div className="measurement-value" style={{ color: '#17a2b8' }}>
            {measurements.totalArea > 0
              ? `${((measurements.usableArea / measurements.totalArea) * 100).toFixed(1)}%`
              : '0%'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsDisplay;
