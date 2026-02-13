/**
 * Tests for application constants
 */

import {
  GAMIFICATION,
  TIMEOUTS,
  PAGINATION,
  FILE_LIMITS,
  VALIDATION_MESSAGES,
  API_ERRORS,
  STORAGE_KEYS,
  NOTIFICATION_TYPES,
  PHONE_PATTERNS,
  EMAIL_PATTERNS
} from './constants';

describe('GAMIFICATION', () => {
  it('has expected keys and values', () => {
    expect(GAMIFICATION.POINTS_PER_LEVEL).toBe(500);
    expect(GAMIFICATION.MIN_PASSWORD_LENGTH).toBe(6);
    expect(GAMIFICATION.DEFAULT_LEVEL).toBe(1);
    expect(GAMIFICATION.DEFAULT_POINTS).toBe(0);
  });
});

describe('TIMEOUTS', () => {
  it('has positive millisecond values', () => {
    expect(TIMEOUTS.DEFAULT).toBe(30000);
    expect(TIMEOUTS.AUTH).toBe(60000);
    expect(TIMEOUTS.UPLOAD).toBe(120000);
    expect(TIMEOUTS.LONG_RUNNING).toBe(300000);
  });
});

describe('PAGINATION', () => {
  it('has expected defaults', () => {
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(10);
    expect(PAGINATION.MAX_PAGE_SIZE).toBe(100);
    expect(PAGINATION.DEFAULT_PAGE).toBe(1);
  });
});

describe('FILE_LIMITS', () => {
  it('has size limits in bytes', () => {
    expect(FILE_LIMITS.IMAGE_MAX_SIZE).toBe(10 * 1024 * 1024);
    expect(FILE_LIMITS.CV_MAX_SIZE).toBe(5 * 1024 * 1024);
  });

  it('has allowed MIME types arrays', () => {
    expect(Array.isArray(FILE_LIMITS.ALLOWED_IMAGE_TYPES)).toBe(true);
    expect(Array.isArray(FILE_LIMITS.ALLOWED_DOCUMENT_TYPES)).toBe(true);
    expect(FILE_LIMITS.ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
  });
});

describe('VALIDATION_MESSAGES', () => {
  it('REQUIRED is a function that returns string', () => {
    expect(typeof VALIDATION_MESSAGES.REQUIRED).toBe('function');
    expect(VALIDATION_MESSAGES.REQUIRED('email')).toContain('email');
    expect(VALIDATION_MESSAGES.REQUIRED('email')).toContain('bắt buộc');
  });

  it('has INVALID_PHONE and INVALID_EMAIL strings', () => {
    expect(typeof VALIDATION_MESSAGES.INVALID_PHONE).toBe('string');
    expect(typeof VALIDATION_MESSAGES.INVALID_EMAIL).toBe('string');
  });

  it('PASSWORD_TOO_SHORT accepts minLength', () => {
    expect(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT(8)).toContain('8');
  });
});

describe('API_ERRORS', () => {
  it('has all error message keys', () => {
    const keys = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'SERVER_ERROR',
      'VALIDATION_ERROR',
      'ACCOUNT_DELETED'
    ];
    keys.forEach((key) => {
      expect(API_ERRORS[key]).toBeDefined();
      expect(typeof API_ERRORS[key]).toBe('string');
    });
  });
});

describe('STORAGE_KEYS', () => {
  it('has expected localStorage keys', () => {
    expect(STORAGE_KEYS.AUTH_TOKEN).toBe('authToken');
    expect(STORAGE_KEYS.USER_EMAIL).toBe('userEmail');
    expect(STORAGE_KEYS.USER_POINTS).toBe('userPoints');
  });
});

describe('NOTIFICATION_TYPES', () => {
  it('has success, error, warning, info, milestone', () => {
    expect(NOTIFICATION_TYPES.SUCCESS).toBe('success');
    expect(NOTIFICATION_TYPES.ERROR).toBe('error');
    expect(NOTIFICATION_TYPES.WARNING).toBe('warning');
    expect(NOTIFICATION_TYPES.INFO).toBe('info');
    expect(NOTIFICATION_TYPES.MILESTONE).toBe('milestone');
  });
});

describe('PHONE_PATTERNS', () => {
  it('REGEX matches valid Vietnamese phones', () => {
    expect(PHONE_PATTERNS.REGEX.test('0912345678')).toBe(true);
    expect(PHONE_PATTERNS.REGEX.test('+84912345678')).toBe(true);
    expect(PHONE_PATTERNS.REGEX.test('123')).toBe(false);
  });

  it('has EXAMPLES object', () => {
    expect(PHONE_PATTERNS.EXAMPLES.WITH_PREFIX).toBe('+84912345678');
    expect(PHONE_PATTERNS.EXAMPLES.WITHOUT_PREFIX).toBe('0912345678');
  });
});

describe('EMAIL_PATTERNS', () => {
  it('REGEX matches valid email', () => {
    expect(EMAIL_PATTERNS.REGEX.test('a@b.co')).toBe(true);
    expect(EMAIL_PATTERNS.REGEX.test('invalid')).toBe(false);
  });
  it('has EXAMPLE', () => {
    expect(EMAIL_PATTERNS.EXAMPLE).toContain('@');
  });
});
