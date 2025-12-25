# Email Service Setup Guide

⚠️ **QUAN TRỌNG:** Email service này dùng email account của **WEBSITE**, không phải của người dùng. Người dùng chỉ cần nhập email để nhận thông báo, không cần password.

## Các Email Provider được hỗ trợ:

### 1. SendGrid (Khuyến nghị cho production - FREE tier: 100 emails/ngày)

**Environment Variables:**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@duhocannhien.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

**Setup:**
1. Đăng ký tài khoản FREE tại https://sendgrid.com
2. Verify email của bạn (email sẽ dùng để gửi)
3. Tạo API Key trong Settings → API Keys → Create API Key
4. Copy API Key → Thêm vào Railway/Vercel environment variables
5. Verify sender email trong SendGrid dashboard

**Ưu điểm:**
- ✅ FREE: 100 emails/ngày
- ✅ Không cần password của người dùng
- ✅ Professional email service
- ✅ Dễ setup

---

### 2. Mailgun (FREE tier: 5,000 emails/tháng đầu 3 tháng)

**Environment Variables:**
```env
EMAIL_PROVIDER=mailgun
MAILGUN_SMTP_LOGIN=your-mailgun-smtp-login
MAILGUN_SMTP_PASSWORD=your-mailgun-smtp-password
MAILGUN_SMTP_SERVER=smtp.mailgun.org
EMAIL_FROM=noreply@duhocannhien.com
```

---

### 3. Gmail (Chỉ dùng cho testing - cần App Password của website email)

**Lưu ý:** Chỉ dùng email account riêng của website, không phải của người dùng!

**Environment Variables:**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=website-email@gmail.com  # Email riêng của website
EMAIL_PASSWORD=app-password          # App Password của website email
EMAIL_FROM=noreply@duhocannhien.com
```

**Cách lấy App Password:**
1. Tạo Gmail account riêng cho website (ví dụ: noreply.duhocannhien@gmail.com)
2. Vào Google Account → Security
3. Bật 2-Step Verification
4. Tạo App Password cho "Mail"
5. Copy password → Dùng làm `EMAIL_PASSWORD`

---

### 2. SendGrid (Khuyến nghị cho production)

**Environment Variables:**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@duhocannhien.com
```

**Setup:**
1. Đăng ký tài khoản tại https://sendgrid.com
2. Tạo API Key trong Settings → API Keys
3. Copy API Key vào `SENDGRID_API_KEY`
4. Verify sender email trong SendGrid

---

### 3. Mailgun

**Environment Variables:**
```env
EMAIL_PROVIDER=mailgun
MAILGUN_SMTP_LOGIN=your-mailgun-smtp-login
MAILGUN_SMTP_PASSWORD=your-mailgun-smtp-password
MAILGUN_SMTP_SERVER=smtp.mailgun.org
EMAIL_FROM=noreply@duhocannhien.com
```

---

### 4. Custom SMTP

**Environment Variables:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@duhocannhien.com
```

---

## Các biến môi trường khác:

```env
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

---

## Test Email Service:

Sau khi setup, restart server và kiểm tra logs:
- ✅ `Email service: Configured and ready` = Thành công
- ⚠️ `Email service: Not configured` = Cần setup lại

---

## Troubleshooting:

1. **Gmail bị reject:**
   - Phải dùng App Password, không dùng password thường
   - Kiểm tra 2-Step Verification đã bật

2. **SendGrid không gửi được:**
   - Verify sender email trong SendGrid dashboard
   - Kiểm tra API Key có đúng không

3. **Email vào spam:**
   - Setup SPF/DKIM records cho domain
   - Verify domain trong email provider

