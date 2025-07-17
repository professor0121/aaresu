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

## 🔄 CI/CD Pipeline Architecture

```mermaid
graph TB
    subgraph "Source Control"
        GH[GitHub Repository]
        BRANCH[Feature Branch]
        PR[Pull Request]
        MAIN[Main Branch]
    end

    subgraph "CI Pipeline"
        TRIGGER[Webhook Trigger]
        LINT[ESLint & Prettier]
        TEST[Unit Tests]
        BUILD[Build Application]
        SECURITY[Security Scan]
        COVERAGE[Coverage Report]
    end

    subgraph "CD Pipeline"
        STAGING[Deploy to Staging]
        E2E[E2E Tests]
        APPROVAL[Manual Approval]
        PROD[Deploy to Production]
        MONITOR[Post-Deploy Monitoring]
    end

    subgraph "Deployment Targets"
        VERCEL[Vercel<br/>Frontend]
        RAILWAY[Railway<br/>Backend]
        ATLAS[MongoDB Atlas]
        REDIS_CLOUD[Redis Cloud]
    end

    BRANCH --> PR
    PR --> TRIGGER
    TRIGGER --> LINT
    LINT --> TEST
    TEST --> BUILD
    BUILD --> SECURITY
    SECURITY --> COVERAGE
    COVERAGE --> STAGING

    STAGING --> E2E
    E2E --> APPROVAL
    APPROVAL --> PROD
    PROD --> MONITOR

    STAGING --> VERCEL
    PROD --> VERCEL
    STAGING --> RAILWAY
    PROD --> RAILWAY

    style GH fill:#333
    style TRIGGER fill:#ff6b6b
    style PROD fill:#4caf50
    style MONITOR fill:#2196f3
```

## 🏗️ Microservices Evolution Architecture

```mermaid
graph TB
    subgraph "Current Monolithic Architecture"
        MONO[Express.js Monolith]
        MONO_DB[(MongoDB)]
        MONO_REDIS[(Redis)]
    end

    subgraph "Future Microservices Architecture"
        subgraph "API Gateway"
            GATEWAY[Kong/Nginx Gateway]
            LB[Load Balancer]
        end

        subgraph "Authentication Service"
            AUTH_SVC[Auth Service]
            AUTH_DB[(Auth Database)]
            JWT_SVC[JWT Service]
        end

        subgraph "User Management Service"
            USER_SVC[User Service]
            USER_DB[(User Database)]
            PROFILE_SVC[Profile Service]
        end

        subgraph "Notification Service"
            EMAIL_SVC[Email Service]
            SMS_SVC[SMS Service]
            PUSH_SVC[Push Notification]
        end

        subgraph "Analytics Service"
            ANALYTICS[Analytics Service]
            METRICS_DB[(Metrics Database)]
            EVENTS[Event Processing]
        end

        subgraph "Shared Services"
            CACHE[(Redis Cluster)]
            MESSAGE_QUEUE[Message Queue<br/>RabbitMQ/Kafka]
            CONFIG[Config Service]
        end
    end

    GATEWAY --> AUTH_SVC
    GATEWAY --> USER_SVC
    GATEWAY --> ANALYTICS

    AUTH_SVC --> AUTH_DB
    AUTH_SVC --> JWT_SVC
    USER_SVC --> USER_DB
    EMAIL_SVC --> MESSAGE_QUEUE

    AUTH_SVC -.-> CACHE
    USER_SVC -.-> CACHE
    ANALYTICS -.-> METRICS_DB

    style MONO fill:#ff6b6b
    style GATEWAY fill:#4ecdc4
    style AUTH_SVC fill:#45b7d1
    style MESSAGE_QUEUE fill:#f39c12
```

## 🌐 Global Deployment Architecture

```mermaid
graph TB
    subgraph "Global CDN"
        CDN[CloudFlare CDN]
        EDGE[Edge Locations]
    end

    subgraph "US East Region"
        US_LB[Load Balancer]
        US_API1[API Server 1]
        US_API2[API Server 2]
        US_DB[(Primary Database)]
        US_REDIS[(Redis Primary)]
    end

    subgraph "EU West Region"
        EU_LB[Load Balancer]
        EU_API1[API Server 1]
        EU_API2[API Server 2]
        EU_DB[(Read Replica)]
        EU_REDIS[(Redis Replica)]
    end

    subgraph "Asia Pacific Region"
        AP_LB[Load Balancer]
        AP_API1[API Server 1]
        AP_API2[API Server 2]
        AP_DB[(Read Replica)]
        AP_REDIS[(Redis Replica)]
    end

    subgraph "Monitoring & Management"
        MONITORING[Global Monitoring]
        LOGGING[Centralized Logging]
        ALERTING[Global Alerting]
    end

    CDN --> EDGE
    EDGE --> US_LB
    EDGE --> EU_LB
    EDGE --> AP_LB

    US_LB --> US_API1
    US_LB --> US_API2
    EU_LB --> EU_API1
    EU_LB --> EU_API2
    AP_LB --> AP_API1
    AP_LB --> AP_API2

    US_API1 --> US_DB
    US_API2 --> US_DB
    EU_API1 --> EU_DB
    EU_API2 --> EU_DB
    AP_API1 --> AP_DB
    AP_API2 --> AP_DB

    US_DB -.-> EU_DB
    US_DB -.-> AP_DB
    US_REDIS -.-> EU_REDIS
    US_REDIS -.-> AP_REDIS

    US_API1 --> MONITORING
    EU_API1 --> MONITORING
    AP_API1 --> MONITORING

    style CDN fill:#ff6b6b
    style US_DB fill:#4caf50
    style EU_DB fill:#ff9800
    style AP_DB fill:#ff9800
    style MONITORING fill:#9c27b0
```

## 🔒 Zero-Trust Security Architecture

```mermaid
graph TB
    subgraph "External Layer"
        USER[Users]
        INTERNET[Internet]
        ATTACKS[Potential Attacks]
    end

    subgraph "Edge Security"
        WAF[Web Application Firewall]
        DDOS[DDoS Protection]
        CDN_SEC[CDN Security]
    end

    subgraph "Network Security"
        VPC[Virtual Private Cloud]
        SUBNETS[Private Subnets]
        NAT[NAT Gateway]
        VPN[VPN Gateway]
    end

    subgraph "Application Security"
        API_GW[API Gateway]
        RATE_LIMIT[Rate Limiting]
        AUTH_PROXY[Auth Proxy]
        ENCRYPTION[End-to-End Encryption]
    end

    subgraph "Identity & Access"
        IAM[Identity Management]
        MFA[Multi-Factor Auth]
        RBAC[Role-Based Access]
        AUDIT[Audit Logging]
    end

    subgraph "Data Security"
        ENCRYPT_REST[Encryption at Rest]
        ENCRYPT_TRANSIT[Encryption in Transit]
        KEY_MGMT[Key Management]
        BACKUP_ENC[Encrypted Backups]
    end

    subgraph "Monitoring & Response"
        SIEM[Security Information<br/>Event Management]
        THREAT_DETECT[Threat Detection]
        INCIDENT_RESP[Incident Response]
        FORENSICS[Digital Forensics]
    end

    USER --> WAF
    INTERNET --> DDOS
    ATTACKS --> WAF

    WAF --> API_GW
    DDOS --> CDN_SEC
    CDN_SEC --> VPC

    API_GW --> RATE_LIMIT
    RATE_LIMIT --> AUTH_PROXY
    AUTH_PROXY --> IAM

    IAM --> MFA
    MFA --> RBAC
    RBAC --> AUDIT

    ENCRYPTION --> ENCRYPT_REST
    ENCRYPTION --> ENCRYPT_TRANSIT
    ENCRYPT_REST --> KEY_MGMT

    AUDIT --> SIEM
    SIEM --> THREAT_DETECT
    THREAT_DETECT --> INCIDENT_RESP

    style ATTACKS fill:#e74c3c
    style WAF fill:#f39c12
    style IAM fill:#3498db
    style SIEM fill:#9b59b6
```

## 📊 Data Flow & Analytics Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        APP_LOGS[Application Logs]
        USER_EVENTS[User Events]
        API_METRICS[API Metrics]
        DB_METRICS[Database Metrics]
        SYSTEM_METRICS[System Metrics]
    end

    subgraph "Data Collection"
        LOG_AGENTS[Log Agents]
        METRICS_AGENTS[Metrics Agents]
        EVENT_COLLECTORS[Event Collectors]
    end

    subgraph "Data Pipeline"
        KAFKA[Apache Kafka]
        STREAM_PROC[Stream Processing<br/>Apache Flink]
        BATCH_PROC[Batch Processing<br/>Apache Spark]
    end

    subgraph "Data Storage"
        DATA_LAKE[Data Lake<br/>S3/GCS]
        DATA_WAREHOUSE[Data Warehouse<br/>BigQuery/Redshift]
        TIME_SERIES[Time Series DB<br/>InfluxDB]
        SEARCH_ENGINE[Search Engine<br/>Elasticsearch]
    end

    subgraph "Analytics & ML"
        ANALYTICS_ENGINE[Analytics Engine]
        ML_PIPELINE[ML Pipeline]
        FEATURE_STORE[Feature Store]
        MODEL_SERVING[Model Serving]
    end

    subgraph "Visualization & Alerts"
        DASHBOARDS[Grafana Dashboards]
        BI_TOOLS[Business Intelligence]
        ALERTING[Alert Manager]
        REPORTS[Automated Reports]
    end

    APP_LOGS --> LOG_AGENTS
    USER_EVENTS --> EVENT_COLLECTORS
    API_METRICS --> METRICS_AGENTS

    LOG_AGENTS --> KAFKA
    EVENT_COLLECTORS --> KAFKA
    METRICS_AGENTS --> KAFKA

    KAFKA --> STREAM_PROC
    KAFKA --> BATCH_PROC

    STREAM_PROC --> TIME_SERIES
    BATCH_PROC --> DATA_WAREHOUSE
    STREAM_PROC --> SEARCH_ENGINE
    BATCH_PROC --> DATA_LAKE

    DATA_WAREHOUSE --> ANALYTICS_ENGINE
    DATA_LAKE --> ML_PIPELINE
    TIME_SERIES --> DASHBOARDS

    ML_PIPELINE --> FEATURE_STORE
    FEATURE_STORE --> MODEL_SERVING

    ANALYTICS_ENGINE --> BI_TOOLS
    TIME_SERIES --> ALERTING

    style KAFKA fill:#ff6b6b
    style DATA_LAKE fill:#4ecdc4
    style ML_PIPELINE fill:#f39c12
    style DASHBOARDS fill:#3498db
```

This comprehensive set of diagrams provides visual documentation for all major aspects of your IP Getter project architecture, from high-level system design to detailed component interactions, including future scalability considerations and advanced deployment patterns.
