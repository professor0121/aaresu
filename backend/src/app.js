import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import { connectRedis } from './config/redisClient.js';
import requestLogger from './middlewares/requestLogger.js';
import { arcjetMiddleware } from './middlewares/arcJet.js';

const app=express();
connectRedis();


app.use(cors(
    {
        origin: ['http://localhost:5173','http://localhost:3000'],
        credentials: true,
    }
))

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(arcjetMiddleware);

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/protected',protectedRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date()
    });
});

export default app;

