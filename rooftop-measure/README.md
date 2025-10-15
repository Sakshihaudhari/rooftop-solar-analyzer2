# Rooftop Measurement Tool - Google Maps Setup

## Task 1.1 Complete: Basic HTML/JS Project with Google Maps

This project demonstrates the basic setup of Google Maps in a local JavaScript project for rooftop measurement purposes.

## Project Structure

```
rooftop-measure/
├── index.html      # Main HTML file with map container
├── script.js       # JavaScript for Google Maps initialization
├── config.js       # Configuration file for API key
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## Quick Start

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Optionally restrict the key to your domain for security

### 2. Setup Project

```bash
cd rooftop-measure

# Install dependencies
npm install

# Edit config.js and replace 'YOUR_API_KEY_HERE' with your actual API key
```

### 3. Run the Project

```bash
# Start the development server
npm start

# Or to open browser automatically
npm run dev
```

### 4. View in Browser

Navigate to `http://localhost:8000` to see your Google Maps setup!

## What This Setup Includes

### HTML Structure (`index.html`)
- Basic HTML5 document
- **Map container div**: `<div id="map"></div>` - This is where Google Maps renders
- Responsive design with full viewport height
- Basic control panel for status display

### JavaScript Implementation (`script.js`)
- `initMap()` function - Initializes Google Maps when API loads
- Map configuration:
  - **Satellite view** - Perfect for rooftop detail
  - **High zoom level** (18) - For detailed measurements
  - **Default location** - New York City (customizable)
  - **Useful controls** - Zoom, map type, scale, etc.

### Configuration (`config.js`)
- Centralized API key management
- Basic validation function
- Global availability for easy access

## Map Features Enabled

- **Satellite imagery** for detailed rooftop viewing
- **Zoom controls** for precise navigation
- **Map type control** to switch between satellite/roadmap
- **Scale control** to see distance measurements
- **Fullscreen control** for immersive viewing

## Customization Options

### Change Default Location
Edit `script.js` and modify the `center` property:
```javascript
center: { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }
```

### Adjust Zoom Level
Modify the `zoom` property in `script.js`:
```javascript
zoom: 18  // Higher = more detail, Lower = broader view
```

### Map Types Available
- `google.maps.MapTypeId.SATELLITE` - Satellite view (current)
- `google.maps.MapTypeId.ROADMAP` - Street map view
- `google.maps.MapTypeId.HYBRID` - Satellite with labels
- `google.maps.MapTypeId.TERRAIN` - Terrain view

## Next Steps

This is **Task 1.1 Complete** ✅

The basic Google Maps setup is ready. The next tasks in Main Process 1 would be:
- Task 1.2: Add polygon drawing functionality
- Task 1.3: Implement area calculation
- Task 1.4: Add measurement tools and export features

## Troubleshooting

### Common Issues

1. **Map not loading**: Check that your API key is valid and has Maps JavaScript API enabled
2. **"Google Maps API Error"**: Verify your API key in `config.js`
3. **CORS issues**: The http-server is configured with CORS enabled

### Debug Tips

- Check browser console for JavaScript errors
- Verify API key format (should be 39 characters)
- Ensure Maps JavaScript API is enabled in Google Cloud Console

## Technical Details

- **Framework**: Vanilla JavaScript (no frameworks required)
- **API**: Google Maps JavaScript API v3
- **Libraries**: Geometry library for future area calculations
- **Server**: http-server for local development
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
