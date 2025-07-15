import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app=express();
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import { connectRedis } from './config/redisClient.js';

connectRedis();
app.use(cors(
    {
        origin: ['http://localhost:5173','http://localhost:3000'],
        credentials: true,
    }
))
app.use(express.json());
app.use(cookieParser());

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

