# ⚡ Setup Email Nhanh - 5 Phút

## Cách nhanh nhất: SendGrid

### 1. Đăng ký SendGrid (2 phút)
- Vào: https://sendgrid.com → Start for free
- Verify email

### 2. Tạo API Key (1 phút)
- Settings → API Keys → Create API Key
- Copy API Key

### 3. Verify Sender (1 phút)
- Settings → Sender Authentication → Verify a Single Sender
- Nhập email: `noreply@duhocannhien.com`
- Check email và click verify

### 4. Thêm vào Railway (1 phút)
Vào Railway → Project → Variables → Add:

```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx (paste API key)
EMAIL_FROM=noreply@duhocannhien.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

### 5. Test
- Đăng ký tài khoản mới
- Check email inbox
- Click link xác thực

✅ **Xong!** Email sẽ tự động gửi khi có người đăng ký.

---

## Nếu dùng Gmail (annhienduhochan@gmail.com)

### 1. Bật 2-Step Verification
- Vào: https://myaccount.google.com/security
- Bật **Xác minh 2 bước**

### 2. Tạo App Password
- Vào: https://myaccount.google.com/apppasswords
- Chọn **Thư** (Mail) → **Khác** → Nhập: `Du Hoc An Nhien Server`
- Click **Tạo** → Copy password 16 ký tự

### 3. Thêm vào Railway
```
EMAIL_PROVIDER=gmail
EMAIL_USER=annhienduhochan@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop (paste app password, bỏ dấu cách)
EMAIL_FROM=annhienduhochan@gmail.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

⚠️ **Lưu ý:** 
- Phải dùng **App Password**, không dùng password Gmail
- **Bỏ dấu cách** trong App Password
- Gmail giới hạn 500 emails/ngày

📖 **Xem hướng dẫn chi tiết:** `SETUP-GMAIL.md`

