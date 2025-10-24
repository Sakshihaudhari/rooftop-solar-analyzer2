const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rooftop-solar-analyzer';

    console.log(`🔗 Attempting to connect to MongoDB at: ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Port: ${conn.connection.port}`);
    console.log(`🔗 Connection URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      codeName: error.codeName,
      name: error.name
    });

    // Don't exit process - allow server to start without database for testing
    console.warn('⚠️  Database connection failed, but server will continue');
    console.warn('💡 To fix: Install MongoDB or use MongoDB Atlas');
    return null;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📱 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

// Handle successful connection
mongoose.connection.on('open', () => {
  console.log('🎉 MongoDB connection opened successfully');
});

// Handle reconnection
mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// Handle connection timeout
mongoose.connection.on('timeout', () => {
  console.warn('⏰ MongoDB connection timeout');
});

// Handle app termination
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed due to app termination');
  }
  process.exit(0);
});

// Helper function to check if database is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Helper function to get connection status
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectDB,
  isConnected,
  getConnectionStatus
};
