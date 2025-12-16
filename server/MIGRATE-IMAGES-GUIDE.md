# 📤 HƯỚNG DẪN MIGRATE ẢNH LÊN CLOUDINARY

## 🎯 Mục tiêu

Upload tất cả ảnh hiện có (từ URL hoặc local) lên Cloudinary để:
- ✅ Ảnh không bao giờ mất khi redeploy
- ✅ Ảnh được lưu trữ bền vững trên cloud
- ✅ CDN tự động, ảnh tải nhanh

## 📋 Các bước thực hiện

### Bước 1: Đảm bảo Cloudinary đã được config

1. Vào **Railway → Variables**
2. Kiểm tra có 3 biến:
   - `CLOUDINARY_CLOUD_NAME` = `dy84xpayv`
   - `CLOUDINARY_API_KEY` = `454452135715899`
   - `CLOUDINARY_API_SECRET` = `Z_Z5O5pVMIkMFDf7r_tCXrChNdo`

### Bước 2: Chạy script migration

Có 2 cách:

#### Cách 1: Chạy trên Railway (Khuyến nghị)

1. Vào **Railway → Deployments**
2. Click vào deployment mới nhất
3. Vào tab **Deploy Logs**
4. Tìm dòng có `Server is running on port...`
5. Click vào service → **Settings** → **Run Command**
6. Chạy lệnh:
   ```bash
   node migrate-urls-to-cloudinary.js
   ```

#### Cách 2: Chạy local (nếu có database local)

1. Mở terminal
2. Chạy:
   ```bash
   cd server
   node migrate-urls-to-cloudinary.js
   ```

### Bước 3: Xem kết quả

Script sẽ:
- ✅ Tìm tất cả ảnh trong database
- ✅ Download ảnh từ URL hiện tại
- ✅ Upload lên Cloudinary
- ✅ Cập nhật database với URL mới

**Output mẫu:**
```
🚀 Starting migration of URLs to Cloudinary...

📊 Found 10 images in database

📁 Found 10 images to migrate to Cloudinary

[1/10] Processing: Image #1
   📍 Current URL: https://annhienhanquoc-production.up.railway.app/uploads/gallery/...
   ⬇️  Downloading image...
   ✅ Downloaded 245.67 KB
   📤 Uploading to Cloudinary...
   ✅ Migrated successfully!
   🔗 New Cloudinary URL: https://res.cloudinary.com/dy84xpayv/image/upload/...

✅ Migration complete!
   ✅ Success: 10
   ❌ Errors: 0
   ⏭️  Skipped: 0
```

### Bước 4: Kiểm tra Cloudinary Dashboard

1. Vào https://cloudinary.com/console
2. Vào **Media Library**
3. Xem ảnh đã được upload chưa
4. Nếu có → Migration thành công! ✅

### Bước 5: Test trên website

1. Vào https://duhocannhien.vercel.app/gallery
2. Kiểm tra xem ảnh có hiển thị không
3. Mở Developer Tools (F12) → Network tab
4. Xem ảnh có đang load từ `res.cloudinary.com` không
5. Nếu có → Migration thành công! ✅

## 🔍 Troubleshooting

### Lỗi: "Cloudinary is not configured"

**Giải pháp:**
- Kiểm tra lại 3 biến môi trường trên Railway
- Đảm bảo không có khoảng trắng thừa
- Redeploy lại service

### Lỗi: "Failed to download"

**Nguyên nhân:**
- URL không còn tồn tại
- URL bị chặn
- Network error

**Giải pháp:**
- Script sẽ skip ảnh đó và tiếp tục
- Kiểm tra URL trong database xem có đúng không

### Lỗi: "Upload failed"

**Nguyên nhân:**
- Cloudinary API credentials sai
- Network error
- File quá lớn

**Giải pháp:**
- Kiểm tra lại Cloudinary credentials
- Kiểm tra Cloudinary Dashboard xem có lỗi gì không

## ✅ Kết quả mong đợi

Sau khi migration thành công:
- ✅ Tất cả ảnh được lưu trên Cloudinary
- ✅ Database được cập nhật với URL mới
- ✅ Website vẫn hiển thị ảnh bình thường
- ✅ Ảnh không bao giờ mất khi redeploy

## 📊 Kiểm tra sau migration

1. **Cloudinary Dashboard**: Xem số lượng ảnh đã upload
2. **Website**: Kiểm tra ảnh có hiển thị không
3. **Database**: Kiểm tra URL đã được cập nhật chưa
4. **Redeploy test**: Redeploy lại và kiểm tra ảnh có còn không

---

**Chạy script migration để upload tất cả ảnh lên Cloudinary!** 🚀

