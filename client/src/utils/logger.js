/**
 * Logger utility to replace console.log statements
 * Automatically disabled in production to improve performance
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger object with different log levels
 */
export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log('[LOG]', ...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log warnings (always shown, but formatted)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    } else {
      // In production, you might want to send to error tracking service
      // Example: Sentry.captureMessage(args.join(' '), 'warning');
    }
  },

  /**
   * Log errors (always shown, important for production debugging)
   */
  error: (...args) => {
    console.error('[ERROR]', ...args);
    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(new Error(args.join(' ')));
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log success messages (only in development)
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('[SUCCESS]', ...args);
    }
  },

  /**
   * Log grouped messages (only in development)
   */
  group: (label, ...args) => {
    if (isDevelopment) {
      console.group(label);
      args.forEach(arg => console.log(arg));
      console.groupEnd();
    }
  }
};

export default logger;

