import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user has authentication token
  const accessToken = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');

  // If no token or user data, redirect to login
  if (!accessToken || !user) {
    return <Navigate to="/" replace />;
  }

  // If token and user exist, render the protected component
  return children;
};

export default ProtectedRoute;
