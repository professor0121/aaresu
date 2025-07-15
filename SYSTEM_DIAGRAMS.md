# 🎨 System Architecture Diagrams

## 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        FE[React Frontend<br/>Port: 5173]
        ADMIN[Admin Panel<br/>Port: 5174]
    end
    
    subgraph "API Layer"
        BE[Express Backend<br/>Port: 3000]
        MW[Authentication<br/>Middleware]
    end
    
    subgraph "Data Layer"
        DB[(MongoDB<br/>User Data)]
        REDIS[(Redis<br/>OTP Cache)]
    end
    
    subgraph "External Services"
        SMTP[Gmail SMTP<br/>Email Service]
    end
    
    FE -->|HTTPS/Cookies| BE
    ADMIN -->|HTTPS/Cookies| BE
    BE --> MW
    MW --> DB
    MW --> REDIS
    BE --> SMTP
    
    style FE fill:#61dafb
    style ADMIN fill:#61dafb
    style BE fill:#68a063
    style DB fill:#4db33d
    style REDIS fill:#dc382d
    style SMTP fill:#ea4335
```

## 🔐 Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant R as Redis
    participant E as Email Service
    
    Note over U,E: User Registration Flow
    U->>FE: Enter registration details
    FE->>BE: POST /api/auth/register
    BE->>DB: Check if user exists
    DB-->>BE: User not found
    BE->>DB: Create new user
    BE->>BE: Generate JWT token
    BE->>BE: Generate OTP
    BE->>R: Store OTP (5min TTL)
    BE->>E: Send OTP email
    BE-->>FE: Set JWT cookie + success response
    FE-->>U: Show OTP verification form
    
    Note over U,E: OTP Verification Flow
    U->>FE: Enter OTP
    FE->>BE: POST /api/auth/verifyOtp
    BE->>R: Retrieve stored OTP
    BE->>BE: Compare OTP hashes
    BE->>DB: Mark user as verified
    BE-->>FE: Success response
    FE-->>U: Redirect to dashboard
```

## 🛡️ Protected Route Flow

```mermaid
sequenceDiagram
    participant U as User
    participant PR as ProtectedRoute
    participant RX as Redux Store
    participant API as Backend API
    participant MW as Auth Middleware
    participant DB as MongoDB
    
    U->>PR: Navigate to protected page
    PR->>RX: Check isAuthenticated
    
    alt User not authenticated
        PR->>API: GET /api/auth/me (with cookies)
        API->>MW: Validate JWT token
        MW->>DB: Find user by email
        DB-->>MW: Return user data
        MW-->>API: Add user to req.user
        API-->>PR: Return user data
        PR->>RX: Update auth state
        PR-->>U: Render protected content
    else User already authenticated
        PR-->>U: Render protected content immediately
    end
    
    alt Invalid/Expired token
        API-->>PR: 401 Unauthorized
        PR-->>U: Redirect to login
    end
```

## 📊 Database Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String username
        String email UK
        String password
        String bio
        Boolean verified
        Date createdAt
        Date updatedAt
    }
    
    OTP_CACHE {
        String key PK "otp:email"
        String hashedOTP
        Number ttl "300 seconds"
    }
    
    JWT_TOKEN {
        String email
        Date iat "issued at"
        Date exp "expires at"
        String signature
    }
    
    USER ||--o{ OTP_CACHE : "generates"
    USER ||--o{ JWT_TOKEN : "owns"
```

## 🎯 Frontend Component Architecture

```mermaid
graph TD
    APP[App.jsx]
    APP --> ROUTER[RootRoutes.jsx]
    APP --> HEADER[Header.jsx]
    
    ROUTER --> PROTECTED[ProtectedRoute.jsx]
    ROUTER --> LOGIN[LoginPage.jsx]
    ROUTER --> REGISTER[RegisterPage.jsx]
    ROUTER --> FORGOT[ForgetPassword.jsx]
    
    PROTECTED --> HOME[HomePage.jsx]
    
    HEADER --> AUTH_SECTION[AuthSection]
    HEADER --> LOGOUT_BTN[LogoutButton.jsx]
    
    subgraph "Redux Store"
        STORE[Redux Store]
        AUTH_SLICE[Auth Slice]
        AUTH_THUNKS[Auth Thunks]
    end
    
    subgraph "Custom Hooks"
        USE_AUTH[useAuth]
        USE_PROTECTED[useProtectedRoute]
        USE_AUTH_CONTENT[useAuthContent]
    end
    
    APP --> STORE
    PROTECTED --> USE_PROTECTED
    HEADER --> USE_AUTH_CONTENT
    AUTH_SECTION --> USE_AUTH
    
    style APP fill:#61dafb
    style STORE fill:#764abc
    style USE_AUTH fill:#ff6b6b
```

## 🔄 Redux State Flow

```mermaid
stateDiagram-v2
    [*] --> NotAuthenticated
    
    NotAuthenticated --> Loading : dispatch(loginUser)
    NotAuthenticated --> Loading : dispatch(registerUser)
    NotAuthenticated --> Loading : dispatch(loadUser)
    
    Loading --> OTPPending : login/register success
    Loading --> NotAuthenticated : login/register failed
    Loading --> Authenticated : loadUser success
    Loading --> NotAuthenticated : loadUser failed
    
    OTPPending --> Loading : dispatch(verifyOtp)
    OTPPending --> NotAuthenticated : OTP verification failed
    
    Loading --> Authenticated : OTP verification success
    
    Authenticated --> NotAuthenticated : dispatch(logout)
    Authenticated --> NotAuthenticated : token expired
    
    state Loading {
        [*] --> FetchingData
        FetchingData --> [*]
    }
    
    state Authenticated {
        [*] --> UserDataLoaded
        UserDataLoaded --> [*]
    }
```

## 🌐 API Route Structure

```mermaid
graph LR
    subgraph "Public Routes"
        REG[POST /register]
        LOGIN[POST /login]
        VERIFY[POST /verifyOtp]
        HEALTH[GET /health]
    end
    
    subgraph "Protected Routes"
        ME[GET /me]
        UPDATE[PUT /updateUser]
        LOGOUT[POST /logout]
        DASHBOARD[GET /protected/dashboard]
        SETTINGS[PUT /protected/settings]
    end
    
    subgraph "Verified User Routes"
        PROFILE[GET /profile]
        PREMIUM[GET /protected/premium-content]
        ADMIN[GET /protected/admin/users]
    end
    
    subgraph "Middleware"
        AUTH_MW[authenticateToken]
        VERIFY_MW[requireVerified]
        OPT_MW[optionalAuth]
    end
    
    REG --> NONE[No Middleware]
    LOGIN --> NONE
    VERIFY --> NONE
    HEALTH --> NONE
    
    ME --> AUTH_MW
    UPDATE --> AUTH_MW
    DASHBOARD --> AUTH_MW
    SETTINGS --> AUTH_MW
    
    LOGOUT --> OPT_MW
    
    PROFILE --> AUTH_MW
    PROFILE --> VERIFY_MW
    PREMIUM --> AUTH_MW
    PREMIUM --> VERIFY_MW
    ADMIN --> AUTH_MW
    ADMIN --> VERIFY_MW
    
    style REG fill:#4caf50
    style LOGIN fill:#4caf50
    style ME fill:#ff9800
    style PROFILE fill:#f44336
    style AUTH_MW fill:#2196f3
    style VERIFY_MW fill:#9c27b0
```

## 🔧 Backend Service Architecture

```mermaid
graph TB
    subgraph "Controllers Layer"
        AUTH_CTRL[auth.controller.js]
        VERIFY_CTRL[verifyOtp.js]
    end
    
    subgraph "Services Layer"
        AUTH_SVC[auth.service.js]
    end
    
    subgraph "DAO Layer"
        USER_DAO[user.dao.js]
    end
    
    subgraph "Models Layer"
        USER_MODEL[user.model.js]
    end
    
    subgraph "Utils Layer"
        JWT_UTIL[jwtToken.js]
        HASH_UTIL[hashPassword.js]
        OTP_UTIL[otp.js]
        EMAIL_UTIL[sendEmail.js]
        ASYNC_UTIL[asyncHandler.js]
    end
    
    subgraph "Middleware Layer"
        AUTH_MW[auth.middleware.js]
    end
    
    subgraph "Config Layer"
        DB_CONFIG[connectDB.js]
        REDIS_CONFIG[redisClient.js]
        ENV_CONFIG[env.js]
    end
    
    AUTH_CTRL --> AUTH_SVC
    AUTH_CTRL --> USER_DAO
    AUTH_CTRL --> OTP_UTIL
    
    AUTH_SVC --> USER_DAO
    AUTH_SVC --> HASH_UTIL
    AUTH_SVC --> JWT_UTIL
    AUTH_SVC --> OTP_UTIL
    AUTH_SVC --> EMAIL_UTIL
    
    USER_DAO --> USER_MODEL
    
    AUTH_MW --> JWT_UTIL
    AUTH_MW --> USER_DAO
    
    OTP_UTIL --> REDIS_CONFIG
    USER_MODEL --> DB_CONFIG
    
    style AUTH_CTRL fill:#ff6b6b
    style AUTH_SVC fill:#4ecdc4
    style USER_DAO fill:#45b7d1
    style USER_MODEL fill:#96ceb4
    style AUTH_MW fill:#feca57
```

## 📱 User Journey Flow

```mermaid
journey
    title User Authentication Journey
    section Registration
      Visit site: 5: User
      Click register: 4: User
      Fill form: 3: User
      Submit: 4: User
      Receive email: 5: User
      Enter OTP: 4: User
      Access dashboard: 5: User
    
    section Login (Returning User)
      Visit site: 5: User
      Auto-redirect if token valid: 5: System
      Or click login: 4: User
      Enter credentials: 3: User
      Receive OTP email: 4: User
      Enter OTP: 4: User
      Access dashboard: 5: User
    
    section Protected Access
      Navigate to protected page: 5: User
      Auto token validation: 5: System
      Instant access: 5: User
      Or redirect to login: 2: System
```

## 🔄 Data Flow Architecture

```mermaid
flowchart TD
    subgraph "Frontend"
        UI[User Interface]
        HOOKS[Custom Hooks]
        REDUX[Redux Store]
        AXIOS[Axios Instance]
    end
    
    subgraph "Backend"
        ROUTES[Express Routes]
        MIDDLEWARE[Auth Middleware]
        CONTROLLERS[Controllers]
        SERVICES[Services]
        DAO[Data Access]
    end
    
    subgraph "Data Storage"
        MONGO[(MongoDB)]
        REDIS[(Redis)]
    end
    
    UI --> HOOKS
    HOOKS --> REDUX
    REDUX --> AXIOS
    AXIOS -->|HTTP/Cookies| ROUTES
    
    ROUTES --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> DAO
    DAO --> MONGO
    SERVICES --> REDIS
    
    MONGO --> DAO
    REDIS --> SERVICES
    DAO --> SERVICES
    SERVICES --> CONTROLLERS
    CONTROLLERS --> ROUTES
    ROUTES -->|JSON Response| AXIOS
    
    style UI fill:#61dafb
    style REDUX fill:#764abc
    style ROUTES fill:#68a063
    style MONGO fill:#4db33d
    style REDIS fill:#dc382d
```

This comprehensive set of diagrams provides visual documentation for all major aspects of your IP Getter project architecture, from high-level system design to detailed component interactions.
