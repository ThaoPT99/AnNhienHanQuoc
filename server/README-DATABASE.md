# 📊 Database - Hướng dẫn nhanh

## 🚀 Khởi động

Database sẽ tự động được tạo khi server khởi động lần đầu.

```bash
npm start
```

## 📝 API Endpoints

### Tạo liên hệ mới
```bash
POST /api/contacts
Body: { name, email, phone, message? }
```

### Xem tất cả liên hệ
```bash
GET /api/contacts
```

### Xem thống kê
```bash
GET /api/contacts/stats/summary
```

### Cập nhật trạng thái
```bash
PATCH /api/contacts/:id/status
Body: { status: 'new' | 'read' | 'replied' | 'archived' }
```

### Xóa liên hệ
```bash
DELETE /api/contacts/:id
```

## 💾 Backup Database

```bash
# Backup thủ công
npm run backup

# Backup và tự động xóa file cũ (>30 ngày)
npm run backup:auto
```

## 📖 Hướng dẫn chi tiết

Xem file `DEPLOY-DATABASE.md` để biết cách:
- Deploy database lên Railway, Render, VPS
- Cấu hình persistent storage
- Backup và restore
- Quản lý dữ liệu

## ⚙️ Environment Variables

```env
DATABASE_PATH=/path/to/contacts.db  # Mặc định: ./contacts.db
PORT=5000
FRONTEND_URL=http://localhost:3000
```

