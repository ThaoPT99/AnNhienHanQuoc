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
  // If it's already a Date object, return it
  if (date instanceof Date) {
    return date;
  }
  
  // If it's a string, parse it
  // If it's an ISO string with Z or timezone offset, parse correctly
  if (typeof date === 'string' && (date.includes('Z') || date.match(/[+-]\d{2}:\d{2}$/))) {
    return new Date(date);
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
      return new Date(utcString);
    }
  }
  
  // Fallback: parse as is (will use browser's local timezone)
  return new Date(date);
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
  const d = toVietnamTime(date);
  // Use Intl.DateTimeFormat with timeZone to convert to Vietnam time
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  }).format(d);
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
  const vietnamDate = toVietnamTime(date);
  const now = getVietnamTime();
  const diffMs = now - vietnamDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatVietnamDate(vietnamDate);
};

