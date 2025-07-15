# 🚀 IP Getter - Full-Stack Authentication System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, secure full-stack web application featuring JWT-based authentication with email verification, protected routes, and comprehensive user management.

## ✨ Features

### 🔐 **Advanced Authentication**
- **JWT Cookie Authentication** - Secure HTTP-only cookies
- **Email Verification** - OTP-based verification system
- **Protected Routes** - Automatic token validation
- **Persistent Sessions** - Stay logged in across browser restarts
- **Secure Logout** - Complete session cleanup

### 🛡️ **Security First**
- **Password Hashing** - bcryptjs with salt rounds
- **XSS Protection** - HTTP-only cookies
- **CSRF Protection** - SameSite cookie configuration
- **Input Validation** - Request sanitization
- **Error Handling** - No sensitive data exposure

### 🎨 **Modern Frontend**
- **React 18** - Latest React features
- **Redux Toolkit** - Efficient state management
- **Tailwind CSS** - Utility-first styling
- **Custom Hooks** - Reusable authentication logic
- **Responsive Design** - Mobile-first approach

### ⚡ **High Performance Backend**
- **Express.js** - Fast, minimalist framework
- **MongoDB** - Flexible document database
- **Redis** - High-speed caching for OTPs
- **Async/Await** - Non-blocking operations
- **Connection Pooling** - Optimized database connections

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** 6+
- **Redis** 7+
- **Gmail Account** (for SMTP)

### 1. Clone Repository
```bash
git clone <repository-url>
cd aaresu
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Environment Variables:**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ipgetter
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
REDIS_URL=your-redis-url
REDIS_PASSWORD=your-redis-password
REDIS_PORT=your-redis-port
REDIS_USERNAME=your-redis-username
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin (optional)
cd admin
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5174

## 📚 Documentation

### 📖 **Complete Documentation**
- **[📋 Project Documentation](PROJECT_DOCUMENTATION.md)** - Comprehensive project overview
- **[🎨 System Diagrams](SYSTEM_DIAGRAMS.md)** - Mermaid architecture diagrams
- **[🎯 UML Diagrams](UML_DIAGRAMS.md)** - Technical UML diagrams
- **[🌐 API Documentation](API_DOCUMENTATION.md)** - Complete API reference

### 🔐 **Authentication Guides**
- **[🔒 Authentication Flow](AUTHENTICATION_FLOW.md)** - Complete auth implementation
- **[🛡️ Protected Routes Guide](backend/PROTECTED_ROUTES_GUIDE.md)** - Route protection details

## 🛠️ Technology Stack

### **Backend**
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime Environment | 18+ |
| Express.js | Web Framework | 5.x |
| MongoDB | Primary Database | 6+ |
| Mongoose | ODM | 8.x |
| Redis | Cache/Session Store | 7+ |
| JWT | Authentication | 9.x |
| bcryptjs | Password Hashing | 3.x |
| Nodemailer | Email Service | 7.x |

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18+ |
| Redux Toolkit | State Management | 2.x |
| React Router | Client Routing | 6.x |
| Axios | HTTP Client | 1.x |
| Tailwind CSS | Styling | 3.x |
| Vite | Build Tool | 5.x |
| Lucide React | Icons | Latest |

## 🌐 API Endpoints

### **Public Routes**
```http
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
POST /api/auth/verifyOtp     # Email verification
GET  /api/health            # Health check
```

### **Protected Routes** 🔒
```http
GET  /api/auth/me           # Current user
PUT  /api/auth/updateUser   # Update profile
GET  /api/protected/dashboard # User dashboard
PUT  /api/protected/settings  # User settings
```

### **Verified User Routes** 🔐
```http
GET  /api/auth/profile           # Full profile
GET  /api/protected/premium-content # Premium features
GET  /api/protected/admin/users     # Admin panel
```

## 📁 Project Structure

```
aaresu/
├── 📁 backend/                 # Node.js API Server
│   ├── 📁 src/
│   │   ├── 📁 config/         # Database & Redis config
│   │   ├── 📁 controllers/    # Request handlers
│   │   ├── 📁 dao/           # Data access layer
│   │   ├── 📁 middlewares/   # Auth & validation
│   │   ├── 📁 models/        # MongoDB schemas
│   │   ├── 📁 routes/        # API routes
│   │   ├── 📁 services/      # Business logic
│   │   ├── 📁 utils/         # Helper functions
│   │   └── 📄 app.js         # Express configuration
│   ├── 📄 server.js          # Server entry point
│   └── 📄 package.json       # Dependencies
├── 📁 frontend/               # React Client
│   ├── 📁 src/
│   │   ├── 📁 components/    # UI components
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 redux/         # State management
│   │   ├── 📁 hooks/         # Custom hooks
│   │   ├── 📁 axios/         # API configuration
│   │   └── 📁 routes/        # Client routing
│   └── 📄 package.json       # Dependencies
├── 📁 admin/                  # Admin Panel
└── 📄 README.md              # This file
```

## 🔒 Security Features

- **🍪 HTTP-only Cookies** - XSS protection
- **🔐 JWT Authentication** - Stateless auth
- **🧂 Password Hashing** - bcryptjs with salt
- **📧 Email Verification** - OTP-based
- **🛡️ CORS Protection** - Origin allowlist
- **⏰ Token Expiration** - 1-hour sessions
- **🔄 Secure Logout** - Complete cleanup

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**⭐ Star this repository if you found it helpful!**