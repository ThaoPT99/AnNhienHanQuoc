/**
 * Script to add gallery images to production database via API
 * 
 * Usage:
 *   node add-gallery-images-to-production.js
 * 
 * Make sure to set PRODUCTION_API_URL environment variable
 * or modify the API_URL below
 */

require('dotenv').config();
const https = require('https');
const http = require('http');

const PRODUCTION_API_URL = process.env.PRODUCTION_API_URL || 'https://annhienhanquoc-production.up.railway.app';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''; // You need to get this from admin login

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

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(ADMIN_TOKEN && { 'x-admin-token': ADMIN_TOKEN })
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject(new Error(parsed.error || `HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function addImages() {
  console.log(`🚀 Bắt đầu thêm ảnh vào production database...`);
  console.log(`📍 API URL: ${PRODUCTION_API_URL}\n`);

  // First, check if we can access the API
  try {
    await makeRequest(`${PRODUCTION_API_URL}/api/health`);
    console.log('✅ Kết nối với server thành công\n');
  } catch (err) {
    console.error('❌ Không thể kết nối với server:', err.message);
    console.error('   Vui lòng kiểm tra lại PRODUCTION_API_URL');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Process images one by one
  for (let i = 0; i < imagesToAdd.length; i++) {
    const image = imagesToAdd[i];
    console.log(`[${i + 1}/${imagesToAdd.length}] Đang thêm: ${image.title} - ${image.category}`);
    console.log(`   📍 URL: ${image.url}`);

    try {
      // Check if image already exists
      const existingResponse = await makeRequest(`${PRODUCTION_API_URL}/api/gallery`);
      const existingImages = existingResponse.data || [];
      const exists = Array.isArray(existingImages) && existingImages.some(img => img.url === image.url);
      
      if (exists) {
        console.log(`   ⏭️  Ảnh đã tồn tại, bỏ qua...\n`);
        skippedCount++;
        continue;
      }

      // Add image via API
      const response = await makeRequest(`${PRODUCTION_API_URL}/api/gallery`, 'POST', image);

      console.log(`   ✅ Đã thêm thành công! (ID: ${response.data.id})\n`);
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        console.log(`   ⏭️  Ảnh đã tồn tại, bỏ qua...\n`);
        skippedCount++;
      } else {
        console.error(`   ❌ Lỗi: ${err.message}\n`);
        errorCount++;
      }
    }
  }

  console.log('\n✅ Hoàn thành!');
  console.log(`   ✅ Thành công: ${successCount}`);
  console.log(`   ❌ Lỗi: ${errorCount}`);
  console.log(`   ⏭️  Bỏ qua: ${skippedCount}`);
}

// Run script
addImages().catch(err => {
  console.error('❌ Lỗi nghiêm trọng:', err);
  process.exit(1);
});

