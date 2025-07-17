# 🚀 Deployment Guide

## 🏗️ Deployment Architecture Overview

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend Tier"
            CDN[CDN/CloudFlare]
            STATIC[Static Hosting<br/>Vercel/Netlify]
        end
        
        subgraph "Application Tier"
            LB[Load Balancer]
            API1[API Server 1<br/>Railway/Heroku]
            API2[API Server 2<br/>Railway/Heroku]
            API3[API Server 3<br/>Railway/Heroku]
        end
        
        subgraph "Data Tier"
            DB_PRIMARY[(MongoDB Atlas<br/>Primary)]
            DB_SECONDARY[(MongoDB Atlas<br/>Secondary)]
            REDIS[(Redis Cloud)]
        end
        
        subgraph "External Services"
            SMTP[Gmail SMTP]
            MONITORING[Monitoring<br/>DataDog/New Relic]
            LOGS[Logging<br/>LogDNA/Papertrail]
        end
    end
    
    subgraph "CI/CD Pipeline"
        GITHUB[GitHub Repository]
        ACTIONS[GitHub Actions]
        DOCKER[Docker Registry]
    end
    
    CDN --> STATIC
    STATIC --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    API1 --> DB_PRIMARY
    API2 --> DB_PRIMARY
    API3 --> DB_PRIMARY
    DB_PRIMARY --> DB_SECONDARY
    API1 --> REDIS
    API2 --> REDIS
    API3 --> REDIS
    API1 --> SMTP
    
    GITHUB --> ACTIONS
    ACTIONS --> DOCKER
    ACTIONS --> STATIC
    ACTIONS --> API1
    
    style CDN fill:#ff6b6b
    style LB fill:#4ecdc4
    style DB_PRIMARY fill:#45b7d1
    style REDIS fill:#dc382d
```

## 🌍 Environment Strategy

### Environment Tiers

```mermaid
flowchart LR
    DEV[Development<br/>Local Machine] --> STAGING[Staging<br/>Cloud Environment]
    STAGING --> PROD[Production<br/>Cloud Environment]
    
    subgraph "Development"
        DEV_DB[(Local MongoDB)]
        DEV_REDIS[(Local Redis)]
    end
    
    subgraph "Staging"
        STAGE_DB[(MongoDB Atlas)]
        STAGE_REDIS[(Redis Cloud)]
    end
    
    subgraph "Production"
        PROD_DB[(MongoDB Atlas<br/>Cluster)]
        PROD_REDIS[(Redis Cloud<br/>Cluster)]
    end
    
    DEV --> DEV_DB
    DEV --> DEV_REDIS
    STAGING --> STAGE_DB
    STAGING --> STAGE_REDIS
    PROD --> PROD_DB
    PROD --> PROD_REDIS
    
    style DEV fill:#61dafb
    style STAGING fill:#ff9800
    style PROD fill:#4caf50
```

## 🔧 Platform-Specific Deployment

### 1. Frontend Deployment (Vercel)

#### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

#### Deployment Steps
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from frontend directory
cd frontend
vercel

# 4. Set environment variables
vercel env add VITE_API_URL production
# Enter: https://your-api-domain.com/api

# 5. Deploy to production
vercel --prod
```

### 2. Backend Deployment (Railway)

#### Railway Configuration (`railway.toml`)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
PORT = "3000"
```

#### Deployment Steps
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
cd backend
railway init

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-production-jwt-secret
railway variables set MONGO_URI=your-mongodb-atlas-uri
railway variables set EMAIL=your-gmail@gmail.com
railway variables set EMAIL_PASS=your-gmail-app-password
railway variables set REDIS_URL=your-redis-cloud-url

# 5. Deploy
railway up
```

### 3. Alternative: Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Docker Compose (Full Stack)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:3000/api
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL=${EMAIL}
      - EMAIL_PASS=${EMAIL_PASS}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### Frontend CI/CD (`.github/workflows/frontend.yml`)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm run test
      
      - name: Build application
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
```

#### Backend CI/CD (`.github/workflows/backend.yml`)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['backend/**']
  pull_request:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          NODE_ENV: test
          MONGO_URI: mongodb://localhost:27017/test
          JWT_SECRET: test-secret
          REDIS_URL: redis://localhost:6379

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          cd backend
          npx @railway/cli deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

#### 1. Create Cluster
```bash
# Using MongoDB Atlas CLI
atlas clusters create production-cluster \
  --provider AWS \
  --region US_EAST_1 \
  --tier M10 \
  --diskSizeGB 10 \
  --backup
```

#### 2. Database Security
```javascript
// Connection string format
mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority

// Security settings
{
  "ipWhitelist": ["0.0.0.0/0"], // Configure for production IPs
  "databaseUsers": [
    {
      "username": "api-user",
      "password": "secure-password",
      "roles": ["readWrite"]
    }
  ]
}
```

### Redis Cloud Setup

#### 1. Create Database
```bash
# Redis Cloud configuration
{
  "name": "ip-getter-cache",
  "plan": "30MB",
  "region": "us-east-1",
  "evictionPolicy": "allkeys-lru"
}
```

#### 2. Connection Configuration
```javascript
// Redis connection for production
const redisOptions = {
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
};
```

## 🔐 Environment Variables

### Production Environment Setup

#### Backend Environment Variables
```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# Email Service
EMAIL=your-production-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Redis
REDIS_URL=rediss://username:password@host:port
REDIS_PASSWORD=your-redis-password
REDIS_PORT=your-redis-port
REDIS_USERNAME=your-redis-username

# Security
COOKIE_DOMAIN=.yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

#### Frontend Environment Variables
```bash
# API Configuration
VITE_API_URL=https://your-api-domain.com/api

# Analytics (Optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-frontend-sentry-dsn
```

## 📊 Monitoring & Logging

### Health Check Implementation
```javascript
// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    services: {}
  };

  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();
    healthCheck.services.mongodb = 'healthy';
  } catch (error) {
    healthCheck.services.mongodb = 'unhealthy';
  }

  try {
    // Check Redis connection
    await redisClient.ping();
    healthCheck.services.redis = 'healthy';
  } catch (error) {
    healthCheck.services.redis = 'unhealthy';
  }

  const isHealthy = Object.values(healthCheck.services).every(status => status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(healthCheck);
});
```

### Logging Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ip-getter-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🔄 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security review completed
- [ ] Performance testing completed
- [ ] Backup strategy in place

### Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor error rates
- [ ] Verify all services operational

### Post-Deployment
- [ ] Monitor application metrics
- [ ] Check error logs
- [ ] Verify user authentication flow
- [ ] Test critical user journeys
- [ ] Update documentation
- [ ] Notify stakeholders

## 🚨 Rollback Strategy

### Automated Rollback
```bash
# Railway rollback
railway rollback

# Vercel rollback
vercel rollback

# Docker rollback
docker service update --rollback api-service
```

### Manual Rollback Process
1. **Identify Issue** - Monitor alerts and logs
2. **Assess Impact** - Determine affected users/features
3. **Execute Rollback** - Use platform-specific commands
4. **Verify Rollback** - Test critical functionality
5. **Communicate** - Notify team and users
6. **Post-Mortem** - Document lessons learned

This deployment guide provides comprehensive instructions for deploying your IP Getter application to production with proper CI/CD, monitoring, and rollback strategies.
