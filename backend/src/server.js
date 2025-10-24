#!/usr/bin/env node

const path = require('path');

// Load environment variables from project root directory
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

console.log('🔧 Backend - .env file path:', path.resolve(__dirname, '..', '..', '.env'));
console.log('🔑 Loaded REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? '[OK - Key Loaded]' : '[MISSING]');
console.log('🔑 Backend - REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
console.log('🔑 Backend - All env vars:', Object.keys(process.env).filter(key => key.includes('REACT_APP') || key.includes('GOOGLE') || key.includes('API')));

// Get port from environment or use default
const PORT = process.env.PORT || 8000;

// Import the Express app
const app = require('./app');

const server = app.listen(PORT, async () => {
    console.log(`🚀 Rooftop Solar Analyzer Server starting...`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS: ${process.env.CORS_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`📋 Logging API: http://localhost:${PORT}/log`);
    console.log(`⚛️  React Frontend: http://localhost:${PORT} (serving React app)`);
    console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);

    // MongoDB connection is optional - server can run without it
    // Database connection will be attempted when first API call is made
    console.log('💾 Database connection: Optional (will connect on first API call)');

    console.log('✅ Server is running successfully!');
    console.log('🌍 Open http://localhost:${PORT} in your browser to start using the React solar analyzer');
});
