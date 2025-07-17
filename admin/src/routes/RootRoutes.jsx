// src/routes/RootRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';
import ForgetPassword from '../pages/ForgetPassword';
import Dashboard from '../pages/Dashboard';

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

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>

    </div>
  );
};

export default RootRoutes;
