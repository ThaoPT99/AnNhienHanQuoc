/**
 * Utility functions for handling Vietnam timezone (UTC+7) on server
 */

/**
 * Get current time in Vietnam timezone
 * @returns {Date} Current date in Vietnam timezone
 */
const getVietnamTime = () => {
  const now = new Date();
  // Get UTC time
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  // Convert to Vietnam time (UTC+7)
  const vietnamTime = new Date(utc + (7 * 3600000));
  return vietnamTime;
};

/**
 * Convert a date to Vietnam timezone (UTC+7)
 * @param {Date|string} date - Date object or ISO string
 * @returns {Date} Date object in Vietnam timezone
 */
const toVietnamTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Get UTC time
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  // Convert to Vietnam time (UTC+7)
  const vietnamTime = new Date(utc + (7 * 3600000));
  return vietnamTime;
};

/**
 * Get current timestamp in Vietnam timezone as ISO string
 * @returns {string} ISO string in Vietnam timezone
 */
const getVietnamTimeISO = () => {
  return getVietnamTime().toISOString();
};

/**
 * Format date in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Format options
 * @returns {string} Formatted date string
 */
const formatVietnamDate = (date, options = {}) => {
  const vietnamDate = toVietnamTime(date);
  return vietnamDate.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  });
};

/**
 * Format time in Vietnam timezone
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Format options
 * @returns {string} Formatted time string
 */
const formatVietnamTime = (date, options = {}) => {
  const vietnamDate = toVietnamTime(date);
  return vietnamDate.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  });
};

module.exports = {
  getVietnamTime,
  toVietnamTime,
  getVietnamTimeISO,
  formatVietnamDate,
  formatVietnamTime
};


