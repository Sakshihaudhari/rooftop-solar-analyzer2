# Deployment Guide

## 🚀 Quick Deployment with Docker

### Prerequisites
- Docker and Docker Compose
- Google Maps API key

### 1. Environment Setup
Create a `.env` file in the root directory:
```bash
# Copy the example
cp .env.example .env
```

Edit the `.env` file:
```bash
# Google Maps API Key (required)
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Database URL (optional - defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost:5432/rooftop_solar
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🖥️ Manual Deployment

### Frontend Deployment

#### Option 1: Development Server
```bash
cd frontend
npm install
npm start
```

#### Option 2: Production Build
```bash
cd frontend
npm install
npm run build
npm install -g serve
serve -s build -l 3000
```

### Backend Deployment

#### Option 1: Development Server
```bash
cd backend
npm install
npm start
```

#### Option 2: Production with PM2
```bash
cd backend
npm install -g pm2
npm install
pm2 start src/server.js --name "rooftop-backend"
```

## ☁️ Cloud Deployment

### Heroku (Frontend + Backend)
```bash
# Install Heroku CLI and login
heroku login

# Create apps
heroku create rooftop-frontend
heroku create rooftop-backend

# Deploy frontend
cd frontend
heroku buildpacks:set mars/create-react-app
git push heroku main

# Deploy backend
cd ../backend
heroku buildpacks:set heroku/nodejs
git push heroku main
```

### AWS (EC2 + S3)
1. Launch EC2 instance with Node.js
2. Clone repository and setup
3. Configure Nginx as reverse proxy
4. Use S3 for static frontend files
5. Setup RDS for database

### Google Cloud Platform
1. Use App Engine for backend
2. Use Cloud Storage for static files
3. Setup Cloud SQL for database

## 🔧 Environment Variables

### Frontend (.env)
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
REACT_APP_API_BASE_URL=http://localhost:8000  # Backend URL
```

### Backend (.env)
```bash
NODE_ENV=production
DATABASE_URL=your_database_connection_string
PORT=8000
GOOGLE_MAPS_API_KEY=your_api_key  # For server-side operations
```

## 🗄️ Database Setup

### PostgreSQL (Recommended)
```sql
CREATE DATABASE rooftop_solar;
CREATE USER solar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rooftop_solar TO solar_user;
```

### Migration (if using database)
```bash
cd backend
npm run migrate
```

## 🔒 Security Checklist

- [ ] Set strong Google Maps API key restrictions
- [ ] Use HTTPS in production
- [ ] Set up CORS properly
- [ ] Enable database authentication
- [ ] Use environment variables for secrets
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

## 📊 Monitoring

### Health Checks
- Frontend: Check if React app loads
- Backend: Monitor API endpoints
- Database: Check connection and performance

### Logs
```bash
# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend
```

## 🔄 Updates

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up --build -d
```

### Database Migrations
```bash
# If using database migrations
docker-compose exec backend npm run migrate
```

## 🆘 Troubleshooting

### Common Issues

#### Google Maps Not Loading
- Check API key is set correctly
- Verify API key has required permissions
- Check browser console for errors

#### Drawing Not Working
- Ensure satellite view is enabled
- Check that Google Maps drawing library is loaded
- Verify polygon coordinates are valid

#### Database Connection Issues
- Check DATABASE_URL format
- Verify database is running and accessible
- Check firewall settings

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Or use different ports
PORT=3001 npm start
```

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement lazy loading

### Backend
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use load balancing

### Database
- Add proper indexes
- Use read replicas
- Implement connection pooling
- Regular maintenance

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
# Test API endpoints
curl http://localhost:8000/api/health
```

## 📝 API Documentation

### Health Check
```
GET /api/health
```

### Solar Analysis
```
POST /api/designs
Content-Type: application/json

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

## 🤝 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Test individual components
5. Check system requirements

---

**Happy Deploying! 🌞**
