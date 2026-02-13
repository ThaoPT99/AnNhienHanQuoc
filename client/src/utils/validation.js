/**
 * Validation utilities
 * Centralized validation functions to reduce code duplication
 */

/**
 * Vietnamese phone number regex pattern
 * Supports formats: 0912345678, +84912345678, 0123456789
 */
const VIETNAMESE_PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;

/**
 * Email regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates Vietnamese phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} - { isValid: boolean, cleanPhone: string, error?: string }
 */
export const validateVietnamesePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      cleanPhone: '',
      error: 'Số điện thoại không được để trống'
    };
  }

  // Remove all spaces
  const cleanPhone = phone.replace(/\s+/g, '');

  if (!VIETNAMESE_PHONE_REGEX.test(cleanPhone)) {
    return {
      isValid: false,
      cleanPhone,
      error: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc +84912345678)'
    };
  }

  return {
    isValid: true,
    cleanPhone,
    error: null
  };
};

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email không được để trống'
    };
  }

  const trimmedEmail = email.trim();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Email không hợp lệ. Vui lòng nhập địa chỉ email hợp lệ (VD: example@email.com)'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum password length (default: 6)
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validatePassword = (password, options = {}) => {
  const { minLength = 6 } = options;

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Mật khẩu không được để trống'
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Mật khẩu phải có ít nhất ${minLength} ký tự`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates name (non-empty string)
 * @param {string} name - Name to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum name length (default: 1)
 * @param {number} options.maxLength - Maximum name length (default: 100)
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateName = (name, options = {}) => {
  const { minLength = 1, maxLength = 100 } = options;

  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: 'Tên không được để trống'
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return {
      isValid: false,
      error: `Tên phải có ít nhất ${minLength} ký tự`
    };
  }

  if (trimmedName.length > maxLength) {
    return {
      isValid: false,
      error: `Tên không được vượt quá ${maxLength} ký tự`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates multiple fields at once
 * @param {Object} fields - Object with field names as keys and values as values
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} - { isValid: boolean, errors: Object }
 * 
 * @example
 * const result = validateFields(
 *   { email: 'test@email.com', phone: '0912345678' },
 *   {
 *     email: { type: 'email', required: true },
 *     phone: { type: 'phone', required: true }
 *   }
 * );
 */
export const validateFields = (fields, rules) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = fields[fieldName];
    const { type, required = false, ...options } = rule;

    // Check if required field is empty
    if (required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[fieldName] = `${fieldName} là bắt buộc`;
      isValid = false;
      continue;
    }

    // Skip validation if field is not required and empty
    if (!required && (!value || (typeof value === 'string' && !value.trim()))) {
      continue;
    }

    // Validate based on type
    let validationResult;
    switch (type) {
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validateVietnamesePhone(value);
        break;
      case 'password':
        validationResult = validatePassword(value, options);
        break;
      case 'name':
        validationResult = validateName(value, options);
        break;
      default:
        validationResult = { isValid: true, error: null };
    }

    if (!validationResult.isValid) {
      errors[fieldName] = validationResult.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Cleans phone number (removes spaces, normalizes format)
 * @param {string} phone - Phone number to clean
 * @returns {string} - Cleaned phone number
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  return phone.replace(/\s+/g, '');
};

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number (e.g., 0912 345 678)
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = cleanPhoneNumber(phone);
  
  if (!cleaned) {
    return '';
  }

  // Format: 0912 345 678 or +84 912 345 678
  if (cleaned.startsWith('+84')) {
    return cleaned.replace(/(\+84)(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3 $4');
  } else if (cleaned.startsWith('0')) {
    return cleaned.replace(/(0)(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3 $4');
  }

  return cleaned;
};

// Export regex patterns for advanced use cases
export const PHONE_REGEX = VIETNAMESE_PHONE_REGEX;
export const EMAIL_REGEX_PATTERN = EMAIL_REGEX;
