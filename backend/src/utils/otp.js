import crypto from 'crypto';
import { redisClient } from '../config/redisClient.js';

export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const storeOTP = async (key, otp, ttl = 300) => { // ttl in seconds
  const hashed = hashOTP(otp);
  await redisClient.setEx(`otp:${key}`, ttl, hashed);
  return otp;
};
