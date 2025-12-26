import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { showNotification } from './NotificationCenter';

const RequireAuth = ({ children, message = 'Vui lòng đăng nhập để sử dụng tính năng này' }) => {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    // Show notification
    showNotification('Yêu cầu đăng nhập', message, 'info');
    
    // Redirect to login with return path
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default RequireAuth;



