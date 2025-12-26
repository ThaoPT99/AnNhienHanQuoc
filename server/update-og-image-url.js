const fs = require('fs');
const path = require('path');

// Get URL from command line argument
const imageUrl = process.argv[2];

if (!imageUrl) {
  console.log('❌ Vui lòng cung cấp URL ảnh');
  console.log('');
  console.log('📋 Cách sử dụng:');
  console.log('   node update-og-image-url.js <URL_ẢNH_CLOUDINARY>');
  console.log('');
  console.log('📋 Ví dụ:');
  console.log('   node update-og-image-url.js https://res.cloudinary.com/xxx/image/upload/og-image.jpg');
  process.exit(1);
}

console.log('📝 Đang cập nhật URL ảnh Open Graph...');
console.log('📎 URL:', imageUrl);
console.log('');

function updateCodeWithImageURL(imageUrl) {
  let updated = false;
  
  // Update index.html
  const indexHtmlPath = path.join(__dirname, '..', 'client', 'public', 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const oldImage = indexHtml.match(/<meta property="og:image" content="([^"]*)" \/>/);
    if (oldImage) {
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
      console.log('   Từ:', oldImage[1]);
      console.log('   Đến:', imageUrl);
      updated = true;
    }
  }
  
  // Update SEO.js
  const seoJsPath = path.join(__dirname, '..', 'client', 'src', 'components', 'SEO.js');
  if (fs.existsSync(seoJsPath)) {
    let seoJs = fs.readFileSync(seoJsPath, 'utf8');
    
    // Update default image
    const oldDefaultImage = seoJs.match(/const defaultImage = '([^']*)';/);
    if (oldDefaultImage) {
      seoJs = seoJs.replace(
        /const defaultImage = '[^']*';/g,
        `const defaultImage = '${imageUrl}';`
      );
      console.log('✅ Đã cập nhật defaultImage trong SEO.js');
      console.log('   Từ:', oldDefaultImage[1]);
      console.log('   Đến:', imageUrl);
      updated = true;
    }
    
    // Update image parameter default
    const oldImageParam = seoJs.match(/image = '([^']*)',/);
    if (oldImageParam) {
      seoJs = seoJs.replace(
        /image = '[^']*',/g,
        `image = '${imageUrl}',`
      );
      console.log('✅ Đã cập nhật image parameter trong SEO.js');
      console.log('   Từ:', oldImageParam[1]);
      console.log('   Đến:', imageUrl);
      updated = true;
    }
    
    fs.writeFileSync(seoJsPath, seoJs, 'utf8');
  }
  
  return updated;
}

if (updateCodeWithImageURL(imageUrl)) {
  console.log('');
  console.log('🎉 Hoàn tất!');
  console.log('');
  console.log('📋 Bước tiếp theo:');
  console.log('1. Commit và push code lên GitHub');
  console.log('2. Deploy lên Vercel');
  console.log('3. Test với Facebook Debugger: https://developers.facebook.com/tools/debug/');
  console.log('   - Nhập URL: https://duhocannhien.vercel.app');
  console.log('   - Click "Scrape Again" để refresh cache');
} else {
  console.log('⚠️  Không tìm thấy URL cũ để cập nhật');
}




