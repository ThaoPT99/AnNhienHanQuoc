// Test script for recruitment endpoint
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const endpoint = `${API_URL}/api/recruitment/apply`;

console.log('🧪 Testing recruitment endpoint:', endpoint);

// Create test form data
const form = new FormData();
form.append('name', 'Test User');
form.append('email', 'test@example.com');
form.append('phone', '0123456789');
form.append('position', 'Tư vấn viên du học');
form.append('experience', '2 năm kinh nghiệm');
form.append('message', 'Test application');

// Make request
const options = {
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(endpoint, options, (res) => {
  console.log(`\n📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📦 Response Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(data);
    }
    
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('\n✅ Test PASSED!');
    } else {
      console.log('\n❌ Test FAILED!');
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 Make sure the server is running on', API_URL);
  }
});

form.pipe(req);

