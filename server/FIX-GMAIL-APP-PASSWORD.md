# 🔧 Xử lý lỗi "App passwords not available"

## ❌ Lỗi: "The setting you are looking for is not available for your account"

### Nguyên nhân thường gặp:

1. **Chưa bật 2-Step Verification** (Nguyên nhân phổ biến nhất)
2. Tài khoản Google Workspace (công ty) có hạn chế
3. Tài khoản trẻ em hoặc có giới hạn
4. Tài khoản chưa verify đầy đủ

---

## ✅ Giải pháp 1: Bật 2-Step Verification (Bắt buộc)

**App Passwords chỉ xuất hiện sau khi bật 2-Step Verification!**

### Các bước:

1. Vào: https://myaccount.google.com/security
2. Tìm mục **"Xác minh 2 bước"** (2-Step Verification)
3. Click **"Bắt đầu"** hoặc **"Get started"**
4. Làm theo hướng dẫn:
   - Nhập số điện thoại
   - Nhận mã xác minh qua SMS
   - Xác nhận
5. **Sau khi bật xong**, quay lại: https://myaccount.google.com/apppasswords
6. Bây giờ sẽ thấy form tạo App Password!

---

## ✅ Giải pháp 2: Kiểm tra loại tài khoản

### Nếu là Google Workspace (tài khoản công ty):

1. Vào: https://admin.google.com
2. Kiểm tra xem admin có cho phép App Passwords không
3. Hoặc liên hệ admin để bật tính năng này

### Nếu là tài khoản trẻ em:

- Có thể bị hạn chế bởi Family Link
- Cần tài khoản Google thông thường

---

## ✅ Giải pháp 3: Dùng OAuth2 (Nâng cao)

Nếu App Passwords không khả dụng, có thể dùng OAuth2:

1. Tạo OAuth2 credentials trong Google Cloud Console
2. Cấu hình trong email-service.js
3. Phức tạp hơn nhưng an toàn hơn

**Tuy nhiên, cách này phức tạp. Khuyến nghị: Dùng SendGrid thay thế.**

---

## 🚀 Giải pháp 4: Chuyển sang SendGrid (Khuyến nghị)

Nếu Gmail không hoạt động, **SendGrid là lựa chọn tốt hơn**:

### Ưu điểm SendGrid:
- ✅ FREE: 100 emails/ngày
- ✅ Không cần App Password
- ✅ Dễ setup hơn
- ✅ Professional hơn
- ✅ Không bị giới hạn như Gmail

### Setup SendGrid (5 phút):

1. Đăng ký: https://sendgrid.com → Start for free
2. Verify email
3. Settings → API Keys → Create API Key
4. Copy API Key
5. Settings → Sender Authentication → Verify Single Sender
6. Thêm vào Railway:

```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=annhienduhochan@gmail.com
SITE_NAME=Du học An Nhiên
FRONTEND_URL=https://duhocannhien.vercel.app
```

**Xem hướng dẫn chi tiết:** `EMAIL-SETUP.md`

---

## 📋 Checklist kiểm tra

- [ ] Đã bật 2-Step Verification chưa?
- [ ] Đã đợi vài phút sau khi bật 2-Step Verification?
- [ ] Đã thử refresh trang App Passwords?
- [ ] Tài khoản có phải Google Workspace không?
- [ ] Tài khoản có bị hạn chế không?

---

## 💡 Khuyến nghị

**Nếu App Passwords không khả dụng:**
1. **Thử bật 2-Step Verification trước** (giải pháp 1)
2. **Nếu vẫn không được → Dùng SendGrid** (giải pháp 4)
   - Dễ hơn
   - Ổn định hơn
   - Professional hơn
   - FREE 100 emails/ngày

---

## 🔗 Links hữu ích

- Google Account Security: https://myaccount.google.com/security
- 2-Step Verification: https://myaccount.google.com/signinoptions/two-step-verification
- App Passwords: https://myaccount.google.com/apppasswords
- SendGrid: https://sendgrid.com

---

**Nếu vẫn gặp vấn đề, hãy thử SendGrid - nó đơn giản và ổn định hơn!** ✅

