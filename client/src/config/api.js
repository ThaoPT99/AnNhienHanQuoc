/**
 * API Configuration
 * Centralized API URL configuration to avoid duplication
 */

/**
 * Get API base URL
 * Priority:
 * 1. REACT_APP_API_URL environment variable
 * 2. Production URL (if in production)
 * 3. Local development URL
 */
export const getApiUrl = () => {
  // Check if API URL is explicitly set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Determine environment
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Production URL
  if (isProduction) {
    return 'https://annhienhanquoc-production.up.railway.app';
  }

  // Development URL
  if (isDevelopment) {
    return process.env.REACT_APP_DEV_API_URL || 'http://localhost:5000';
  }

  // Fallback to production URL
  return 'https://annhienhanquoc-production.up.railway.app';
};

/**
 * API base URL (singleton)
 */
export const API_URL = getApiUrl();

/**
 * Build full API endpoint URL
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @returns {string} - Full URL
 */
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY: '/api/auth/verify',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  
  // Admin
  ADMIN: {
    LOGIN: '/api/admin/login',
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    CONTACTS: '/api/admin/contacts',
    GALLERY: '/api/admin/gallery'
  },
  
  // Community
  COMMUNITY: {
    POSTS: '/api/community/posts',
    POST: (id) => `/api/community/posts/${id}`,
    COMMENTS: (postId) => `/api/community/posts/${postId}/comments`,
    LIKE: (postId) => `/api/community/posts/${postId}/like`,
    REACTIONS: (postId) => `/api/community/posts/${postId}/reactions`
  },
  
  // Gamification
  GAMIFICATION: {
    LEADERBOARD: '/api/leaderboard',
    SYNC: '/api/leaderboard/sync',
    RANK: (email) => `/api/leaderboard/rank/${encodeURIComponent(email)}`
  },
  
  // Rewards
  REWARDS: {
    LIST: '/api/rewards',
    REDEEM: '/api/rewards/redeem',
    REDEMPTIONS: (email) => `/api/rewards/redemptions/${encodeURIComponent(email)}`
  },
  
  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: '/api/newsletter/subscribe',
    UNSUBSCRIBE: '/api/newsletter/unsubscribe'
  },
  
  // Resources
  RESOURCES: {
    DOWNLOAD: '/api/resources/download'
  },
  
  // Events
  EVENTS: {
    LIST: '/api/events',
    REGISTER: '/api/events/register',
    DETAIL: (id) => `/api/events/${id}`
  },
  
  // Health check
  HEALTH: '/api/health'
};

/**
 * Get full URL for an API endpoint
 * @param {string} endpoint - Endpoint key or path
 * @param {Object} params - Parameters for dynamic endpoints
 * @returns {string} - Full URL
 * 
 * @example
 * getEndpointUrl('AUTH.LOGIN') // '/api/auth/login'
 * getEndpointUrl('COMMUNITY.POST', { id: 123 }) // '/api/community/posts/123'
 */
export const getEndpointUrl = (endpoint, params = {}) => {
  // If endpoint is already a path string, return it
  if (typeof endpoint === 'string' && endpoint.startsWith('/')) {
    return buildApiUrl(endpoint);
  }

  // Navigate through API_ENDPOINTS object
  const keys = endpoint.split('.');
  let current = API_ENDPOINTS;

  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`API endpoint not found: ${endpoint}`);
      return buildApiUrl(endpoint);
    }
    current = current[key];
  }

  // If it's a function, call it with params
  if (typeof current === 'function') {
    return buildApiUrl(current(params));
  }

  // Otherwise return the endpoint path
  return buildApiUrl(current);
};

export default {
  API_URL,
  buildApiUrl,
  getApiUrl,
  getEndpointUrl,
  API_ENDPOINTS
};
