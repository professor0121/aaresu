# 🔐 Security Guide & Best Practices

## 🛡️ Security Overview

This guide covers the comprehensive security measures implemented in the IP Getter project, threat modeling, security best practices, and recommendations for maintaining a secure application.

## 🏗️ Security Architecture

```mermaid
graph TB
    subgraph "Client Security Layer"
        HTTPS[HTTPS/TLS 1.3]
        CSP[Content Security Policy]
        CORS_CLIENT[CORS Headers]
        XSS[XSS Protection]
    end
    
    subgraph "Transport Security"
        TLS[TLS Encryption]
        CERT[SSL Certificates]
        HSTS[HTTP Strict Transport Security]
    end
    
    subgraph "Application Security"
        JWT[JWT Tokens]
        COOKIES[HTTP-Only Cookies]
        BCRYPT[Password Hashing]
        OTP[OTP Verification]
        RATE_LIMIT[Rate Limiting]
    end
    
    subgraph "API Security"
        AUTH_MW[Authentication Middleware]
        INPUT_VAL[Input Validation]
        ERROR_HANDLE[Secure Error Handling]
        SANITIZE[Data Sanitization]
    end
    
    subgraph "Data Security"
        DB_AUTH[Database Authentication]
        REDIS_AUTH[Redis Authentication]
        ENV_VARS[Environment Variables]
        ENCRYPTION[Data Encryption]
    end
    
    subgraph "Infrastructure Security"
        FIREWALL[Firewall Rules]
        VPC[Virtual Private Cloud]
        BACKUP[Encrypted Backups]
        MONITORING[Security Monitoring]
    end
    
    HTTPS --> TLS
    TLS --> JWT
    JWT --> AUTH_MW
    AUTH_MW --> DB_AUTH
    DB_AUTH --> FIREWALL
    
    style HTTPS fill:#4caf50
    style JWT fill:#ff9800
    style AUTH_MW fill:#2196f3
    style DB_AUTH fill:#9c27b0
    style FIREWALL fill:#f44336
```

## 🔒 Implemented Security Measures

### 1. Authentication & Authorization

#### JWT Token Security
```javascript
// Secure JWT configuration
const token = jwt.sign(
  { email: user.email },
  process.env.JWT_SECRET,
  { 
    expiresIn: '1h',
    algorithm: 'HS256',
    issuer: 'ip-getter-app',
    audience: 'ip-getter-users'
  }
);
```

#### HTTP-Only Cookies
```javascript
// Secure cookie configuration
res.cookie('token', token, {
  httpOnly: true,        // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',       // CSRF protection
  maxAge: 3600000,       // 1 hour expiration
  domain: process.env.COOKIE_DOMAIN, // Restrict domain
  path: '/'              // Cookie path
});
```

#### Password Security
```javascript
// Password hashing with bcryptjs
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Password validation
const isValidPassword = await bcrypt.compare(password, user.password);
```

### 2. Email Verification & OTP Security

#### OTP Generation & Storage
```javascript
// Secure OTP generation
const generateSecureOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// OTP hashing before storage
const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

// Redis storage with TTL
await redisClient.setEx(`otp:${email}`, 300, hashedOTP); // 5 minutes
```

### 3. Input Validation & Sanitization

#### Request Validation
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email format');
}

// Password strength validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(password)) {
  throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
}
```

### 4. CORS Configuration
```javascript
// Secure CORS setup
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};
```

## 🚨 Threat Modeling

### STRIDE Analysis

```mermaid
mindmap
  root((Security Threats))
    Spoofing
      Identity Theft
      Session Hijacking
      Token Forgery
    Tampering
      Data Modification
      Request Manipulation
      Cookie Tampering
    Repudiation
      Action Denial
      Log Tampering
      Audit Trail Loss
    Information Disclosure
      Data Leakage
      Error Information
      Sensitive Data Exposure
    Denial of Service
      Rate Limiting Bypass
      Resource Exhaustion
      Service Unavailability
    Elevation of Privilege
      Authorization Bypass
      Admin Access
      Role Escalation
```

### Attack Vectors & Mitigations

| Attack Vector | Risk Level | Mitigation Implemented | Additional Recommendations |
|---------------|------------|------------------------|----------------------------|
| **SQL Injection** | 🟢 Low | MongoDB with Mongoose ODM | Input validation, parameterized queries |
| **XSS (Cross-Site Scripting)** | 🟢 Low | HTTP-only cookies, CSP headers | Content sanitization, output encoding |
| **CSRF (Cross-Site Request Forgery)** | 🟢 Low | SameSite cookies, CORS | CSRF tokens for state-changing operations |
| **Session Hijacking** | 🟡 Medium | Secure cookies, HTTPS | Session rotation, IP validation |
| **Brute Force Attacks** | 🟡 Medium | Password hashing | Rate limiting, account lockout |
| **Man-in-the-Middle** | 🟢 Low | HTTPS/TLS | Certificate pinning, HSTS |
| **Data Breaches** | 🟡 Medium | Password hashing, env vars | Database encryption, access controls |
| **DoS/DDoS** | 🔴 High | Basic rate limiting | Advanced DDoS protection, CDN |

## 🔧 Security Configuration

### Environment Variables Security
```bash
# .env file structure
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Email
EMAIL=your-app-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Redis
REDIS_URL=rediss://username:password@host:port
REDIS_PASSWORD=your-redis-password

# Security
COOKIE_DOMAIN=.yourdomain.com
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Security
```javascript
// MongoDB connection with security options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
  ssl: true,
  sslValidate: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

### Redis Security
```javascript
// Redis connection with TLS
const redisOptions = {
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
};
```

## 🛡️ Security Best Practices

### Development Security Checklist

#### ✅ Authentication & Authorization
- [x] JWT tokens with secure configuration
- [x] HTTP-only cookies for token storage
- [x] Password hashing with bcryptjs (12 rounds)
- [x] Email verification with OTP
- [x] Session expiration (1 hour)
- [ ] Refresh token implementation
- [ ] Multi-factor authentication (2FA)
- [ ] Role-based access control (RBAC)

#### ✅ Data Protection
- [x] Environment variables for secrets
- [x] Input validation and sanitization
- [x] Secure error handling (no sensitive data exposure)
- [x] CORS configuration
- [ ] Database field encryption
- [ ] API response filtering
- [ ] Data masking in logs

#### ✅ Communication Security
- [x] HTTPS in production
- [x] Secure cookie configuration
- [x] SameSite cookie protection
- [ ] Content Security Policy (CSP)
- [ ] HTTP Strict Transport Security (HSTS)
- [ ] Certificate pinning

#### ✅ Infrastructure Security
- [x] Secure database connections
- [x] Redis authentication
- [ ] Rate limiting implementation
- [ ] DDoS protection
- [ ] Web Application Firewall (WAF)
- [ ] Security monitoring and alerting

### Code Security Guidelines

#### Secure Coding Practices
```javascript
// ❌ Bad: Exposing sensitive information
app.get('/api/error', (req, res) => {
  try {
    // Some operation
  } catch (error) {
    res.status(500).json({ error: error.stack }); // Exposes stack trace
  }
});

// ✅ Good: Secure error handling
app.get('/api/error', (req, res) => {
  try {
    // Some operation
  } catch (error) {
    console.error('Error:', error); // Log internally
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});
```

#### Input Validation
```javascript
// ✅ Comprehensive input validation
const validateUserInput = (data) => {
  const { username, email, password } = data;
  
  // Username validation
  if (!username || username.length < 3 || username.length > 30) {
    throw new Error('Username must be 3-30 characters');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  // Password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password does not meet security requirements');
  }
  
  return true;
};
```

## 🚀 Production Security Recommendations

### Immediate Implementation (High Priority)

1. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

2. **Content Security Policy**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
```

3. **Security Headers**
```javascript
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));
```

### Medium-Term Implementation

1. **Refresh Token System**
2. **Multi-Factor Authentication (2FA)**
3. **Role-Based Access Control**
4. **API Rate Limiting per User**
5. **Security Audit Logging**
6. **Automated Security Scanning**

### Long-Term Security Strategy

1. **Security Monitoring & SIEM**
2. **Penetration Testing**
3. **Bug Bounty Program**
4. **Security Training for Developers**
5. **Compliance Certifications (SOC 2, ISO 27001)**

## 🔍 Security Monitoring

### Logging Security Events
```javascript
const securityLogger = {
  logAuthAttempt: (email, success, ip) => {
    console.log(`AUTH_ATTEMPT: ${email} | Success: ${success} | IP: ${ip} | Time: ${new Date()}`);
  },
  
  logSuspiciousActivity: (activity, details) => {
    console.warn(`SECURITY_ALERT: ${activity} | Details: ${JSON.stringify(details)}`);
  },
  
  logDataAccess: (userId, resource, action) => {
    console.log(`DATA_ACCESS: User ${userId} | Resource: ${resource} | Action: ${action}`);
  }
};
```

### Health Check with Security Status
```javascript
app.get('/api/health', (req, res) => {
  const securityStatus = {
    httpsEnabled: req.secure,
    corsConfigured: true,
    authenticationActive: true,
    rateLimitingActive: false, // TODO: Implement
    lastSecurityUpdate: '2024-01-15'
  };
  
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    security: securityStatus
  });
});
```

## 📋 Security Incident Response

### Incident Response Plan
1. **Detection** - Monitor logs and alerts
2. **Assessment** - Evaluate severity and impact
3. **Containment** - Isolate affected systems
4. **Eradication** - Remove threat and vulnerabilities
5. **Recovery** - Restore normal operations
6. **Lessons Learned** - Document and improve

### Emergency Contacts
- **Security Team**: security@company.com
- **DevOps Team**: devops@company.com
- **Management**: management@company.com

## 🔗 Security Resources

### Tools & Libraries
- **Helmet.js** - Security headers
- **Express Rate Limit** - Rate limiting
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT implementation
- **validator** - Input validation

### Security Testing
- **OWASP ZAP** - Security scanning
- **Burp Suite** - Web application testing
- **npm audit** - Dependency vulnerability scanning
- **Snyk** - Continuous security monitoring

This security guide provides a comprehensive foundation for maintaining a secure application. Regular security reviews and updates are essential for ongoing protection.
