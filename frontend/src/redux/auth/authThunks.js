// redux/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/apiInstace';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', formData);
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
      const response = await axiosInstance.post('/auth/verifyOtp', formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

// redux/auth/authThunks.js
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/me', {
        withCredentials: true,
      });
      console.log(res.data.user);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Auth failed');
    }
  }
);

// export const forgetPassword = createAsyncThunk(
//   'auth/forgetPassword',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/auth/forget-password', formData);
//       console.log("response data", response.data)
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || 'Password reset failed');
//     }
//   }
// );


// Step 1: Send OTP to email
export const forgetPassword = createAsyncThunk('auth/forgetPassword', async ({ email }) => {
  const res = await axios.post('/api/auth/forgot-password', { email });
  console.log("response data from froget pass",res.data)
  return res.data;
});


// Step 3: Reset password
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, newPassword }) => {
  const res = await axios.post('/api/auth/reset-password', { email, newPassword });
  return res.data;
});
