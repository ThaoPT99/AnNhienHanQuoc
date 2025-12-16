# 🔒 GIẢI PHÁP LƯU TRỮ ẢNH BỀN VỮNG - KHÔNG MẤT KHI DEPLOY

## ❌ Vấn đề hiện tại

Mỗi lần deploy lại, tất cả hình ảnh bị mất vì:
- Railway/Render/Cloud platforms có **ephemeral storage** (lưu trữ tạm thời)
- Khi service restart hoặc redeploy, file system bị reset về trạng thái ban đầu
- File uploads trong thư mục `uploads/` sẽ bị xóa

## ✅ Giải pháp: Cloudinary (Khuyến nghị)

**Cloudinary** là dịch vụ cloud storage miễn phí, hoàn hảo cho ảnh:
- ✅ **Miễn phí**: 25GB storage, 25GB bandwidth/tháng
- ✅ **CDN tự động**: Ảnh được phân phối nhanh toàn cầu
- ✅ **Tự động optimize**: Resize, compress tự động
- ✅ **Không bao giờ mất**: Lưu trữ vĩnh viễn trên cloud
- ✅ **Dễ tích hợp**: Chỉ cần API key

## 🚀 Cài đặt Cloudinary

### Bước 1: Tạo tài khoản Cloudinary

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Vào Dashboard → Settings → Upload
4. Copy các thông tin:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### Bước 2: Cấu hình Environment Variables

Trong Railway/Render dashboard, thêm các biến môi trường:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Bước 3: Cài đặt package

```bash
cd server
npm install cloudinary
```

### Bước 4: Code đã được cập nhật tự động

Code đã được cập nhật để:
- Tự động detect nếu có Cloudinary config → dùng Cloudinary
- Nếu không có → fallback về local storage (cho development)

## 📋 Cách sử dụng

### Upload ảnh qua Admin Panel

1. Đăng nhập Admin
2. Vào "Quản lý thư viện ảnh"
3. Chọn file ảnh
4. Click "Thêm mới"
5. Ảnh sẽ tự động upload lên Cloudinary và lưu URL vào database

### Upload qua API

```bash
curl -X POST https://your-server.com/api/gallery \
  -F "image=@/path/to/image.jpg" \
  -F "title=Tiêu đề" \
  -F "category=Trường học"
```

## 🔄 Migration ảnh cũ

Nếu bạn có ảnh cũ đang lưu local, chạy script migration:

```bash
cd server
node migrate-to-cloudinary.js
```

Script này sẽ:
1. Đọc tất cả ảnh trong `uploads/gallery/`
2. Upload lên Cloudinary
3. Cập nhật URL trong database
4. Giữ lại file local (backup)

## 🎯 Lợi ích

| Tính năng | Local Storage | Cloudinary |
|-----------|--------------|------------|
| Mất khi deploy | ❌ Có | ✅ Không |
| CDN | ❌ Không | ✅ Có |
| Auto optimize | ❌ Không | ✅ Có |
| Backup | ❌ Phải tự làm | ✅ Tự động |
| Miễn phí | ✅ Có | ✅ Có (25GB) |

## 🔐 Bảo mật

- API Secret phải được giữ bí mật
- Không commit vào Git
- Chỉ lưu trong Environment Variables
- Cloudinary có built-in security features

## 📊 Monitoring

Vào Cloudinary Dashboard để xem:
- Số lượng ảnh đã upload
- Dung lượng đã sử dụng
- Bandwidth đã dùng
- Analytics

## ⚠️ Lưu ý

1. **Free tier**: 25GB storage + 25GB bandwidth/tháng
   - Đủ cho hàng nghìn ảnh
   - Nếu vượt quá, có thể upgrade hoặc optimize ảnh

2. **Backup**: Dù Cloudinary rất ổn định, vẫn nên backup database định kỳ

3. **Fallback**: Code vẫn hỗ trợ local storage nếu không có Cloudinary config

## 🆘 Troubleshooting

### Ảnh không hiển thị sau khi upload

1. Kiểm tra Environment Variables đã đúng chưa
2. Kiểm tra Cloudinary Dashboard xem ảnh đã upload chưa
3. Xem server logs để tìm lỗi

### Lỗi "Invalid API credentials"

- Kiểm tra lại `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Đảm bảo không có khoảng trắng thừa

### Muốn quay lại local storage

Chỉ cần xóa hoặc comment các biến môi trường Cloudinary, code sẽ tự động fallback về local.

---

**Sau khi setup xong, ảnh sẽ KHÔNG BAO GIỜ bị mất khi deploy!** 🎉

