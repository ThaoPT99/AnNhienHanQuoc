# ⚡ Hướng dẫn nhanh lấy Twilio TURN credentials

## Bước 1: Đăng ký Twilio (Nếu chưa có)

1. Vào: https://www.twilio.com/try-twilio
2. Điền thông tin và đăng ký (miễn phí)
3. Verify email và số điện thoại (nếu cần)

## Bước 2: Lấy Credentials

1. **Đăng nhập vào Twilio Console**: https://console.twilio.com/

2. **Vào Network Traversal Service**:
   - Cách 1: Menu bên trái → **Programmable Video** → **Tools** → **Network Traversal Service**
   - Cách 2: Truy cập trực tiếp: https://console.twilio.com/us1/develop/video/manage/tools/network-traversal-service

3. **Copy Credentials**:
   - Bạn sẽ thấy 2 thông tin:
     - **Username**: Có dạng `xxxxx:xxxxx` (có dấu `:` ở giữa)
     - **Password**: Một chuỗi dài

   ⚠️ **Copy cả 2 giá trị này!**

## Bước 3: Cập nhật Code

1. Mở file: `client/src/components/VideoCall.js`

2. Tìm đoạn code này (khoảng dòng 65-80):
```javascript
// Twilio STUN/TURN (Free tier: 10,000 minutes/month) - KHuyến nghị
/*
{
  urls: [
    'stun:global.stun.twilio.com:3478',
    'turn:global.turn.twilio.com:3478?transport=udp',
    'turn:global.turn.twilio.com:3478?transport=tcp',
    'turn:global.turn.twilio.com:443?transport=tcp'
  ],
  username: 'YOUR_TWILIO_USERNAME',  // ← Thay bằng username từ Twilio
  credential: 'YOUR_TWILIO_PASSWORD'  // ← Thay bằng password từ Twilio
},
*/
```

3. **Uncomment** (xóa `/*` và `*/`) và thay credentials:
```javascript
// Twilio STUN/TURN (Free tier: 10,000 minutes/month) - KHuyến nghị
{
  urls: [
    'stun:global.stun.twilio.com:3478',
    'turn:global.turn.twilio.com:3478?transport=udp',
    'turn:global.turn.twilio.com:3478?transport=tcp',
    'turn:global.turn.twilio.com:443?transport=tcp'
  ],
  username: 'xxxxx:xxxxx',  // ← Paste username từ Twilio Console
  credential: 'xxxxx'  // ← Paste password từ Twilio Console
},
```

4. **Lưu file** và deploy lại!

## Bước 4: Test

1. Deploy code mới
2. Vào video call
3. Mở Debug Logs
4. Kiểm tra:
   - ✅ Nếu thấy `📊 ICE stats: host=X, srflx=X, relay=X` với **relay > 0** → Thành công!
   - ✅ Nếu thấy `✅ Using TURN server (relay)` → Thành công!

### Test với Trickle ICE:

1. Vào: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Add Server với:
   - URLs: `turn:global.turn.twilio.com:3478?transport=udp`
   - Username: (username từ Twilio)
   - Password: (password từ Twilio)
3. Click "Gather candidates"
4. Kiểm tra xem có **relay** candidates không

## ⚠️ Lưu ý bảo mật

**KHÔNG commit credentials vào Git!**

Sau khi cập nhật code:
1. Test để đảm bảo hoạt động
2. **KHÔNG push code có credentials lên GitHub**

Nếu muốn commit, nên dùng environment variables (xem `SETUP-TWILIO-TURN.md` phần "Lưu ý bảo mật")

## Giới hạn Free Tier

- ✅ **10,000 phút/tháng** miễn phí
- ✅ Đủ cho ~100-200 video calls/tháng (tùy độ dài)
- ✅ Rất ổn định và đáng tin cậy

## Troubleshooting

**Không có relay candidates?**
1. Kiểm tra lại credentials (copy đúng chưa?)
2. Kiểm tra format username (phải có dấu `:` ở giữa)
3. Test với Trickle ICE tool trước

**Cần hỗ trợ?**
- Xem file `SETUP-TWILIO-TURN.md` để biết thêm chi tiết
- Twilio Docs: https://www.twilio.com/docs/stun-turn

