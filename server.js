#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env' });

// Get port from environment or use default
const PORT = process.env.PORT || 8000;

// Start the server with Express for both static files and API
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

// Serve static files from current directory
app.use(express.static('.', {
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

// Catch-all handler for SPA routing (send index.html for client-side routing)
app.get('*', (req, res) => {
    // Serve index.html for all routes (client-side routing will handle it)
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Rooftop Solar Analyzer Server starting...`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS: ${process.env.CORS_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`📋 Logging API: http://localhost:${PORT}/log`);
    console.log('✅ Server is running successfully!');
    console.log('🌍 Open http://localhost:${PORT} in your browser to start measuring rooftops');
});
