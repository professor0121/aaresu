import express from 'express';
const router=express.Router();
import { registerUser, loginUser, updateUser, getUser, sendOtp, verifyOtp } from '../controllers/auth.controller.js';

router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/updateUser',updateUser);
router.get('/me',getUser);
router.post('/sendOtp',sendOtp);
router.post('/verifyOtp',verifyOtp);
    

export default router;