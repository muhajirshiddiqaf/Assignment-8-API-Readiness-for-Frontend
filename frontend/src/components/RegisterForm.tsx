import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const { register, isLoading, error, successMessage, clearError, clearSuccessMessage } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    clearSuccessMessage();
    setValidationError('');
  }, [clearError, clearSuccessMessage]);

  // Auto-navigate to login after successful registration
  useEffect(() => {
    if (successMessage && successMessage.includes('Registration successful')) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds before switching to login
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (successMessage) clearSuccessMessage();
    if (validationError) setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) return;
    if (!validateForm()) return;
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      // Registration successful - will auto-navigate to login after 2 seconds
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        {error && (
          <div className="error-message">{error}</div>
        )}
        {validationError && (
          <div className="error-message">{validationError}</div>
        )}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            {successMessage.includes('Registration successful') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                Redirecting to login page...
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="form-button"
            disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? (
              <>
                <span className="loading"></span>
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 