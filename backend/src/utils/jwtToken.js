import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateToken = (email) => {
  const token = jwt.sign({ email }, ENV.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);
  return decoded;
};
