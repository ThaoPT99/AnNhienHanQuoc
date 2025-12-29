# 🔧 Hướng Dẫn: Hiển Thị "Du Học An Nhiên" Thay Vì "Vercel" Trên Google

## Vấn đề
Google đang hiển thị "Vercel" trong kết quả tìm kiếm thay vì "Du Học An Nhiên" vì:
1. Domain đang là `duhocannhien.vercel.app` (subdomain của Vercel)
2. Google tự động nhận diện hosting provider khi chưa có structured data đầy đủ
3. Chưa có brand information rõ ràng trong structured data

## Giải pháp đã thực hiện ✅

### 1. **Thêm Structured Data vào index.html** (Static file - quan trọng nhất)
- ✅ Thêm Organization schema với `@id` và `brand` property
- ✅ Thêm WebSite schema liên kết với Organization
- ✅ Sử dụng `@id` để Google liên kết các entities

### 2. **Cải thiện SEO Component**
- ✅ Thêm `@id` cho Organization
- ✅ Thêm `brand` property với Brand schema
- ✅ Thêm `copyrightHolder` và `publisher` với `@id`
- ✅ Liên kết WebSite với Organization qua `@id`

### 3. **Meta Tags đã có**
- ✅ `application-name`: "Du học An Nhiên"
- ✅ `og:site_name`: "Du học An Nhiên"
- ✅ `apple-mobile-web-app-title`: "Du học An Nhiên"

## Các bước tiếp theo để Google cập nhật

### Bước 1: Request Re-Index trong Google Search Console
1. Truy cập [Google Search Console](https://search.google.com/search-console)
2. Vào **URL Inspection**
3. Nhập URL: `https://duhocannhien.vercel.app`
4. Click **Request Indexing**
5. Lặp lại cho các trang quan trọng

### Bước 2: Kiểm tra Structured Data
1. Sử dụng [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Test URL: `https://duhocannhien.vercel.app`
3. Kiểm tra Organization schema có đầy đủ không
4. Đảm bảo `brand` property hiển thị đúng

### Bước 3: Submit Sitemap (Nếu chưa)
1. Vào Google Search Console
2. Vào **Sitemaps**
3. Submit: `https://duhocannhien.vercel.app/sitemap.xml`

### Bước 4: Tạo Google Business Profile (Quan trọng)
1. Truy cập [Google Business Profile](https://business.google.com)
2. Tạo business profile với tên: **"Du Học An Nhiên"**
3. Thêm địa chỉ: 219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội
4. Thêm website: `https://duhocannhien.vercel.app`
5. Verify business profile

### Bước 5: Đăng ký Domain Tùy Chỉnh (Tối ưu nhất)
**Quan trọng**: Mặc dù đã có structured data, Google vẫn có thể ưu tiên hiển thị tên hosting provider cho subdomain. 

Để chắc chắn Google hiển thị "Du Học An Nhiên":
1. Đăng ký domain: `duhocannhien.com` hoặc `duhocannhien.vn`
2. Thêm domain vào Vercel (Settings → Domains)
3. Cập nhật code theo hướng dẫn trong `UPDATE-DOMAIN-GUIDE.md`
4. Deploy lại và request re-index

## Thời gian Google cập nhật
- **Request Indexing**: 1-7 ngày
- **Hoàn toàn thay đổi brand name**: 2-4 tuần
- **Nếu có domain tùy chỉnh**: Nhanh hơn (3-7 ngày)

## Kiểm tra kết quả
1. Tìm kiếm: `site:duhocannhien.vercel.app`
2. Kiểm tra phần hiển thị brand name (ô đỏ)
3. Sử dụng [Google Search Console](https://search.google.com/search-console) để theo dõi

## Lưu ý quan trọng
- ⚠️ **Nếu vẫn dùng vercel.app domain**: Google có thể vẫn hiển thị "Vercel" trong một số trường hợp
- ✅ **Domain tùy chỉnh**: Là cách tốt nhất để Google nhận diện brand name
- ✅ **Google Business Profile**: Giúp Google nhận diện brand tốt hơn
- ✅ **Consistent brand name**: Đảm bảo tên brand nhất quán trong tất cả structured data

## Testing
Sau khi deploy, kiểm tra:
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Các file đã cập nhật
- ✅ `client/public/index.html` - Thêm Organization và WebSite schema
- ✅ `client/src/components/SEO.js` - Cải thiện structured data với `@id` và `brand`
- ✅ `client/src/config/site.js` - Config tập trung cho brand name

