# 🔧 Fix Vercel Auto Deploy

## Vấn đề: Vercel không tự động deploy khi push code

## ✅ Giải pháp nhanh:

### Cách 1: Trigger Manual Deployment (Nhanh nhất)
1. Vào Vercel Dashboard: https://vercel.com/an-nhiens-projects-aad50b30/an-nhien-han-quoc
2. Tab **Deployments**
3. Click nút **"..."** (3 chấm) ở deployment mới nhất
4. Chọn **"Redeploy"**
5. Hoặc click **"Deploy"** → chọn branch `main`

### Cách 2: Reconnect GitHub Integration
1. Vào **Settings** → **Git**
2. Xem repository: `ThaoPT99/AnNhienHanQuoc`
3. Nếu thấy warning, click **"Disconnect"** rồi **"Connect Git Repository"** lại
4. Chọn lại repository và branch `main`

### Cách 3: Kiểm tra GitHub Webhook
1. Vào GitHub: https://github.com/ThaoPT99/AnNhienHanQuoc/settings/hooks
2. Tìm webhook có URL chứa `vercel.com`
3. Xem **Recent Deliveries** → nếu có lỗi (đỏ), click **"Redeliver"**

### Cách 4: Push lại với empty commit (Trigger webhook)
```bash
git commit --allow-empty -m "Trigger: Force Vercel deployment"
git push origin main
```

## 🔍 Kiểm tra nguyên nhân:

### 1. Kiểm tra Vercel Integration Status
- Vào **Settings** → **Integrations**
- Xem GitHub integration có active không

### 2. Kiểm tra Branch Configuration
- Vào **Settings** → **Git**
- Xem **Production Branch** có đúng là `main` không

### 3. Kiểm tra Build Settings
- Vào **Settings** → **General**
- Xem **Build Command** và **Output Directory** có đúng không
- Project này dùng:
  - **Root Directory**: `client`
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`

## 📝 Lưu ý:

- Vercel Hobby plan: **Không giới hạn** số lần deploy/ngày
- Nếu vẫn không tự động deploy sau khi reconnect, có thể do:
  - GitHub webhook bị block bởi firewall
  - Vercel service đang có vấn đề (check status.vercel.com)
  - Repository settings trên GitHub có thay đổi

## 🚀 Sau khi fix:

1. Đợi 1-2 phút
2. Hard refresh trình duyệt: `Ctrl + Shift + R`
3. Kiểm tra deployment mới trong tab **Deployments**

