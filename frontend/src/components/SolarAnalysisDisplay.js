import React from 'react';

const SolarAnalysisDisplay = ({ solarAnalysis }) => {
  if (!solarAnalysis) {
    return null;
  }

  return (
    <div className="solar-analysis-display">
      <h4 className="data-section-title">☀️ Solar Analysis</h4>
      <div className="solar-grid">
        {/* Panel Count Card */}
        <div className="analysis-card">
          <div className="card-label">Panel Count</div>
          <div className="card-value color-green">
            {solarAnalysis.panelCount.toLocaleString()}
          </div>
          <div className="card-unit">units</div>
        </div>

        {/* Total Capacity Card */}
        <div className="analysis-card">
          <div className="card-label">Total Capacity</div>
          <div className="card-value color-green">
            {solarAnalysis.totalCapacity.toFixed(1)}
          </div>
          <div className="card-unit">kW</div>
        </div>

        {/* Annual Generation Card */}
        <div className="analysis-card full-width">
          <div className="card-label">Annual Generation</div>
          <div className="card-value color-green">
            {Math.round(solarAnalysis.estimatedGeneration).toLocaleString()}
          </div>
          <div className="card-unit">kWh/year</div>
        </div>

        {/* Efficiency Card */}
        <div className="analysis-card full-width">
          <div className="card-label">Efficiency</div>
          <div className="card-value color-green">
            {solarAnalysis.efficiency.toFixed(1)}
          </div>
          <div className="card-unit">%</div>
        </div>
      </div>
    </div>
  );
};

export default SolarAnalysisDisplay;
