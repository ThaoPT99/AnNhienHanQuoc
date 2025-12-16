# ⚡ HƯỚNG DẪN NHANH - SETUP CLOUDINARY

## 🎯 Mục tiêu
Sau khi setup, **ảnh sẽ KHÔNG BAO GIỜ bị mất khi deploy**!

## 📝 Các bước thực hiện

### Bước 1: Tạo tài khoản Cloudinary (5 phút)

1. Truy cập: **https://cloudinary.com/users/register/free**
2. Đăng ký bằng email (miễn phí)
3. Xác nhận email

### Bước 2: Lấy thông tin API (2 phút)

1. Đăng nhập vào Cloudinary Dashboard
2. Vào **Settings** (biểu tượng bánh răng) → **Upload**
3. Copy 3 thông tin sau:
   - **Cloud name** (ví dụ: `dxy123abc`)
   - **API Key** (ví dụ: `123456789012345`)
   - **API Secret** (ví dụ: `abcdefghijklmnopqrstuvwxyz`)

### Bước 3: Cấu hình trên Railway/Render (3 phút)

**Nếu dùng Railway:**
1. Vào project trên Railway
2. Click vào service của bạn
3. Vào tab **Variables**
4. Thêm 3 biến môi trường:

```
CLOUDINARY_CLOUD_NAME=dxy123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Nếu dùng Render:**
1. Vào service trên Render
2. Vào **Environment**
3. Thêm 3 biến môi trường tương tự

### Bước 4: Cài đặt package (1 phút)

```bash
cd server
npm install cloudinary
```

### Bước 5: Deploy lại (2 phút)

1. Commit và push code lên GitHub
2. Railway/Render sẽ tự động deploy
3. Kiểm tra logs xem có thông báo "✅ Cloudinary configured successfully"

### Bước 6: Test (1 phút)

1. Đăng nhập Admin
2. Upload một ảnh mới
3. Kiểm tra xem ảnh có hiển thị không
4. Vào Cloudinary Dashboard → Media Library để xem ảnh đã upload

## ✅ Xong!

Từ bây giờ, mọi ảnh upload sẽ được lưu trên Cloudinary và **KHÔNG BAO GIỜ bị mất** khi deploy!

## 🔄 Migration ảnh cũ (Tùy chọn)

Nếu bạn có ảnh cũ đang lưu local, chạy script migration:

```bash
cd server
node migrate-to-cloudinary.js
```

Script sẽ tự động:
- Tìm tất cả ảnh local trong database
- Upload lên Cloudinary
- Cập nhật URL trong database
- Giữ lại file local (backup)

## 🆘 Troubleshooting

### "Cloudinary is not configured"
- Kiểm tra lại 3 biến môi trường đã đúng chưa
- Đảm bảo không có khoảng trắng thừa
- Redeploy lại service

### Ảnh không hiển thị
- Kiểm tra Cloudinary Dashboard xem ảnh đã upload chưa
- Xem server logs để tìm lỗi
- Kiểm tra CORS settings (nếu cần)

### Muốn quay lại local storage
- Xóa 3 biến môi trường Cloudinary
- Redeploy
- Code sẽ tự động fallback về local storage

---

**Tổng thời gian: ~15 phút** ⏱️

**Kết quả: Ảnh không bao giờ mất khi deploy!** 🎉

