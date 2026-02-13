# Utility Functions Documentation

Tài liệu hướng dẫn sử dụng các utility functions để giảm code duplication và cải thiện code quality.

## 📁 Cấu trúc Files

```
client/src/
├── utils/
│   ├── validation.js    # Validation utilities
│   ├── api.js           # API request utilities
│   ├── constants.js     # Application constants
│   ├── auth.js          # Authentication utilities (existing)
│   └── pointsSystem.js  # Points system utilities (existing)
└── config/
    └── api.js           # API configuration
```

---

## 🔍 Validation Utilities (`utils/validation.js`)

### `validateVietnamesePhone(phone)`

Validate số điện thoại Việt Nam.

**Parameters:**
- `phone` (string): Số điện thoại cần validate

**Returns:**
```javascript
{
  isValid: boolean,
  cleanPhone: string,  // Phone đã được clean (remove spaces)
  error?: string       // Error message nếu không hợp lệ
}
```

**Example:**
```javascript
import { validateVietnamesePhone } from '../utils/validation';

const phoneValidation = validateVietnamesePhone('0912 345 678');
if (phoneValidation.isValid) {
  console.log('Phone:', phoneValidation.cleanPhone); // "0912345678"
} else {
  console.error(phoneValidation.error);
}
```

### `validateEmail(email)`

Validate email address.

**Parameters:**
- `email` (string): Email cần validate

**Returns:**
```javascript
{
  isValid: boolean,
  error?: string
}
```

**Example:**
```javascript
import { validateEmail } from '../utils/validation';

const emailValidation = validateEmail('user@example.com');
if (!emailValidation.isValid) {
  console.error(emailValidation.error);
}
```

### `validatePassword(password, options)`

Validate password.

**Parameters:**
- `password` (string): Password cần validate
- `options` (object, optional):
  - `minLength` (number): Minimum length (default: 6)

**Returns:**
```javascript
{
  isValid: boolean,
  error?: string
}
```

**Example:**
```javascript
import { validatePassword } from '../utils/validation';

const passwordValidation = validatePassword('mypassword', { minLength: 8 });
```

### `validateFields(fields, rules)`

Validate multiple fields at once.

**Parameters:**
- `fields` (object): Object với field names và values
- `rules` (object): Validation rules cho mỗi field

**Returns:**
```javascript
{
  isValid: boolean,
  errors: { [fieldName]: string }
}
```

**Example:**
```javascript
import { validateFields } from '../utils/validation';

const result = validateFields(
  { email: 'test@email.com', phone: '0912345678' },
  {
    email: { type: 'email', required: true },
    phone: { type: 'phone', required: true }
  }
);

if (!result.isValid) {
  console.log(result.errors); // { email: '...', phone: '...' }
}
```

### `cleanPhoneNumber(phone)`

Clean phone number (remove spaces).

**Example:**
```javascript
import { cleanPhoneNumber } from '../utils/validation';

const cleaned = cleanPhoneNumber('0912 345 678'); // "0912345678"
```

### `formatPhoneNumber(phone)`

Format phone number for display.

**Example:**
```javascript
import { formatPhoneNumber } from '../utils/validation';

const formatted = formatPhoneNumber('0912345678'); // "0912 345 678"
```

---

## 🌐 API Configuration (`config/api.js`)

### `API_URL`

Base API URL (singleton).

**Example:**
```javascript
import { API_URL } from '../config/api';

console.log(API_URL); // "https://annhienhanquoc-production.up.railway.app"
```

### `buildApiUrl(endpoint)`

Build full API URL from endpoint.

**Example:**
```javascript
import { buildApiUrl } from '../config/api';

const url = buildApiUrl('/api/auth/login');
// "https://annhienhanquoc-production.up.railway.app/api/auth/login"
```

### `getEndpointUrl(endpoint, params)`

Get endpoint URL from `API_ENDPOINTS` object.

**Example:**
```javascript
import { getEndpointUrl, API_ENDPOINTS } from '../config/api';

// Using endpoint key
const loginUrl = getEndpointUrl('AUTH.LOGIN');
// "/api/auth/login"

// Using dynamic endpoint
const postUrl = getEndpointUrl('COMMUNITY.POST', { id: 123 });
// "/api/community/posts/123"

// Direct access
const endpoint = API_ENDPOINTS.AUTH.LOGIN;
```

---

## 📡 API Utilities (`utils/api.js`)

### `apiRequest(endpoint, options, requireAuth)`

Make API request with automatic error handling.

**Parameters:**
- `endpoint` (string): API endpoint
- `options` (object): Fetch options
- `requireAuth` (boolean): Whether authentication is required

**Returns:**
```javascript
{
  success: boolean,
  data?: any,
  error?: {
    type: string,
    message: string,
    status?: number
  },
  response?: Response
}
```

**Example:**
```javascript
import { apiRequest } from '../utils/api';

const result = await apiRequest('/api/users', { method: 'GET' }, true);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.message);
}
```

### `apiPost(endpoint, body, requireAuth)`

POST request helper.

**Example:**
```javascript
import { apiPost } from '../utils/api';

const result = await apiPost('/api/newsletter/subscribe', {
  email: 'user@example.com',
  phone: '0912345678'
});

if (result.success) {
  console.log('Subscribed!');
}
```

### `apiGet(endpoint, requireAuth)`

GET request helper.

**Example:**
```javascript
import { apiGet } from '../utils/api';

const result = await apiGet('/api/users', true);
```

### `apiPut`, `apiPatch`, `apiDelete`

Similar helpers for PUT, PATCH, DELETE requests.

### `authenticatedFetch(endpoint, options)`

Make authenticated API request (uses JWT token).

**Example:**
```javascript
import { authenticatedFetch } from '../utils/api';

const response = await authenticatedFetch('/api/profile');
const data = await response.json();
```

---

## 📋 Constants (`utils/constants.js`)

### `GAMIFICATION`

Gamification constants.

```javascript
import { GAMIFICATION } from '../utils/constants';

const pointsPerLevel = GAMIFICATION.POINTS_PER_LEVEL; // 500
```

### `TIMEOUTS`

Request timeout constants.

```javascript
import { TIMEOUTS } from '../utils/constants';

setTimeout(() => {}, TIMEOUTS.AUTH); // 60000ms
```

### `VALIDATION_MESSAGES`

Pre-defined validation messages.

```javascript
import { VALIDATION_MESSAGES } from '../utils/constants';

const message = VALIDATION_MESSAGES.INVALID_PHONE;
```

### `STORAGE_KEYS`

LocalStorage key constants.

```javascript
import { STORAGE_KEYS } from '../utils/constants';

localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
```

---

## 🔄 Migration Guide

### Before (Old Code)

```javascript
// ❌ Old way - duplicated code
const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
const cleanPhone = phone.replace(/\s+/g, '');
if (!phoneRegex.test(cleanPhone)) {
  alert('Số điện thoại không hợp lệ');
  return;
}

const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, phone: cleanPhone })
});
```

### After (New Code)

```javascript
// ✅ New way - using utilities
import { validateVietnamesePhone } from '../utils/validation';
import { apiPost, getEndpointUrl } from '../utils/api';
import { API_ENDPOINTS } from '../config/api';

const phoneValidation = validateVietnamesePhone(phone);
if (!phoneValidation.isValid) {
  alert(phoneValidation.error);
  return;
}

const result = await apiPost(
  getEndpointUrl('NEWSLETTER.SUBSCRIBE'),
  { email, phone: phoneValidation.cleanPhone }
);

if (result.success) {
  // Handle success
}
```

---

## 📝 Best Practices

1. **Always use validation utilities** instead of inline regex
2. **Use API utilities** instead of raw fetch calls
3. **Use constants** instead of magic numbers/strings
4. **Import from config/api** instead of defining API_URL locally

---

## 🎯 Examples

### Complete Form Validation Example

```javascript
import { validateFields } from '../utils/validation';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validation = validateFields(
    { email, phone, password },
    {
      email: { type: 'email', required: true },
      phone: { type: 'phone', required: true },
      password: { type: 'password', required: true, minLength: 6 }
    }
  );
  
  if (!validation.isValid) {
    // Show errors
    Object.values(validation.errors).forEach(error => {
      alert(error);
    });
    return;
  }
  
  // Proceed with submission
};
```

### API Request with Error Handling

```javascript
import { apiPost, getEndpointUrl } from '../utils/api';
import { API_ERRORS } from '../utils/constants';

const handleSubmit = async () => {
  const result = await apiPost(
    getEndpointUrl('AUTH.REGISTER'),
    formData
  );
  
  if (result.success) {
    // Success
    console.log(result.data);
  } else {
    // Handle error
    const errorMessage = result.error?.message || API_ERRORS.SERVER_ERROR;
    alert(errorMessage);
  }
};
```

---

## 🔗 Related Files

- `utils/auth.js` - Authentication utilities
- `utils/pointsSystem.js` - Points system utilities
- `components/NotificationCenter.js` - Notification system

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
