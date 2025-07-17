// redux/auth/admin/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios/apiInstace';

export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/admin/register', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/admin/login', formData);
      console.log(response.data)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);


export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/admin/verifyOtp', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

// redux/auth/admin/authThunks.js
export const loadAdmin = createAsyncThunk(
  'auth/loadAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/admin/me', {
        withCredentials: true,
      });
      console.log(res.data.Admin);
      return res.data.Admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Auth failed');
    }
  }
);
