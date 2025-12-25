# 📧 Hướng dẫn Setup Gmail cho Email Xác thực

## Email của bạn: annhienduhochan@gmail.com

⚠️ **QUAN TRỌNG:** Phải bật **2-Step Verification TRƯỚC** mới thấy App Passwords!

---

## 🚀 Các bước thực hiện

### Bước 1: Bật 2-Step Verification (Bảo mật 2 lớp) - BẮT BUỘC

1. Đăng nhập Gmail: https://mail.google.com
2. Click **Ảnh đại diện** (góc trên phải) → **Quản lý Tài khoản Google**
3. Vào tab **Bảo mật**
4. Tìm **Xác minh 2 bước** → Click **Bắt đầu**
5. Làm theo hướng dẫn:
   - Nhập số điện thoại
   - Nhận mã qua SMS
   - Xác nhận

### Bước 2: Tạo App Password (Mật khẩu ứng dụng)

⚠️ **BẮT BUỘC:** Phải dùng App Password, không dùng password Gmail!

**Lưu ý:** Nếu không thấy App Passwords, bạn chưa bật 2-Step Verification. Quay lại Bước 1!

1. Vào: https://myaccount.google.com/apppasswords
   - **Nếu thấy lỗi "not available"** → Bạn chưa bật 2-Step Verification
   - Quay lại Bước 1 và bật 2-Step Verification trước
   - Hoặc: Google Account → Bảo mật → Mật khẩu ứng dụng
2. Chọn **Ứng dụng**: **Thư** (Mail)
3. Chọn **Thiết bị**: **Khác (Tên tùy chỉnh)**
4. Nhập tên: `Du Hoc An Nhien Server`
5. Click **Tạo**
6. **Copy mật khẩu 16 ký tự** (có dấu cách)
   - Ví dụ: `abcd efgh ijkl mnop`
   - ⚠️ Chỉ hiện 1 lần, lưu lại ngay!

### Bước 3: Thêm vào Railway

1. Vào Railway: https://railway.app
2. Chọn **Project** → **Service** (backend)
3. Vào tab **Variables**
4. Click **New Variable** và thêm từng biến:

**Variable 1:**
- Key: `EMAIL_PROVIDER`
- Value: `gmail`

**Variable 2:**
- Key: `EMAIL_USER`
- Value: `annhienduhochan@gmail.com`

**Variable 3:**
- Key: `EMAIL_PASSWORD`
- Value: `abcdefghijklmnop` (App Password, **bỏ dấu cách**)
  - Nếu App Password là: `abcd efgh ijkl mnop`
  - Thì nhập: `abcdefghijklmnop` (không có dấu cách)

**Variable 4:**
- Key: `EMAIL_FROM`
- Value: `annhienduhochan@gmail.com`

**Variable 5:**
- Key: `SITE_NAME`
- Value: `Du học An Nhiên`

**Variable 6:**
- Key: `FRONTEND_URL`
- Value: `https://duhocannhien.vercel.app`

### Bước 4: Restart Server

- Railway tự động restart khi thêm variables
- Hoặc: **Deployments** → **Redeploy**

### Bước 5: Test

**Test bằng script:**
```bash
cd server
node test-email.js your-email@example.com
```

**Hoặc test trực tiếp:**
1. Vào website → `/login`
2. Đăng ký tài khoản mới
3. Kiểm tra email inbox
4. Click link xác thực

---

## ✅ Kiểm tra đã hoạt động

Vào Railway → **Deployments** → **Logs**

**✅ Thành công:**
```
✅ Email service initialized with provider: gmail
✅ Email sent successfully
```

**❌ Lỗi:**
```
❌ Error: Invalid login
```
→ Kiểm tra lại App Password

---

## ❌ Nếu gặp lỗi "App passwords not available"

**Nguyên nhân:** Chưa bật 2-Step Verification hoặc tài khoản bị hạn chế

**Giải pháp:**
1. ✅ **Bật 2-Step Verification trước** (Bước 1 ở trên)
2. ✅ Đợi vài phút sau khi bật
3. ✅ Refresh trang App Passwords
4. ❌ Nếu vẫn không được → Xem file `FIX-GMAIL-APP-PASSWORD.md`
5. 💡 **Khuyến nghị:** Dùng SendGrid thay thế (dễ hơn, ổn định hơn)

---

## ⚠️ Lưu ý quan trọng

1. ✅ **Phải bật 2-Step Verification TRƯỚC** khi tạo App Password
   - App Passwords chỉ xuất hiện sau khi bật 2-Step Verification
2. ✅ **Phải dùng App Password**, không dùng password Gmail
3. ✅ **Bỏ dấu cách** trong App Password khi thêm vào Railway
4. ⚠️ **Gmail giới hạn:** 500 emails/ngày
   - Đủ cho testing và website nhỏ
   - Nếu cần nhiều hơn → Dùng SendGrid

---

## 🐛 Xử lý lỗi

### "Invalid login"
- ✅ Kiểm tra App Password đã đúng chưa
- ✅ Đã bỏ dấu cách chưa
- ✅ Đã bật 2-Step Verification chưa

### "Less secure app access"
- ✅ Không cần bật "Less secure app access"
- ✅ Chỉ cần App Password

### Email không gửi
- ✅ Xem logs trong Railway
- ✅ Test với script: `node test-email.js your-email@example.com`
- ✅ Kiểm tra App Password

---

## 📋 Checklist

- [ ] Đã bật 2-Step Verification
- [ ] Đã tạo App Password
- [ ] Đã copy App Password (16 ký tự)
- [ ] Đã thêm 6 biến vào Railway
- [ ] Đã bỏ dấu cách trong App Password
- [ ] Server đã restart
- [ ] Đã test gửi email thành công

---

## 🔗 Links nhanh

- Google Account: https://myaccount.google.com
- Bảo mật: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- Railway: https://railway.app

---

**Sau khi setup xong, email xác thực sẽ tự động gửi!** ✅

