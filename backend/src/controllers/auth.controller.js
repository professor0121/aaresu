import asyncHandler from '../utils/asyncHandler.js';
import { createUserService } from '../services/auth.service.js';

export const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    const user=await createUserService(username,email,password);
    res.status(201).json({
        message:'User created successfully',
        user:user
    });
})

export const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    
    return req.body;
})

export const updateUser=asyncHandler(async(req,res)=>{
    //logic of updating user
    return req.body;
})

export const getUser=asyncHandler(async(req,res)=>{
    //logic of getting user
    return req.body;
})

export const sendOtp=asyncHandler(async(req,res)=>{
    //logic of sending otp
    return req.body;
})

export const verifyOtp=asyncHandler(async(req,res)=>{
    //logic of verifying otp
    return req.body;
})