# Testing Guide - Utility Functions

## 📋 Quick Start

### Run All Tests
```bash
cd client
npm test
```

### Run Only Utility Tests
```bash
npm test -- --watchAll=false --testPathPattern="(validation|api|constants)\\.test\\.js"
```

---

## 📁 Test Files Structure

```
client/src/
├── utils/
│   ├── validation.test.js      ✅ ~26 test cases
│   ├── api.test.js             ✅ ~13 test cases
│   └── constants.test.js        ✅ ~15 test cases
└── config/
    └── api.test.js              ✅ ~17 test cases
```

**Total: 4 test files, ~71 test cases**

---

## 🧪 Test Examples

### Validation Test
```javascript
import { validateVietnamesePhone } from './validation';

test('validates Vietnamese phone correctly', () => {
  const result = validateVietnamesePhone('0912345678');
  expect(result.isValid).toBe(true);
});
```

### API Config Test
```javascript
import { getEndpointUrl } from '../config/api';

test('returns full URL for endpoint', () => {
  const url = getEndpointUrl('AUTH.LOGIN');
  expect(url).toContain('/api/auth/login');
});
```

---

## 📊 Expected Results

```
PASS  src/utils/validation.test.js
PASS  src/config/api.test.js
PASS  src/utils/constants.test.js
PASS  src/utils/api.test.js

Test Suites: 4 passed, 4 total
Tests:       71 passed, 71 total
```
