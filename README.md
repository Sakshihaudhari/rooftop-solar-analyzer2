# Advanced Rooftop Solar Analyzer

A comprehensive rooftop solar analysis tool with obstacle detection, solar panel optimization, and comprehensive energy calculations - designed to work like HelioScope.

## 🏗️ Architecture Overview

This project uses a **modern React architecture**:

- **React Frontend** (`frontend/` folder) - Modern React application (primary)
- **Express Backend** (`server.js`) - Server for API endpoints and static serving

## Tech Stack

### React Frontend (Primary)
- **Framework**: React 18 with hooks
- **Maps Integration**: `@react-google-maps/api`
- **Styling**: CSS3 with custom variables and responsive design
- **State Management**: Custom React hooks (`useSolarAnalyzer`)
- **Build System**: Create React App

### Backend Server
- **Runtime**: Node.js with Express
- **API**: RESTful endpoints for future backend integration
- **Static Serving**: Serves React build files
- **Development**: Hot reload support

### Google Services
- **Maps JavaScript API**: Core mapping functionality
- **Places API**: Location search and autocomplete
- **Drawing API**: Polygon creation and editing
- **Geometry API**: Area and distance calculations

## Features

### Core Measurement Features
- **Interactive Polygon Drawing**: Click to draw custom rooftop shapes with precise control
- **Real-time Area Calculation**: Automatic area calculation in square meters and feet
- **Satellite View**: High-resolution satellite imagery for accurate measurements
- **Editable Polygons**: Modify polygon points after creation

### Advanced Solar Analysis
- **Obstacle Detection**: Draw obstacles on rooftops that automatically subtract from usable area
- **Solar Panel Optimization**: Intelligent panel placement avoiding obstacles
- **Multiple Panel Sizes**: Support for small (1.2m x 0.8m), standard (1.6m x 1m), and large (2m x 1m) panels
- **Capacity Calculations**: Total system capacity and estimated annual generation
- **Efficiency Analysis**: Panel layout efficiency metrics

### Location Intelligence
- **Google Places Search**: Search for any location worldwide using autocomplete
- **Geocoding Integration**: Automatic coordinate resolution for addresses
- **High Zoom Levels**: Zoom to level 20 for detailed rooftop analysis

## Quick Start

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**, **Places API**, and **Geometry API**
4. Create credentials (API Key)
5. Optionally restrict the key to your domain for security

### 2. React Frontend Setup

```bash
# Navigate to React frontend directory
cd frontend

# Install React dependencies
npm install

# Set up Google Maps API key
# Edit frontend/.env and replace with your actual API key:
# REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Start React development server (recommended for development)
npm start
# Opens http://localhost:3000 with hot reload
```

### 3. Backend Server Setup

```bash
# In the root directory, start the Express server
# (This serves the React app and provides API endpoints)
npm start
# Runs on http://localhost:8000
```

### 4. Access the Application

- **React Development**: `http://localhost:3000` (with hot reload)
- **Production Build**: `http://localhost:8000` (serves React build)
- **API Health Check**: `http://localhost:8000/api/health`

### 5. Development Workflow

```bash
# Terminal 1: React development server (hot reload)
cd frontend && npm start

# Terminal 2: Backend server (serves React build)
npm start
```


## How to Use

### Basic Workflow

1. **Search Location**: Use the search box to find any address or location worldwide
2. **Draw Rooftop**: Select "Draw Rooftop" mode and click on the map to outline your rooftop
3. **Add Obstacles**: Switch to "Draw Obstacle" mode to mark chimneys, vents, or other obstructions
4. **Optimize Panels**: Click "Optimize Panels" to automatically place solar panels on usable areas
5. **Analyze Results**: View detailed measurements and solar generation estimates

### Drawing Modes

- **Draw Rooftop Mode**: Outline the main rooftop area (blue polygons)
- **Draw Obstacle Mode**: Mark areas that cannot be used for panels (red polygons)

### Panel Optimization

- Choose from three panel sizes: Small (1.2m×0.8m), Standard (1.6m×1m), Large (2m×1m)
- Panels are automatically placed avoiding obstacles
- Real-time calculations show total capacity and estimated generation

### Measurements Displayed

- **Total Area**: Complete rooftop area in square meters
- **Usable Area**: Area available after subtracting obstacles
- **Obstacle Area**: Total area covered by obstacles
- **Panel Count**: Number of panels that can be installed
- **Total Capacity**: Combined power capacity in kilowatts
- **Annual Generation**: Estimated yearly energy production

## File Structure

### Current Architecture
```
rooftop-solar-analyzer/
├── frontend/                           # React application (primary)
│   ├── public/
│   │   └── index.html                  # React HTML template
│   ├── src/
│   │   ├── components/                 # React UI components
│   │   │   ├── ControlPanel.js         # Drawing controls & settings
│   │   │   ├── MeasurementsDisplay.js  # Area measurements
│   │   │   └── SolarAnalysisDisplay.js # Solar panel results
│   │   ├── hooks/
│   │   │   └── useSolarAnalyzer.js     # State management hook
│   │   ├── App.js                      # Main React component
│   │   ├── App.css                     # React styling
│   │   └── index.js                    # React entry point
│   ├── package.json                    # React dependencies
│   └── .env                           # React environment variables
├── server.js                          # Express server (serves React app)
├── rooftop-solar-analyzer-progress.md # Project progress tracker
└── README.md                          # This file
```

### Key Architecture Benefits

- **Modern React Stack**: Component-based architecture with hooks for state management
- **Clean Separation**: React handles UI, Express handles serving and API endpoints
- **Enhanced Developer Experience**: Hot reload, better debugging, scalable structure
- **Production Ready**: Both development and production configurations
- **Future-Proof**: TypeScript-ready, easy to extend with additional libraries

## React Frontend Development

### React-Specific Setup

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Maps JavaScript API key

#### Installation & Development

1. **Install React dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Google Maps API key:**
   ```bash
   # Edit frontend/.env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Start React development server:**
   ```bash
   cd frontend && npm start
   # Opens http://localhost:3000 with hot reload
   ```

#### Project Structure

```
frontend/
├── public/
│   └── index.html          # React HTML template with Google Maps integration
├── src/
│   ├── components/
│   │   ├── ControlPanel.js         # Drawing controls and settings UI
│   │   ├── MeasurementsDisplay.js  # Real-time area measurements display
│   │   └── SolarAnalysisDisplay.js # Solar panel analysis results
│   ├── hooks/
│   │   └── useSolarAnalyzer.js     # Main state management hook
│   ├── App.js                      # Main React application component
│   ├── App.css                     # React component styling
│   └── index.js                    # React application entry point
├── package.json                    # React dependencies and build scripts
├── .env                           # React environment variables
└── node_modules/                  # React dependencies
```

#### Available Scripts

- `npm start` - Runs React app in development mode with hot reload
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production deployment
- `npm run eject` - Ejects from Create React App (one-way operation)

#### React Architecture Features

- **Component-Based Design** - Modular UI components for maintainability
- **Custom Hooks** - `useSolarAnalyzer` hook for state management
- **Google Maps Integration** - `@react-google-maps/api` for seamless map integration
- **Responsive Design** - Mobile-friendly interface with CSS Grid and Flexbox
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Performance Optimized** - Code splitting and lazy loading

#### Google Maps API Integration

The React frontend integrates with Google Maps APIs:
- **Maps JavaScript API** - Core mapping functionality with satellite imagery
- **Places API** - Location search with autocomplete suggestions
- **Drawing API** - Interactive polygon creation and editing tools
- **Geometry API** - Accurate area and distance calculations with spherical geometry

#### Development Guidelines

1. **Component Structure** - Use functional components with React hooks
2. **State Management** - Utilize the `useSolarAnalyzer` hook for complex state
3. **Styling** - Maintain consistent CSS variables and responsive design
4. **Error Handling** - Implement proper error boundaries and user feedback
5. **Performance** - Optimize for real-time polygon operations and calculations

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

### Export Complete Analysis Data
```javascript
// In browser console
solarAnalyzer.exportAnalysisData();
// Returns: {
//   measurements: { totalArea, usableArea, obstacleArea },
//   panelConfig: { size, dimensions, count, totalCapacity },
//   polygons: { rooftop, obstacles, panels },
//   timestamp: "..."
// }
```

### Advanced Integration
Access individual components for custom integrations:
```javascript
// Get measurements
const measurements = solarAnalyzer.updateMeasurements();

// Get panel layout
solarAnalyzer.optimizePanelLayout();

// Access polygons directly
solarAnalyzer.rooftopPolygons[0]; // Main rooftop
solarAnalyzer.obstaclePolygons;   // Array of obstacles
solarAnalyzer.solarPanels;        // Array of placed panels
```

## Troubleshooting

### Common Issues

1. **Map not loading**: Check API key is valid and has Maps JavaScript API, Places API, and Geometry API enabled
2. **Search not working**: Ensure Places API is enabled in Google Cloud Console
3. **Area showing 0**: Ensure polygon is properly closed and not self-intersecting
4. **Panel optimization fails**: Verify rooftop polygon is drawn before attempting optimization
5. **Obstacles not working**: Make sure to draw rooftop first, then switch to obstacle mode

### Getting Help

- Check browser console for JavaScript errors
- Verify API key permissions in Google Cloud Console
- Ensure no ad blockers are interfering with Google Maps

## License

MIT License - Free for personal and commercial use

## Industry Standards Compliance

This tool follows industry standards for:
- **Accuracy**: Uses official Google Maps geometry calculations with spherical area computation
- **Solar Analysis**: Implements industry-standard panel placement algorithms avoiding obstacles
- **Usability**: Intuitive interface following mapping conventions used by HelioScope and similar tools
- **Performance**: Optimized for real-time polygon editing and panel layout calculations
- **Accessibility**: Keyboard and screen reader friendly interface

### Solar Panel Specifications
- **Panel Sizes**: Follows standard industry dimensions (IEC 61215 compliant)
- **Capacity Ratings**: Based on typical market-available panel specifications
- **Generation Estimates**: Uses average solar irradiance of 4-5 hours per day
- **Efficiency Calculations**: Accounts for panel efficiency and rooftop utilization