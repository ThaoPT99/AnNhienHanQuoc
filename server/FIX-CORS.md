# 🔧 HƯỚNG DẪN SỬA LỖI CORS

## ❌ Lỗi hiện tại

```
Access to XMLHttpRequest at 'https://annhienhanquoc-production.up.railway.app/api/contacts' 
from origin 'https://duhocannhien.vercel.app' has been blocked by CORS policy
```

**Nguyên nhân**: Backend chỉ cho phép requests từ `http://localhost:3000`, nhưng frontend đang chạy trên `https://duhocannhien.vercel.app`

## ✅ Giải pháp

### Bước 1: Code đã được cập nhật

Code backend đã được cập nhật để hỗ trợ nhiều origins:
- `http://localhost:3000` (development)
- `https://duhocannhien.vercel.app` (production)
- Hoặc bất kỳ URL nào trong biến môi trường `FRONTEND_URL`

### Bước 2: Deploy code mới lên Railway

1. **Commit và push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Fix CORS: Support multiple origins"
   git push
   ```

2. **Railway sẽ tự động deploy** code mới từ GitHub

### Bước 3: Kiểm tra Railway Deployment

1. Vào Railway Dashboard: https://railway.app/
2. Chọn project của bạn
3. Kiểm tra xem deployment đã thành công chưa
4. Xem logs để đảm bảo không có lỗi

### Bước 4: (Tùy chọn) Cấu hình Environment Variable

Nếu bạn muốn thêm frontend URL khác, thêm vào Railway:

1. Vào Railway Dashboard
2. Chọn service backend của bạn
3. Vào tab **Variables**
4. Thêm biến môi trường:
   ```
   FRONTEND_URL=https://duhocannhien.vercel.app
   ```
5. Railway sẽ tự động restart service

## 🧪 Test sau khi fix

1. **Mở trình duyệt**: `https://duhocannhien.vercel.app/admin`
2. **Mở Developer Console** (F12)
3. **Kiểm tra**:
   - Không còn lỗi CORS
   - Dữ liệu load được
   - API requests thành công

## 📋 Checklist

- [ ] Code đã được commit và push lên GitHub
- [ ] Railway đã deploy code mới
- [ ] Không có lỗi trong Railway logs
- [ ] Frontend có thể kết nối với backend
- [ ] Dữ liệu hiển thị đúng

## 🔍 Debug nếu vẫn lỗi

### 1. Kiểm tra Railway Logs

```bash
# Xem logs trong Railway dashboard
# Hoặc dùng Railway CLI
railway logs
```

Tìm dòng: `CORS blocked origin:` để xem origin nào bị chặn

### 2. Kiểm tra Network Tab

1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Tìm request bị lỗi
4. Kiểm tra **Response Headers**:
   - `Access-Control-Allow-Origin` phải có giá trị đúng

### 3. Test API trực tiếp

```bash
# Test từ command line
curl -H "Origin: https://duhocannhien.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://annhienhanquoc-production.up.railway.app/api/health
```

Nếu thấy header `Access-Control-Allow-Origin: https://duhocannhien.vercel.app` thì CORS đã hoạt động.

## 🎯 Kết quả mong đợi

Sau khi fix:
- ✅ Frontend có thể gọi API từ backend
- ✅ Không còn lỗi CORS trong console
- ✅ Dữ liệu hiển thị đúng
- ✅ Upload ảnh hoạt động
- ✅ Admin panel hoạt động bình thường

## 💡 Lưu ý

- Code đã được cập nhật để tự động cho phép cả localhost và Vercel domain
- Nếu bạn thêm domain mới, chỉ cần thêm vào mảng `allowedOrigins` trong `index.js`
- Hoặc set biến môi trường `FRONTEND_URL` trên Railway

