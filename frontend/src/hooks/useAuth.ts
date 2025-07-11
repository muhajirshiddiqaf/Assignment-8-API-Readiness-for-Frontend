import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { AuthState, LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          // Verify token is still valid by calling profile endpoint
          try {
            await authService.getProfile();
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Token is invalid, clear auth data
            authService.logout();
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication check failed',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    console.log('Login function called with:', credentials);
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    setSuccessMessage(null);

    try {
      const response = await authService.login(credentials);
      console.log('Login response received:', response);
      
      // Store auth data first
      authService.setAuthData(response.token, response.user);
      
      // Then update state
      const newAuthState = {
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      console.log('Setting new auth state:', newAuthState);
      setAuthState(newAuthState);

      setSuccessMessage('Login successful! Welcome back!');
      console.log('Login successful, state updated');
      return response;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    setSuccessMessage(null);

    try {
      const response = await authService.register(userData);
      
      // Don't auto-login after register, just show success message
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));

      setSuccessMessage('Registration successful! Please login with your credentials.');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    setSuccessMessage('You have been logged out successfully.');
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return {
    ...authState,
    successMessage,
    login,
    register,
    logout,
    clearError,
    clearSuccessMessage,
  };
}; 