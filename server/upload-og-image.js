require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { checkCloudinaryConfig, initCloudinary, uploadToCloudinary } = require('./cloudinary');

async function uploadOGImage() {
  console.log('📤 Bắt đầu upload ảnh Open Graph lên Cloudinary...');
  
  const imagePath = path.join(__dirname, 'og-image-du-hoc-an-nhien.png');
  
  // Check if image exists
  if (!fs.existsSync(imagePath)) {
    console.error('❌ Không tìm thấy file ảnh:', imagePath);
    console.log('💡 Hãy chạy: node generate-og-image.js trước');
    process.exit(1);
  }

  // Check Cloudinary config
  if (!checkCloudinaryConfig()) {
    console.log('');
    console.log('⚠️  Cloudinary chưa được cấu hình local');
    console.log('');
    console.log('📋 Có 2 cách để upload:');
    console.log('');
    console.log('CÁCH 1: Upload thủ công (Khuyến nghị)');
    console.log('1. Mở file:', imagePath);
    console.log('2. Truy cập https://cloudinary.com/console');
    console.log('3. Upload ảnh vào folder "og-images"');
    console.log('4. Copy URL của ảnh');
    console.log('5. Chạy: node update-og-image-url.js <URL_ẢNH>');
    console.log('');
    console.log('CÁCH 2: Cấu hình Cloudinary local');
    console.log('1. Tạo file .env trong thư mục server/');
    console.log('2. Thêm các dòng sau:');
    console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('   CLOUDINARY_API_KEY=your_api_key');
    console.log('   CLOUDINARY_API_SECRET=your_api_secret');
    console.log('3. Chạy lại script này');
    process.exit(0);
  }

  try {
    console.log('📁 File ảnh:', imagePath);
    console.log('⏳ Đang upload lên Cloudinary...');
    
    initCloudinary();
    const result = await uploadToCloudinary(imagePath, 'og-images');
    
    console.log('');
    console.log('✅ Upload thành công!');
    console.log('📎 URL ảnh:', result.url);
    console.log('');
    console.log('📝 Đang cập nhật URL trong code...');
    
    updateCodeWithImageURL(result.url);
    
    console.log('');
    console.log('🎉 Hoàn tất!');
    console.log('');
    console.log('📋 Bước tiếp theo:');
    console.log('1. Commit và push code lên GitHub');
    console.log('2. Deploy lên Vercel');
    console.log('3. Test với Facebook Debugger: https://developers.facebook.com/tools/debug/');
    console.log('   - Nhập URL: https://duhocannhien.vercel.app');
    console.log('   - Click "Scrape Again" để refresh cache');
    console.log('');
    console.log('💡 Lưu ý: Facebook cache ảnh, có thể mất vài phút để hiển thị ảnh mới');
    
  } catch (error) {
    console.error('❌ Lỗi khi upload:', error.message);
    process.exit(1);
  }
}

function updateCodeWithImageURL(imageUrl) {
  // Update index.html
  const indexHtmlPath = path.join(__dirname, '..', 'client', 'public', 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    indexHtml = indexHtml.replace(
      /<meta property="og:image" content="[^"]*" \/>/g,
      `<meta property="og:image" content="${imageUrl}" />`
    );
    indexHtml = indexHtml.replace(
      /<meta property="og:image:secure_url" content="[^"]*" \/>/g,
      `<meta property="og:image:secure_url" content="${imageUrl}" />`
    );
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('✅ Đã cập nhật client/public/index.html');
  }
  
  // Update SEO.js
  const seoJsPath = path.join(__dirname, '..', 'client', 'src', 'components', 'SEO.js');
  if (fs.existsSync(seoJsPath)) {
    let seoJs = fs.readFileSync(seoJsPath, 'utf8');
    // Update default image
    seoJs = seoJs.replace(
      /const defaultImage = '[^']*';/g,
      `const defaultImage = '${imageUrl}';`
    );
    // Update image parameter default
    seoJs = seoJs.replace(
      /image = '[^']*',/g,
      `image = '${imageUrl}',`
    );
    fs.writeFileSync(seoJsPath, seoJs, 'utf8');
    console.log('✅ Đã cập nhật client/src/components/SEO.js');
  }
}

// Run if called directly
if (require.main === module) {
  uploadOGImage().catch(console.error);
}

module.exports = { uploadOGImage };

