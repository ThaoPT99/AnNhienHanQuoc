# 🗄️ HƯỚNG DẪN DEPLOY DATABASE

## 📋 Tổng quan

Dự án sử dụng **SQLite** database để lưu trữ thông tin liên hệ. SQLite là database file-based, phù hợp cho các ứng dụng nhỏ và vừa.

## 📊 Cấu trúc Database

### Bảng `contacts`
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Các trường:**
- `id`: ID tự động tăng
- `name`: Tên người liên hệ
- `email`: Email người liên hệ
- `phone`: Số điện thoại
- `message`: Tin nhắn (tùy chọn)
- `status`: Trạng thái (`new`, `read`, `replied`, `archived`)
- `created_at`: Thời gian tạo
- `updated_at`: Thời gian cập nhật

---

## 🚀 DEPLOY DATABASE TRÊN CÁC PLATFORM

### 1️⃣ Railway (Khuyến nghị - Miễn phí)

Railway hỗ trợ SQLite tốt và tự động tạo file database.

#### Bước 1: Deploy Backend lên Railway

1. **Tạo tài khoản Railway:**
   - Truy cập: https://railway.app/
   - Đăng nhập bằng GitHub

2. **Tạo project mới:**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Cấu hình Service:**
   - **Root Directory**: `/server`
   - **Start Command**: `npm start`
   - Railway tự động detect Node.js

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   DATABASE_PATH=/tmp/contacts.db
   ```
   ⚠️ **Lưu ý**: Railway sử dụng `/tmp` để lưu file, dữ liệu sẽ bị mất khi restart. Xem phần "Persistent Storage" bên dưới.

5. **Persistent Storage (Quan trọng!):**
   - Railway có thể mất dữ liệu khi restart
   - **Giải pháp**: Sử dụng Railway Volume
     - Trong Railway dashboard, thêm "Volume"
     - Mount tại `/data`
     - Cập nhật `DATABASE_PATH=/data/contacts.db`

#### Bước 2: Kiểm tra Database

Sau khi deploy, database sẽ tự động được tạo khi server khởi động.

**Test API:**
```bash
# Health check
curl https://your-app.railway.app/api/health

# Get all contacts
curl https://your-app.railway.app/api/contacts
```

---

### 2️⃣ Render

Render cũng hỗ trợ SQLite nhưng cần cấu hình đặc biệt.

#### Bước 1: Deploy Backend

1. Truy cập: https://render.com/
2. Đăng nhập bằng GitHub
3. Tạo "New Web Service"
4. Connect repository
5. Cấu hình:
   - **Name**: du-hoc-an-nhien-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Bước 2: Environment Variables

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.netlify.app
DATABASE_PATH=/opt/render/project/src/contacts.db
```

⚠️ **Lưu ý Render:**
- Render có persistent disk tại `/opt/render/project/src/`
- Dữ liệu sẽ được giữ lại giữa các lần deploy

---

### 3️⃣ VPS (Ubuntu/Linux)

#### Bước 1: Cài đặt trên VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2
```

#### Bước 2: Upload và cài đặt

```bash
# Clone repository
git clone your-repo-url
cd your-project/server

# Cài đặt dependencies
npm install

# Tạo thư mục cho database
mkdir -p /var/lib/du-hoc-db
sudo chown $USER:$USER /var/lib/du-hoc-db
```

#### Bước 3: Cấu hình Environment

Tạo file `.env`:
```bash
nano .env
```

Nội dung:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
DATABASE_PATH=/var/lib/du-hoc-db/contacts.db
```

#### Bước 4: Chạy với PM2

```bash
# Start server
pm2 start index.js --name "du-hoc-backend"

# Lưu cấu hình
pm2 save

# Tự động start khi reboot
pm2 startup
```

#### Bước 5: Backup Database

Tạo script backup tự động:

```bash
# Tạo script backup
nano /home/user/backup-db.sh
```

Nội dung:
```bash
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DB_PATH="/var/lib/du-hoc-db/contacts.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH "$BACKUP_DIR/contacts_$DATE.db"

# Xóa backup cũ hơn 30 ngày
find $BACKUP_DIR -name "contacts_*.db" -mtime +30 -delete

echo "Backup completed: contacts_$DATE.db"
```

Cấp quyền:
```bash
chmod +x /home/user/backup-db.sh
```

Thêm vào crontab (backup hàng ngày lúc 2h sáng):
```bash
crontab -e
# Thêm dòng:
0 2 * * * /home/user/backup-db.sh
```

---

## 🔄 MIGRATION & BACKUP

### Backup Database

#### Cách 1: Backup thủ công

```bash
# Copy file database
cp contacts.db contacts_backup_$(date +%Y%m%d).db
```

#### Cách 2: Sử dụng script backup

Tạo file `backup-db.js` trong thư mục server:

```javascript
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'contacts.db');
const backupPath = path.join(__dirname, `backups/contacts_${Date.now()}.db`);

// Tạo thư mục backups nếu chưa có
const backupDir = path.dirname(backupPath);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Copy database
fs.copyFileSync(dbPath, backupPath);
console.log('✅ Backup created:', backupPath);
```

Chạy:
```bash
node backup-db.js
```

### Restore Database

```bash
# Dừng server
pm2 stop du-hoc-backend

# Restore từ backup
cp backups/contacts_20240101_120000.db contacts.db

# Khởi động lại server
pm2 start du-hoc-backend
```

---

## 📊 QUẢN LÝ DATABASE

### Xem dữ liệu trong Database

#### Cách 1: Sử dụng SQLite CLI

```bash
# Cài đặt SQLite (nếu chưa có)
sudo apt install sqlite3

# Mở database
sqlite3 contacts.db

# Xem tất cả contacts
SELECT * FROM contacts;

# Xem số lượng contacts
SELECT COUNT(*) FROM contacts;

# Xem contacts mới nhất
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;

# Thoát
.quit
```

#### Cách 2: Sử dụng API

```bash
# Get all contacts
curl https://your-api-url.com/api/contacts

# Get statistics
curl https://your-api-url.com/api/contacts/stats/summary
```

### Xóa dữ liệu cũ

```sql
-- Xóa contacts cũ hơn 1 năm
DELETE FROM contacts 
WHERE created_at < datetime('now', '-1 year');

-- Xóa contacts đã archived
DELETE FROM contacts 
WHERE status = 'archived';
```

---

## 🔒 BẢO MẬT DATABASE

### 1. Backup thường xuyên
- Backup hàng ngày
- Lưu backup ở nhiều nơi (local, cloud)

### 2. Giới hạn truy cập
- Chỉ admin mới có thể xem contacts
- Thêm authentication cho API `/api/contacts`

### 3. Validate dữ liệu
- Server đã có validation email
- Có thể thêm validation phone number

---

## 🆙 NÂNG CẤP LÊN POSTGRESQL (Tùy chọn)

Nếu dự án phát triển lớn hơn, có thể nâng cấp lên PostgreSQL:

### Railway PostgreSQL

1. Trong Railway dashboard, thêm "PostgreSQL" service
2. Railway tự động cung cấp connection string
3. Cập nhật code để sử dụng PostgreSQL thay vì SQLite

### Render PostgreSQL

1. Tạo "PostgreSQL" database trong Render
2. Lấy connection string
3. Cập nhật code

---

## ✅ CHECKLIST DEPLOY DATABASE

- [ ] Database đã được tạo tự động khi server start
- [ ] Environment variables đã được cấu hình đúng
- [ ] Database path đã được set (quan trọng cho persistent storage)
- [ ] Đã test API endpoints
- [ ] Đã setup backup tự động (nếu dùng VPS)
- [ ] Đã kiểm tra database có lưu dữ liệu sau khi restart

---

## 🐛 XỬ LÝ LỖI

### Lỗi: Database locked
- **Nguyên nhân**: Nhiều process đang truy cập database cùng lúc
- **Giải pháp**: Đảm bảo chỉ có 1 instance server chạy

### Lỗi: Database không tồn tại
- **Nguyên nhân**: Database path sai hoặc không có quyền ghi
- **Giải pháp**: Kiểm tra DATABASE_PATH và quyền truy cập

### Lỗi: Mất dữ liệu sau khi restart (Railway)
- **Nguyên nhân**: Database lưu ở `/tmp` (temporary)
- **Giải pháp**: Sử dụng Railway Volume hoặc chuyển sang PostgreSQL

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Server logs: `pm2 logs` hoặc Railway logs
2. Database file có tồn tại không
3. Environment variables đã đúng chưa
4. Quyền truy cập file database

