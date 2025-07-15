import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app=express();
import authRoutes from './routes/authRoutes.js';
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
app.use('/api/auth',authRoutes);

export default app;

