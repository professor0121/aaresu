# Protected Routes with JWT Cookies - Implementation Guide

## Overview
This implementation provides a robust authentication system using JWT tokens stored in HTTP-only cookies. The system includes three types of middleware for different protection levels.

## Middleware Types

### 1. `authenticateToken`
- **Purpose**: Protects routes that require user authentication
- **Behavior**: Validates JWT token from cookies and adds user info to `req.user`
- **Response**: Returns 401 if token is missing, invalid, or expired

### 2. `requireVerified`
- **Purpose**: Ensures user has verified their email
- **Behavior**: Must be used after `authenticateToken`
- **Response**: Returns 403 if user is not verified

### 3. `optionalAuth`
- **Purpose**: For routes that work with or without authentication
- **Behavior**: Adds user info to `req.user` if token exists, continues regardless
- **Response**: Never returns errors, continues with or without user

## Route Examples

### Authentication Routes (`/api/auth`)
```javascript
// Public routes
POST /api/auth/register     // Register new user
POST /api/auth/login        // Login user
POST /api/auth/verifyOtp    // Verify email with OTP

// Protected routes
GET  /api/auth/me           // Get current user (requires auth)
PUT  /api/auth/updateUser   // Update user (requires auth)
GET  /api/auth/profile      // Get profile (requires auth + verification)
POST /api/auth/logout       // Logout (optional auth)
```

### Protected Routes (`/api/protected`)
```javascript
// Requires authentication only
GET  /api/protected/dashboard

// Requires authentication + email verification
GET  /api/protected/premium-content
GET  /api/protected/admin/users

// Optional authentication
GET  /api/protected/public-content

// Requires authentication for updates
PUT  /api/protected/settings
```

## Usage Examples

### 1. Basic Protected Route
```javascript
import { authenticateToken } from '../middlewares/auth.middleware.js';

router.get('/dashboard', authenticateToken, (req, res) => {
    // req.user contains: { id, username, email, verified, bio }
    res.json({
        message: `Welcome ${req.user.username}!`,
        user: req.user
    });
});
```

### 2. Verified Users Only
```javascript
import { authenticateToken, requireVerified } from '../middlewares/auth.middleware.js';

router.get('/premium', authenticateToken, requireVerified, (req, res) => {
    // Only verified users can access this
    res.json({ premiumContent: 'Secret data' });
});
```

### 3. Optional Authentication
```javascript
import { optionalAuth } from '../middlewares/auth.middleware.js';

router.get('/content', optionalAuth, (req, res) => {
    if (req.user) {
        // User is authenticated
        res.json({ 
            content: 'Personalized content',
            user: req.user.username 
        });
    } else {
        // User is not authenticated
        res.json({ content: 'Public content' });
    }
});
```

## Frontend Integration

### Making Authenticated Requests
```javascript
// With axios (credentials: true is important for cookies)
const response = await axios.get('/api/protected/dashboard', {
    withCredentials: true
});

// With fetch
const response = await fetch('/api/protected/dashboard', {
    credentials: 'include'
});
```

### Handling Authentication Errors
```javascript
try {
    const response = await axios.get('/api/protected/dashboard');
} catch (error) {
    if (error.response?.status === 401) {
        // Token expired or invalid - redirect to login
        window.location.href = '/login';
    } else if (error.response?.status === 403) {
        // User not verified - redirect to verification
        window.location.href = '/verify-email';
    }
}
```

## Security Features

### Cookie Configuration
```javascript
res.cookie('token', token, {
    httpOnly: true,      // Prevents XSS attacks
    sameSite: 'lax',     // CSRF protection
    secure: false,       // Set to true in production with HTTPS
    maxAge: 3600000      // 1 hour expiration
});
```

### Token Validation
- Validates JWT signature
- Checks token expiration
- Verifies user exists in database
- Handles specific JWT errors (expired, malformed, etc.)

## Error Responses

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Access denied. No token provided."
}
```

### 403 Forbidden (Email not verified)
```json
{
    "success": false,
    "message": "Email verification required. Please verify your email to access this resource."
}
```

### Token Expired
```json
{
    "success": false,
    "message": "Token has expired. Please login again."
}
```

## Testing the Implementation

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 2. Access Protected Routes
```bash
# Access protected route with cookies
curl -X GET http://localhost:3000/api/protected/dashboard \
  -b cookies.txt

# Access user profile
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 3. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Best Practices

1. **Always use HTTPS in production** - Set `secure: true` for cookies
2. **Set appropriate cookie expiration** - Match JWT expiration time
3. **Handle token refresh** - Implement refresh token mechanism for long sessions
4. **Validate user permissions** - Add role-based access control if needed
5. **Log authentication events** - Monitor failed login attempts
6. **Use environment variables** - Keep JWT secrets secure

## Next Steps

1. Implement refresh token mechanism
2. Add role-based access control (RBAC)
3. Add rate limiting for authentication endpoints
4. Implement session management
5. Add audit logging for security events
