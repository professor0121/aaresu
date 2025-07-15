import asyncHandler from '../utils/asyncHandler.js';
import { registerUserService, loginUserService } from '../services/auth.service.js';
import { findUserByEmail, updateVerified } from '../dao/user.dao.js';
import { compareOTP } from '../utils/otp.js';

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
    //logic of updating user
    return req.body;
})

export const getUser = asyncHandler(async (req, res) => {
    //logic of getting user
    return req.body;
})

export const sendOtp = asyncHandler(async (req, res) => {
    //logic of sending otp
    return req.body;
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