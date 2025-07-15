import crypto from 'crypto';
import { redisClient } from '../config/redisClient.js';

// Generate random numeric OTP
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

// Hash OTP with SHA256
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Store hashed OTP in Redis
export const storeOTP = async (key, otp, ttl = 300) => {
  const hashed = hashOTP(otp);
  await redisClient.setEx(`otp:${key}`, ttl, hashed);
  return otp;
};

// Compare entered OTP with stored hashed OTP
export const compareOTP = async (key, enteredOtp) => {
  const storedHashedOtp = await redisClient.get(`otp:${key}`);
  if (!storedHashedOtp) return false;

  const enteredHashed = hashOTP(enteredOtp);
  return storedHashedOtp === enteredHashed;
};
