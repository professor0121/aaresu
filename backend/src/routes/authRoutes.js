import express from 'express';
const router=express.Router();
import { registerUser, loginUser, updateUser, getUser, sendOtp, verifyOtp } from '../controllers/auth.controller.js';

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verifyOtp',verifyOtp);

router.put('/updateUser',updateUser);
router.get('/me',getUser);
    

export default router;