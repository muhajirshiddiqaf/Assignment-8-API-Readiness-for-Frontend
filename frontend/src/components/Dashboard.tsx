import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, logout, successMessage, clearSuccessMessage } = useAuth();
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // Tampilkan pesan sukses login hanya saat successMessage ada
  useEffect(() => {
    if (successMessage && successMessage.toLowerCase().includes('login')) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>Welcome to Todo App</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </button>
      </div>

      {showLoginSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #c3e6cb',
          fontWeight: 600,
          fontSize: '1.1rem',
          textAlign: 'center',
          transition: 'opacity 0.5s',
        }}>
          {successMessage}
        </div>
      )}

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#495057', marginTop: 0 }}>User Information</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>

      <div style={{ 
        backgroundColor: '#e7f3ff', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ color: '#0056b3', marginTop: 0 }}>🎉 Authentication Successful!</h3>
        <p style={{ color: '#0056b3', marginBottom: 0 }}>
          You have successfully logged in to the Todo App. This is the protected dashboard area that only authenticated users can access.
        </p>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4 style={{ color: '#856404', marginTop: 0 }}>Next Steps:</h4>
        <ul style={{ color: '#856404', marginBottom: 0 }}>
          <li>Integrate with the Todo API endpoints</li>
          <li>Create, read, update, and delete todo lists</li>
          <li>Manage tasks within each list</li>
          <li>Add more features like task categories, due dates, etc.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard; 