# 🚨 SỬA LỖI CORS - HƯỚNG DẪN NHANH

## ❌ Lỗi hiện tại

```
Access to XMLHttpRequest blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

## ✅ Giải pháp

Code đã được sửa để:
1. ✅ Xử lý preflight requests (OPTIONS)
2. ✅ Cho phép origin từ Vercel
3. ✅ Thêm logging để debug

## 🚀 CÁC BƯỚC DEPLOY

### Bước 1: Commit và Push code

```bash
cd "C:\Users\phant\OneDrive\MYTNH~1\AnNhienHanQuoc"
git add .
git commit -m "Fix CORS: Add preflight handling and better error logging"
git push
```

### Bước 2: Kiểm tra Railway Deployment

1. Vào: https://railway.app/
2. Chọn project của bạn
3. Kiểm tra deployment status
4. Xem logs để đảm bảo không có lỗi

### Bước 3: Kiểm tra Environment Variables trên Railway

Đảm bảo có biến môi trường:
- `FRONTEND_URL=https://duhocannhien.vercel.app` (tùy chọn, nhưng nên có)

### Bước 4: Test lại

1. Mở: `https://duhocannhien.vercel.app/admin-gallery`
2. Mở Developer Console (F12)
3. Thử thêm ảnh mới
4. Kiểm tra không còn lỗi CORS

## 🔍 Debug nếu vẫn lỗi

### Kiểm tra Railway Logs

Trong Railway dashboard, xem logs và tìm:
- `CORS blocked origin:` - để xem origin nào bị chặn
- `Allowed origins:` - để xem danh sách origins được phép

### Test API trực tiếp

```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: https://duhocannhien.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,x-admin-token" \
  -v \
  https://annhienhanquoc-production.up.railway.app/api/gallery
```

Nếu thấy header `Access-Control-Allow-Origin: https://duhocannhien.vercel.app` thì CORS đã hoạt động.

## ⚠️ Lưu ý

- Code mới phải được deploy lên Railway mới hoạt động
- Đợi 1-2 phút sau khi push để Railway deploy xong
- Clear browser cache nếu cần

