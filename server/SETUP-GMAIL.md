# 📧 Setup Gmail cho Email Xác thực

## Sử dụng: annhienduhochan@gmail.com

### Bước 1: Bật 2-Step Verification (Bảo mật 2 lớp)

1. Đăng nhập vào Gmail: https://mail.google.com
2. Click vào **Ảnh đại diện** (góc trên bên phải) → **Quản lý Tài khoản Google**
3. Vào tab **Bảo mật** (Security)
4. Tìm mục **Xác minh 2 bước** (2-Step Verification)
5. Click **Bắt đầu** và làm theo hướng dẫn:
   - Nhập số điện thoại
   - Nhận mã xác minh qua SMS
   - Xác nhận

### Bước 2: Tạo App Password (Mật khẩu ứng dụng)

⚠️ **QUAN TRỌNG:** Phải dùng App Password, không dùng password thường!

1. Vẫn trong trang **Bảo mật** của Google Account
2. Tìm mục **Mật khẩu ứng dụng** (App passwords)
   - Nếu chưa thấy, click vào **Xác minh 2 bước** → Scroll xuống → **Mật khẩu ứng dụng**
3. Click **Chọn ứng dụng** → Chọn **Thư** (Mail)
4. Click **Chọn thiết bị** → Chọn **Khác (Tên tùy chỉnh)**
5. Nhập tên: `Du Hoc An Nhien Server`
6. Click **Tạo**
7. **Copy mật khẩu 16 ký tự** (có dấu cách, ví dụ: `abcd efgh ijkl mnop`)
   - ⚠️ Chỉ hiện 1 lần, lưu lại ngay!

### Bước 3: Thêm Environment Variables vào Railway

1. Vào Railway: https://railway.app
2. Chọn Project → Service (backend server)
3. Vào tab **Variables**
4. Thêm các biến sau:

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=annhienduhochan@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=annhienduhochan@gmail.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

**Lưu ý:**
- `EMAIL_PASSWORD`: Dán App Password (16 ký tự, **bỏ dấu cách**)
  - Ví dụ: Nếu App Password là `abcd efgh ijkl mnop`
  - Thì nhập: `abcdefghijklmnop` (không có dấu cách)

### Bước 4: Restart Server

- Railway sẽ tự động restart khi bạn thêm variables
- Hoặc vào **Deployments** → Click **Redeploy**

### Bước 5: Test Email

**Cách 1: Dùng script test**
```bash
cd server
node test-email.js your-test-email@example.com
```

**Cách 2: Test trực tiếp**
1. Vào website → `/login`
2. Đăng ký tài khoản mới
3. Kiểm tra email inbox của email bạn vừa đăng ký
4. Click link xác thực

### Bước 6: Kiểm tra Logs

Vào Railway → Service → **Deployments** → Click vào deployment mới nhất → Xem **Logs**

**✅ Thành công:**
```
✅ Email service initialized with provider: gmail
✅ Email sent successfully: <message-id>
```

**❌ Lỗi:**
```
❌ Error initializing email service: Invalid login
```
→ Kiểm tra lại App Password

---

## ⚠️ Lưu ý quan trọng

1. **Phải dùng App Password**, không dùng password Gmail thường
2. **Bỏ dấu cách** trong App Password khi thêm vào Railway
3. **Gmail giới hạn:** 500 emails/ngày
   - Đủ cho testing và website nhỏ
   - Nếu cần nhiều hơn, nên chuyển sang SendGrid

## 🐛 Troubleshooting

### Lỗi: "Invalid login"
- ✅ Kiểm tra App Password đã đúng chưa
- ✅ Đã bỏ dấu cách chưa
- ✅ Đã bật 2-Step Verification chưa

### Lỗi: "Less secure app access"
- ✅ Không cần bật "Less secure app access"
- ✅ Chỉ cần dùng App Password

### Email không gửi được
- ✅ Kiểm tra logs trong Railway
- ✅ Test với script: `node test-email.js your-email@example.com`
- ✅ Kiểm tra App Password có đúng không

---

## 📋 Checklist

- [ ] Đã bật 2-Step Verification
- [ ] Đã tạo App Password
- [ ] Đã copy App Password (16 ký tự)
- [ ] Đã thêm environment variables vào Railway
- [ ] Đã bỏ dấu cách trong App Password
- [ ] Server đã restart
- [ ] Đã test gửi email thành công

---

## 🔗 Links hữu ích

- Google Account Security: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- Railway Variables: Railway Dashboard → Project → Variables

---

**Sau khi setup xong, email xác thực sẽ tự động gửi khi có người đăng ký!** ✅



