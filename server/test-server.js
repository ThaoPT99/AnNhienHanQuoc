/**
 * Quick test script to verify server setup
 */

const { dbHelpers } = require('./database');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing server setup...\n');

// Test 1: Check database connection
console.log('1️⃣ Testing database connection...');
setTimeout(() => {
  dbHelpers.getAllGalleryImages((err, rows) => {
    if (err) {
      console.error('   ❌ Database error:', err.message);
    } else {
      console.log('   ✅ Database connected successfully');
      console.log(`   📊 Current gallery images: ${rows ? rows.length : 0}`);
    }

    // Test 2: Check uploads directory
    console.log('\n2️⃣ Testing uploads directory...');
    const uploadsDir = path.join(__dirname, 'uploads', 'gallery');
    if (fs.existsSync(uploadsDir)) {
      console.log('   ✅ Uploads directory exists:', uploadsDir);
      const files = fs.readdirSync(uploadsDir);
      console.log(`   📁 Files in directory: ${files.length}`);
    } else {
      console.log('   ⚠️  Uploads directory does not exist (will be created on first upload)');
    }

    // Test 3: Check required modules
    console.log('\n3️⃣ Testing required modules...');
    try {
      require('multer');
      console.log('   ✅ Multer module loaded');
    } catch (e) {
      console.log('   ❌ Multer module not found:', e.message);
    }

    try {
      require('express');
      console.log('   ✅ Express module loaded');
    } catch (e) {
      console.log('   ❌ Express module not found:', e.message);
    }

    try {
      require('sqlite3');
      console.log('   ✅ SQLite3 module loaded');
    } catch (e) {
      console.log('   ❌ SQLite3 module not found:', e.message);
    }

    console.log('\n✅ Test completed!');
    console.log('\n💡 To start the server, run: npm start');
    process.exit(0);
  });
}, 1000);

