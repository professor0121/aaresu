import { hashOTP } from '../utils/otp.js';
import { redisClient } from '../config/redisClient.js';

export const verifyOTP = async (key, userInputOTP) => {
  const storedHash = await redisClient.get(`otp:${key}`);
  if (!storedHash) {
    throw new Error('OTP expired or not found');
  }

  const inputHash = hashOTP(userInputOTP);
  if (storedHash !== inputHash) {
    throw new Error('Invalid OTP');
  }

  // Optional: Delete OTP after successful use
  await redisClient.del(`otp:${key}`);
  return true;
};
