# 🔧 Troubleshooting & Maintenance Guide

## 🎯 Overview

This guide provides comprehensive troubleshooting procedures, common issue resolutions, and maintenance practices for the IP Getter application.

## 🚨 Emergency Response Workflow

```mermaid
flowchart TD
    ALERT[Alert Received] --> ASSESS[Assess Severity]
    ASSESS --> CRITICAL{Critical Issue?}
    
    CRITICAL -->|Yes| IMMEDIATE[Immediate Response]
    CRITICAL -->|No| STANDARD[Standard Response]
    
    IMMEDIATE --> ESCALATE[Escalate to On-Call]
    IMMEDIATE --> ROLLBACK[Consider Rollback]
    IMMEDIATE --> HOTFIX[Deploy Hotfix]
    
    STANDARD --> INVESTIGATE[Investigate Issue]
    INVESTIGATE --> REPRODUCE[Reproduce Problem]
    REPRODUCE --> FIX[Implement Fix]
    FIX --> TEST[Test Solution]
    TEST --> DEPLOY[Deploy Fix]
    
    ROLLBACK --> VERIFY[Verify System Health]
    HOTFIX --> VERIFY
    DEPLOY --> VERIFY
    
    VERIFY --> MONITOR[Monitor for 24h]
    MONITOR --> POSTMORTEM[Post-Mortem Analysis]
    
    style ALERT fill:#ff6b6b
    style CRITICAL fill:#f39c12
    style IMMEDIATE fill:#e74c3c
    style VERIFY fill:#27ae60
```

## 🔍 Common Issues & Solutions

### Authentication Issues

#### Issue: "User not authenticated" after page refresh
**Symptoms:**
- User gets logged out on page refresh
- Token appears to be lost
- Redirect to login page unexpectedly

**Diagnosis Steps:**
```bash
# 1. Check browser cookies
# Open DevTools → Application → Cookies
# Look for 'token' cookie

# 2. Check backend logs
tail -f logs/combined.log | grep "authenticateToken"

# 3. Test token validation endpoint
curl -b "token=<cookie_value>" http://localhost:3000/api/auth/me
```

**Solutions:**
```javascript
// Check cookie configuration
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Must be false in development
  sameSite: 'lax',
  maxAge: 3600000, // 1 hour
  domain: process.env.COOKIE_DOMAIN // Remove in development
});

// Verify JWT secret consistency
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
// Should be at least 32 characters
```

#### Issue: OTP verification fails
**Symptoms:**
- "Invalid OTP" error message
- OTP emails not received
- OTP expires too quickly

**Diagnosis Steps:**
```bash
# 1. Check Redis connection
redis-cli ping

# 2. Check OTP storage
redis-cli get "otp:user@example.com"

# 3. Check email logs
grep "sendVerificationOtp" logs/combined.log

# 4. Test email configuration
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});
transporter.verify().then(console.log).catch(console.error);
"
```

**Solutions:**
```javascript
// Verify OTP generation and storage
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check OTP comparison logic
const compareOTP = async (email, enteredOtp) => {
  const storedHashedOtp = await redisClient.get(`otp:${email}`);
  if (!storedHashedOtp) {
    throw new Error('OTP expired or not found');
  }
  
  const enteredHashedOtp = crypto.createHash('sha256').update(enteredOtp).digest('hex');
  return storedHashedOtp === enteredHashedOtp;
};
```

### Database Connection Issues

#### Issue: MongoDB connection failures
**Symptoms:**
- "MongoNetworkError" in logs
- Application crashes on startup
- Intermittent database errors

**Diagnosis Steps:**
```bash
# 1. Test MongoDB connection
mongosh "mongodb://localhost:27017/ipgetter"

# 2. Check MongoDB Atlas connectivity (if using cloud)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"

# 3. Check connection pool status
# In Node.js application
console.log('MongoDB connection state:', mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

**Solutions:**
```javascript
// Robust MongoDB connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      });
      
      console.log('✅ MongoDB connected successfully');
      break;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, error.message);
      
      if (retries === maxRetries) {
        console.error('❌ Max retries reached. Exiting...');
        process.exit(1);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
```

#### Issue: Redis connection problems
**Symptoms:**
- OTP verification fails
- Cache misses increase
- "Redis connection lost" errors

**Diagnosis Steps:**
```bash
# 1. Test Redis connection
redis-cli ping

# 2. Check Redis Cloud connection (if using cloud)
redis-cli -h <host> -p <port> -a <password> ping

# 3. Monitor Redis performance
redis-cli --latency-history -i 1

# 4. Check Redis memory usage
redis-cli info memory
```

**Solutions:**
```javascript
// Robust Redis connection with reconnection logic
const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  reconnectOnError: (err) => {
    console.log('Redis reconnect on error:', err.message);
    return err.message.includes('READONLY');
  }
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});
```

### Performance Issues

#### Issue: Slow API response times
**Symptoms:**
- Response times > 500ms
- Timeouts on frontend
- High server load

**Diagnosis Steps:**
```bash
# 1. Check API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/auth/me

# Create curl-format.txt:
echo "     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n" > curl-format.txt

# 2. Monitor database query performance
# Enable MongoDB profiling
mongosh --eval "db.setProfilingLevel(2, { slowms: 100 })"

# 3. Check system resources
top -p $(pgrep node)
```

**Solutions:**
```javascript
// Add database query optimization
const getUserByEmail = async (email) => {
  // Add index on email field
  // db.users.createIndex({ email: 1 })
  
  return await User.findOne({ email }).lean(); // Use lean() for read-only operations
};

// Implement response caching
const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    
    next();
  };
};

// Use caching for static data
app.get('/api/auth/me', cacheMiddleware(300), authenticateToken, getUser);
```

### Frontend Issues

#### Issue: CORS errors
**Symptoms:**
- "Access to fetch blocked by CORS policy"
- Network requests fail in browser
- Works in development but fails in production

**Diagnosis Steps:**
```bash
# 1. Check CORS configuration
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:3000/api/auth/login

# 2. Verify frontend API URL
echo $VITE_API_URL

# 3. Check browser network tab for preflight requests
```

**Solutions:**
```javascript
// Backend CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Frontend axios configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
  timeout: 10000
});
```

## 🛠️ Debugging Tools & Techniques

### Backend Debugging

#### Debug Mode Setup
```javascript
// Enable debug logging
const debug = require('debug');
const authDebug = debug('app:auth');
const dbDebug = debug('app:database');

// Usage in code
authDebug('User login attempt: %s', email);
dbDebug('Database query: %O', query);

// Run with debug output
DEBUG=app:* npm start
```

#### Request/Response Logging
```javascript
// Detailed request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  console.log(`📥 ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
      responseSize: data?.length || 0
    });
    originalSend.call(this, data);
  };
  
  next();
};
```

### Frontend Debugging

#### Redux DevTools Setup
```javascript
// Enhanced Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production' && {
    trace: true,
    traceLimit: 25
  }
});

export default store;
```

#### Network Request Debugging
```javascript
// Axios interceptors for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);
```

## 📋 Maintenance Procedures

### Daily Maintenance Checklist

```mermaid
graph LR
    DAILY[Daily Tasks] --> LOGS[Check Logs]
    DAILY --> METRICS[Review Metrics]
    DAILY --> ALERTS[Check Alerts]
    DAILY --> BACKUP[Verify Backups]
    
    LOGS --> ERROR_LOGS[Error Logs]
    LOGS --> ACCESS_LOGS[Access Logs]
    
    METRICS --> RESPONSE_TIME[Response Times]
    METRICS --> ERROR_RATE[Error Rates]
    METRICS --> RESOURCE_USAGE[Resource Usage]
    
    style DAILY fill:#3498db
    style ERROR_LOGS fill:#e74c3c
    style RESPONSE_TIME fill:#27ae60
```

#### Daily Tasks
- [ ] Check error logs for new issues
- [ ] Review application metrics dashboard
- [ ] Verify all services are healthy
- [ ] Check database performance metrics
- [ ] Review security alerts
- [ ] Verify backup completion

### Weekly Maintenance

#### Security Updates
```bash
# Check for security vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update specific packages
npm install package@latest
```

#### Performance Review
```bash
# Analyze database performance
mongosh --eval "db.runCommand({collStats: 'users'})"

# Check Redis memory usage
redis-cli info memory

# Review slow queries
mongosh --eval "db.system.profile.find().limit(5).sort({ts:-1}).pretty()"
```

### Monthly Maintenance

#### Database Maintenance
```javascript
// Database cleanup script
const cleanupOldSessions = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  // Remove old unverified users
  const result = await User.deleteMany({
    verified: false,
    createdAt: { $lt: thirtyDaysAgo }
  });
  
  console.log(`Cleaned up ${result.deletedCount} old unverified users`);
};

// Index optimization
const optimizeIndexes = async () => {
  // Analyze index usage
  const indexStats = await db.users.aggregate([
    { $indexStats: {} }
  ]).toArray();
  
  console.log('Index usage statistics:', indexStats);
  
  // Remove unused indexes
  // db.users.dropIndex("unused_index_name");
};
```

## 🚨 Emergency Procedures

### Service Outage Response

#### Immediate Actions (0-5 minutes)
1. **Acknowledge the alert**
2. **Check service status dashboard**
3. **Verify the scope of the outage**
4. **Notify stakeholders if critical**

#### Investigation Phase (5-15 minutes)
1. **Check recent deployments**
2. **Review error logs**
3. **Check external service status**
4. **Identify root cause**

#### Resolution Phase (15+ minutes)
1. **Implement fix or rollback**
2. **Monitor service recovery**
3. **Verify all functionality**
4. **Update stakeholders**

### Rollback Procedures

```bash
# Railway rollback
railway rollback

# Vercel rollback
vercel rollback <deployment-url>

# Docker rollback
docker service update --rollback api-service

# Database rollback (if needed)
mongorestore --drop --db ipgetter backup/2024-01-15/
```

## 📞 Escalation Contacts

### Contact Matrix
| Issue Type | Primary Contact | Secondary Contact | Escalation |
|------------|----------------|-------------------|------------|
| **Authentication** | Backend Team | Security Team | CTO |
| **Database** | DevOps Team | Backend Team | Infrastructure Lead |
| **Frontend** | Frontend Team | Full-stack Team | Engineering Manager |
| **Security** | Security Team | DevOps Team | CISO |
| **Infrastructure** | DevOps Team | Platform Team | Infrastructure Lead |

### Communication Channels
- **Slack**: #alerts, #engineering, #incidents
- **Email**: engineering@company.com
- **Phone**: Emergency on-call rotation
- **Status Page**: status.company.com

This troubleshooting guide provides comprehensive procedures for identifying, diagnosing, and resolving common issues in your IP Getter application.
