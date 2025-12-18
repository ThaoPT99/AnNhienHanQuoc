// Script to generate a secure admin token
const crypto = require('crypto');

// Generate a random secure token (32 bytes = 256 bits)
const token = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Generated Admin Token:');
console.log('='.repeat(60));
console.log(token);
console.log('='.repeat(60));
console.log('\n📋 Instructions:');
console.log('1. Copy the token above');
console.log('2. Add it to your Railway environment variables:');
console.log('   - Variable name: ADMIN_TOKEN');
console.log('   - Variable value: (paste the token above)');
console.log('3. Also add it to your local .env file if testing locally:');
console.log('   ADMIN_TOKEN=' + token);
console.log('\n⚠️  Keep this token secret! Do not commit it to Git.\n');

