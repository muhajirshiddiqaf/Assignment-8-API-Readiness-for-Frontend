import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DebugInfo: React.FC = () => {
  const auth = useAuth();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>isAuthenticated: {auth.isAuthenticated.toString()}</div>
      <div>isLoading: {auth.isLoading.toString()}</div>
      <div>User: {auth.user ? auth.user.username : 'null'}</div>
      <div>Token: {auth.token ? 'exists' : 'null'}</div>
      <div>Error: {auth.error || 'none'}</div>
      <div>Success: {auth.successMessage || 'none'}</div>
    </div>
  );
};

export default DebugInfo; 