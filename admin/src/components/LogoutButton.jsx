import React from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../axios/apiInstace';

const LogoutButton = ({ className = '', children }) => {
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await axiosInstance.post('/auth/logout');
      console.log('Logout successful');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Clear Redux state regardless of backend response
      logoutUser();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${className}`}
    >
      {children || 'Logout'}
    </button>
  );
};

export default LogoutButton;
