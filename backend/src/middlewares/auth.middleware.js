import { verifyToken } from '../utils/jwtToken.js';
import { findUserByEmail } from '../dao/user.dao.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware to protect routes by verifying JWT token from cookies
 * Adds user information to req.user if token is valid
 */
export const authenticateToken = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Find user by email from token
    const user = await findUserByEmail(decoded.email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Add user to request object (excluding password)
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      bio: user.bio
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
});

/**
 * Middleware to check if user is verified
 * Should be used after authenticateToken middleware
 */
export const requireVerified = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email to access this resource.'
    });
  }

  next();
});

/**
 * Optional middleware - continues even if no token is provided
 * Useful for routes that work for both authenticated and non-authenticated users
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (token) {
      const decoded = verifyToken(token);
      
      if (decoded && decoded.email) {
        const user = await findUserByEmail(decoded.email);
        
        if (user) {
          req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            verified: user.verified,
            bio: user.bio
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    console.log('Optional auth failed:', error.message);
    next();
  }
});
