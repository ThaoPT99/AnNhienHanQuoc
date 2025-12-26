# 🚂 Setup TURN Server trên Railway

## Vì bạn đã có Railway rồi, setup TURN server rất dễ!

---

## 📋 Bước 1: Tạo Service mới trên Railway

1. Vào Railway Dashboard: https://railway.app
2. Click vào project hiện tại (hoặc tạo project mới)
3. Click **"+ New"** → **"Empty Service"**
4. Đặt tên: `turn-server` hoặc `webrtc-turn`

---

## 📋 Bước 2: Setup coturn với Dockerfile

### Tạo Dockerfile

Trong service mới, tạo file `Dockerfile`:

```dockerfile
FROM coturn/coturn:latest

# Copy config file
COPY turnserver.conf /etc/turnserver.conf

# Expose TURN ports
EXPOSE 3478/udp
EXPOSE 3478/tcp
EXPOSE 5349/udp
EXPOSE 5349/tcp

# Start coturn
CMD ["turnserver", "-n", "-v"]
```

### Tạo file `turnserver.conf`

Tạo file `turnserver.conf` trong cùng thư mục:

```conf
# Listening ports
listening-port=3478
tls-listening-port=5349

# External IP (Railway sẽ tự động set)
# Không cần set external-ip, Railway sẽ handle

# Realm
realm=railway.turn
server-name=railway.turn

# No authentication (cho đơn giản - có thể thêm auth sau)
no-auth

# Logging
log-file=stdout
verbose

# Enable STUN
stun-only
no-cli

# Disable TLS/DTLS (cho đơn giản)
no-tls
no-dtls

# Allow all IPs
denied-peer-ip=
allowed-peer-ip=0.0.0.0-255.255.255.255

# User quota (unlimited)
user-quota=0
total-quota=0

# Max bps (unlimited)
max-bps=0
```

---

## 📋 Bước 3: Deploy trên Railway

### Cách 1: Deploy từ GitHub (Khuyến nghị)

1. Tạo folder mới trong repo: `turn-server/`
2. Copy `Dockerfile` và `turnserver.conf` vào folder đó
3. Push lên GitHub
4. Trong Railway:
   - Click **"Deploy from GitHub repo"**
   - Chọn repo và branch
   - Chọn folder `turn-server/`
   - Railway sẽ tự động detect Dockerfile và deploy

### Cách 2: Deploy trực tiếp

1. Trong Railway service, click **"Settings"**
2. Chọn **"Source"** → **"Deploy from GitHub"**
3. Chọn repo và path: `turn-server/`
4. Railway sẽ tự động build và deploy

---

## 📋 Bước 4: Cấu hình Ports và Variables

### Mở Ports

1. Vào service → **"Settings"** → **"Networking"**
2. Add port:
   - **Port**: `3478`
   - **Protocol**: `UDP`
   - **Public**: ✅ Enabled
3. Add port TCP (optional):
   - **Port**: `3478`
   - **Protocol**: `TCP`
   - **Public**: ✅ Enabled

### Environment Variables (Optional)

Nếu muốn thêm authentication sau, có thể thêm:
- `TURN_USERNAME`: username
- `TURN_PASSWORD`: password

---

## 📋 Bước 5: Lấy Public URL

Sau khi deploy xong:

1. Vào service → **"Settings"** → **"Networking"**
2. Copy **Public Domain** (ví dụ: `turn-server-production.up.railway.app`)
3. Hoặc xem trong **"Deployments"** → **"View Logs"**

**Lưu ý:** Railway sẽ tự động tạo public domain cho service.

---

## 📋 Bước 6: Cập nhật Code

### Cập nhật `client/src/components/VideoCall.js`

Tìm phần `rtcConfiguration` và thêm TURN server của Railway:

```javascript
const rtcConfiguration = {
  iceServers: [
    // Google STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // ... other STUN servers
    
    // Railway TURN Server (thêm vào đây)
    { 
      urls: [
        `turn:YOUR_RAILWAY_DOMAIN:3478`,
        `turn:YOUR_RAILWAY_DOMAIN:3478?transport=tcp`
      ]
      // Nếu có auth, thêm:
      // username: 'your-username',
      // credential: 'your-password'
    }
  ],
  // ... rest of config
};
```

**Thay `YOUR_RAILWAY_DOMAIN` bằng domain Railway của bạn!**

Ví dụ:
```javascript
{ 
  urls: [
    'turn:turn-server-production.up.railway.app:3478',
    'turn:turn-server-production.up.railway.app:3478?transport=tcp'
  ]
}
```

---

## 📋 Bước 7: Test TURN Server

### Cách 1: Test với trickle-ice

1. Vào: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Thêm TURN server:
   ```
   turn:YOUR_RAILWAY_DOMAIN:3478
   ```
3. Click "Gather candidates"
4. Kiểm tra xem có **relay** candidates không

### Cách 2: Test trong code

1. Deploy code mới
2. Vào video call
3. Xem Debug Logs:
   - Nếu thấy `✅ Using TURN server (relay)` → TURN hoạt động!
   - Nếu thấy `📊 ICE stats: relay=X` (X > 0) → TURN hoạt động!

---

## 🔒 Thêm Authentication (Tùy chọn - Bảo mật hơn)

### Cập nhật `turnserver.conf`:

```conf
# Remove no-auth, thêm:
user=username:password-hash

# Generate password hash (trên máy local):
# turnadmin -k -u username -p password -r railway.turn
```

### Cập nhật code:

```javascript
{ 
  urls: 'turn:YOUR_RAILWAY_DOMAIN:3478',
  username: 'username',
  credential: 'password'
}
```

---

## 🐛 Troubleshooting

### TURN server không hoạt động?

1. **Kiểm tra logs:**
   - Vào Railway → Service → **"Deployments"** → **"View Logs"**
   - Xem có lỗi gì không

2. **Kiểm tra ports:**
   - Đảm bảo port 3478 (UDP) đã được mở
   - Check trong **"Settings"** → **"Networking"**

3. **Test connection:**
   ```bash
   # Test từ máy local
   telnet YOUR_RAILWAY_DOMAIN 3478
   ```

4. **Kiểm tra domain:**
   - Đảm bảo domain đúng format: `turn:domain:3478`
   - Không dùng `https://` trong TURN URL

### Connection vẫn failed?

1. Kiểm tra TURN server có trong Debug Logs không
2. Test với trickle-ice tool
3. Kiểm tra Railway logs xem có lỗi gì

---

## 📊 Cấu trúc Folder

```
your-repo/
├── turn-server/
│   ├── Dockerfile
│   └── turnserver.conf
├── client/
├── server/
└── ...
```

---

## 🚀 Quick Start (5 phút)

1. **Tạo folder `turn-server/` trong repo**
2. **Tạo 2 files:**
   - `Dockerfile` (copy từ trên)
   - `turnserver.conf` (copy từ trên)
3. **Push lên GitHub**
4. **Trong Railway:**
   - Tạo service mới
   - Deploy from GitHub → chọn folder `turn-server/`
   - Mở port 3478 (UDP)
5. **Lấy public domain và cập nhật code**
6. **Deploy và test!**

---

## 💡 Tips

- **Railway tự động scale:** Không cần lo về traffic
- **Free tier:** Railway có free tier, đủ cho TURN server
- **Monitoring:** Xem logs trong Railway dashboard
- **Custom domain:** Có thể dùng custom domain nếu muốn

---

## 🎉 Kết quả mong đợi

Sau khi setup, bạn sẽ thấy trong Debug Logs:

```
✅ Using TURN server (relay) for guest@example.com
📊 ICE stats: host=2, srflx=2, relay=2  ← Có relay rồi!
✅ ICE connection established!
```

**Connection sẽ thành công!** 🎊

---

## 📝 Lưu ý

- Railway free tier có giới hạn, nhưng đủ cho TURN server
- Nếu cần nhiều bandwidth, có thể upgrade plan
- TURN server chỉ relay traffic khi cần, không tốn nhiều bandwidth

