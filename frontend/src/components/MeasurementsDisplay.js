import React from 'react';

const MeasurementsDisplay = ({ measurements }) => {
  if (!measurements || measurements.totalArea === 0) {
    return null;
  }

  return (
    <div className="measurements-overlay">
      <div className="control-panel">
        <div className="control-section">
          <h3>Measurements</h3>
          <div className="measurements-grid">
            <div className="measurement-item">
              <div className="measurement-label">Total Area</div>
              <div className="measurement-value">
                {Math.round(measurements.totalArea).toLocaleString()} m²
              </div>
            </div>
            <div className="measurement-item">
              <div className="measurement-label">Usable Area</div>
              <div className="measurement-value">
                {Math.round(measurements.usableArea).toLocaleString()} m²
              </div>
            </div>
            <div className="measurement-item">
              <div className="measurement-label">Obstacle Area</div>
              <div className="measurement-value">
                {Math.round(measurements.obstacleArea).toLocaleString()} m²
              </div>
            </div>
            <div className="measurement-item">
              <div className="measurement-label">Perimeter</div>
              <div className="measurement-value">
                {Math.round(measurements.perimeter).toLocaleString()} m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsDisplay;
