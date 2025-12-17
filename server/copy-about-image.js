/**
 * Script to copy about image to public folder
 */

const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'uploads', 'gallery', 'z7335282956837_dccc007a84cec34742579005d959eaec.jpg');
const destDir = path.join(__dirname, '..', 'client', 'public', 'images');
const destFile = path.join(destDir, 'about-team.jpg');

console.log('📁 Đang copy ảnh...');
console.log(`   Nguồn: ${sourceFile}`);
console.log(`   Đích: ${destFile}`);

// Check if source exists
if (!fs.existsSync(sourceFile)) {
  console.error('❌ Không tìm thấy file nguồn!');
  console.error(`   Kiểm tra: ${sourceFile}`);
  process.exit(1);
}

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('✅ Đã tạo thư mục:', destDir);
}

// Copy file
try {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ Đã copy ảnh thành công!');
  console.log(`   File: ${destFile}`);
  console.log('\n📝 Bạn có thể sử dụng ảnh với đường dẫn: /images/about-team.jpg');
} catch (err) {
  console.error('❌ Lỗi khi copy file:', err.message);
  process.exit(1);
}

