# 🚂 Hướng dẫn Chi tiết Setup TURN Server trên Railway

## Bước 1: Tạo Service mới

1. **Vào Railway Dashboard:**
   - Mở: https://railway.app
   - Đăng nhập vào tài khoản của bạn

2. **Chọn Project:**
   - Click vào project hiện tại của bạn (project đang chạy server)
   - Hoặc nếu muốn tạo project mới, click "New Project"

3. **Tạo Service mới:**
   - Trong project, bạn sẽ thấy các services hiện có
   - Click nút **"+ New"** (màu xanh, ở góc trên bên phải hoặc giữa màn hình)
   - Một menu dropdown sẽ hiện ra

4. **Chọn "Empty Service":**
   - Trong menu dropdown, chọn **"Empty Service"**
   - Hoặc **"Blank Service"** (tùy version Railway)

---

## Bước 2: Đặt tên Service

Sau khi click "Empty Service", Railway sẽ tạo một service mới và hiển thị:

### Cách 1: Đặt tên ngay khi tạo

- Railway sẽ tự động tạo tên mặc định (ví dụ: "service-1", "service-2")
- **Click vào tên đó** (hoặc icon bút chì ✏️ bên cạnh tên)
- Gõ tên mới: `turn-server`
- Nhấn Enter hoặc click ra ngoài để lưu

### Cách 2: Đặt tên sau

1. Tìm service vừa tạo (thường ở đầu danh sách)
2. **Click vào tên service** (hoặc icon settings ⚙️)
3. Vào tab **"Settings"**
4. Tìm phần **"Service Name"** hoặc **"Name"**
5. Click vào và gõ: `turn-server`
6. Nhấn Enter hoặc click "Save"

### Cách 3: Đặt tên trong Settings

1. Click vào service mới
2. Click tab **"Settings"** (ở trên cùng)
3. Scroll xuống phần **"General"**
4. Tìm field **"Service Name"**
5. Gõ: `turn-server`
6. Click **"Save"** hoặc nhấn Enter

---

## Bước 3: Deploy từ GitHub

Sau khi đặt tên xong:

1. **Vào tab "Settings"** của service `turn-server`

2. **Tìm phần "Source"** hoặc **"Deploy"**

3. **Click "Connect GitHub"** hoặc **"Deploy from GitHub repo"**

4. **Chọn Repository:**
   - Chọn: `ThaoPT99/AnNhienHanQuoc`
   - Chọn branch: `main`

5. **Chọn Root Directory:**
   - Tìm field **"Root Directory"** hoặc **"Working Directory"**
   - Gõ: `turn-server`
   - (Đây là folder chứa Dockerfile)

6. **Click "Deploy"** hoặc Railway sẽ tự động deploy

---

## Bước 4: Kiểm tra Deploy

1. **Vào tab "Deployments"** (hoặc "Logs")
2. Xem logs để đảm bảo build thành công
3. Đợi vài phút để Railway build Docker image

---

## Bước 5: Mở Ports

1. **Vào tab "Settings"** của service `turn-server`

2. **Tìm phần "Networking"** hoặc **"Ports"**

3. **Add Port:**
   - Click **"+ Add Port"** hoặc **"New Port"**
   - **Port Number**: `3478`
   - **Protocol**: Chọn `UDP` (quan trọng!)
   - **Public**: ✅ Bật (Enable)
   - Click **"Save"**

4. **(Optional) Add TCP Port:**
   - Click **"+ Add Port"** lần nữa
   - **Port Number**: `3478`
   - **Protocol**: Chọn `TCP`
   - **Public**: ✅ Bật
   - Click **"Save"**

---

## Bước 6: Lấy Public Domain

1. **Vào tab "Settings"** → **"Networking"**

2. **Tìm phần "Domains"** hoặc **"Public Domain"**

3. **Copy domain** (ví dụ: `turn-server-production.up.railway.app`)

   - Nếu chưa có domain, Railway sẽ tự động tạo
   - Có thể mất vài phút để domain được tạo

4. **Lưu domain này lại** - sẽ cần để cập nhật code

---

## 📸 Mô tả Giao diện

### Khi tạo Service mới:
```
Railway Dashboard
├── [Your Project Name]
│   ├── [Existing Services...]
│   └── [+ New] ← Click đây
│       ├── Empty Service ← Chọn cái này
│       ├── Database
│       └── ...
```

### Sau khi tạo:
```
[service-1] ← Click vào đây để đổi tên
├── Settings ← Vào đây
│   ├── Service Name: [service-1] ← Click để đổi
│   └── ...
```

### Trong Settings:
```
Settings
├── General
│   └── Service Name: [turn-server] ← Gõ tên ở đây
├── Source
│   └── Deploy from GitHub repo ← Click đây
└── Networking
    └── Ports
        └── + Add Port ← Click để thêm port
```

---

## ❓ Troubleshooting

### Không thấy nút "+ New"?

- Đảm bảo bạn đã chọn đúng project
- Refresh trang (F5)
- Kiểm tra bạn có quyền edit project không

### Không tìm thấy "Empty Service"?

- Có thể gọi là "Blank Service" hoặc "New Service"
- Hoặc click "Deploy from GitHub" trực tiếp

### Không thấy field để đổi tên?

- Click vào **icon settings ⚙️** của service
- Hoặc click vào **tên service** để mở settings
- Tìm trong tab "Settings" → "General"

### Không thấy "Root Directory"?

- Có thể gọi là "Working Directory" hoặc "Base Directory"
- Hoặc có thể cần click "Advanced" để hiện thêm options

---

## 🎯 Checklist

- [ ] Đã tạo service mới
- [ ] Đã đặt tên: `turn-server`
- [ ] Đã connect GitHub repo
- [ ] Đã chọn root directory: `turn-server`
- [ ] Đã mở port 3478 (UDP)
- [ ] Đã lấy public domain
- [ ] Đã deploy thành công (check logs)

---

## 💡 Tips

- **Tên service** có thể đổi bất cứ lúc nào trong Settings
- **Root Directory** phải đúng là `turn-server` (folder chứa Dockerfile)
- **Port 3478 UDP** là bắt buộc, TCP là optional
- **Public Domain** sẽ tự động tạo sau khi deploy

---

## 🚀 Sau khi hoàn thành

Sau khi có **public domain**, gửi cho tôi domain đó và tôi sẽ cập nhật code để sử dụng TURN server!

Hoặc bạn có thể tự cập nhật trong `client/src/components/VideoCall.js`:
- Tìm `rtcConfiguration`
- Thêm TURN server với domain Railway của bạn

