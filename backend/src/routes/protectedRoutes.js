import express from 'express';
import { authenticateToken, requireVerified, optionalAuth } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Example protected route - requires authentication
router.get('/dashboard', authenticateToken, asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to your dashboard!',
        user: req.user,
        data: {
            lastLogin: new Date(),
            features: ['feature1', 'feature2', 'feature3']
        }
    });
}));

// Example protected route - requires authentication AND email verification
router.get('/premium-content', authenticateToken, requireVerified, asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to premium content!',
        user: req.user,
        premiumData: {
            content: 'This is premium content only for verified users',
            accessLevel: 'premium'
        }
    });
}));

// Example route with optional authentication
router.get('/public-content', optionalAuth, asyncHandler(async (req, res) => {
    const response = {
        success: true,
        message: 'Public content accessible to everyone',
        publicData: {
            content: 'This content is available to all users',
            timestamp: new Date()
        }
    };

    // Add user-specific data if authenticated
    if (req.user) {
        response.userSpecificData = {
            personalizedMessage: `Hello ${req.user.username}!`,
            recommendations: ['item1', 'item2', 'item3']
        };
    }

    res.status(200).json(response);
}));

// Example route for user settings - requires authentication
router.put('/settings', authenticateToken, asyncHandler(async (req, res) => {
    const { theme, notifications, privacy } = req.body;
    
    // Here you would update user settings in the database
    res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        user: req.user,
        updatedSettings: {
            theme,
            notifications,
            privacy,
            updatedAt: new Date()
        }
    });
}));

// Example route for admin actions - requires authentication and verification
router.get('/admin/users', authenticateToken, requireVerified, asyncHandler(async (req, res) => {
    // In a real app, you'd also check if user has admin role
    res.status(200).json({
        success: true,
        message: 'Admin access granted',
        adminData: {
            totalUsers: 150,
            activeUsers: 120,
            pendingVerifications: 30
        }
    });
}));

export default router;
