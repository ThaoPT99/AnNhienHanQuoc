# 🔄 Hướng Dẫn Cập Nhật Domain Website

## Vấn đề hiện tại
Google đang hiển thị "Vercel" trong kết quả tìm kiếm vì website đang sử dụng domain `duhocannhien.vercel.app`.

## Giải pháp

### Bước 1: Đăng ký Domain Tùy Chỉnh (Nếu chưa có)
- Đăng ký domain tại: Namecheap, GoDaddy, FPT, P.A Việt Nam, v.v.
- Domain đề xuất: `duhocannhien.com` hoặc `duhocannhien.vn`

### Bước 2: Thêm Domain vào Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project "AnNhienHanQuoc"
3. Vào **Settings** → **Domains**
4. Click **Add Domain**
5. Nhập domain mới (ví dụ: `duhocannhien.com`)
6. Làm theo hướng dẫn để cấu hình DNS:
   - Thêm A record hoặc CNAME record trỏ đến Vercel
   - Chờ DNS propagate (5-30 phút)

### Bước 3: Cập Nhật Domain Trong Code

#### 3.1. Cập nhật file config (Dễ nhất)
Mở file `client/src/config/site.js` và thay đổi dòng:
```javascript
domain: process.env.REACT_APP_SITE_DOMAIN || 'https://duhocannhien.vercel.app',
```
Thành:
```javascript
domain: process.env.REACT_APP_SITE_DOMAIN || 'https://duhocannhien.com', // Thay bằng domain mới
```

#### 3.2. Hoặc sử dụng Environment Variable (Khuyến nghị)
Tạo file `.env` trong thư mục `client/`:
```env
REACT_APP_SITE_DOMAIN=https://duhocannhien.com
```

#### 3.3. Cập nhật file index.html
Mở `client/public/index.html` và thay thế tất cả:
- `https://duhocannhien.vercel.app` → `https://duhocannhien.com` (domain mới)

Các vị trí cần thay:
- Line 22: `og:url`
- Line 34: `og:logo`
- Line 38: `twitter:url`
- Line 61: `canonical`

#### 3.4. Cập nhật sitemap.xml
Mở `client/public/sitemap.xml` và thay thế tất cả:
- `https://duhocannhien.vercel.app` → `https://duhocannhien.com`

#### 3.5. Cập nhật robots.txt
Mở `client/public/robots.txt` và thay thế:
- `https://duhocannhien.vercel.app` → `https://duhocannhien.com`

### Bước 4: Cập Nhật Google Search Console

1. **Thêm Domain Mới vào Search Console**
   - Truy cập [Google Search Console](https://search.google.com/search-console)
   - Click **Add Property**
   - Chọn **Domain** (khuyến nghị) hoặc **URL prefix**
   - Nhập domain mới: `duhocannhien.com`
   - Verify ownership (DNS record hoặc HTML file)

2. **Submit Sitemap Mới**
   - Vào **Sitemaps** trong Search Console
   - Submit: `https://duhocannhien.com/sitemap.xml`

3. **Yêu Cầu Re-Index**
   - Vào **URL Inspection**
   - Nhập URL trang chủ: `https://duhocannhien.com`
   - Click **Request Indexing**
   - Lặp lại cho các trang quan trọng (About, Services, Contact, v.v.)

4. **Thêm Canonical URL**
   - Đảm bảo canonical URL trong code trỏ đến domain mới
   - Đã được xử lý tự động trong SEO component

### Bước 5: Cập Nhật Social Media
- Facebook: Cập nhật website URL trong Page Settings
- TikTok: Cập nhật link trong profile
- Các nền tảng khác: Cập nhật link website

### Bước 6: Deploy và Test

1. **Commit và Push Code**
```bash
git add .
git commit -m "Update domain to duhocannhien.com"
git push
```

2. **Kiểm Tra Deployment**
   - Đợi Vercel deploy xong
   - Truy cập domain mới để kiểm tra
   - Kiểm tra meta tags bằng [Open Graph Debugger](https://developers.facebook.com/tools/debug/)
   - Kiểm tra structured data bằng [Google Rich Results Test](https://search.google.com/test/rich-results)

### Bước 7: Chuyển Hướng (301 Redirect)

Để đảm bảo SEO, thêm redirect từ domain cũ sang domain mới trong Vercel:

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Giữ cả 2 domains (cũ và mới)
3. Set domain mới làm **Primary Domain**
4. Vercel sẽ tự động redirect domain cũ sang domain mới

Hoặc thêm vào `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://duhocannhien.com/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "duhocannhien.vercel.app"
        }
      ]
    }
  ]
}
```

## Thời Gian Google Cập Nhật
- **DNS Propagation**: 5 phút - 48 giờ
- **Google Re-index**: 1-7 ngày
- **Hoàn toàn thay thế kết quả cũ**: 2-4 tuần

## Lưu Ý Quan Trọng
- ✅ Giữ domain cũ hoạt động ít nhất 1 tháng sau khi chuyển
- ✅ Đảm bảo cả 2 domains đều có SSL certificate (HTTPS)
- ✅ Kiểm tra tất cả links trong website đều dùng domain mới
- ✅ Cập nhật email signature, business cards, v.v. với domain mới

## Script Tự Động (Tùy chọn)

Nếu có nhiều files cần cập nhật, có thể chạy script:
```bash
# Windows PowerShell
Get-ChildItem -Recurse -Include *.html,*.xml,*.txt,*.js,*.ts,*.json | 
  ForEach-Object {
    (Get-Content $_.FullName) -replace 'duhocannhien\.vercel\.app', 'duhocannhien.com' | 
    Set-Content $_.FullName
  }
```

**Lưu ý**: Backup code trước khi chạy script!

## Hỗ Trợ
Nếu gặp vấn đề, kiểm tra:
1. DNS records đã đúng chưa
2. SSL certificate đã active chưa
3. Vercel deployment có lỗi không
4. Google Search Console có error không

