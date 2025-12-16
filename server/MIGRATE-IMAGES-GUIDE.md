# Hướng dẫn Migrate Images sang Cloudinary

## Vấn đề
Khi redeploy trên Railway, tất cả images trong thư viện ảnh bị mất vì Railway sử dụng ephemeral storage (lưu trữ tạm thời).

## Giải pháp
Migrate tất cả images sang Cloudinary - một dịch vụ lưu trữ ảnh trên cloud, không bị mất khi redeploy.

## Bước 1: Cấu hình Cloudinary trên Railway

1. Đăng ký tài khoản Cloudinary miễn phí tại: https://cloudinary.com/users/register/free
2. Vào Dashboard → Settings → Get started
3. Copy 3 thông tin sau:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

4. Vào Railway Dashboard → Project → Variables
5. Thêm 3 biến môi trường:
   ```
   CLOUDINARY_CLOUD_NAME = <cloud_name_của_bạn>
   CLOUDINARY_API_KEY = <api_key_của_bạn>
   CLOUDINARY_API_SECRET = <api_secret_của_bạn>
   ```

## Bước 2: Redeploy để áp dụng biến môi trường

Sau khi thêm biến môi trường, Railway sẽ tự động redeploy. Đợi deploy xong.

## Bước 3: Chạy Migration Script

Có 2 cách để migrate images:

### Cách 1: Migrate từ URLs (Khuyến nghị)
Script này sẽ download images từ URLs hiện tại (Railway URLs, external URLs) và upload lên Cloudinary.

```bash
# SSH vào Railway hoặc chạy local với Railway CLI
node migrate-urls-to-cloudinary.js
```

### Cách 2: Migrate từ Local Files
Nếu bạn có access vào server và files vẫn còn trên server:

```bash
node migrate-to-cloudinary.js
```

## Bước 4: Kiểm tra kết quả

1. Vào Admin Gallery trên website
2. Kiểm tra xem tất cả images có hiển thị không
3. Kiểm tra URL của images - phải là `https://res.cloudinary.com/...`

## Sau khi migrate

- ✅ Tất cả images mới upload sẽ tự động lưu lên Cloudinary
- ✅ Images sẽ không bị mất khi redeploy
- ✅ Images được tối ưu tự động bởi Cloudinary
- ✅ CDN toàn cầu cho tốc độ tải nhanh

## Lưu ý

- Migration script sẽ tự động bỏ qua images đã có trên Cloudinary
- Nếu image URL không thể download được, script sẽ skip và tiếp tục với image tiếp theo
- Sau khi migrate thành công, bạn có thể xóa local files (nếu muốn)

## Troubleshooting

### Lỗi: "Cloudinary is not configured"
- Kiểm tra lại biến môi trường trên Railway
- Đảm bảo đã redeploy sau khi thêm biến môi trường

### Lỗi: "Failed to download image"
- Image URL có thể đã không còn tồn tại (đã bị xóa khi redeploy)
- Bạn sẽ cần upload lại những images này thủ công

### Images vẫn bị mất sau khi migrate
- Kiểm tra xem migration có chạy thành công không
- Kiểm tra database xem URLs đã được update chưa
- Đảm bảo Cloudinary credentials đúng
