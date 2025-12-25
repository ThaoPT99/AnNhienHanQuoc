# Hướng dẫn tạo ảnh Open Graph cho Facebook

## Vấn đề
Khi chia sẻ link website lên Facebook, bạn muốn hiển thị logo công ty trong link preview.

## Giải pháp

### 1. Tạo ảnh Open Graph (og-image.jpg)

**Yêu cầu:**
- Kích thước: **1200 x 630 pixels** (tỷ lệ 1.91:1)
- Format: JPG hoặc PNG
- File size: < 8MB
- Nên có logo công ty rõ ràng

**Công cụ tạo ảnh:**
- Canva: https://www.canva.com (template "Facebook Post")
- Figma
- Photoshop
- Online tools: https://www.bannerbear.com/tools/open-graph-image-generator/

**Nội dung ảnh nên có:**
- Logo công ty "Du học An Nhiên" 
- Slogan: "Tư vấn du học Hàn Quốc uy tín"
- Màu sắc: Gradient tím (#667eea → #764ba2) như logo
- Ảnh nền: Có thể dùng ảnh về Hàn Quốc, trường học

### 2. Upload ảnh lên Cloudinary

Sau khi tạo ảnh og-image.jpg:

1. Upload lên Cloudinary
2. Copy URL của ảnh
3. Cập nhật trong `client/public/index.html` và `client/src/components/SEO.js`

### 3. Cập nhật code

File: `client/public/index.html`
```html
<meta property="og:image" content="URL_ẢNH_CLOUDINARY" />
```

File: `client/src/components/SEO.js`
```javascript
const defaultImage = 'URL_ẢNH_CLOUDINARY';
```

### 4. Test với Facebook Debugger

1. Truy cập: https://developers.facebook.com/tools/debug/
2. Nhập URL: https://duhocannhien.vercel.app
3. Click "Scrape Again" để refresh cache
4. Kiểm tra preview

### 5. Lưu ý

- Facebook cache ảnh, nếu thay đổi ảnh cần dùng Debugger để refresh
- Ảnh phải accessible (không bị chặn bởi CORS)
- Nên dùng HTTPS URL
- Ảnh nên có text rõ ràng vì có thể bị crop trên mobile

## Cách nhanh nhất

1. Tạo ảnh 1200x630px với logo công ty
2. Upload lên Cloudinary
3. Cập nhật URL trong code
4. Deploy và test với Facebook Debugger


