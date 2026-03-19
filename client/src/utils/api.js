/**
 * API utility functions
 * Common functions for making API requests
 */

import { API_URL, buildApiUrl, getEndpointUrl } from '../config/api';
import { getAuthToken } from './auth';

/**
 * Default fetch options
 */
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  const url = buildApiUrl(endpoint);
  const headers = {
    ...defaultOptions.headers,
    'Authorization': `Bearer ${token}`,
    'x-user-token': token,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    try {
      const data = await response.clone().json();
      if (data.account_deleted) {
        // Account was deleted
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Account has been deleted');
      }
    } catch (e) {
      // JSON parsing failed, continue with normal auth error handling
    }

    // Session expired
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

/**
 * Make unauthenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const headers = {
    ...defaultOptions.headers,
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  });
};

/**
 * Parse JSON response with error handling
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>}
 */
export const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.error('JSON parse error:', error);
      const text = await response.text();
      console.error('Response text:', text);
      throw new Error('Invalid JSON response from server');
    }
  }

  // Non-JSON response
  const text = await response.text();
  return { error: 'Server returned non-JSON response', message: text };
};

/**
 * Handle API error response
 * @param {Response} response - Fetch response
 * @param {Object} data - Parsed response data
 * @returns {Object} - Error object
 */
export const handleApiError = (response, data) => {
  const error = {
    status: response.status,
    statusText: response.statusText,
    message: data?.error || data?.message || 'An error occurred',
    data
  };

  // Common error messages
  switch (response.status) {
    case 400:
      error.type = 'validation';
      error.message = data?.error || data?.message || 'Invalid request';
      break;
    case 401:
      error.type = 'authentication';
      error.message = data?.error || 'Unauthorized';
      break;
    case 403:
      error.type = 'authorization';
      error.message = data?.error || 'Forbidden';
      break;
    case 404:
      error.type = 'not_found';
      error.message = data?.error || data?.message || 'Resource not found';
      break;
    case 500:
      error.type = 'server';
      error.message = 'Server error. Please try again later.';
      break;
    default:
      error.type = 'unknown';
  }

  return error;
};

/**
 * Make API request with automatic error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<Object>} - { success: boolean, data?: any, error?: Object }
 */
export const apiRequest = async (endpoint, options = {}, requireAuth = false) => {
  try {
    const fetchFn = requireAuth ? authenticatedFetch : apiFetch;
    const response = await fetchFn(endpoint, options);
    const data = await parseJsonResponse(response);

    if (response.ok) {
      return {
        success: true,
        data,
        response
      };
    }

    const error = handleApiError(response, data);
    return {
      success: false,
      error,
      response
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'network',
        message: error.message || 'Network error. Please check your connection.',
        originalError: error
      }
    };
  }
};

/**
 * POST request helper
 */
export const apiPost = async (endpoint, body, requireAuth = false) => {
  return apiRequest(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(body)
    },
    requireAuth
  );
};

/**
 * GET request helper
 */
export const apiGet = async (endpoint, requireAuth = false) => {
  return apiRequest(endpoint, { method: 'GET' }, requireAuth);
};

/**
 * PUT request helper
 */
export const apiPut = async (endpoint, body, requireAuth = false) => {
  return apiRequest(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(body)
    },
    requireAuth
  );
};

/**
 * PATCH request helper
 */
export const apiPatch = async (endpoint, body, requireAuth = false) => {
  return apiRequest(
    endpoint,
    {
      method: 'PATCH',
      body: JSON.stringify(body)
    },
    requireAuth
  );
};

/**
 * DELETE request helper
 */
export const apiDelete = async (endpoint, requireAuth = false) => {
  return apiRequest(endpoint, { method: 'DELETE' }, requireAuth);
};

// Export API_URL and getEndpointUrl for backward compatibility
export { API_URL, getEndpointUrl };
