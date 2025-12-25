/**
 * Utility functions for handling Vietnam timezone (UTC+7)
 */

/**
 * Convert a date to Vietnam timezone (UTC+7)
 * @param {Date|string} date - Date object or ISO string
 * @returns {Date} Date object in Vietnam timezone
 */
export const toVietnamTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Get UTC time
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  // Convert to Vietnam time (UTC+7)
  const vietnamTime = new Date(utc + (7 * 3600000));
  return vietnamTime;
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
  const vietnamDate = toVietnamTime(date);
  return vietnamDate.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};

/**
 * Format date in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatVietnamDate = (date, options = {}) => {
  const vietnamDate = toVietnamTime(date);
  return vietnamDate.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  });
};

/**
 * Format date and time in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string
 */
export const formatVietnamDateTime = (date, options = {}) => {
  const vietnamDate = toVietnamTime(date);
  return vietnamDate.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  });
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

