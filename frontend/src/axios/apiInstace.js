// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-url.com/api', // ✅ Set your base API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for token handling
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or get from Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
