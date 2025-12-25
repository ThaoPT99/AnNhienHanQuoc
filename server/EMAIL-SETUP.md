# Email Service Setup Guide

Hệ thống hỗ trợ nhiều email provider để gửi thông báo cuộc gọi video.

## Các Email Provider được hỗ trợ:

### 1. Gmail (Dễ nhất - Khuyến nghị cho testing)

**Environment Variables:**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
# Hoặc
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=noreply@duhocannhien.com
```

**Cách lấy App Password:**
1. Vào Google Account → Security
2. Bật 2-Step Verification
3. Tạo App Password cho "Mail"
4. Copy password và dùng làm `EMAIL_PASSWORD`

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

