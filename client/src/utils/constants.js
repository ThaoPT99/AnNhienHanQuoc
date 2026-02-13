/**
 * Application Constants
 * Centralized constants to avoid magic numbers and strings
 */

/**
 * Gamification Constants
 */
export const GAMIFICATION = {
  POINTS_PER_LEVEL: 500,
  MIN_PASSWORD_LENGTH: 6,
  DEFAULT_LEVEL: 1,
  DEFAULT_POINTS: 0
};

/**
 * Request Timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  AUTH: 60000, // 60 seconds (registration may take longer due to email sending)
  UPLOAD: 120000, // 2 minutes for file uploads
  LONG_RUNNING: 300000 // 5 minutes for long-running operations
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

/**
 * File Upload Limits
 */
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  CV_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: (field) => `${field} là bắt buộc`,
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc +84912345678)',
  PASSWORD_TOO_SHORT: (minLength) => `Mật khẩu phải có ít nhất ${minLength} ký tự`,
  PASSWORD_REQUIRED: 'Mật khẩu không được để trống',
  PHONE_REQUIRED: 'Vui lòng nhập số điện thoại',
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  NAME_REQUIRED: 'Vui lòng nhập tên'
};

/**
 * API Error Messages
 */
export const API_ERRORS = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
  TIMEOUT_ERROR: 'Request timeout. Server có thể đang xử lý, vui lòng đợi một chút.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  ACCOUNT_DELETED: 'Tài khoản của bạn đã bị xóa bởi quản trị viên.'
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_EMAIL: 'userEmail',
  USER_ID: 'userId',
  USER_NAME: 'userName',
  DISPLAY_NAME: 'displayName',
  USER_POINTS: 'userPoints',
  USER_LEVEL: 'userLevel',
  USER_BADGES: 'userBadges',
  USER_ACTIVITIES: 'userActivities',
  RESOURCE_DOWNLOAD_EMAIL: 'resource_download_email',
  RESOURCE_DOWNLOAD_PHONE: 'resource_download_phone'
};

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  MILESTONE: 'milestone'
};

/**
 * Date/Time Formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss'
};

/**
 * Vietnamese Phone Number Patterns
 */
export const PHONE_PATTERNS = {
  REGEX: /^(\+84|0)[0-9]{9,10}$/,
  EXAMPLES: {
    WITH_PREFIX: '+84912345678',
    WITHOUT_PREFIX: '0912345678',
    WITH_SPACES: '0912 345 678'
  }
};

/**
 * Email Patterns
 */
export const EMAIL_PATTERNS = {
  REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EXAMPLE: 'example@email.com'
};
