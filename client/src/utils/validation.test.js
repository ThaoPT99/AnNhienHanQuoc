/**
 * Tests for validation utilities
 */

import {
  validateVietnamesePhone,
  validateEmail,
  validatePassword,
  validateName,
  validateFields,
  cleanPhoneNumber,
  formatPhoneNumber,
  PHONE_REGEX,
  EMAIL_REGEX_PATTERN
} from './validation';

describe('validateVietnamesePhone', () => {
  it('returns valid for correct Vietnamese phone numbers', () => {
    expect(validateVietnamesePhone('0912345678')).toEqual({
      isValid: true,
      cleanPhone: '0912345678',
      error: null
    });
    expect(validateVietnamesePhone('+84912345678')).toEqual({
      isValid: true,
      cleanPhone: '+84912345678',
      error: null
    });
    expect(validateVietnamesePhone('0912 345 678')).toEqual({
      isValid: true,
      cleanPhone: '0912345678',
      error: null
    });
    expect(validateVietnamesePhone('0123456789')).toEqual({
      isValid: true,
      cleanPhone: '0123456789',
      error: null
    });
  });

  it('returns invalid for empty or non-string input', () => {
    const result = validateVietnamesePhone('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('trống');

    expect(validateVietnamesePhone(null).isValid).toBe(false);
    expect(validateVietnamesePhone(undefined).isValid).toBe(false);
    expect(validateVietnamesePhone(123).isValid).toBe(false);
  });

  it('returns invalid for wrong format', () => {
    const result = validateVietnamesePhone('123456'); // too short
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('không hợp lệ');

    expect(validateVietnamesePhone('912345678').isValid).toBe(false); // missing 0 or +84
    expect(validateVietnamesePhone('+1234567890').isValid).toBe(false); // wrong country code
    expect(validateVietnamesePhone('09123456789').isValid).toBe(false); // 11 digits with 0
  });

  it('strips spaces and returns cleanPhone', () => {
    const result = validateVietnamesePhone(' 0912  345  678 ');
    expect(result.cleanPhone).toBe('0912345678');
  });
});

describe('validateEmail', () => {
  it('returns valid for correct emails', () => {
    expect(validateEmail('user@example.com').isValid).toBe(true);
    expect(validateEmail('test.user@domain.co.uk').isValid).toBe(true);
    expect(validateEmail('a@b.co').isValid).toBe(true);
  });

  it('returns invalid for empty or non-string', () => {
    expect(validateEmail('').isValid).toBe(false);
    expect(validateEmail(null).isValid).toBe(false);
    expect(validateEmail(undefined).isValid).toBe(false);
  });

  it('returns invalid for wrong format', () => {
    expect(validateEmail('invalid').isValid).toBe(false);
    expect(validateEmail('missing@domain').isValid).toBe(false);
    expect(validateEmail('@nodomain.com').isValid).toBe(false);
    expect(validateEmail('spaces in@email.com').isValid).toBe(false);
  });

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ').isValid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('returns valid for password with default min length 6', () => {
    expect(validatePassword('123456').isValid).toBe(true);
    expect(validatePassword('password').isValid).toBe(true);
  });

  it('returns invalid for short password', () => {
    const result = validatePassword('12345');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('ít nhất 6');
  });

  it('respects custom minLength option', () => {
    expect(validatePassword('12345678', { minLength: 8 }).isValid).toBe(true);
    expect(validatePassword('1234567', { minLength: 8 }).isValid).toBe(false);
  });

  it('returns invalid for empty password', () => {
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword(null).isValid).toBe(false);
  });
});

describe('validateName', () => {
  it('returns valid for non-empty name', () => {
    expect(validateName('Nguyen Van A').isValid).toBe(true);
    expect(validateName('A').isValid).toBe(true);
  });

  it('returns invalid for empty or whitespace', () => {
    expect(validateName('').isValid).toBe(false);
    expect(validateName('   ').isValid).toBe(false);
    expect(validateName(null).isValid).toBe(false);
  });

  it('respects minLength and maxLength options', () => {
    expect(validateName('AB', { minLength: 2 }).isValid).toBe(true);
    expect(validateName('A', { minLength: 2 }).isValid).toBe(false);
    const longName = 'a'.repeat(101);
    expect(validateName(longName, { maxLength: 100 }).isValid).toBe(false);
    expect(validateName('a'.repeat(100), { maxLength: 100 }).isValid).toBe(true);
  });
});

describe('validateFields', () => {
  it('validates multiple fields and returns combined result', () => {
    const result = validateFields(
      { email: 'user@test.com', phone: '0912345678' },
      {
        email: { type: 'email', required: true },
        phone: { type: 'phone', required: true }
      }
    );
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid fields', () => {
    const result = validateFields(
      { email: 'invalid', phone: '123' },
      {
        email: { type: 'email', required: true },
        phone: { type: 'phone', required: true }
      }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeDefined();
  });

  it('returns required error for missing required field', () => {
    const result = validateFields(
      { email: '', phone: '0912345678' },
      {
        email: { type: 'email', required: true },
        phone: { type: 'phone', required: true }
      }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toContain('bắt buộc');
  });

  it('skips validation for optional empty fields', () => {
    const result = validateFields(
      { email: 'user@test.com', phone: '' },
      {
        email: { type: 'email', required: true },
        phone: { type: 'phone', required: false }
      }
    );
    expect(result.isValid).toBe(true);
  });
});

describe('cleanPhoneNumber', () => {
  it('removes all spaces', () => {
    expect(cleanPhoneNumber('0912 345 678')).toBe('0912345678');
    expect(cleanPhoneNumber('  0912345678  ')).toBe('0912345678');
  });

  it('returns empty string for invalid input', () => {
    expect(cleanPhoneNumber('')).toBe('');
    expect(cleanPhoneNumber(null)).toBe('');
    expect(cleanPhoneNumber(123)).toBe('');
  });
});

describe('formatPhoneNumber', () => {
  it('formats Vietnamese phone with spaces', () => {
    expect(formatPhoneNumber('0912345678')).toBe('0912 345 678');
    expect(formatPhoneNumber('+84912345678')).toBe('+84 912 345 678');
  });

  it('returns empty string for empty input', () => {
    expect(formatPhoneNumber('')).toBe('');
    expect(formatPhoneNumber(null)).toBe('');
  });
});

describe('PHONE_REGEX and EMAIL_REGEX_PATTERN', () => {
  it('PHONE_REGEX matches valid Vietnamese phones', () => {
    expect(PHONE_REGEX.test('0912345678')).toBe(true);
    expect(PHONE_REGEX.test('+84912345678')).toBe(true);
    expect(PHONE_REGEX.test('123')).toBe(false);
  });

  it('EMAIL_REGEX_PATTERN matches valid emails', () => {
    expect(EMAIL_REGEX_PATTERN.test('a@b.co')).toBe(true);
    expect(EMAIL_REGEX_PATTERN.test('invalid')).toBe(false);
  });
});
