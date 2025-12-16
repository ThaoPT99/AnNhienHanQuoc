# 🔍 KIỂM TRA CLOUDINARY - TẠI SAO MẤT ẢNH KHI REDEPLOY

## ❌ Vấn đề

Mỗi lần redeploy, tất cả ảnh bị mất vì:
1. **Ảnh đang được lưu local** trên Railway (ephemeral storage)
2. **Database có thể bị reset** nếu không có persistent storage
3. **Cloudinary chưa được sử dụng** hoặc chưa được init đúng

## ✅ Giải pháp

### Bước 1: Kiểm tra Cloudinary có hoạt động không

Sau khi deploy, vào **Railway → Deploy Logs** và tìm:

**Nếu thấy:**
```
✅ Cloudinary configured successfully
```
→ Cloudinary đã được config đúng ✅

**Nếu thấy:**
```
ℹ️  Cloudinary not configured, using local storage
```
→ Cloudinary chưa được config ❌

### Bước 2: Kiểm tra Environment Variables

Vào **Railway → Variables** và đảm bảo có 3 biến:
- `CLOUDINARY_CLOUD_NAME` = `dy84xpayv`
- `CLOUDINARY_API_KEY` = `454452135715899`
- `CLOUDINARY_API_SECRET` = `Z_Z5O5pVMIkMFDf7r_tCXrChNdo`

### Bước 3: Test upload ảnh mới

1. Đăng nhập Admin: `https://duhocannhien.vercel.app/admin-login`
2. Vào "Quản lý thư viện ảnh"
3. Upload một ảnh mới
4. Kiểm tra logs trên Railway:
   - Nếu thấy: `✅ Image uploaded to Cloudinary:` → Thành công!
   - Nếu thấy: `Cloudinary upload failed, using local storage` → Cloudinary chưa hoạt động

### Bước 4: Kiểm tra Cloudinary Dashboard

1. Vào https://cloudinary.com/console
2. Vào **Media Library**
3. Xem có ảnh nào đã được upload chưa
4. Nếu có → Cloudinary đang hoạt động ✅
5. Nếu không → Cloudinary chưa hoạt động ❌

## 🔧 Nếu Cloudinary chưa hoạt động

### Kiểm tra lại Environment Variables

1. Vào Railway → Variables
2. Xóa 3 biến Cloudinary
3. Thêm lại từng biến một, đảm bảo:
   - **Name** không có khoảng trắng thừa
   - **Value** không có khoảng trắng thừa
   - Không có dấu `=` trong Name hoặc Value

### Redeploy lại

Sau khi sửa xong:
1. Vào Railway → Deployments
2. Click **Redeploy**
3. Kiểm tra logs xem có `✅ Cloudinary configured successfully` không

## 📊 Kiểm tra Database

Database cũng có thể bị mất nếu không có persistent storage. Kiểm tra:

1. Vào Railway → Volumes
2. Xem có volume nào được mount cho database không
3. Nếu không có, cần setup Railway Volume cho database

## 🎯 Kết quả mong đợi

Sau khi setup đúng:
- ✅ Ảnh được lưu trên Cloudinary (không bao giờ mất)
- ✅ Database được lưu persistent (không mất khi redeploy)
- ✅ Logs hiển thị: `✅ Cloudinary configured successfully`
- ✅ Upload ảnh mới thấy: `✅ Image uploaded to Cloudinary:`

---

**Kiểm tra logs trên Railway để xem Cloudinary có hoạt động không!** 🔍

