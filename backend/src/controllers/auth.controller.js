import asyncHandler from '../utils/asyncHandler.js';
import { registerUserService, loginUserService} from '../services/auth.service.js';
import { findUserByEmail, updateVerified, updateUserById } from '../dao/user.dao.js';
import { compareOTP, generateOTP, storeOTP } from '../utils/otp.js';
import { sendVerificationOtp, sendPasswordResetOtp } from '../utils/sendEmail.js';
import { hashPassword } from '../utils/hashPassword.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    const user = await findUserByEmail(email);
    if (user) {
        return res.status(400).json({
            message: 'User already exists',
        });
    }
    const newUser = await registerUserService(username, email, password);
    res.cookie('token', newUser.token, { httpOnly: true });//httpOnly is used to prevent XSS attacks.
    res.status(201).json({
        message: 'User created successfully',
        newUser,
    });

});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUserService(email, password);
    res.cookie('token', user.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true in production with HTTPS
    });
    res.status(200).json({ message: 'Logged in', user });

})

export const updateUser = asyncHandler(async (req, res) => {
    // User is available in req.user from authenticateToken middleware
    const { username, bio } = req.body;
    const userId = req.user.id;

    try {
        // Here you would implement the actual update logic
        // For now, returning user info with success message
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: req.user,
            updateData: { username, bio }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
})

export const getUser = asyncHandler(async (req, res) => {
    // User is available in req.user from authenticateToken middleware
    const {email}=req.user;
    const user = await findUserByEmail(email);
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        user
    });
})

export const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
        });
    }
    const match = await compareOTP(email, otp);
    if (!match) {
        return res.status(400).json({
            message: 'Invalid OTP',
        });
    }
    await updateVerified(email);
    res.status(200).json({
        message: 'OTP verified successfully',
    });

})

export const logoutUser = asyncHandler(async (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true in production with HTTPS
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
})

// Forgot Password - Step 1: Send OTP to email for password reset
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found with this email address'
        });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 600); // 10 minutes expiry for password reset

    // Send OTP via email
    await sendPasswordResetOtp(email, otp);

    res.status(200).json({
        success: true,
        message: 'Password reset OTP sent to your email'
    });
});

// Reset Password - Step 3: Update password after OTP verification
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found with this email address'
        });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    await updateUserById(user._id, { password: hashedPassword });

    res.status(200).json({
        success: true,
        message: 'Password reset successfully'
    });
});

