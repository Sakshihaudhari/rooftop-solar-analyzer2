import React from 'react';

const MeasurementsDisplay = ({ measurements }) => {
  if (!measurements || measurements.totalArea === 0) {
    return (
      <div className="measurements-display">
        <h4 className="data-section-title">📐 Measurements</h4>
        <div className="measurements-placeholder">
          <p>Draw a rooftop to see measurements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="measurements-display">
      <h4 className="data-section-title">📐 Measurements</h4>
      <div className="measurements-grid">
        {/* Total Area Card */}
        <div className="measurement-card">
          <div className="card-label">Total Area</div>
          <div className="card-value color-blue">
            {Math.round(measurements.totalArea).toLocaleString()}
          </div>
          <div className="card-unit">m²</div>
        </div>

        {/* Usable Area Card */}
        <div className="measurement-card">
          <div className="card-label">Usable Area</div>
          <div className="card-value color-green">
            {Math.round(measurements.usableArea).toLocaleString()}
          </div>
          <div className="card-unit">m²</div>
        </div>

        {/* Obstacle Area Card */}
        <div className="measurement-card">
          <div className="card-label">Obstacle Area</div>
          <div className="card-value color-red">
            {Math.round(measurements.obstacleArea).toLocaleString()}
          </div>
          <div className="card-unit">m²</div>
        </div>

        {/* Perimeter Card */}
        <div className="measurement-card">
          <div className="card-label">Perimeter</div>
          <div className="card-value color-blue">
            {Math.round(measurements.perimeter).toLocaleString()}
          </div>
          <div className="card-unit">m</div>
        </div>

        {/* Usable Percentage Card */}
        <div className="measurement-card full-width">
          <div className="card-label">Usable Percentage</div>
          <div className="card-value color-teal">
            {measurements.totalArea > 0
              ? `${((measurements.usableArea / measurements.totalArea) * 100).toFixed(1)}`
              : '0'
            }
          </div>
          <div className="card-unit">%</div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsDisplay;
