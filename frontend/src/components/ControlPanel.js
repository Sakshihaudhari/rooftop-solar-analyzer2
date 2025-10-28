import React from 'react';

const ControlPanel = ({
  currentDrawingMode,
  selectedPanelSize,
  rooftops,
  rooftopFillColor,
  rooftopFillOpacity,
  onDrawingModeChange,
  onPanelSizeChange,
  onOptimizePanels,
  onClearAll,
  onUpdateRooftopStyle,
  isLoading,
  error
}) => {
  return (
    <div className="unified-sidebar">
      {/* Section 1: Drawing & Controls */}
      <section className="sidebar-section">
        <h2 className="section-title">Drawing Mode</h2>
        
        <div className="mode-buttons">
          <button
            className={`mode-btn ${currentDrawingMode === 'rooftop' ? 'active' : ''}`}
            onClick={() => onDrawingModeChange('rooftop')}
            disabled={currentDrawingMode === 'rooftop'}
          >
            Draw Rooftop
          </button>
          <button
            className={`mode-btn ${currentDrawingMode === 'obstacle' ? 'active' : ''}`}
            onClick={() => onDrawingModeChange('obstacle')}
            disabled={currentDrawingMode === 'obstacle'}
          >
            Draw Obstacle
          </button>
        </div>

        {/* Rooftop Style - Conditional */}
        {rooftops.length > 0 && (
          <div className="rooftop-style-controls">
            <label className="control-label">Rooftop Fill</label>
            
            <div className="color-opacity-group">
              <input
                type="color"
                className="color-input"
                value={rooftopFillColor || '#ffffff'}
                onChange={(e) => onUpdateRooftopStyle && onUpdateRooftopStyle(e.target.value, rooftopFillOpacity)}
              />
              
              <div className="opacity-container">
                <input
                  type="range"
                  className="opacity-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rooftopFillOpacity || 0.5}
                  onChange={(e) => onUpdateRooftopStyle && onUpdateRooftopStyle(rooftopFillColor, parseFloat(e.target.value))}
                />
                <span className="opacity-label">
                  {Math.round((rooftopFillOpacity || 0.5) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Panel Size Selector */}
        <div className="panel-size-group">
          <label className="control-label">Panel Size</label>
          <select
            value={selectedPanelSize}
            onChange={(e) => onPanelSizeChange(e.target.value)}
            className="panel-size-select"
          >
            <option value="small">Small (1.2m × 0.8m) – 300W</option>
            <option value="standard">Standard (1.6m × 1.0m) – 400W</option>
            <option value="large">Large (2.0m × 1.0m) – 500W</option>
          </select>
        </div>
      </section>

      {/* Section 2: Actions */}
      <section className="sidebar-section actions-section">
        <div className="action-buttons">
          <button
            onClick={onOptimizePanels}
            disabled={isLoading || rooftops.length === 0}
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            title={rooftops.length === 0 ? 'Draw a rooftop first' : 'Optimize panel layout'}
          >
            {isLoading ? '⏳ Optimizing...' : '✓ Optimize Layout'}
          </button>
          <button
            onClick={onClearAll}
            className="btn btn-secondary"
            title="Clear all drawings and analysis"
          >
            ✕ Clear All
          </button>
        </div>
      </section>

      {/* Error Messages */}
      {error && (
        <section className="sidebar-section error-section">
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ControlPanel;
