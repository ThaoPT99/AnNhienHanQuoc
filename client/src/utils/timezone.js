/**
 * Utility functions for handling Vietnam timezone (UTC+7)
 */

/**
 * Parse date string from database
 * SQLite timestamps from server in Hà Lan timezone need to be converted to Vietnam time
 * @param {Date|string} date - Date object or ISO string
 * @returns {Date} Date object
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
  // SQLite CURRENT_TIMESTAMP stores in server timezone (Hà Lan = UTC+1 or UTC+2)
  // But SQLite datetime('now') returns UTC
  // 
  // Problem: Timestamps stored with CURRENT_TIMESTAMP are in Hà Lan time
  // When we parse "2025-12-25 06:48:00" without timezone, JavaScript treats it as local time
  // If browser is in Vietnam, it thinks it's 06:48 Vietnam time (wrong!)
  // Actually it's 06:48 Hà Lan time = 05:48 UTC = 12:48 Vietnam time
  //
  // Solution: Treat the timestamp as if it's in Hà Lan timezone, convert to UTC, then to Vietnam
  // Hà Lan is UTC+1 (winter, Oct-Mar) or UTC+2 (summer, Mar-Oct)
  // Vietnam is UTC+7
  // Net offset from Hà Lan to Vietnam: +6 hours (winter) or +5 hours (summer)
  if (typeof date === 'string') {
    // Check if it matches SQLite datetime format: YYYY-MM-DD HH:MM:SS
    const sqliteMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/);
    if (sqliteMatch) {
      const [, year, month, day, hour, minute, second] = sqliteMatch;
      const monthNum = parseInt(month);
      
      // Determine if it's summer time in Hà Lan (March-October = UTC+2)
      // or winter time (November-February = UTC+1)
      const isSummer = monthNum >= 3 && monthNum <= 10;
      const netherlandsOffsetHours = isSummer ? 2 : 1; // UTC+2 (summer) or UTC+1 (winter)
      
      // The timestamp from database is in Hà Lan time (stored with CURRENT_TIMESTAMP)
      // Example: "2025-12-25 06:48:00" means 06:48 Hà Lan time
      // Hà Lan time (UTC+1) = 05:48 UTC = 12:48 Vietnam time (UTC+7)
      //
      // Strategy: Parse as UTC, then adjust
      // 1. Parse as if it's UTC: "2025-12-25T06:48:00Z" = 06:48 UTC
      // 2. But it's actually Hà Lan time, so real UTC = 06:48 - netherlandsOffset = 05:48 UTC
      // 3. Vietnam time = 05:48 UTC + 7 = 12:48 Vietnam
      // Net: Add (7 - netherlandsOffset) hours
      const utcDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
      
      // Calculate net offset: Vietnam (UTC+7) - Hà Lan (UTC+1 or +2)
      const netOffsetHours = 7 - netherlandsOffsetHours; // +6 (winter) or +5 (summer)
      const vietnamDate = new Date(utcDate.getTime() + (netOffsetHours * 3600000));
      
      return vietnamDate;
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

