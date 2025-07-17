// src/routes/RootRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/LoginPage';
import Home from '../pages/HomePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/layout/MainLayout';
import Register from '../pages/RegisterPage';
import ForgetPassword from '../pages/ForgetPassword';

const RootRoutes = () => {
  const location = useLocation();

  const noSidebarRoutes = ['/login', '/register', '/forget-password'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div
      style={{
        backgroundImage: 'url(gradient_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {showSidebar ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* Add more protected routes here */}
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      )}
    </div>
  );
};

export default RootRoutes;
