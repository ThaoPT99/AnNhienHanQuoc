/**
 * Script to check gallery images in database
 */

require('dotenv').config();
const { dbHelpers } = require('./database');

console.log('🔍 Đang kiểm tra ảnh trong database...\n');

dbHelpers.getAllGalleryImages((err, images) => {
  if (err) {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  }

  if (!images || images.length === 0) {
    console.log('ℹ️  Không có ảnh nào trong database');
    process.exit(0);
  }

  console.log(`📊 Tìm thấy ${images.length} ảnh trong database:\n`);

  // Group by category
  const grouped = images.reduce((acc, img) => {
    const cat = img.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {});

  Object.keys(grouped).forEach(category => {
    console.log(`📁 ${category}: ${grouped[category].length} ảnh`);
    grouped[category].forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.title || 'Không có tiêu đề'} - ${img.url}`);
    });
    console.log('');
  });

  process.exit(0);
});

