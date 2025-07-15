import express from 'express';
import cookieParser from 'cookie-parser';
const app=express();
import authRoutes from './routes/authRoutes.js';
import { connectRedis } from './config/redisClient.js';

connectRedis();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);

export default app;

