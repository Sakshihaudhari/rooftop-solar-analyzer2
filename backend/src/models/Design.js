const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const PolygonSchema = new mongoose.Schema({
  type: { type: String, enum: ['Polygon'], default: 'Polygon' },
  coordinates: [[PointSchema]] // Array of coordinate arrays (GeoJSON format)
}, { _id: false });

const PanelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  coordinates: [PointSchema], // Panel boundary coordinates
  type: { type: String, enum: ['standard', 'premium'], default: 'standard' },
  orientation: { type: Number, default: 0 }, // Rotation angle
  efficiency: { type: Number, default: 0.2 } // Panel efficiency rating
}, { _id: false });

const DesignSchema = new mongoose.Schema({
  // User metadata
  userId: { type: String, default: 'anonymous' },

  // Location information
  location: {
    address: { type: String, required: true },
    coordinates: PointSchema, // Center point of the design
    zoom: { type: Number, default: 20 }
  },

  // Spatial data
  roofPolygon: PolygonSchema,

  obstaclePolygons: [PolygonSchema], // Array of obstacle polygons

  panels: [PanelSchema], // Array of placed panels

  // Calculated data
  calculations: {
    totalRoofArea: { type: Number, default: 0 },
    obstacleArea: { type: Number, default: 0 },
    usableArea: { type: Number, default: 0 },
    panelCount: { type: Number, default: 0 },
    estimatedCapacity: { type: Number, default: 0 }, // kW
    efficiency: { type: Number, default: 0 } // Percentage
  },

  // Design metadata
  name: { type: String, default: 'Untitled Design' },
  description: { type: String, default: '' },
  tags: [String],

  // Version control
  version: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: false },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for better query performance
DesignSchema.index({ 'location.coordinates': '2dsphere' }); // Spatial index for location queries
DesignSchema.index({ userId: 1, createdAt: -1 }); // User designs sorted by creation date
DesignSchema.index({ isPublic: 1, createdAt: -1 }); // Public designs
DesignSchema.index({ tags: 1 }); // Tag-based search

// Virtual for design age
DesignSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update calculations when polygons change
DesignSchema.methods.updateCalculations = function() {
  // This would contain the calculation logic
  // For now, just update the updatedAt timestamp
  this.updatedAt = new Date();
  return this.save();
};

// Static method to find designs near a location
DesignSchema.statics.findNearLocation = function(coordinates, radiusKm = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    }
  });
};

module.exports = mongoose.model('Design', DesignSchema);
