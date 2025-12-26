# 🎯 Setup Twilio TURN Server (Miễn phí - Khuyến nghị)

## Tại sao chọn Twilio?

- ✅ **Miễn phí**: 10,000 phút/tháng (đủ cho hầu hết use cases)
- ✅ **Ổn định**: Infrastructure chuyên nghiệp, uptime cao
- ✅ **Dễ setup**: Chỉ cần 5 phút
- ✅ **Hỗ trợ tốt**: Documentation đầy đủ

## Bước 1: Đăng ký Twilio

1. Vào: https://www.twilio.com/try-twilio
2. Đăng ký tài khoản (có thể cần verify số điện thoại)
3. Xác nhận email và login vào Twilio Console

## Bước 2: Lấy STUN/TURN Credentials

1. Vào Twilio Console: https://console.twilio.com/
2. Vào **Programmable Video** → **Tools** → **Network Traversal Service**
3. Hoặc truy cập trực tiếp: https://console.twilio.com/us1/develop/video/manage/tools/network-traversal-service
4. Bạn sẽ thấy:
   - **Username**: Một chuỗi dài (ví dụ: `xxxxx:xxxxx`)
   - **Password**: Một chuỗi dài (ví dụ: `xxxxx`)

**Copy cả Username và Password!**

## Bước 3: Cập nhật Code

Mở file `client/src/components/VideoCall.js` và thêm Twilio TURN server:

```javascript
const rtcConfiguration = {
  iceServers: [
    // Google STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // ... other STUN servers ...
    
    // Twilio STUN/TURN (Free tier - 10,000 minutes/month)
    {
      urls: [
        'stun:global.stun.twilio.com:3478',
        'turn:global.turn.twilio.com:3478?transport=udp',
        'turn:global.turn.twilio.com:3478?transport=tcp',
        'turn:global.turn.twilio.com:443?transport=tcp'
      ],
      username: 'YOUR_TWILIO_USERNAME',  // ← Thay bằng username của bạn
      credential: 'YOUR_TWILIO_PASSWORD'  // ← Thay bằng password của bạn
    },
    
    // Fallback TURN servers (miễn phí nhưng có thể không ổn định)
    // ... existing free TURN servers ...
  ],
  // ... rest of config
};
```

**Thay `YOUR_TWILIO_USERNAME` và `YOUR_TWILIO_PASSWORD` bằng credentials bạn vừa copy!**

## Bước 4: Test

1. Deploy code mới
2. Vào video call
3. Xem Debug Logs:
   - ✅ Nếu thấy `📊 ICE stats: host=X, srflx=X, relay=X` (relay > 0) → TURN hoạt động!
   - ✅ Nếu thấy `✅ Using TURN server (relay)` → TURN hoạt động!

### Test với Trickle ICE:

1. Vào: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Thêm Twilio TURN server với credentials của bạn
3. Click "Gather candidates"
4. Kiểm tra xem có **relay** candidates không

## Giới hạn Free Tier

- **10,000 phút/tháng** (khoảng 166 giờ)
- Đủ cho khoảng 100-200 video calls/tháng (tùy độ dài cuộc gọi)
- Nếu vượt quá, cần upgrade plan

## Troubleshooting

### Không có relay candidates?

1. **Kiểm tra credentials**: Đảm bảo username và password đúng
2. **Kiểm tra format**: Username có format `xxxxx:xxxxx` (có dấu `:`)
3. **Test với Trickle ICE**: Xác nhận credentials hoạt động
4. **Kiểm tra firewall**: Một số network có thể block TURN traffic

### Vượt quá giới hạn?

1. Upgrade Twilio plan (trả phí theo usage)
2. Hoặc setup TURN server trên VPS (xem `SETUP-TURN-FREE.md`)

## Lưu ý bảo mật

⚠️ **Không commit credentials vào Git!**

Có 2 cách:

### Cách 1: Environment Variables (Khuyến nghị)

1. Tạo file `.env` trong thư mục `client/`:
```
REACT_APP_TWILIO_TURN_USERNAME=your_username_here
REACT_APP_TWILIO_TURN_PASSWORD=your_password_here
```

2. Trong `VideoCall.js`:
```javascript
username: process.env.REACT_APP_TWILIO_TURN_USERNAME,
credential: process.env.REACT_APP_TWILIO_TURN_PASSWORD
```

3. Thêm `.env` vào `.gitignore`

### Cách 2: Server-side Configuration

Lưu credentials trên server và lấy qua API khi cần.

## Kết quả mong đợi

Sau khi setup:
- ✅ Video calls sẽ kết nối được ngay cả khi cả 2 bên đều ở sau strict NAT/firewall
- ✅ Debug logs sẽ hiển thị `relay=X` (X > 0)
- ✅ Connection sẽ thành công và ổn định hơn

## Liên kết

- Twilio Console: https://console.twilio.com/
- Twilio STUN/TURN Docs: https://www.twilio.com/docs/stun-turn
- Trickle ICE Test: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

