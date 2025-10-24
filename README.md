# Rooftop Solar Analyzer

A complete web application for analyzing rooftop solar potential using satellite imagery, computer vision, and geospatial calculations.

## 🌟 Features

- **Interactive Map**: Google Maps with satellite view for accurate rooftop analysis
- **Drawing Tools**: Draw rooftops and obstacles directly on satellite imagery
- **Real-time Measurements**: Automatic calculation of area, perimeter, and usable space
- **Solar Panel Optimization**: Intelligent panel placement respecting obstacles and rooftop constraints
- **Location Search**: Search for any location using Google Places API
- **Multiple Panel Types**: Support for different solar panel sizes (300W, 400W, 500W)
- **Comprehensive Analysis**: Panel count, capacity, annual generation, and efficiency calculations

## 🏗️ Architecture

### Frontend (React)
- Modern React 18 with hooks
- Google Maps integration with drawing tools
- Real-time calculations and measurements
- Responsive design with professional UI

### Backend (Node.js/Express)
- RESTful API for data persistence
- PostgreSQL for structured data storage
- Image processing and analysis endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Maps API key with:
  - Maps JavaScript API
  - Places API
  - Geometry API

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd rooftop-solar-analyzer2
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

3. **Backend Setup**
```bash
cd backend
npm install
```

4. **Environment Configuration**

Create `frontend/.env`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

5. **Start Development Servers**

Frontend:
```bash
cd frontend
npm start
```

Backend:
```bash
cd backend
npm start
```

6. **Access the Application**

Frontend: http://localhost:3000
Backend API: http://localhost:8000

## 📖 User Guide

### Getting Started
1. **Search Location**: Use the search bar to find your location or navigate manually
2. **Draw Rooftop**: Click "Draw Rooftop" and draw the outline of your rooftop on the satellite image
3. **Add Obstacles** (Optional): Draw any obstacles like chimneys, vents, or skylights
4. **Select Panel Size**: Choose your preferred solar panel dimensions
5. **Optimize Layout**: Click "Optimize Panel Layout" for automatic panel placement
6. **View Results**: Check measurements and solar analysis in the sidebar

### Drawing Tips
- Use satellite view for accurate rooftop outlines
- Draw polygons by clicking points around the rooftop edge
- Double-click to finish drawing
- Obstacles should be drawn after the rooftop
- Panels will automatically avoid obstacle areas

### Panel Types
- **Small (1.2m x 0.8m)**: 300W panels - ideal for smaller spaces
- **Standard (1.6m x 1.0m)**: 400W panels - balanced size and power
- **Large (2.0m x 1.0m)**: 500W panels - maximum power output

## 🔧 Development

### Project Structure
```
rooftop-solar-analyzer2/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.js           # Main application
│   └── package.json
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Data models
│   │   └── config/          # Configuration
│   └── package.json
└── README.md
```

### Key Components

#### Frontend Components
- **MapContainer**: Google Maps integration with drawing tools
- **ControlPanel**: Drawing mode and action controls
- **MeasurementsDisplay**: Real-time area and perimeter calculations
- **SolarAnalysisDisplay**: Panel layout and generation analysis
- **SearchBox**: Location search with Places API

#### Backend Routes
- `/api/designs`: Solar analysis results storage
- `/api/analyze`: Image processing and analysis
- `/api/measurements`: Geospatial calculations

### API Endpoints

#### POST /api/designs
Save solar analysis results
```json
{
  "totalArea": 150.5,
  "usableArea": 135.2,
  "obstacleArea": 15.3,
  "perimeter": 52.1,
  "panelCount": 25,
  "totalCapacity": 10.0,
  "estimatedGeneration": 15000
}
```

## 🛠️ Customization

### Adding Panel Types
Edit `frontend/src/hooks/useSolarAnalyzer.js`:
```javascript
const PANEL_SIZES = {
  custom: { width: 2.2, height: 1.1, capacity: 0.6 }, // 600W
  // Add more panel types here
};
```

### Modifying Calculations
Update the solar analysis in `useSolarAnalyzer.js`:
```javascript
const estimatedGeneration = totalCapacity * 1500; // kWh/year
// Modify calculation factors as needed
```

### Styling
Main styles are in `frontend/src/App.css`. The design follows a professional, clean aesthetic similar to industry tools like HelioScope.

## 🔍 Troubleshooting

### Google Maps Not Loading
- Verify API key is set in `.env`
- Check that required APIs are enabled in Google Cloud Console
- Ensure billing is enabled on your Google Cloud project

### Drawing Not Working
- Make sure you're in satellite view
- Try refreshing the page
- Check browser console for JavaScript errors

### Measurements Inaccurate
- Use satellite view for better accuracy
- Ensure polygons are drawn precisely
- Check that obstacles are properly marked

## 📊 Technical Details

### Calculations
- **Area**: Uses Google Maps Geometry API for accurate polygon area calculation
- **Panel Placement**: Grid-based algorithm with obstacle avoidance
- **Generation Estimates**: Based on 1500 kWh per kW per year (4 hours average sunlight)
- **Efficiency**: Panel capacity vs available area ratio

### Performance
- Real-time calculations for instant feedback
- Optimized polygon rendering
- Efficient obstacle detection algorithms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all prerequisites are met
4. Create an issue with detailed description

---

**Built with ❤️ for sustainable energy solutions**