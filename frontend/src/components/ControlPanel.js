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
    <div className="control-panel">
      <div className="control-section">
        <h3>Drawing Mode</h3>
        <div className="mode-buttons">
          <button
            className={currentDrawingMode === 'rooftop' ? 'active' : ''}
            onClick={() => onDrawingModeChange('rooftop')}
            disabled={currentDrawingMode === 'rooftop'}
          >
            Draw Rooftop
          </button>
          <button
            className={currentDrawingMode === 'obstacle' ? 'active' : ''}
            onClick={() => onDrawingModeChange('obstacle')}
            disabled={currentDrawingMode === 'obstacle'}
          >
            Draw Obstacle
          </button>
        </div>
      </div>

      {rooftops.length > 0 && (
        <div className="control-section">
          <h3>Rooftop Style</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500' }}>
              Fill Color
            </label>
            <input
              type="color"
              value={rooftopFillColor || '#ffffff'}
              onChange={(e) => onUpdateRooftopStyle && onUpdateRooftopStyle(e.target.value, rooftopFillOpacity)}
              style={{
                width: '100%',
                height: '36px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500' }}>
              Opacity: {Math.round((rooftopFillOpacity || 0.5) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rooftopFillOpacity || 0.5}
              onChange={(e) => onUpdateRooftopStyle && onUpdateRooftopStyle(rooftopFillColor, parseFloat(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      )}

      <div className="control-section">
        <h3>Panel Size</h3>
        <select
          value={selectedPanelSize}
          onChange={(e) => onPanelSizeChange(e.target.value)}
          className="panel-size-select"
        >
          <option value="small">Small (1.2m x 0.8m) - 300W</option>
          <option value="standard">Standard (1.6m x 1.0m) - 400W</option>
          <option value="large">Large (2.0m x 1.0m) - 500W</option>
        </select>
      </div>

      <div className="control-section">
        <h3>Actions</h3>
        <button
          onClick={onOptimizePanels}
          disabled={isLoading || rooftops.length === 0}
          className="optimize-button"
          title={rooftops.length === 0 ? 'Draw a rooftop first' : ''}
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
