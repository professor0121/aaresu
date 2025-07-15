# 📚 IP Getter Project - Complete Documentation

## 🏗️ Project Overview

**IP Getter** is a full-stack web application with JWT-based authentication, email verification, and protected routes. The project consists of a Node.js/Express backend with MongoDB, Redis for OTP storage, and a React frontend with Redux state management.

## 📁 Project Structure

```
aaresu/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── config/         # Database & Redis configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── dao/           # Data Access Objects
│   │   ├── middlewares/   # Authentication & validation
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   └── app.js         # Express app configuration
│   └── server.js          # Server entry point
├── frontend/              # React.js Client Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── axios/         # API configuration
│   │   └── routes/        # Client-side routing
│   └── public/            # Static assets
└── admin/                 # Admin Panel (separate React app)
    └── src/               # Admin-specific components
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache/Session**: Redis Cloud
- **Authentication**: JWT with HTTP-only cookies
- **Email**: Nodemailer with Gmail SMTP
- **Security**: bcryptjs, CORS, cookie-parser

### Frontend
- **Framework**: React.js with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons

## 🔐 Authentication System

### JWT Cookie-Based Authentication
- **Token Storage**: HTTP-only cookies (XSS protection)
- **Token Validation**: Automatic validation on protected routes
- **Session Management**: Persistent sessions across browser restarts
- **Email Verification**: OTP-based email verification with Redis storage

### Security Features
- Password hashing with bcryptjs
- CSRF protection with SameSite cookies
- XSS prevention with HTTP-only cookies
- Rate limiting ready (middleware structure in place)
- Secure logout (clears both client and server state)

## 📊 Database Schema

### User Model (MongoDB)
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  bio: String (default: ''),
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Storage (Redis)
```javascript
Key: "otp:{email}"
Value: SHA256 hashed OTP
TTL: 300 seconds (5 minutes)
```

## 🌐 API Endpoints

### Public Routes
```
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
POST /api/auth/verifyOtp     # Email verification
GET  /api/health            # Health check
```

### Protected Routes (Authentication Required)
```
GET  /api/auth/me           # Get current user
PUT  /api/auth/updateUser   # Update user profile
POST /api/auth/logout       # Logout user
GET  /api/protected/dashboard # User dashboard
PUT  /api/protected/settings  # Update settings
```

### Verified User Routes (Authentication + Email Verification)
```
GET  /api/auth/profile           # Get full profile
GET  /api/protected/premium-content # Premium content
GET  /api/protected/admin/users     # Admin panel
```

### Optional Authentication Routes
```
GET  /api/protected/public-content # Public content with optional personalization
```

## 🎯 Frontend Architecture

### Component Hierarchy
```
App.jsx
├── RootRoutes.jsx
│   ├── ProtectedRoute.jsx
│   │   └── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ForgetPassword.jsx
├── Header.jsx
│   ├── AuthSection.jsx
│   └── LogoutButton.jsx
└── UI Components/
    ├── ProtectedRoute.jsx
    └── LogoutButton.jsx
```

### Redux Store Structure
```javascript
store: {
  auth: {
    user: Object | null,
    token: String | null,
    loading: Boolean,
    error: String | null,
    isAuthenticated: Boolean
  }
}
```

### Custom Hooks
- **useAuth**: Complete authentication state management
- **useProtectedRoute**: Route protection logic
- **useAuthContent**: Conditional rendering helpers

## 🔄 Data Flow Patterns

### Authentication Flow
1. User submits login credentials
2. Backend validates credentials
3. JWT token generated and set as HTTP-only cookie
4. OTP sent to user's email
5. User verifies OTP
6. User marked as verified in database
7. Frontend Redux state updated
8. User redirected to protected content

### Protected Route Flow
1. User navigates to protected route
2. ProtectedRoute component checks authentication
3. If not authenticated, calls `/api/auth/me`
4. Backend validates JWT from cookies
5. If valid, user data returned and stored in Redux
6. Protected content rendered
7. If invalid, user redirected to login

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB database
- Redis instance
- Gmail account for SMTP

### Environment Variables
```bash
# Backend (.env)
PORT=3000
MONGO_URI=mongodb://localhost:27017/ipgetter
JWT_SECRET=your-super-secret-jwt-key
EMAIL=your-gmail@gmail.com
EMAIL_PASS=your-app-password
REDIS_URL=your-redis-url
REDIS_PASSWORD=your-redis-password
REDIS_PORT=your-redis-port
REDIS_USERNAME=your-redis-username

# Frontend (.env)
VITE_API_URL=http://localhost:3000/api
```

### Installation & Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev

# Admin (if needed)
cd admin
npm install
npm run dev
```

## 📈 Performance Considerations

### Backend Optimizations
- **Async/Await**: All database operations are asynchronous
- **Connection Pooling**: MongoDB connection pooling via Mongoose
- **Redis Caching**: OTP storage in Redis for fast retrieval
- **Error Handling**: Centralized error handling with asyncHandler

### Frontend Optimizations
- **Code Splitting**: React Router lazy loading ready
- **State Management**: Efficient Redux state updates
- **API Caching**: Axios interceptors for request/response handling
- **Component Optimization**: Functional components with hooks

## 🔒 Security Best Practices

### Implemented Security Measures
✅ **Password Hashing**: bcryptjs with salt rounds  
✅ **JWT Security**: HTTP-only cookies, secure flags  
✅ **CORS Configuration**: Specific origin allowlist  
✅ **Input Validation**: Request body validation  
✅ **Error Handling**: No sensitive data in error responses  
✅ **Session Management**: Secure logout implementation  

### Recommended Enhancements
🔄 **Rate Limiting**: Implement rate limiting for auth endpoints  
🔄 **HTTPS**: Enable HTTPS in production  
🔄 **Refresh Tokens**: Implement refresh token mechanism  
🔄 **Role-Based Access**: Add user roles and permissions  
🔄 **Audit Logging**: Log security events  

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for utilities (JWT, hashing, OTP)
- Integration tests for API endpoints
- Middleware testing for authentication
- Database operation testing

### Frontend Testing
- Component unit tests with React Testing Library
- Redux state management tests
- Authentication flow testing
- Protected route testing

## 📦 Deployment Architecture

### Production Deployment
```
Load Balancer
├── Frontend (Vercel/Netlify)
├── Backend (Railway/Heroku)
├── Database (MongoDB Atlas)
└── Cache (Redis Cloud)
```

### Environment Configuration
- **Development**: Local MongoDB + Redis
- **Staging**: Cloud databases with test data
- **Production**: Fully managed cloud services

## 🔄 Future Enhancements

### Planned Features
1. **Multi-factor Authentication** (2FA)
2. **Social Login** (Google, GitHub)
3. **Real-time Notifications** (WebSocket)
4. **File Upload** (Profile pictures)
5. **Admin Dashboard** (User management)
6. **API Rate Limiting** (Express rate limit)
7. **Logging System** (Winston/Morgan)
8. **Monitoring** (Health checks, metrics)

### Scalability Considerations
- **Microservices**: Split into auth, user, and notification services
- **Database Sharding**: Horizontal scaling for large user base
- **CDN Integration**: Static asset delivery
- **Caching Layer**: Redis for frequently accessed data

## 📞 Support & Maintenance

### Monitoring
- Health check endpoint: `GET /api/health`
- Error logging with timestamps
- Performance metrics tracking

### Backup Strategy
- **Database**: Automated MongoDB backups
- **Redis**: OTP data is temporary (5-minute TTL)
- **Code**: Git version control with branching strategy

---

*This documentation provides a comprehensive overview of the IP Getter project architecture, implementation details, and operational guidelines.*
