import React from 'react';

const ControlPanel = ({
  currentDrawingMode,
  selectedPanelSize,
  onDrawingModeChange,
  onPanelSizeChange,
  onOptimizePanels,
  onClearAll,
  isLoading,
  error
}) => {
  return (
    <div className="control-panel">
      <div className="control-section">
        <h3>Drawing Mode</h3>
        <div className="mode-buttons">
          <button
            className={currentDrawingMode === 'rooftop' ? 'active' : ''}
            onClick={() => onDrawingModeChange('rooftop')}
          >
            Draw Rooftop
          </button>
          <button
            className={currentDrawingMode === 'obstacle' ? 'active' : ''}
            onClick={() => onDrawingModeChange('obstacle')}
          >
            Draw Obstacle
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Panel Size</h3>
        <select
          value={selectedPanelSize}
          onChange={(e) => onPanelSizeChange(e.target.value)}
        >
          <option value="small">Small (1.2m x 0.8m)</option>
          <option value="standard">Standard (1.6m x 1.0m)</option>
          <option value="large">Large (2.0m x 1.0m)</option>
        </select>
      </div>

      <div className="control-section">
        <h3>Actions</h3>
        <button
          onClick={onOptimizePanels}
          disabled={isLoading}
          className="optimize-button"
        >
          {isLoading ? 'Optimizing...' : 'Optimize Panel Layout'}
        </button>
        <button
          onClick={onClearAll}
          className="clear-button"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
