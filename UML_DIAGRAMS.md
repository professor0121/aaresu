# 🎯 UML Diagrams & Technical Architecture

## 📋 Class Diagram - Backend Architecture

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String username
        +String email
        +String password
        +String bio
        +Boolean verified
        +Date createdAt
        +Date updatedAt
        +save()
        +findById()
        +findByEmail()
        +updateVerified()
    }
    
    class AuthController {
        +registerUser(req, res)
        +loginUser(req, res)
        +updateUser(req, res)
        +getUser(req, res)
        +verifyOtp(req, res)
        +logoutUser(req, res)
    }
    
    class AuthService {
        +registerUserService(username, email, password)
        +loginUserService(email, password)
        -hashPassword(password)
        -generateToken(email)
        -generateOTP()
        -sendVerificationEmail(email, otp)
    }
    
    class UserDAO {
        +createUser(userData)
        +findUserByEmail(email)
        +updateVerified(email)
        +findUserById(id)
    }
    
    class AuthMiddleware {
        +authenticateToken(req, res, next)
        +requireVerified(req, res, next)
        +optionalAuth(req, res, next)
        -verifyToken(token)
        -extractUserFromToken(token)
    }
    
    class JWTUtil {
        +generateToken(email)
        +verifyToken(token)
        -createSignature(payload)
        -validateSignature(token)
    }
    
    class OTPUtil {
        +generateOTP(length)
        +hashOTP(otp)
        +storeOTP(key, otp, ttl)
        +compareOTP(key, enteredOtp)
    }
    
    class EmailUtil {
        +sendVerificationOtp(to, otp)
        -createTransporter()
        -formatEmailTemplate(otp)
    }
    
    class RedisClient {
        +connect()
        +setEx(key, ttl, value)
        +get(key)
        +del(key)
    }
    
    class DatabaseConnection {
        +connectDB()
        +disconnect()
        -handleConnectionError()
    }
    
    AuthController --> AuthService
    AuthController --> UserDAO
    AuthController --> OTPUtil
    AuthService --> UserDAO
    AuthService --> JWTUtil
    AuthService --> OTPUtil
    AuthService --> EmailUtil
    UserDAO --> User
    AuthMiddleware --> JWTUtil
    AuthMiddleware --> UserDAO
    OTPUtil --> RedisClient
    User --> DatabaseConnection
```

## 🎨 Component Diagram - Frontend Architecture

```mermaid
classDiagram
    class App {
        +useEffect()
        +render()
        -initializeAuth()
    }
    
    class ProtectedRoute {
        +children: ReactNode
        +useProtectedRoute()
        +render()
        -checkAuthentication()
        -showLoadingSpinner()
        -redirectToLogin()
    }
    
    class AuthSlice {
        +initialState: AuthState
        +reducers: Object
        +extraReducers: Object
        +logout()
        -handlePending()
        -handleFulfilled()
        -handleRejected()
    }
    
    class AuthThunks {
        +registerUser(formData)
        +loginUser(formData)
        +verifyOtp(formData)
        +loadUser()
        -handleApiCall()
        -handleError()
    }
    
    class useAuth {
        +user: User
        +isAuthenticated: boolean
        +loading: boolean
        +checkAuth()
        +logoutUser()
        -initializeAuth()
    }
    
    class useProtectedRoute {
        +isLoading: boolean
        +isProtected: boolean
        +shouldRedirect: boolean
        -validateRoute()
    }
    
    class useAuthContent {
        +isAuthenticated: boolean
        +user: User
        +ifAuthenticated(content)
        +ifNotAuthenticated(content)
        +ifVerified(content)
    }
    
    class Header {
        +isMobileMenuOpen: boolean
        +toggleMobileMenu()
        +render()
        -renderAuthSection()
        -renderNavigation()
    }
    
    class AuthSection {
        +isMobile: boolean
        +useAuthContent()
        +render()
        -renderUserInfo()
        -renderAuthButtons()
    }
    
    class LogoutButton {
        +className: string
        +children: ReactNode
        +handleLogout()
        -clearCookies()
        -updateReduxState()
    }
    
    class AxiosInstance {
        +baseURL: string
        +withCredentials: boolean
        +interceptors: Object
        +get(url, config)
        +post(url, data, config)
        -handleRequest()
        -handleResponse()
        -handleError()
    }
    
    App --> ProtectedRoute
    App --> Header
    ProtectedRoute --> useProtectedRoute
    Header --> AuthSection
    AuthSection --> useAuthContent
    AuthSection --> LogoutButton
    useAuth --> AuthSlice
    useAuth --> AuthThunks
    useProtectedRoute --> useAuth
    useAuthContent --> useAuth
    AuthThunks --> AxiosInstance
    LogoutButton --> AxiosInstance
```

## 🔄 Sequence Diagram - Complete Authentication Flow

```mermaid
sequenceDiagram
    participant Browser as Browser
    participant React as React App
    participant Redux as Redux Store
    participant API as Express API
    participant Middleware as Auth Middleware
    participant Service as Auth Service
    participant DAO as User DAO
    participant DB as MongoDB
    participant Redis as Redis Cache
    participant Email as Email Service
    
    Note over Browser,Email: User Registration Process
    
    Browser->>React: User fills registration form
    React->>Redux: dispatch(registerUser)
    Redux->>API: POST /api/auth/register
    API->>Service: registerUserService()
    Service->>DAO: findUserByEmail()
    DAO->>DB: Query user by email
    DB-->>DAO: User not found
    DAO-->>Service: null
    Service->>Service: hashPassword()
    Service->>DAO: createUser()
    DAO->>DB: Insert new user
    DB-->>DAO: User created
    Service->>Service: generateToken()
    Service->>Service: generateOTP()
    Service->>Redis: storeOTP()
    Service->>Email: sendVerificationOtp()
    Service-->>API: {user, token}
    API->>API: Set JWT cookie
    API-->>Redux: Success response
    Redux-->>React: Update auth state
    React-->>Browser: Show OTP verification
    
    Note over Browser,Email: OTP Verification Process
    
    Browser->>React: User enters OTP
    React->>Redux: dispatch(verifyOtp)
    Redux->>API: POST /api/auth/verifyOtp
    API->>Redis: compareOTP()
    Redis-->>API: OTP valid
    API->>DAO: updateVerified()
    DAO->>DB: Update user.verified = true
    DB-->>DAO: User updated
    API-->>Redux: Success response
    Redux-->>React: Set isAuthenticated = true
    React-->>Browser: Redirect to dashboard
    
    Note over Browser,Email: Protected Route Access
    
    Browser->>React: Navigate to protected route
    React->>React: ProtectedRoute component
    React->>Redux: Check isAuthenticated
    Redux-->>React: false
    React->>Redux: dispatch(loadUser)
    Redux->>API: GET /api/auth/me (with cookies)
    API->>Middleware: authenticateToken()
    Middleware->>Middleware: verifyToken()
    Middleware->>DAO: findUserByEmail()
    DAO->>DB: Query user
    DB-->>DAO: User found
    DAO-->>Middleware: User data
    Middleware->>API: req.user = userData
    API-->>Redux: User data
    Redux-->>React: Update auth state
    React-->>Browser: Render protected content
```

## 🏗️ Deployment Diagram

```mermaid
deployment
    node "Client Browser" {
        component "React App" as ReactApp
        component "Redux Store" as ReduxStore
        artifact "JWT Cookie" as Cookie
    }
    
    node "CDN/Static Hosting" {
        component "Vite Build" as ViteBuild
        artifact "Static Assets" as Assets
    }
    
    node "API Server" {
        component "Express.js" as Express
        component "Auth Middleware" as AuthMW
        component "Controllers" as Controllers
        component "Services" as Services
    }
    
    node "Database Server" {
        database "MongoDB" as MongoDB
        database "Redis Cache" as Redis
    }
    
    node "Email Service" {
        component "Gmail SMTP" as SMTP
    }
    
    node "Monitoring" {
        component "Health Checks" as Health
        component "Error Logging" as Logging
    }
    
    ReactApp --> ViteBuild : "Build Process"
    ReactApp --> Express : "HTTPS/API Calls"
    Cookie --> Express : "Authentication"
    
    Express --> AuthMW : "Request Processing"
    AuthMW --> Controllers : "Authorized Requests"
    Controllers --> Services : "Business Logic"
    
    Services --> MongoDB : "User Data"
    Services --> Redis : "OTP Storage"
    Services --> SMTP : "Email Notifications"
    
    Express --> Health : "Status Monitoring"
    Express --> Logging : "Error Tracking"
```

## 📊 Activity Diagram - User Authentication Journey

```mermaid
flowchart TD
    Start([User Visits Site]) --> CheckToken{Valid JWT Cookie?}
    
    CheckToken -->|Yes| ValidateToken[Validate Token with Backend]
    CheckToken -->|No| ShowLogin[Show Login Page]
    
    ValidateToken --> TokenValid{Token Valid?}
    TokenValid -->|Yes| LoadDashboard[Load Dashboard]
    TokenValid -->|No| ShowLogin
    
    ShowLogin --> UserChoice{User Action}
    UserChoice -->|Login| LoginForm[Fill Login Form]
    UserChoice -->|Register| RegisterForm[Fill Registration Form]
    
    LoginForm --> SubmitLogin[Submit Credentials]
    RegisterForm --> SubmitRegister[Submit Registration]
    
    SubmitLogin --> ValidateLogin{Credentials Valid?}
    ValidateLogin -->|No| LoginError[Show Error Message]
    ValidateLogin -->|Yes| SendLoginOTP[Send OTP Email]
    
    SubmitRegister --> CheckUserExists{User Exists?}
    CheckUserExists -->|Yes| RegisterError[Show Error Message]
    CheckUserExists -->|No| CreateUser[Create User Account]
    
    CreateUser --> SendRegisterOTP[Send OTP Email]
    
    SendLoginOTP --> ShowOTPForm[Show OTP Verification]
    SendRegisterOTP --> ShowOTPForm
    
    ShowOTPForm --> EnterOTP[User Enters OTP]
    EnterOTP --> ValidateOTP{OTP Valid?}
    
    ValidateOTP -->|No| OTPError[Show OTP Error]
    ValidateOTP -->|Yes| SetVerified[Mark User as Verified]
    
    SetVerified --> SetCookie[Set JWT Cookie]
    SetCookie --> LoadDashboard
    
    LoadDashboard --> End([Dashboard Loaded])
    
    LoginError --> ShowLogin
    RegisterError --> ShowLogin
    OTPError --> ShowOTPForm
    
    style Start fill:#4caf50
    style End fill:#4caf50
    style LoadDashboard fill:#2196f3
    style LoginError fill:#f44336
    style RegisterError fill:#f44336
    style OTPError fill:#f44336
```

## 🔐 Security Architecture Diagram

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS[HTTPS Encryption]
        CSP[Content Security Policy]
        CORS_CLIENT[CORS Headers]
    end
    
    subgraph "Transport Security"
        TLS[TLS 1.3]
        CERT[SSL Certificate]
    end
    
    subgraph "Application Security"
        JWT[JWT Tokens]
        COOKIES[HTTP-Only Cookies]
        BCRYPT[Password Hashing]
        OTP[OTP Verification]
    end
    
    subgraph "API Security"
        AUTH_MW[Authentication Middleware]
        RATE_LIMIT[Rate Limiting]
        INPUT_VAL[Input Validation]
        ERROR_HANDLE[Error Handling]
    end
    
    subgraph "Data Security"
        DB_AUTH[Database Authentication]
        REDIS_AUTH[Redis Authentication]
        ENV_VARS[Environment Variables]
    end
    
    subgraph "Infrastructure Security"
        FIREWALL[Firewall Rules]
        VPC[Virtual Private Cloud]
        BACKUP[Encrypted Backups]
    end
    
    HTTPS --> TLS
    TLS --> CERT
    
    COOKIES --> JWT
    JWT --> AUTH_MW
    BCRYPT --> OTP
    
    AUTH_MW --> RATE_LIMIT
    RATE_LIMIT --> INPUT_VAL
    INPUT_VAL --> ERROR_HANDLE
    
    ERROR_HANDLE --> DB_AUTH
    DB_AUTH --> REDIS_AUTH
    REDIS_AUTH --> ENV_VARS
    
    ENV_VARS --> FIREWALL
    FIREWALL --> VPC
    VPC --> BACKUP
    
    style HTTPS fill:#4caf50
    style JWT fill:#ff9800
    style AUTH_MW fill:#2196f3
    style DB_AUTH fill:#9c27b0
    style FIREWALL fill:#f44336
```

## 📈 Performance Architecture

```mermaid
graph LR
    subgraph "Frontend Performance"
        LAZY[Lazy Loading]
        MEMO[React.memo]
        BUNDLE[Code Splitting]
        CACHE_FE[Browser Caching]
    end
    
    subgraph "API Performance"
        ASYNC[Async/Await]
        POOL[Connection Pooling]
        CACHE_API[Response Caching]
        COMPRESS[Gzip Compression]
    end
    
    subgraph "Database Performance"
        INDEX[Database Indexes]
        AGGREGATE[Aggregation Pipeline]
        CACHE_DB[Query Caching]
        REPLICA[Read Replicas]
    end
    
    subgraph "Infrastructure Performance"
        CDN[Content Delivery Network]
        LOAD_BAL[Load Balancer]
        AUTO_SCALE[Auto Scaling]
        MONITOR[Performance Monitoring]
    end
    
    LAZY --> ASYNC
    MEMO --> POOL
    BUNDLE --> CACHE_API
    CACHE_FE --> COMPRESS
    
    ASYNC --> INDEX
    POOL --> AGGREGATE
    CACHE_API --> CACHE_DB
    COMPRESS --> REPLICA
    
    INDEX --> CDN
    AGGREGATE --> LOAD_BAL
    CACHE_DB --> AUTO_SCALE
    REPLICA --> MONITOR
    
    style LAZY fill:#61dafb
    style ASYNC fill:#68a063
    style INDEX fill:#4db33d
    style CDN fill:#ff6b6b
```

These UML diagrams provide comprehensive technical documentation covering class structures, component relationships, sequence flows, deployment architecture, security measures, and performance considerations for your IP Getter project.
