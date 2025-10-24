const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database connection (but don't connect yet)
const { connectDB } = require('./config/database');

// Import routes
const designRoutes = require('./routes/designs');

const app = express();

// Export connectDB function for manual connection
app.connectDB = connectDB;

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

// API routes
app.use('/api/designs', designRoutes);

// API endpoints for solar analysis data (placeholder for future backend integration)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Rooftop Solar Analyzer API is running' });
});

// Test endpoint to check environment variables
app.get('/api/test-env', (req, res) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'undefined';
    console.log('🔑 Backend - Environment test - API Key:', apiKey);
    console.log('🔑 Backend - Environment test - API Key length:', apiKey.length);
    res.json({
        status: 'ok',
        apiKey: apiKey,
        apiKeyLength: apiKey.length,
        env: process.env
    });
});

// Catch-all handler for SPA routing (React Router will handle client-side routing)
app.get('*', (req, res) => {
    // Serve React index.html for all non-API routes (SPA routing)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    // For React SPA, serve the built index.html and let React Router handle routing
    const indexPath = path.join(__dirname, '../../frontend/build/index.html');
    const fs = require('fs');

    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading React app');
        }

        // Inject the Google Maps API key into the HTML
        // Use the API key from environment variables
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        console.log('🔑 Backend - Injecting API Key:', apiKey ? '[OK - Key Found]' : '[MISSING]');
        console.log('🔑 Backend - Using API Key:', apiKey);
        console.log('🔑 Backend - API Key length:', apiKey ? apiKey.length : 'undefined');

        console.log('🔑 Backend - Final API Key:', apiKey);
        console.log('🔑 Backend - API Key length:', apiKey ? apiKey.length : 'undefined');

        // Try to inject the API key - handle minified HTML
        let modifiedHtml;
        if (data.includes('<head>')) {
            // HTML has proper formatting
            modifiedHtml = data.replace(
                '<head>',
                `<head>
                <script>
                    // Inject Google Maps API key into window object for React app
                    window.GOOGLE_MAPS_API_KEY = '${apiKey}';
                    window.process = window.process || {};
                    window.process.env = window.process.env || {};
                    window.process.env.REACT_APP_GOOGLE_MAPS_API_KEY = '${apiKey}';
                    console.log('🔑 Frontend - Injected API Key:', window.GOOGLE_MAPS_API_KEY);
                    console.log('🔑 Frontend - Injected API Key length:', window.GOOGLE_MAPS_API_KEY ? window.GOOGLE_MAPS_API_KEY.length : 'undefined');
                </script>`
            );
        } else {
            // HTML is minified, try to find the title tag
            modifiedHtml = data.replace(
                '<title>',
                `<script>
                    // Inject Google Maps API key into window object for React app
                    window.GOOGLE_MAPS_API_KEY = '${apiKey}';
                    window.process = window.process || {};
                    window.process.env = window.process.env || {};
                    window.process.env.REACT_APP_GOOGLE_MAPS_API_KEY = '${apiKey}';
                    console.log('🔑 Frontend - Injected API Key:', window.GOOGLE_MAPS_API_KEY);
                    console.log('🔑 Frontend - Injected API Key length:', window.GOOGLE_MAPS_API_KEY ? window.GOOGLE_MAPS_API_KEY.length : 'undefined');
                </script><title>`
            );
        }

        console.log('🔑 Backend - HTML injection completed');

        res.send(modifiedHtml);
    });
});

module.exports = app;
