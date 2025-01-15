import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const { user } = useAuth();

  // If user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = () => {
    // Redirects to backend auth/google route
    const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
    console.log('Attempting to redirect to:', loginUrl);
    window.location.href = loginUrl;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Habit Tracker</h1>
        <p>Track your daily habits and build consistency</p>
        <button 
          className="google-login-btn"
          onClick={handleGoogleLogin}
        >
          <img 
            src="/google-icon.svg" 
            alt="Google" 
            className="google-icon"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login; 