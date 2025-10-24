const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const { connectDB, isConnected, getConnectionStatus } = require('../config/database');

// @route   GET /api/designs
// @desc    Get all designs (public ones only, or user's own)
// @access  Public (filtered)
router.get('/', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const { userId, limit = 20, skip = 0, public: isPublic } = req.query;

    let query = {};

    // If userId is provided, get user's designs
    if (userId) {
      query.userId = userId;
    } else if (isPublic === 'true') {
      // Get only public designs
      query.isPublic = true;
    } else {
      // Default: get public designs only (for anonymous users)
      query.isPublic = true;
    }

    const designs = await Design.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      success: true,
      count: designs.length,
      data: designs,
      databaseStatus: getConnectionStatus()
    });
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: error.message,
      databaseStatus: getConnectionStatus()
    });
  }
});

// @route   GET /api/designs/:id
// @desc    Get single design by ID
// @access  Public (if public design) or Private (if user's own)
router.get('/:id', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if design is public or belongs to user
    if (!design.isPublic && design.userId !== req.query.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error) {
    console.error('Error fetching design:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching design',
      error: error.message
    });
  }
});

// @route   POST /api/designs
// @desc    Create new design
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const designData = {
      ...req.body,
      userId: req.body.userId || 'anonymous',
      version: 1
    };

    const design = new Design(designData);
    await design.save();

    res.status(201).json({
      success: true,
      data: design,
      message: 'Design created successfully'
    });
  } catch (error) {
    console.error('Error creating design:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating design',
      error: error.message
    });
  }
});

// @route   PUT /api/designs/:id
// @desc    Update design
// @access  Private (only owner can update)
router.put('/:id', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns this design
    if (design.userId !== req.body.userId && req.body.userId !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update version number
    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        version: design.version + 1,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedDesign,
      message: 'Design updated successfully'
    });
  } catch (error) {
    console.error('Error updating design:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating design',
      error: error.message
    });
  }
});

// @route   DELETE /api/designs/:id
// @desc    Delete design
// @access  Private (only owner can delete)
router.delete('/:id', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns this design
    if (design.userId !== req.query.userId && req.query.userId !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting design',
      error: error.message
    });
  }
});

// @route   GET /api/designs/near/:lat/:lng
// @desc    Find designs near a location
// @access  Public (public designs only)
router.get('/near/:lat/:lng', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const { lat, lng } = req.params;
    const radius = parseFloat(req.query.radius) || 10; // km

    const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };

    const designs = await Design.findNearLocation(coordinates, radius);

    res.json({
      success: true,
      count: designs.length,
      data: designs,
      center: coordinates,
      radius: radius
    });
  } catch (error) {
    console.error('Error finding nearby designs:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding nearby designs',
      error: error.message
    });
  }
});

// @route   POST /api/designs/:id/calculate
// @desc    Recalculate design metrics
// @access  Private (only owner can update)
router.post('/:id/calculate', async (req, res) => {
  try {
    // Try to connect to database if not already connected
    if (!isConnected()) {
      try {
        await connectDB();
      } catch (dbError) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected',
          status: getConnectionStatus(),
          error: 'MongoDB is not available. Please ensure MongoDB is running.'
        });
      }
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Check if user owns this design
    if (design.userId !== req.body.userId && req.body.userId !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Perform calculations (this would be more sophisticated in real implementation)
    await design.updateCalculations();

    res.json({
      success: true,
      data: design,
      message: 'Design calculations updated'
    });
  } catch (error) {
    console.error('Error updating calculations:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating calculations',
      error: error.message
    });
  }
});

module.exports = router;
