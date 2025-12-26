# 🆓 Hướng dẫn Setup TURN Server MIỄN PHÍ

## Tại sao cần TURN Server?

Từ logs của bạn:
```
📊 ICE stats: host=2, srflx=2, relay=0
⚠️ WARNING: No TURN (relay) candidates found!
```

**Không có relay candidates** → Connection failed. Cần TURN server để relay traffic khi NAT traversal thất bại.

## ✅ Giải pháp MIỄN PHÍ: Setup TURN Server trên VPS miễn phí

### Option 1: Oracle Cloud Free Tier (Khuyến nghị - Dễ nhất)

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí vĩnh viễn
- ✅ 2 VMs miễn phí (ARM hoặc x86)
- ✅ 10TB bandwidth/tháng miễn phí
- ✅ Không cần credit card (có thể cần)

**Bước 1: Đăng ký Oracle Cloud**
1. Vào: https://www.oracle.com/cloud/free/
2. Click "Start for Free"
3. Đăng ký tài khoản (có thể cần credit card nhưng không bị charge)

**Bước 2: Tạo VM Instance**
1. Vào Oracle Cloud Console
2. Menu → Compute → Instances
3. Click "Create Instance"
4. Chọn:
   - **Image**: Ubuntu 22.04
   - **Shape**: VM.Standard.A1.Flex (ARM - 4 cores, 24GB RAM - MIỄN PHÍ)
   - **Networking**: Public IP
5. Click "Create"

**Bước 3: Setup coturn trên VM**

SSH vào VM:
```bash
ssh ubuntu@YOUR_PUBLIC_IP
```

Cài đặt coturn:
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install coturn
sudo apt-get install -y coturn

# Enable coturn
sudo systemctl enable coturn
```

Cấu hình coturn:
```bash
# Edit config file
sudo nano /etc/turnserver.conf
```

Thêm/sửa các dòng sau:
```conf
# Listening port
listening-port=3478
tls-listening-port=5349

# Your server's public IP (thay YOUR_PUBLIC_IP)
listening-ip=0.0.0.0
external-ip=YOUR_PUBLIC_IP

# Realm (tên domain hoặc tên bất kỳ)
realm=yourdomain.com
server-name=yourdomain.com

# No authentication (cho đơn giản - có thể thêm auth sau)
no-auth

# Log file
log-file=/var/log/turn.log
verbose

# Enable STUN
stun-only
no-cli
no-tls
no-dtls
```

Khởi động coturn:
```bash
sudo systemctl start coturn
sudo systemctl status coturn
```

**Bước 4: Mở Firewall**

Trong Oracle Cloud Console:
1. Vào Networking → Virtual Cloud Networks
2. Chọn VCN của bạn → Security Lists
3. Add Ingress Rule:
   - Source: 0.0.0.0/0
   - IP Protocol: UDP
   - Destination Port Range: 3478
   - Description: TURN Server

**Bước 5: Cập nhật code**

Trong `client/src/components/VideoCall.js`, thêm TURN server của bạn:

```javascript
const rtcConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Thêm TURN server của bạn
    { 
      urls: 'turn:YOUR_PUBLIC_IP:3478',
      // Nếu có username/password, thêm:
      // username: 'your-username',
      // credential: 'your-password'
    }
  ],
  // ... rest of config
};
```

---

### Option 2: AWS Free Tier

**Ưu điểm:**
- ✅ 750 giờ EC2 miễn phí/tháng (12 tháng đầu)
- ✅ t2.micro instance miễn phí

**Bước 1: Tạo EC2 Instance**
1. Vào AWS Console → EC2
2. Launch Instance
3. Chọn:
   - **AMI**: Ubuntu 22.04
   - **Instance Type**: t2.micro (Free Tier)
   - **Security Group**: Mở port 3478 (UDP)
4. Launch

**Bước 2-5**: Giống như Oracle Cloud (setup coturn)

---

### Option 3: Google Cloud Free Tier

**Ưu điểm:**
- ✅ $300 credit miễn phí (90 ngày)
- ✅ f1-micro instance miễn phí (1 instance, US regions)

**Bước 1: Tạo VM Instance**
1. Vào Google Cloud Console → Compute Engine
2. Create Instance
3. Chọn:
   - **Machine type**: f1-micro (Free Tier)
   - **Boot disk**: Ubuntu 22.04
   - **Firewall**: Allow HTTP, HTTPS, và tạo rule cho UDP 3478
4. Create

**Bước 2-5**: Giống như Oracle Cloud (setup coturn)

---

## 🧪 Test TURN Server

### Cách 1: Test với trickle-ice

1. Vào: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Thêm TURN server:
   ```
   turn:YOUR_PUBLIC_IP:3478
   ```
3. Click "Gather candidates"
4. Kiểm tra xem có **relay** candidates không

### Cách 2: Test trong code

Sau khi cập nhật code và deploy, xem Debug Logs:
- Nếu thấy `✅ Using TURN server (relay)` → TURN hoạt động!
- Nếu thấy `📊 ICE stats: relay=X` (X > 0) → TURN hoạt động!

---

## 🔒 Thêm Authentication (Tùy chọn - Bảo mật hơn)

Nếu muốn thêm username/password:

**Trên server:**
```bash
# Generate password hash
turnadmin -k -u username -p password -r yourdomain.com
```

**Cập nhật /etc/turnserver.conf:**
```conf
# Remove no-auth, thêm:
user=username:password-hash
```

**Cập nhật code:**
```javascript
{
  urls: 'turn:YOUR_PUBLIC_IP:3478',
  username: 'username',
  credential: 'password'
}
```

---

## 📊 So sánh các options

| Option | Chi phí | Bandwidth | Độ khó | Khuyến nghị |
|--------|---------|-----------|--------|-------------|
| Oracle Cloud | Miễn phí vĩnh viễn | 10TB/tháng | ⭐⭐ | ✅ Tốt nhất |
| AWS | Miễn phí 12 tháng | Giới hạn | ⭐⭐⭐ | ✅ OK |
| Google Cloud | $300 credit 90 ngày | Giới hạn | ⭐⭐⭐ | ✅ OK |
| TURN miễn phí công cộng | Miễn phí | Không ổn định | ⭐ | ❌ Không khuyến nghị |

---

## 🚀 Quick Start (Oracle Cloud - 15 phút)

1. Đăng ký Oracle Cloud Free Tier
2. Tạo VM Ubuntu 22.04 (ARM)
3. SSH vào VM
4. Chạy script sau:

```bash
# Install coturn
sudo apt-get update && sudo apt-get install -y coturn

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me)

# Configure coturn
sudo tee /etc/turnserver.conf > /dev/null <<EOF
listening-port=3478
listening-ip=0.0.0.0
external-ip=$PUBLIC_IP
realm=yourdomain.com
server-name=yourdomain.com
no-auth
log-file=/var/log/turn.log
verbose
stun-only
no-cli
no-tls
no-dtls
EOF

# Start coturn
sudo systemctl enable coturn
sudo systemctl start coturn

# Check status
sudo systemctl status coturn
```

5. Mở port 3478 (UDP) trong Security List
6. Cập nhật code với TURN server IP
7. Deploy và test!

---

## ❓ Troubleshooting

### TURN server không hoạt động?

1. **Kiểm tra coturn đang chạy:**
   ```bash
   sudo systemctl status coturn
   ```

2. **Kiểm tra logs:**
   ```bash
   sudo tail -f /var/log/turn.log
   ```

3. **Kiểm tra firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 3478/udp
   ```

4. **Test từ máy local:**
   ```bash
   telnet YOUR_PUBLIC_IP 3478
   ```

### Connection vẫn failed?

1. Kiểm tra TURN server có trong Debug Logs không
2. Test với trickle-ice tool
3. Kiểm tra network có block UDP 3478 không

---

## 💡 Tips

- **Oracle Cloud Free Tier** là lựa chọn tốt nhất cho production miễn phí
- Có thể setup nhiều TURN servers để redundancy
- Monitor bandwidth usage (Oracle Cloud: 10TB/tháng miễn phí)
- Có thể thêm authentication sau nếu cần bảo mật

---

## 🎉 Kết quả mong đợi

Sau khi setup TURN server, bạn sẽ thấy trong Debug Logs:

```
✅ Using TURN server (relay) for guest@example.com
📊 ICE stats: host=2, srflx=2, relay=2
✅ ICE connection established!
```

**Connection sẽ thành công!** 🎊

