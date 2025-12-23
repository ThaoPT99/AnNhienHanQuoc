# Hướng dẫn upload tài liệu miễn phí

## ✅ Đã sửa

### Vấn đề
- Trước đây: Code chỉ ghi lại thông tin download vào database, không thực sự trả về file
- Bây giờ: Code đã được sửa để thực sự download file khi người dùng click "Tải xuống"

### Những gì đã được sửa

1. **Server (`server/index.js`):**
   - ✅ Tạo mapping file paths cho từng resource ID
   - ✅ Tự động tạo thư mục `server/uploads/resources` nếu chưa có
   - ✅ Thêm route `GET /api/resources/file/:id` để serve file
   - ✅ Cập nhật route `POST /api/resources/download` để trả về file thay vì chỉ JSON

2. **Client (`client/src/pages/Resources.js`):**
   - ✅ Cập nhật logic download để thực sự tải file về máy
   - ✅ Xử lý blob response và trigger download

## 📁 Cấu trúc file

### Mapping Resource ID → File Name

| Resource ID | Tên tài liệu | File name |
|------------|-------------|-----------|
| 1 | Checklist hồ sơ du học Hàn Quốc | `checklist-ho-so-du-hoc-han-quoc.pdf` |
| 2 | Hướng dẫn xin visa D-2 chi tiết | `huong-dan-xin-visa-d2.pdf` |
| 3 | Template thư giới thiệu bản thân | `template-thu-gioi-thieu-ban-than.docx` |
| 4 | Kế hoạch học tập mẫu | `ke-hoach-hoc-tap-mau.docx` |
| 5 | Danh sách trường đại học Hàn Quốc | `danh-sach-truong-dai-hoc-han-quoc.pdf` |
| 6 | Hướng dẫn luyện thi TOPIK | `huong-dan-luyen-thi-topik.pdf` |
| 7 | Từ vựng tiếng Hàn du học sinh | `tu-vung-tieng-han-du-hoc-sinh.pdf` |
| 8 | Hướng dẫn tìm nhà ở tại Hàn Quốc | `huong-dan-tim-nha-o-han-quoc.pdf` |
| 9 | Checklist chuẩn bị lên đường | `checklist-chuan-bi-len-duong.pdf` |
| 10 | Hướng dẫn làm thêm tại Hàn Quốc | `huong-dan-lam-them-han-quoc.pdf` |

## 📝 Các bước upload file

### Bước 1: Chuẩn bị file

1. Chuẩn bị các file tài liệu theo danh sách trên
2. Đảm bảo:
   - File PDF có extension `.pdf`
   - File Word có extension `.docx`
   - Tên file phải **chính xác** như trong bảng mapping (không phân biệt hoa thường)

### Bước 2: Upload file vào server

#### Cách 1: Upload trực tiếp vào thư mục (Local)

1. Mở thư mục: `server/uploads/resources/`
2. Copy các file vào thư mục này
3. Đảm bảo tên file chính xác

#### Cách 2: Upload qua FTP/SFTP (Production)

1. Kết nối vào server production (Railway/Vercel)
2. Upload file vào thư mục: `server/uploads/resources/`
3. Đảm bảo tên file chính xác

#### Cách 3: Upload qua Git (Không khuyến nghị cho file lớn)

1. Copy file vào `server/uploads/resources/`
2. Commit và push lên Git
3. **Lưu ý:** File lớn có thể làm chậm Git repository

### Bước 3: Kiểm tra file

1. Đảm bảo tất cả 10 file đã được upload
2. Kiểm tra tên file chính xác
3. Test download trên website

## 🧪 Test download

### Test local

1. Start server: `cd server && npm start`
2. Mở browser: `http://localhost:3000/resources`
3. Nhập email và click "Tải xuống"
4. Kiểm tra file có được download không

### Test production

1. Deploy code mới
2. Upload file vào server production
3. Test trên website: `https://duhocannhien.vercel.app/resources`
4. Kiểm tra file có được download không

## ⚠️ Lưu ý quan trọng

### 1. Tên file phải chính xác
- Tên file phải **khớp hoàn toàn** với mapping
- Phân biệt hoa thường: `checklist-ho-so-du-hoc-han-quoc.pdf` ✅, `Checklist-Ho-So-Du-Hoc-Han-Quoc.pdf` ❌

### 2. File không tồn tại
- Nếu file chưa được upload, server sẽ trả về lỗi 404
- Người dùng sẽ thấy thông báo: "File not found"
- Admin sẽ thấy log trong console

### 3. File size
- Không nên upload file quá lớn (> 10MB)
- File lớn sẽ làm chậm download và tốn bandwidth

### 4. File format
- PDF: `.pdf`
- Word: `.docx` (không dùng `.doc` cũ)

## 🔧 Troubleshooting

### Vấn đề 1: File không download được

**Nguyên nhân:**
- File chưa được upload
- Tên file không đúng
- Đường dẫn file sai

**Giải pháp:**
1. Kiểm tra file có trong `server/uploads/resources/` không
2. Kiểm tra tên file có đúng không
3. Kiểm tra server logs để xem lỗi

### Vấn đề 2: Lỗi 404 khi download

**Nguyên nhân:**
- File không tồn tại
- Tên file sai

**Giải pháp:**
1. Kiểm tra file có tồn tại không
2. Kiểm tra tên file có đúng không
3. Kiểm tra quyền truy cập file

### Vấn đề 3: File download nhưng không mở được

**Nguyên nhân:**
- File bị corrupt
- File format sai

**Giải pháp:**
1. Kiểm tra file có mở được trên máy không
2. Thử upload lại file
3. Kiểm tra file format

## 📋 Checklist

- [ ] Đã chuẩn bị 10 file tài liệu
- [ ] Đã đặt tên file đúng theo mapping
- [ ] Đã upload file vào `server/uploads/resources/`
- [ ] Đã test download local
- [ ] Đã deploy code mới
- [ ] Đã upload file vào server production
- [ ] Đã test download production
- [ ] Tất cả file download được thành công

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
- ✅ Người dùng nhập email
- ✅ Click "Tải xuống"
- ✅ File được download về máy
- ✅ File mở được và đúng nội dung
- ✅ Thông tin download được ghi vào database

---

**Sau khi upload file, chức năng download sẽ hoạt động hoàn toàn!**

