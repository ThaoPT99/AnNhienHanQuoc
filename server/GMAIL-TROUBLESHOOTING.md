# 🔧 Gmail Troubleshooting - Xử lý lỗi

## ❌ Lỗi: "App passwords not available"

### Nguyên nhân #1: Chưa bật 2-Step Verification (90% trường hợp)

**Triệu chứng:**
- Vào https://myaccount.google.com/apppasswords
- Thấy lỗi: "The setting you are looking for is not available for your account"
- Hoặc không thấy form tạo App Password

**Giải pháp:**
1. **BẮT BUỘC:** Bật 2-Step Verification trước
   - Vào: https://myaccount.google.com/security
   - Tìm "Xác minh 2 bước" → Click "Bắt đầu"
   - Làm theo hướng dẫn (nhập số điện thoại, nhận mã SMS)
2. **Đợi 2-3 phút** sau khi bật
3. **Refresh trang** App Passwords
4. Bây giờ sẽ thấy form tạo App Password!

---

## ❌ Lỗi: "Invalid login" khi gửi email

**Nguyên nhân:**
- Dùng password Gmail thay vì App Password
- App Password sai
- Chưa bỏ dấu cách trong App Password

**Giải pháp:**
1. ✅ Phải dùng **App Password**, không dùng password Gmail
2. ✅ Tạo App Password mới: https://myaccount.google.com/apppasswords
3. ✅ **Bỏ dấu cách** khi thêm vào Railway
   - App Password: `abcd efgh ijkl mnop`
   - Nhập vào Railway: `abcdefghijklmnop` (không có dấu cách)

---

## ❌ Lỗi: "Less secure app access"

**Nguyên nhân:**
- Google đã tắt tính năng này
- Không cần bật nữa

**Giải pháp:**
- ✅ **Không cần bật** "Less secure app access"
- ✅ Chỉ cần dùng **App Password** là đủ

---

## ❌ Lỗi: Gmail không gửi được email

**Kiểm tra:**
1. ✅ Xem logs trong Railway
2. ✅ Test với script: `node test-email.js your-email@example.com`
3. ✅ Kiểm tra App Password có đúng không
4. ✅ Kiểm tra đã bật 2-Step Verification chưa

**Logs thành công:**
```
✅ Email service initialized with provider: gmail
✅ Email sent successfully: <message-id>
```

**Logs lỗi:**
```
❌ Error: Invalid login
```
→ Kiểm tra lại App Password

---

## ⚠️ Giới hạn Gmail

- **500 emails/ngày** - Đủ cho testing và website nhỏ
- Nếu cần nhiều hơn → Dùng SendGrid (100 emails/ngày FREE, nhưng ổn định hơn)

---

## 💡 Khuyến nghị

**Nếu Gmail gặp nhiều vấn đề:**
- ✅ Chuyển sang **SendGrid** (dễ hơn, ổn định hơn)
- ✅ Xem hướng dẫn: `EMAIL-SETUP.md`

---

## 🔗 Links nhanh

- Google Account Security: https://myaccount.google.com/security
- 2-Step Verification: https://myaccount.google.com/signinoptions/two-step-verification
- App Passwords: https://myaccount.google.com/apppasswords
- Railway Logs: Railway Dashboard → Deployments → Logs



