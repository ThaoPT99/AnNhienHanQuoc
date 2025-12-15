# HƯỚNG DẪN DEPLOY WEBSITE DU HỌC AN NHIÊN

## 📋 Tổng quan

Website này gồm 2 phần:
- **Frontend (React)**: Chạy trên port 3000
- **Backend (Node.js/Express)**: Chạy trên port 5000

## 🚀 PHƯƠNG PHÁP 1: Deploy miễn phí (Khuyến nghị)

### Option A: Vercel (Frontend) + Railway (Backend)

#### Bước 1: Deploy Backend lên Railway (Miễn phí)

1. **Tạo tài khoản Railway:**
   - Truy cập: https://railway.app/
   - Đăng nhập bằng GitHub

2. **Tạo project mới:**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Cấu hình:**
   - Root Directory: `/server`
   - Start Command: `npm start`
   - Port: Railway tự động assign

4. **Lấy URL backend:**
   - Railway sẽ cung cấp URL như: `https://your-app.railway.app`
   - Copy URL này để dùng cho frontend

#### Bước 2: Deploy Frontend lên Vercel (Miễn phí)

1. **Tạo tài khoản Vercel:**
   - Truy cập: https://vercel.com/
   - Đăng nhập bằng GitHub

2. **Import project:**
   - Click "Add New Project"
   - Chọn repository của bạn
   - Framework Preset: **React**
   - Root Directory: `/client`

3. **Cấu hình Environment Variables:**
   - Thêm: `REACT_APP_API_URL=https://your-backend-url.railway.app`

4. **Deploy:**
   - Click "Deploy"
   - Vercel sẽ tự động build và deploy

### Option B: Netlify (Frontend) + Render (Backend)

#### Deploy Backend lên Render:

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
6. Click "Create Web Service"
7. Copy URL backend (ví dụ: `https://your-app.onrender.com`)

#### Deploy Frontend lên Netlify:

1. Truy cập: https://www.netlify.com/
2. Đăng nhập bằng GitHub
3. "Add new site" > "Import an existing project"
4. Chọn repository
5. Cấu hình:
   - **Base directory**: client
   - **Build command**: `npm run build`
   - **Publish directory**: client/build
6. Thêm Environment Variable:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com`
7. Click "Deploy site"

---

## 🖥️ PHƯƠNG PHÁP 2: Deploy lên VPS

### Yêu cầu:
- VPS với Ubuntu 20.04+
- Domain name (tùy chọn)
- SSH access

### Bước 1: Cài đặt trên VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt install -y nginx
```

### Bước 2: Upload code

```bash
# Clone repository
git clone your-repo-url
cd your-project

# Hoặc dùng SCP
# scp -r ./project user@your-server-ip:/home/user/
```

### Bước 3: Chạy Backend

```bash
cd server
npm install

# Chạy với PM2
pm2 start index.js --name "du-hoc-backend"
pm2 save
pm2 startup
```

### Bước 4: Build và chạy Frontend

```bash
cd client
npm install
npm run build

# Serve với PM2
npm install -g serve
pm2 serve build 3000 --name "du-hoc-frontend" --spa
```

### Bước 5: Cấu hình Nginx

Tạo file: `/etc/nginx/sites-available/du-hoc-an-nhien`

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/user/your-project/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/du-hoc-an-nhien /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 6: Cài đặt SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 CHUẨN BỊ CODE TRƯỚC KHI DEPLOY

### 1. Tạo file `.env` trong `client`:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

### 2. Tạo file `.env` trong `server` (nếu cần):

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Đã test website hoạt động tốt ở local
- [ ] Đã cập nhật API URL trong frontend
- [ ] Đã build frontend thành công (`npm run build`)
- [ ] Đã backup code lên GitHub
- [ ] Đã chuẩn bị domain (nếu cần)

---

## 🐛 XỬ LÝ LỖI

### Lỗi CORS
- Kiểm tra CORS config trong backend
- Đảm bảo frontend URL đúng

### Lỗi API không kết nối
- Kiểm tra backend đã chạy chưa
- Kiểm tra URL API trong frontend
- Kiểm tra firewall

---

## 💡 KHUYẾN NGHỊ

1. **Cho người mới**: Dùng Vercel + Railway (miễn phí)
2. **Cho production**: Dùng VPS với Nginx + SSL
3. **Database**: Cân nhắc PostgreSQL cho production


