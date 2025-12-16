# 🚨 KHÔI PHỤC ẢNH BỊ MẤT SAU KHI DEPLOY

## ❌ Vấn đề

Sau khi Railway deploy lại, tất cả ảnh đã bị mất vì:
- Railway mặc định lưu file trong `/tmp` hoặc thư mục tạm
- Khi service restart/redeploy, các file này bị xóa
- Database vẫn còn thông tin về ảnh, nhưng file thực tế đã mất

## ✅ Giải pháp

### Option 1: Sử dụng Railway Volume (Khuyến nghị)

Railway Volume là persistent storage, file sẽ không bị mất khi redeploy.

#### Bước 1: Tạo Volume trên Railway

1. Vào Railway Dashboard: https://railway.app/
2. Chọn project của bạn
3. Click **"+ New"** → Chọn **"Volume"**
4. Đặt tên: `gallery-uploads`
5. Mount path: `/data`
6. Click **"Add"**

#### Bước 2: Cập nhật code để sử dụng Volume

Cập nhật `server/index.js`:

```javascript
// Thay đổi uploads directory
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads', 'gallery');

// Nếu dùng Railway Volume, set environment variable:
// UPLOADS_DIR=/data/uploads/gallery
```

Hoặc sửa trực tiếp:

```javascript
// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
```

#### Bước 3: Set Environment Variable trên Railway

1. Vào Railway Dashboard
2. Chọn service backend
3. Vào tab **"Variables"**
4. Thêm biến môi trường:
   ```
   UPLOADS_DIR=/data/uploads/gallery
   ```
5. Railway sẽ tự động restart service

#### Bước 4: Deploy lại

Railway sẽ tự động mount volume và lưu file vào `/data/uploads/gallery`

### Option 2: Sử dụng Cloud Storage (Tốt nhất cho Production)

Thay vì lưu file local, upload lên cloud storage:

#### Các lựa chọn:
- **Cloudinary** (Miễn phí 25GB)
- **AWS S3**
- **Google Cloud Storage**
- **Cloudflare R2** (Miễn phí 10GB)

#### Lợi ích:
- ✅ File không bao giờ mất
- ✅ CDN tự động
- ✅ Không lo về storage limit
- ✅ Backup tự động

### Option 3: Backup thường xuyên

Nếu vẫn dùng local storage, cần backup thường xuyên:

```bash
# Backup script
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## 🔄 Khôi phục ảnh hiện tại

### Kiểm tra Database

Database có thể vẫn còn thông tin về ảnh:

1. Vào Admin panel
2. Xem "Quản lý thư viện ảnh"
3. Nếu thấy danh sách ảnh nhưng không hiển thị → File đã mất, chỉ còn metadata

### Khôi phục từ Backup (nếu có)

Nếu bạn có backup file `uploads/`:
1. Upload lại file backup
2. Đảm bảo đường dẫn đúng
3. Ảnh sẽ hiển thị lại

### Upload lại ảnh

Nếu không có backup:
1. Vào Admin → "Quản lý thư viện ảnh"
2. Xóa các record ảnh cũ (chỉ còn metadata, không có file)
3. Upload lại ảnh mới

## 🛡️ Ngăn chặn mất ảnh trong tương lai

### Checklist:

- [ ] Đã tạo Railway Volume
- [ ] Đã set `UPLOADS_DIR=/data/uploads/gallery`
- [ ] Đã test upload ảnh mới
- [ ] Đã verify ảnh không mất sau khi restart
- [ ] (Tùy chọn) Đã setup cloud storage

## 📝 Code cần cập nhật

Cập nhật `server/index.js` để hỗ trợ Railway Volume:

```javascript
// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log('📁 Uploads directory:', uploadsDir);
```

## ⚠️ Lưu ý quan trọng

1. **Railway Volume là giải pháp tốt nhất** cho persistent storage
2. **Cloud Storage** là giải pháp tốt nhất cho production
3. **Local storage** chỉ dùng cho development
4. **Luôn backup** trước khi deploy lớn

## 🎯 Kế hoạch hành động

1. ✅ Tạo Railway Volume ngay
2. ✅ Set environment variable `UPLOADS_DIR`
3. ✅ Deploy lại code
4. ✅ Upload lại ảnh
5. ✅ Test restart để đảm bảo ảnh không mất

