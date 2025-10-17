import React from 'react';

const SolarAnalysisDisplay = ({ solarAnalysis }) => {
  if (!solarAnalysis) {
    return null;
  }

  return (
    <div className="solar-analysis-overlay">
      <div className="control-panel">
        <div className="control-section">
          <h3>Solar Panel Analysis</h3>
          <div className="solar-section">
            <div className="solar-title">Panel Layout Results</div>
            <div className="solar-grid">
              <div className="solar-item">
                <div className="solar-label">Panel Count</div>
                <div className="solar-value">
                  {solarAnalysis.panelCount}
                </div>
              </div>
              <div className="solar-item">
                <div className="solar-label">Total Capacity</div>
                <div className="solar-value">
                  {solarAnalysis.totalCapacity.toFixed(1)} kW
                </div>
              </div>
              <div className="solar-item">
                <div className="solar-label">Annual Generation</div>
                <div className="solar-value">
                  {Math.round(solarAnalysis.estimatedGeneration).toLocaleString()} kWh/year
                </div>
              </div>
              <div className="solar-item">
                <div className="solar-label">Efficiency</div>
                <div className="solar-value">
                  {solarAnalysis.efficiency.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarAnalysisDisplay;
