# ⚡ Hướng dẫn NHANH NHẤT - Lấy Twilio STUN/TURN Credentials

## 🎯 Bạn cần 2 thứ từ Twilio Dashboard:

### Bước 1: Lấy Account SID và Auth Token

1. **Vào Twilio Dashboard**: https://console.twilio.com/
   - Hoặc click "Twilio Home" ở góc trên bên trái

2. **Trên Dashboard, bạn sẽ thấy** (ở góc trên bên phải hoặc giữa trang):
   - **Account SID**: Có dạng `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click nút "View" để xem (dạng `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

   ⚠️ **Copy cả 2 giá trị này!**

### Bước 2: Chạy Script

**Windows:**
```bash
# Double-click file này:
LAY-TWILIO-CREDENTIALS.bat

# Hoặc chạy trong PowerShell:
cd server
$env:TWILIO_ACCOUNT_SID="ACxxxxx"
$env:TWILIO_AUTH_TOKEN="your_token"
node get-twilio-turn-credentials.js
```

**Mac/Linux:**
```bash
cd server
TWILIO_ACCOUNT_SID=ACxxxxx TWILIO_AUTH_TOKEN=your_token node get-twilio-turn-credentials.js
```

### Bước 3: Copy Credentials vào Code

Script sẽ hiển thị **Username** và **Password**. 

Sau đó:
1. Mở file: `client/src/components/VideoCall.js`
2. Tìm đoạn Twilio TURN server (khoảng dòng 65-80)
3. Uncomment (xóa `/*` và `*/`)
4. Thay `YOUR_TWILIO_USERNAME` và `YOUR_TWILIO_PASSWORD`

Xong! 🎉

---

## 📍 Trang ĐÚNG trong Console (Nếu muốn xem trực tiếp):

**Develop** → **Video** → **Tools** → **Network Traversal Service**

URL: https://console.twilio.com/us1/develop/video/tools/network-traversal-service

⚠️ **KHÔNG phải**:
- ❌ Video → Manage → Video credentials (Public Keys)
- ❌ User Settings (thông tin cá nhân)

