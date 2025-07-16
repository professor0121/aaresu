import express from 'express';
const router=express.Router();
import { registerUser, loginUser, updateUser, getUser, sendOtp, verifyOtp, logoutUser,forgetUserPassword } from '../controllers/auth.controller.js';
import { authenticateToken, requireVerified, optionalAuth } from '../middlewares/auth.middleware.js';

// Public routes (no authentication required)
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verifyOtp',verifyOtp);

// Protected routes (authentication required)
router.put('/updateUser', authenticateToken, updateUser);
router.get('/me', authenticateToken, getUser);

// Protected routes that also require email verification
router.get('/profile', authenticateToken, requireVerified, getUser);

// Logout route (optional auth - works with or without token)
router.post('/logout', optionalAuth, logoutUser);

router.post('/forget-password',authenticateToken,forgetUserPassword)

export default router;