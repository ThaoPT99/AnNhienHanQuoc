# 🚀 HƯỚNG DẪN DEPLOY FRONTEND

## Deploy lên Vercel (Khuyến nghị - Miễn phí)

### Bước 1: Chuẩn bị
1. Đảm bảo code đã được push lên GitHub
2. Đã build thành công: `npm run build`

### Bước 2: Deploy
1. Truy cập: https://vercel.com/
2. Đăng nhập bằng GitHub
3. Click "Add New Project"
4. Chọn repository của bạn
5. Cấu hình:
   - **Framework Preset**: React
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (tự động)
   - **Output Directory**: `build` (tự động)

### Bước 3: Environment Variables
Thêm biến môi trường:
- **Name**: `REACT_APP_API_URL`
- **Value**: URL backend của bạn (ví dụ: `https://your-backend.railway.app`)

### Bước 4: Deploy
- Click "Deploy"
- Chờ build xong
- Vercel sẽ cung cấp URL: `https://your-app.vercel.app`

---

## Deploy lên Netlify

### Bước 1: Chuẩn bị
1. Code đã trên GitHub
2. Đã build thành công

### Bước 2: Deploy
1. Truy cập: https://www.netlify.com/
2. Đăng nhập bằng GitHub
3. "Add new site" > "Import an existing project"
4. Chọn repository
5. Cấu hình:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Thêm Environment Variable:
   - `REACT_APP_API_URL=https://your-backend-url.com`
7. Click "Deploy site"

---

## Lưu ý

- Đảm bảo biến `REACT_APP_API_URL` đã được set đúng
- Kiểm tra build logs nếu có lỗi
- Sau khi deploy, test lại website để đảm bảo API hoạt động


