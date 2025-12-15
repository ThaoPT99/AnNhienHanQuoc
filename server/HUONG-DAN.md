# HƯỚNG DẪN CHẠY DỰ ÁN DU HỌC AN NHIÊN

## ⚠️ QUAN TRỌNG: Cần cài đặt Node.js trước!

Bạn chưa cài đặt Node.js. Vui lòng làm theo các bước sau:

## BƯỚC 1: Cài đặt Node.js

1. Truy cập: https://nodejs.org/
2. Tải phiên bản LTS (khuyến nghị)
3. Cài đặt Node.js
4. Khởi động lại máy tính (nếu cần)
5. Kiểm tra cài đặt bằng cách mở PowerShell và chạy:
   ```
   node --version
   npm --version
   ```

## BƯỚC 2: Tìm vị trí dự án

Dự án được lưu tại thư mục hiện tại. Cấu trúc:
```
.
├── server/          (Backend)
│   ├── package.json
│   └── index.js
└── client/          (Frontend)
    ├── package.json
    └── src/
```

## BƯỚC 3: Cài đặt Dependencies

### Mở 2 cửa sổ Terminal/PowerShell

**Terminal 1 - Cài đặt Server:**
```powershell
cd server
npm install
```

**Terminal 2 - Cài đặt Client:**
```powershell
cd client
npm install
```

## BƯỚC 4: Chạy dự án

**Terminal 1 - Chạy Server:**
```powershell
cd server
npm start
```
Server chạy tại: http://localhost:5000

**Terminal 2 - Chạy Client:**
```powershell
cd client
npm start
```
Website tự động mở tại: http://localhost:3000

## 📱 Truy cập

- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## ❓ Nếu gặp lỗi

1. Đảm bảo đã cài Node.js
2. Chạy lại `npm install` trong cả 2 thư mục
3. Kiểm tra port 3000 và 5000 có bị chiếm dụng không

