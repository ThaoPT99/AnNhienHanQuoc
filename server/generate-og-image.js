const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateOGImage() {
  console.log('🎨 Bắt đầu tạo ảnh Open Graph...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match OG image size
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });

    // Create HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 1200px;
            height: 630px;
            overflow: hidden;
            font-family: 'Arial', 'Segoe UI', sans-serif;
        }
        .container {
            width: 100%;
            height: 100%;
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .pattern {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0.05;
            background-image: 
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);
        }
        .logo-circle {
            position: absolute;
            left: 80px;
            top: 50%;
            transform: translateY(-50%);
            width: 140px;
            height: 140px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .logo-inner {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        .korean-flag {
            width: 30px;
            height: 30px;
            background: #0047A0;
            border-radius: 50%;
            margin-bottom: 5px;
        }
        .kr-text {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 2px;
        }
        .content {
            position: absolute;
            left: 300px;
            top: 50%;
            transform: translateY(-50%);
            color: white;
        }
        .title {
            font-size: 64px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            line-height: 1.2;
        }
        .subtitle {
            font-size: 32px;
            margin-bottom: 30px;
            opacity: 0.95;
            font-weight: 500;
        }
        .description {
            font-size: 24px;
            margin-bottom: 25px;
            opacity: 0.9;
            line-height: 1.4;
        }
        .features {
            margin-top: 30px;
        }
        .feature {
            font-size: 20px;
            margin-bottom: 12px;
            opacity: 0.9;
        }
        .url {
            position: absolute;
            bottom: 30px;
            right: 50px;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 500;
        }
        .decorative-line {
            position: absolute;
            left: 280px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="pattern"></div>
        <div class="decorative-line"></div>
        <div class="logo-circle">
            <div class="logo-inner">
                <div class="korean-flag"></div>
                <div class="kr-text">KR</div>
            </div>
        </div>
        <div class="content">
            <div class="title">Du học An Nhiên</div>
            <div class="subtitle">Tư vấn du học Hàn Quốc uy tín</div>
            <div class="description">
                Đồng hành cùng bạn trên hành trình<br>
                du học tại xứ sở Kim Chi 🇰🇷
            </div>
            <div class="features">
                <div class="feature">✓ Tư vấn chuyên nghiệp</div>
                <div class="feature">✓ Hỗ trợ toàn diện</div>
                <div class="feature">✓ Tỷ lệ thành công cao</div>
            </div>
        </div>
        <div class="url">duhocannhien.vercel.app</div>
    </div>
</body>
</html>
    `;

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot
    const outputPath = path.join(__dirname, 'og-image-du-hoc-an-nhien.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630
      }
    });

    console.log('✅ Đã tạo ảnh thành công!');
    console.log('📁 File location:', outputPath);
    console.log('📏 Kích thước: 1200 x 630 pixels');
    console.log('');
    console.log('📤 Bước tiếp theo:');
    console.log('1. Upload ảnh này lên Cloudinary');
    console.log('2. Copy URL của ảnh');
    console.log('3. Cập nhật URL trong client/public/index.html và client/src/components/SEO.js');
    console.log('4. Test với Facebook Debugger: https://developers.facebook.com/tools/debug/');

  } catch (error) {
    console.error('❌ Lỗi khi tạo ảnh:', error);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateOGImage().catch(console.error);
}

module.exports = { generateOGImage };

