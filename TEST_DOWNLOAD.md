# Hướng dẫn test chức năng download tài liệu

## ✅ Code đã sẵn sàng

Tất cả code đã được cấu hình đúng:
- ✅ Server route `/api/resources/download` đã sẵn sàng
- ✅ Client code đã xử lý download file
- ✅ 10 file PDF/DOCX đã được tạo
- ✅ Mapping file names đã đúng

## 🧪 Cách test

### Bước 1: Deploy code mới

1. **Commit và push code:**
   ```bash
   git add .
   git commit -m "Add resource download functionality"
   git push
   ```

2. **Deploy lên production:**
   - Vercel sẽ tự động deploy client
   - Railway sẽ tự động deploy server (nếu dùng Railway)

### Bước 2: Upload file lên server production

**Quan trọng:** File hiện tại chỉ có trên local. Bạn cần upload lên server production.

#### Cách 1: Upload qua Git (không khuyến nghị cho file lớn)
- File sẽ được commit vào Git
- Tự động deploy cùng code

#### Cách 2: Upload qua FTP/SFTP
- Kết nối vào server production
- Upload tất cả file từ `server/uploads/resources/` lên server

#### Cách 3: Upload qua Railway/Vercel Dashboard
- Nếu dùng Railway: Upload file qua dashboard
- Nếu dùng Vercel: Có thể dùng Vercel CLI

### Bước 3: Test trên website

1. **Mở website:** `https://duhocannhien.vercel.app/resources`

2. **Test download:**
   - Nhập email của bạn
   - Click "Xác nhận"
   - Click "Tải xuống" trên bất kỳ tài liệu nào
   - File sẽ được download về máy

3. **Kiểm tra:**
   - File có được download không?
   - Tên file có đúng không?
   - File có mở được không?

## 🔍 Troubleshooting

### Vấn đề 1: File không download được

**Nguyên nhân có thể:**
- File chưa được upload lên server production
- Đường dẫn file sai
- Server chưa được deploy

**Giải pháp:**
1. Kiểm tra file có trong `server/uploads/resources/` trên server production không
2. Kiểm tra server logs để xem lỗi
3. Test route trực tiếp: `https://[server-url]/api/resources/file/1`

### Vấn đề 2: Lỗi 404 File not found

**Nguyên nhân:**
- File chưa được upload
- Tên file sai

**Giải pháp:**
1. Kiểm tra tên file có đúng mapping không
2. Upload lại file với tên đúng

### Vấn đề 3: File download nhưng không mở được

**Nguyên nhân:**
- File bị corrupt
- Content-Type header sai

**Giải pháp:**
1. Kiểm tra file có mở được trên máy không
2. Kiểm tra Content-Type header trong response

## 📋 Checklist trước khi test

- [ ] Code đã được commit và push
- [ ] Server đã được deploy
- [ ] Client đã được deploy
- [ ] File đã được upload lên server production
- [ ] Đã test route `/api/resources/file/1` trực tiếp
- [ ] Đã test download trên website

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
- ✅ Người dùng nhập email
- ✅ Click "Tải xuống"
- ✅ File được download về máy
- ✅ File mở được và đúng nội dung
- ✅ Thông tin download được ghi vào database

---

**Sau khi upload file lên server production, chức năng download sẽ hoạt động hoàn toàn!**

