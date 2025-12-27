/**
 * Utility functions for handling Vietnam timezone (UTC+7)
 */

/**
 * Parse date string from database
 * IMPORTANT: This function assumes timestamps from database are in UTC
 * Backend should always store and return timestamps in UTC format
 * @param {Date|string} date - Date object or ISO string
 * @returns {Date} Date object (in UTC, will be formatted to Vietnam time later)
 */
export const toVietnamTime = (date) => {
  // Handle null/undefined
  if (!date) {
    return new Date();
  }
  
  // If it's already a Date object, validate it
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      return new Date(); // Return current date if invalid
    }
    return date;
  }
  
  // If it's a string, parse it
  // If it's an ISO string with Z or timezone offset, parse correctly
  if (typeof date === 'string' && (date.includes('Z') || date.match(/[+-]\d{2}:\d{2}$/))) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return new Date(); // Return current date if invalid
    }
    return parsed;
  }
  
  // If it's a database timestamp without timezone (e.g., "2025-12-25 06:48:00")
  // ASSUME it's in UTC (backend should use datetime('now') which returns UTC)
  // If backend uses CURRENT_TIMESTAMP (server timezone), it's a backend bug that needs fixing
  if (typeof date === 'string') {
    // Check if it matches SQLite datetime format: YYYY-MM-DD HH:MM:SS
    const sqliteMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/);
    if (sqliteMatch) {
      const [, year, month, day, hour, minute, second] = sqliteMatch;
      // Treat as UTC by appending 'Z'
      const utcString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
      const parsed = new Date(utcString);
      if (isNaN(parsed.getTime())) {
        return new Date(); // Return current date if invalid
      }
      return parsed;
    }
  }
  
  // Fallback: parse as is (will use browser's local timezone)
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return new Date(); // Return current date if invalid
    }
    return parsed;
  } catch (error) {
    console.warn('Error parsing date:', error, 'date:', date);
    return new Date(); // Return current date on error
  }
};

/**
 * Get current time in Vietnam timezone
 * @returns {Date} Current date in Vietnam timezone
 */
export const getVietnamTime = () => {
  return toVietnamTime(new Date());
};

/**
 * Format time in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export const formatVietnamTime = (date, options = {}) => {
  const d = toVietnamTime(date);
  // Use Intl.DateTimeFormat with timeZone to convert to Vietnam time
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(d);
};

/**
 * Format date in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatVietnamDate = (date, options = {}) => {
  if (!date) return '';
  try {
    const d = toVietnamTime(date);
    if (isNaN(d.getTime())) {
      console.warn('Invalid date in formatVietnamDate:', date);
      return '';
    }
    // Use Intl.DateTimeFormat with timeZone to convert to Vietnam time
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      ...options
    }).format(d);
  } catch (error) {
    console.warn('Error in formatVietnamDate:', error, 'date:', date);
    return '';
  }
};

/**
 * Format date and time in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string
 */
export const formatVietnamDateTime = (date, options = {}) => {
  const d = toVietnamTime(date);
  // Use Intl.DateTimeFormat with timeZone to convert to Vietnam time
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(d);
};

/**
 * Get relative time in Vietnamese (e.g., "5 phút trước")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'Vừa xong';
  
  try {
    const vietnamDate = toVietnamTime(date);
    const now = getVietnamTime();
    
    // Validate dates
    if (isNaN(vietnamDate.getTime()) || isNaN(now.getTime())) {
      console.warn('Invalid date in getRelativeTime:', date);
      return 'Vừa xong';
    }
    
    const diffMs = now - vietnamDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    const formatted = formatVietnamDate(vietnamDate);
    return formatted || 'Vừa xong';
  } catch (error) {
    console.warn('Error in getRelativeTime:', error, 'date:', date);
    return 'Vừa xong';
  }
};

