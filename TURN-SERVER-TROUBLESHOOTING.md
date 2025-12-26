# 🔧 TURN Server Troubleshooting - Railway

## Vấn đề hiện tại

Từ logs, bạn thấy:
```
📊 ICE stats: host=2, srflx=2, relay=0
⚠️ WARNING: No TURN (relay) candidates found!
```

**TURN server trên Railway không tạo relay candidates.**

## Nguyên nhân có thể

1. **Railway không expose UDP port qua public domain**
   - Railway public domains thường chỉ expose HTTP/HTTPS (TCP)
   - TURN server cần UDP port 3478 để hoạt động đúng
   - Railway có thể không hỗ trợ UDP qua `.up.railway.app` domain

2. **TURN server chưa được cấu hình đúng trong Railway Networking**
   - Cần đảm bảo port 3478 UDP được expose là Public
   - Kiểm tra trong Railway Dashboard → Settings → Networking

3. **TURN server không có external-ip được set đúng**
   - coturn cần biết external IP để tạo relay allocations

## Cách test TURN server

### Test 1: Trickle ICE Tool

1. Vào: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Click "Add Server"
3. Thêm TURN server:
   ```
   URLs: turn:turn-server-production-f957.up.railway.app:3478
   Username: railway
   Password: railway
   ```
4. Click "Gather candidates"
5. Kiểm tra kết quả:
   - ✅ Nếu thấy **relay** candidates → TURN server hoạt động!
   - ❌ Nếu chỉ thấy host/srflx → TURN server không hoạt động

### Test 2: Kiểm tra Railway Logs

1. Vào Railway Dashboard → service `turn-server`
2. Click **"Deployments"** → **"View Logs"**
3. Tìm các dòng:
   - `✅ Using external IP: ...` → External IP đã được detect
   - `🚀 Starting coturn TURN server...` → Server đã khởi động
   - Lỗi gì không?

### Test 3: Kiểm tra Railway Networking

1. Vào Railway Dashboard → service `turn-server` → **"Settings"** → **"Networking"**
2. Kiểm tra Public Networking:
   - ✅ Port 3478 UDP phải là **Public**
   - ✅ Port 3478 TCP nên là **Public** (optional)
   - ✅ Domain phải trỏ tới port 3478

## Giải pháp

### Option 1: Sử dụng dịch vụ TURN miễn phí (Nhanh nhất)

Các dịch vụ này đã được thêm vào code và có thể hoạt động:

1. **Metered.ca Open Relay** - Đã có trong code
2. **Xirsys Free** - Đã có trong code
3. **Twilio STUN/TURN** (Free tier: 10,000 minutes/month)

**Cách sử dụng:**
- Code đã có sẵn các TURN servers này
- Chúng được dùng như fallback nếu TURN server Railway không hoạt động
- Nếu vẫn không có relay, có thể bị block bởi firewall/network

### Option 2: Sử dụng dịch vụ TURN có phí (Ổn định nhất)

**Khuyến nghị:**

1. **Twilio STUN/TURN**
   - Free tier: 10,000 minutes/month
   - Setup: https://www.twilio.com/stun-turn
   - Rất ổn định và đáng tin cậy

2. **Metered.ca**
   - $5/month cho 100GB
   - Setup: https://www.metered.ca/stun-turn
   - Dễ setup, giá hợp lý

### Option 3: Deploy TURN server trên VPS

Nếu Railway không hỗ trợ UDP:

1. **Oracle Cloud Free Tier** (Khuyến nghị)
   - 2 VMs miễn phí vĩnh viễn
   - 10TB bandwidth/tháng
   - Xem hướng dẫn: `SETUP-TURN-FREE.md`

2. **AWS/GCP/Azure Free Tier**
   - Có giới hạn thời gian
   - Đủ để test và sử dụng

### Option 4: Kiểm tra Railway Networking Settings

Có thể Railway hỗ trợ UDP nhưng cần cấu hình đúng:

1. Vào Railway → service `turn-server` → Settings → Networking
2. Kiểm tra:
   - ✅ Public Networking có port 3478 UDP không?
   - ✅ Port có được expose đúng không?
   - ✅ Domain có trỏ tới UDP port không?

**Lưu ý:** Railway có thể chỉ hỗ trợ TCP qua public domain. Nếu vậy, TURN server sẽ không hoạt động đúng.

## Khuyến nghị

**Ngắn hạn:**
1. Test với trickle-ice tool để xác nhận TURN server Railway có hoạt động không
2. Nếu không, sử dụng các TURN servers miễn phí đã có trong code (Metered.ca, Xirsys)
3. Nếu vẫn không hoạt động, setup Twilio STUN/TURN (free tier)

**Dài hạn:**
1. Setup TURN server trên VPS (Oracle Cloud free tier)
2. Hoặc sử dụng dịch vụ TURN có phí (Metered.ca $5/month)

## Cập nhật code với Twilio TURN (Nếu dùng)

1. Đăng ký Twilio: https://www.twilio.com
2. Tạo STUN/TURN credentials
3. Cập nhật `VideoCall.js`:

```javascript
{
  urls: [
    'turn:global.turn.twilio.com:3478?transport=udp',
    'turn:global.turn.twilio.com:3478?transport=tcp',
    'turn:global.turn.twilio.com:443?transport=tcp'
  ],
  username: 'YOUR_TWILIO_USERNAME',
  credential: 'YOUR_TWILIO_PASSWORD'
}
```

## Liên kết hữu ích

- Trickle ICE Test: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
- Twilio STUN/TURN: https://www.twilio.com/stun-turn
- Metered.ca: https://www.metered.ca/stun-turn
- coturn Docs: https://github.com/coturn/coturn

