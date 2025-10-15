# Rooftop Measurement Tool

A simple, industry-standard rooftop measurement tool using Google Maps JavaScript API for accurate polygon-based area calculations.

## Tech Stack
- **Frontend**: Pure JavaScript (ES6+), HTML5, CSS3
- **Maps**: Google Maps JavaScript API
- **Development**: Node.js, npm, http-server
- **Deployment**: Static files, no build process required

## Features

- **Interactive Polygon Drawing**: Click to draw custom rooftop shapes
- **Real-time Area Calculation**: Automatic area calculation in square meters and feet
- **Satellite View**: High-resolution satellite imagery for accurate measurements
- **Editable Polygons**: Modify polygon points after creation
- **Export Functionality**: Export polygon data for further analysis
- **Local Development**: Runs entirely in your browser

## Quick Start

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Optionally restrict the key to your domain for security

### 2. Setup

```bash
# Clone or download the project files
# Edit config.js and replace 'YOUR_API_KEY' with your actual API key

# Install dependencies
npm install

# Start local server
npm run dev
# or
npm start
# or to open browser automatically
npm run serve
```

### 3. Open in Browser

Navigate to `http://localhost:8000` and start measuring rooftops!

## How to Use

1. **Start Drawing**: Click the "Start Drawing" button
2. **Draw Polygon**: Click on the map to add points outlining your rooftop
3. **Complete Polygon**: Double-click or click the first point to finish
4. **View Area**: See real-time area calculation in the info panel
5. **Edit**: Drag polygon points to modify the shape
6. **Clear**: Use "Clear" button to start over

## File Structure

```
├── index.html          # Main HTML interface
├── script.js           # Core measurement functionality
├── config.js           # Google Maps API configuration
├── package.json        # Project configuration
└── README.md          # This file
```

## Technical Details

### Area Calculation
- Uses Google Maps Geometry Library for accurate spherical area calculation
- Accounts for Earth's curvature for precise measurements
- Displays results in both square meters (m²) and square feet (ft²)

### Map Configuration
- **Map Type**: Satellite view for detailed rooftop imagery
- **Zoom Level**: Starts at zoom 20 for detailed measurements
- **Default Location**: New York City (customize in script.js)

### Development Setup
- **Node.js** and **npm** for running the development server
- Modern browsers with ES6 support
- Google Chrome recommended for best performance

## Customization

### Change Default Location
Edit `script.js` line ~15:
```javascript
center: { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }
```

### Modify Polygon Styling
Edit polygon options in `script.js` around line ~40:
```javascript
polygonOptions: {
    fillColor: '#4285f4',
    fillOpacity: 0.3,
    strokeColor: '#4285f4',
    strokeWeight: 2,
    // ... other options
}
```

## Integration Examples

### Export Polygon Data
```javascript
// In browser console
measurementTool.exportPolygonData();
// Returns: { coordinates: [...], area: {...}, timestamp: "..." }
```

### API Integration
The tool can be easily integrated into larger applications by accessing the `measurementTool` instance methods.

## Troubleshooting

### Common Issues

1. **Map not loading**: Check API key is valid and has Maps JavaScript API enabled
2. **Area showing 0**: Ensure polygon is properly closed
3. **Drawing not working**: Make sure to click "Start Drawing" first

### Getting Help

- Check browser console for JavaScript errors
- Verify API key permissions in Google Cloud Console
- Ensure no ad blockers are interfering with Google Maps

## License

MIT License - Free for personal and commercial use

## Industry Standards Compliance

This tool follows industry standards for:
- **Accuracy**: Uses official Google Maps geometry calculations
- **Usability**: Simple, intuitive interface following mapping conventions
- **Performance**: Optimized for real-time polygon editing
- **Accessibility**: Keyboard and screen reader friendly