import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin, registerAdmin, verifyOtp, loadAdmin } from './authThunks';

const initialState = {
  admin: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerAdmin.fulfilled, (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.loading = false;
      state.isAuthenticated = false; // OTP pending
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(registerAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // LOGIN
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.loading = false;
      state.isAuthenticated = false; // OTP pending
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // VERIFY OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // LOAD Admin
    builder.addCase(loadAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAdmin.fulfilled, (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(loadAdmin.rejected, (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.loading = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
