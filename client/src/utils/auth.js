// Authentication utilities

const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get user email from localStorage
export const getUserEmail = () => {
  return localStorage.getItem('userEmail');
};

// Get user name from localStorage
export const getUserName = () => {
  return localStorage.getItem('userName') || localStorage.getItem('displayName');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getAuthToken();
};

// Alias for isLoggedIn (for consistency)
export const isAuthenticated = isLoggedIn;

// Logout user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

// Make authenticated API request
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-user-token': token,
    ...options.headers
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  // If token expired or invalid, logout
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

// Verify token with server
export const verifyToken = async () => {
  try {
    const response = await authenticatedFetch('/api/auth/verify');
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

