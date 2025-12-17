/**
 * Script to add gallery images to the database
 * 
 * Usage:
 *   node add-gallery-images.js
 */

require('dotenv').config();
const { dbHelpers } = require('./database');

const imagesToAdd = [
  // Trường Học
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/1200x/be/a6/a2/bea6a28d5aa24d8b01a8f0ad61e1c6f9.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/1200x/7c/bb/fd/7cbbfdc0ffd039783371029d13e70fa8.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/736x/b7/b5/99/b7b59934d9610bf9870e169e8b16e6df.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/736x/88/b8/92/88b892e9b2d59d74897566daa6aea215.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/736x/d7/6f/2c/d76f2c071d38e6dfcfc2385ee0152390.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  {
    title: 'Trường học Hàn Quốc',
    url: 'https://i.pinimg.com/736x/4e/96/c9/4e96c989ceb05d4df16868234d31c636.jpg',
    category: 'Trường Học',
    description: 'Hình ảnh về trường học tại Hàn Quốc'
  },
  // Cuộc sống sinh viên
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/736x/30/1a/09/301a09086923fa9127185cdad0d995d8.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  },
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/736x/5a/ae/6a/5aae6ad689eed16c016ea8003acc886b.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  },
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/736x/e3/26/56/e32656f0d7ba26d60727e85cc0dc7d33.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  },
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/1200x/0e/da/d5/0edad57379e672c6dd8f659d991aa185.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  },
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/1200x/49/6b/f6/496bf6ea630f923608b20c08c7af05ae.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  },
  {
    title: 'Cuộc sống sinh viên',
    url: 'https://i.pinimg.com/1200x/52/cf/09/52cf090db4bf9bcbf3f386cd1693e50c.jpg',
    category: 'Cuộc sống sinh viên',
    description: 'Hình ảnh về cuộc sống sinh viên tại Hàn Quốc'
  }
];

async function addImages() {
  console.log('🚀 Bắt đầu thêm ảnh vào thư viện...\n');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Process images one by one
  const processNext = (index) => {
    if (index >= imagesToAdd.length) {
      // All done
      console.log('\n✅ Hoàn thành!');
      console.log(`   ✅ Thành công: ${successCount}`);
      console.log(`   ❌ Lỗi: ${errorCount}`);
      console.log(`   ⏭️  Bỏ qua: ${skippedCount}`);
      process.exit(0);
    }

    const image = imagesToAdd[index];
    console.log(`[${index + 1}/${imagesToAdd.length}] Đang thêm: ${image.title} - ${image.category}`);
    console.log(`   📍 URL: ${image.url}`);

    // Check if image already exists (by URL)
    dbHelpers.getAllGalleryImages((err, existingImages) => {
      if (err) {
        console.error(`   ❌ Lỗi khi kiểm tra ảnh: ${err.message}`);
        errorCount++;
        processNext(index + 1);
        return;
      }

      // Check if URL already exists
      const exists = existingImages && existingImages.some(img => img.url === image.url);
      if (exists) {
        console.log(`   ⏭️  Ảnh đã tồn tại, bỏ qua...\n`);
        skippedCount++;
        processNext(index + 1);
        return;
      }

      // Add image to database
      dbHelpers.createGalleryImage(image, (createErr, createdImage) => {
        if (createErr) {
          console.error(`   ❌ Lỗi khi thêm ảnh: ${createErr.message}\n`);
          errorCount++;
          processNext(index + 1);
          return;
        }

        console.log(`   ✅ Đã thêm thành công! (ID: ${createdImage.id})\n`);
        successCount++;
        processNext(index + 1);
      });
    });
  };

  // Start processing
  processNext(0);
}

// Run script
addImages().catch(err => {
  console.error('❌ Lỗi nghiêm trọng:', err);
  process.exit(1);
});

