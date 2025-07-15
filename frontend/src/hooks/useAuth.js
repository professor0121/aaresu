import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadUser } from '../redux/auth/authThunks';
import { logout } from '../redux/auth/authSlice';

/**
 * Custom hook for authentication management
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on first load
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitialized && !isAuthenticated && !user) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          console.log('No valid session found');
        }
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated, user, isInitialized]);

  // Check if user has valid token
  const checkAuth = async () => {
    try {
      await dispatch(loadUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Logout user
  const logoutUser = () => {
    dispatch(logout());
  };

  // Check if user is verified
  const isVerified = user?.verified || false;

  return {
    user,
    isAuthenticated,
    isVerified,
    loading,
    error,
    isInitialized,
    checkAuth,
    logoutUser
  };
};

/**
 * Hook specifically for protected routes
 * Returns authentication status with loading state
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  
  // Route is loading if auth is not initialized or currently loading
  const isLoading = !isInitialized || loading;
  
  // Route is protected if user is authenticated
  const isProtected = isAuthenticated;
  
  return {
    isLoading,
    isProtected,
    shouldRedirect: !isLoading && !isProtected
  };
};

/**
 * Hook for conditional rendering based on auth status
 * Useful for showing different content to authenticated vs non-authenticated users
 */
export const useAuthContent = () => {
  const { isAuthenticated, user, isVerified } = useAuth();
  
  return {
    isAuthenticated,
    isVerified,
    user,
    // Helper functions for conditional rendering
    ifAuthenticated: (content) => isAuthenticated ? content : null,
    ifNotAuthenticated: (content) => !isAuthenticated ? content : null,
    ifVerified: (content) => isVerified ? content : null,
    ifNotVerified: (content) => !isVerified ? content : null,
  };
};
