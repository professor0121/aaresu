import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    updateUser,
    getUser,
    verifyOtp,
    logoutUser,
    forgotPassword,
    resetPassword,
    registerAdmin,
    getAdmin,
    loginAdmin
} from '../controllers/auth.controller.js';
import {
    authenticateToken,
    requireVerified,
    optionalAuth
} from '../middlewares/auth.middleware.js';

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyOtp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (authentication required)
router.put('/updateUser', authenticateToken, updateUser);
router.get('/me', authenticateToken, getUser);

// Protected routes that also require email verification
router.get('/profile', authenticateToken, requireVerified, getUser);

// Logout route (optional auth - works with or without token)
router.post('/logout', optionalAuth, logoutUser);


//Admin auth routes for validations...

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/verifyOtp', verifyOtp);
router.get('/admin/me', authenticateToken, getAdmin);

export default router;