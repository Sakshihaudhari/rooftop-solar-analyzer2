#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Get port from environment or use default
const PORT = process.env.PORT || 8000;

// Import the Express app
const app = require('./app');

const server = app.listen(PORT, () => {
    console.log(`🚀 Rooftop Solar Analyzer Server starting...`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS: ${process.env.CORS_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`📋 Logging API: http://localhost:${PORT}/log`);
    console.log(`⚛️  React Frontend: http://localhost:${PORT} (serving React app)`);
    console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);
    console.log('✅ Server is running successfully!');
    console.log('🌍 Open http://localhost:${PORT} in your browser to start using the React solar analyzer');
});
