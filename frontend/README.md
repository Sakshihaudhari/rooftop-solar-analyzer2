# Rooftop Solar Analyzer Frontend

A React-based frontend for analyzing rooftop solar potential using Google Maps.

## Setup

### 1. Google Maps API Key

You need a Google Maps API key with the following APIs enabled:

**Required APIs:**
- ✅ Maps JavaScript API
- ✅ Places API (for location search)
- ✅ Geometry API (for area calculations)

**To enable these APIs:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the required APIs:
   - Search for "Maps JavaScript API" → Enable
   - Search for "Places API" → Enable
   - Search for "Geometry API" → Enable
4. Create credentials (API Key)
5. Optionally restrict the API key to your domain for security

Create a `.env` file in the frontend directory with:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. Installation

```bash
npm install
```

### 3. Development

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### 4. Troubleshooting Search Box

If the search box is not visible:

1. **Check Places API**: Make sure "Places API" is enabled in Google Cloud Console
2. **Verify API Key**: Ensure your API key is correctly set in `.env`
3. **Check Console**: Open browser dev tools and check for API errors
4. **Test API Key**: Visit [Google Maps Platform](https://console.cloud.google.com/google/maps-apis/credentials) to verify your key

**Search Box Features:**
- Located in the top-left corner of the map (not in sidebar)
- Blue border with search icon 🔍
- Responsive design for mobile devices
- Auto-complete suggestions as you type

## Features

- **Location Search**: Search for any location using Google Places
- **Drawing Tools**: Draw rooftops and obstacles on satellite imagery
- **Measurements**: Real-time area and perimeter calculations
- **Panel Layout**: Automatic solar panel placement optimization
- **Solar Analysis**: Capacity, generation, and efficiency calculations

## Usage

1. Search for a location or navigate to your area of interest
2. Click "Draw Rooftop" and draw the rooftop area on the map
3. Optionally draw obstacles like chimneys or vents using "Draw Obstacle"
4. Select your preferred panel size
5. Click "Optimize Panel Layout" to see the optimal solar panel placement
6. View measurements and solar analysis results
