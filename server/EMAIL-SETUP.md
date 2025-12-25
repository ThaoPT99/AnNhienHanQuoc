# 📧 Hướng dẫn cấu hình Email Server cho Email Xác thực

⚠️ **QUAN TRỌNG:** Email service này dùng email account của **WEBSITE**, không phải của người dùng. Người dùng chỉ cần nhập email để nhận thông báo xác thực, không cần password.

---

## 🚀 Cách nhanh nhất: SendGrid (Khuyến nghị)

### Bước 1: Đăng ký SendGrid (FREE)
1. Truy cập: https://sendgrid.com
2. Click "Start for free"
3. Điền thông tin và verify email

### Bước 2: Tạo API Key
1. Vào **Settings** → **API Keys**
2. Click **Create API Key**
3. Đặt tên: `Du Hoc An Nhien API Key`
4. Chọn quyền: **Full Access** (hoặc chỉ **Mail Send**)
5. Click **Create & View**
6. **Copy API Key ngay** (chỉ hiện 1 lần!)

### Bước 3: Verify Sender Email
1. Vào **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Điền thông tin:
   - **From Email:** `noreply@duhocannhien.com` (hoặc email bạn muốn)
   - **From Name:** `Du học An Nhiên`
   - **Reply To:** (để trống hoặc email của bạn)
4. Click **Create**
5. **Kiểm tra email** và click link verify

### Bước 4: Thêm Environment Variables vào Railway

Vào Railway dashboard → Project → Service → Variables → Add:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx  # API Key vừa copy
EMAIL_FROM=noreply@duhocannhien.com  # Email đã verify
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

### Bước 5: Restart Server
- Railway sẽ tự động restart khi bạn thêm variables
- Hoặc vào Deployments → Redeploy

### Bước 6: Test
1. Đăng ký tài khoản mới tại `/login`
2. Kiểm tra email inbox (có thể vào spam folder)
3. Click link xác thực

---

## 📮 Cách 2: Gmail (Chỉ dùng cho testing)

### Bước 1: Tạo Gmail riêng cho website
1. Tạo Gmail mới: `noreply.duhocannhien@gmail.com`
2. Đăng nhập và verify

### Bước 2: Bật 2-Step Verification
1. Vào https://myaccount.google.com/security
2. Bật **2-Step Verification**
3. Hoàn tất setup

### Bước 3: Tạo App Password
1. Vào https://myaccount.google.com/apppasswords
2. Chọn app: **Mail**
3. Chọn device: **Other (Custom name)** → Nhập: `Du Hoc An Nhien Server`
4. Click **Generate**
5. **Copy password** (16 ký tự, có dấu cách)

### Bước 4: Thêm Environment Variables

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=noreply.duhocannhien@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password (bỏ dấu cách)
EMAIL_FROM=noreply.duhocannhien@gmail.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

⚠️ **Lưu ý:** Gmail có giới hạn 500 emails/ngày. Chỉ dùng cho testing!

---

## 📬 Cách 3: Mailgun (FREE: 5,000 emails/tháng đầu 3 tháng)

### Bước 1: Đăng ký Mailgun
1. Truy cập: https://www.mailgun.com
2. Đăng ký tài khoản FREE
3. Verify email

### Bước 2: Verify Domain hoặc dùng Sandbox
- **Option 1:** Verify domain của bạn (khuyến nghị)
- **Option 2:** Dùng Sandbox domain (chỉ gửi đến email đã verify)

### Bước 3: Lấy SMTP Credentials
1. Vào **Sending** → **Domain Settings**
2. Scroll xuống **SMTP credentials**
3. Copy:
   - **SMTP Login**
   - **Default Password**

### Bước 4: Thêm Environment Variables

```env
EMAIL_PROVIDER=mailgun
MAILGUN_SMTP_LOGIN=postmaster@mg.yourdomain.com
MAILGUN_SMTP_PASSWORD=your-password
MAILGUN_SMTP_SERVER=smtp.mailgun.org
EMAIL_FROM=noreply@yourdomain.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

---

## 🔧 Cách 4: Custom SMTP (Nếu bạn có email server riêng)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false  # true cho port 465, false cho port 587
SMTP_USER=your-username
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

---

## ✅ Kiểm tra Email Service đã hoạt động

Sau khi setup, check server logs trong Railway:

### ✅ Thành công:
```
✅ Email service initialized with provider: sendgrid
✅ Email sent successfully: <message-id>
```

### ❌ Lỗi:
```
❌ Error initializing email service: ...
⚠️ Email service: Not configured
```

---

## 🐛 Troubleshooting

### 1. Email không gửi được

**Kiểm tra:**
- Environment variables đã đúng chưa?
- API Key/Password có đúng không?
- Email sender đã verify chưa? (SendGrid/Mailgun)

**Test nhanh:**
- Restart server
- Xem logs trong Railway
- Thử đăng ký tài khoản mới

### 2. Email vào Spam folder

**Giải pháp:**
- Verify domain trong SendGrid/Mailgun
- Setup SPF/DKIM records cho domain
- Dùng email có domain riêng (không dùng Gmail)

### 3. Gmail bị reject

**Nguyên nhân:**
- Phải dùng **App Password**, không dùng password thường
- Chưa bật 2-Step Verification

**Giải pháp:**
- Tạo App Password mới
- Đảm bảo bật 2-Step Verification

### 4. SendGrid: "Sender email not verified"

**Giải pháp:**
1. Vào SendGrid → Settings → Sender Authentication
2. Verify email bạn dùng trong `EMAIL_FROM`
3. Hoặc verify domain nếu dùng domain riêng

---

## 📋 Checklist Setup

- [ ] Chọn email provider (SendGrid khuyến nghị)
- [ ] Tạo API Key/App Password
- [ ] Verify sender email
- [ ] Thêm environment variables vào Railway
- [ ] Restart server
- [ ] Test đăng ký tài khoản mới
- [ ] Kiểm tra email inbox (và spam folder)
- [ ] Click link xác thực thành công

---

## 💡 Tips

1. **SendGrid FREE tier:** 100 emails/ngày - đủ cho website nhỏ
2. **Gmail:** Chỉ dùng testing, có giới hạn 500/ngày
3. **Mailgun:** 5,000 emails/tháng FREE (3 tháng đầu)
4. **Production:** Nên dùng SendGrid hoặc Mailgun với domain riêng

---

## 🔗 Links hữu ích

- SendGrid: https://sendgrid.com
- Mailgun: https://www.mailgun.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Railway Environment Variables: https://railway.app → Project → Variables

---

**Cần giúp đỡ?** Kiểm tra logs trong Railway hoặc test với endpoint `/api/auth/resend-verification`
