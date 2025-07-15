import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;