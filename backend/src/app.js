const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all routes
if (process.env.CORS_ENABLED === 'true') {
    app.use(cors());
}

// Parse JSON bodies for API endpoints
app.use(express.json());

// Serve React frontend build files (for production)
app.use(express.static(path.join(__dirname, '../../frontend/build'), {
    setHeaders: (res, filepath) => {
        // Disable caching for development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Serve React frontend public files during development
app.use(express.static(path.join(__dirname, '../../frontend/public'), {
    setHeaders: (res, filepath) => {
        // Disable caching for development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Logging endpoint to capture browser errors
app.post('/log', (req, res) => {
    const { message, source, lineno, colno, error } = req.body;
    console.log('⚠️  Browser Error:', {
        message,
        source,
        line: lineno,
        column: colno,
        error: error?.message || error
    });
    res.sendStatus(200);
});

// API endpoints for solar analysis data (placeholder for future backend integration)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Rooftop Solar Analyzer API is running' });
});

// Catch-all handler for SPA routing (React Router will handle client-side routing)
app.get('*', (req, res) => {
    // Serve React index.html for all non-API routes (SPA routing)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    // For React SPA, serve the built index.html and let React Router handle routing
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

module.exports = app;
