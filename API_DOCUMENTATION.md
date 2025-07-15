# 🌐 API Documentation

## 📋 Base Information

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT tokens via HTTP-only cookies
- **Content-Type**: `application/json`
- **CORS**: Enabled for `http://localhost:5173` and `http://localhost:3000`

## 🔐 Authentication Overview

The API uses JWT tokens stored in HTTP-only cookies for authentication. Three middleware types provide different levels of protection:

- **`authenticateToken`**: Requires valid JWT token
- **`requireVerified`**: Requires authentication + email verification
- **`optionalAuth`**: Works with or without authentication

## 📚 API Endpoints

### 🟢 Public Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "newUser": {
    "newUser": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "verified": false,
      "createdAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set:**
- `token`: JWT token (HTTP-only, 1 hour expiration)

---

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Logged in",
  "user": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set:**
- `token`: JWT token (HTTP-only, SameSite=lax, 1 hour expiration)

---

#### Verify OTP
```http
POST /auth/verifyOtp
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "OTP verified successfully"
}
```

---

#### Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-09-06T10:30:00.000Z"
}
```

### 🔒 Protected Endpoints (Authentication Required)

#### Get Current User
```http
GET /auth/me
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "bio": "Software developer"
  }
}
```

---

#### Update User
```http
PUT /auth/updateUser
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Request Body:**
```json
{
  "username": "john_updated",
  "bio": "Senior Software Developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_updated",
    "email": "john@example.com",
    "verified": true,
    "bio": "Senior Software Developer"
  },
  "updateData": {
    "username": "john_updated",
    "bio": "Senior Software Developer"
  }
}
```

---

#### Dashboard
```http
GET /protected/dashboard
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Welcome to your dashboard!",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "bio": "Software developer"
  },
  "data": {
    "lastLogin": "2023-09-06T10:30:00.000Z",
    "features": ["feature1", "feature2", "feature3"]
  }
}
```

---

#### Update Settings
```http
PUT /protected/settings
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Request Body:**
```json
{
  "theme": "dark",
  "notifications": true,
  "privacy": "public"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "bio": "Software developer"
  },
  "updatedSettings": {
    "theme": "dark",
    "notifications": true,
    "privacy": "public",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 🔐 Verified User Endpoints (Authentication + Email Verification Required)

#### Get Full Profile
```http
GET /auth/profile
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "bio": "Software developer"
  }
}
```

---

#### Premium Content
```http
GET /protected/premium-content
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Welcome to premium content!",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "bio": "Software developer"
  },
  "premiumData": {
    "content": "This is premium content only for verified users",
    "accessLevel": "premium"
  }
}
```

---

#### Admin Users
```http
GET /protected/admin/users
```

**Headers:**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Admin access granted",
  "adminData": {
    "totalUsers": 150,
    "activeUsers": 120,
    "pendingVerifications": 30
  }
}
```

### 🔄 Optional Authentication Endpoints

#### Public Content
```http
GET /protected/public-content
```

**Headers (Optional):**
- Cookie: `token=<jwt_token>`

**Response (200) - Without Authentication:**
```json
{
  "success": true,
  "message": "Public content accessible to everyone",
  "publicData": {
    "content": "This content is available to all users",
    "timestamp": "2023-09-06T10:30:00.000Z"
  }
}
```

**Response (200) - With Authentication:**
```json
{
  "success": true,
  "message": "Public content accessible to everyone",
  "publicData": {
    "content": "This content is available to all users",
    "timestamp": "2023-09-06T10:30:00.000Z"
  },
  "userSpecificData": {
    "personalizedMessage": "Hello john_doe!",
    "recommendations": ["item1", "item2", "item3"]
  }
}
```

---

#### Logout
```http
POST /auth/logout
```

**Headers (Optional):**
- Cookie: `token=<jwt_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**
- `token`: JWT token removed

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

```json
{
  "success": false,
  "message": "Invalid token format."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Email verification required. Please verify your email to access this resource."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to update user",
  "error": "Database connection error"
}
```

## 🔧 Request Examples

### Using cURL

#### Register and Login Flow
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}' \
  -c cookies.txt

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verifyOtp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","otp":"123456"}' \
  -b cookies.txt

# Access protected route
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Using JavaScript/Axios

#### Frontend Integration
```javascript
// Configure axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login
const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Access protected route
const getDashboard = async () => {
  try {
    const response = await axiosInstance.get('/protected/dashboard');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    throw error.response.data;
  }
};
```

## 🔒 Security Notes

1. **Cookies**: All JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **CORS**: Configured to allow specific origins only
3. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
4. **OTP Security**: OTPs are hashed and stored in Redis with 5-minute expiration
5. **Token Expiration**: JWT tokens expire after 1 hour
6. **SameSite**: Cookies use SameSite=lax for CSRF protection

## 📊 Rate Limiting (Recommended)

Consider implementing rate limiting for:
- `/auth/register`: 5 requests per hour per IP
- `/auth/login`: 10 requests per hour per IP
- `/auth/verifyOtp`: 5 requests per 5 minutes per email

This API documentation provides comprehensive information for integrating with your IP Getter backend service.
