# Email Service - Security & Privacy

## 🔒 Bảo mật

### Người dùng KHÔNG cần nhập password email

- ✅ Người dùng chỉ cần nhập **email của họ** để nhận thông báo
- ✅ Email được gửi từ **email account của website** (không phải của người dùng)
- ✅ Người dùng **KHÔNG cần** và **KHÔNG NÊN** nhập password email của họ

### Cách hoạt động:

1. **Website có email service riêng:**
   - SendGrid/Mailgun API key (khuyến nghị)
   - Hoặc email account riêng của website (ví dụ: noreply@duhocannhien.com)

2. **Người dùng chỉ cung cấp:**
   - Email của họ để nhận thông báo
   - Không cần password

3. **Website gửi email:**
   - Từ email service của website
   - Đến email của người dùng
   - Với link tham gia cuộc gọi

---

## 📧 Setup Email Service (Admin/Developer)

### Option 1: SendGrid (Khuyến nghị - FREE)

1. Đăng ký tại https://sendgrid.com
2. Verify email của website
3. Tạo API Key
4. Thêm vào environment variables:
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=your-api-key
   EMAIL_FROM=noreply@duhocannhien.com
   ```

### Option 2: Mailgun (FREE tier tốt)

1. Đăng ký tại https://www.mailgun.com
2. Verify domain hoặc email
3. Lấy SMTP credentials
4. Thêm vào environment variables

### Option 3: Gmail (Chỉ cho testing)

**Chỉ dùng email account riêng của website, không phải của người dùng!**

1. Tạo Gmail account riêng cho website
2. Tạo App Password
3. Thêm vào environment variables

---

## ✅ Best Practices

1. **Luôn dùng email service riêng của website**
2. **Không bao giờ yêu cầu password email của người dùng**
3. **Dùng SendGrid/Mailgun cho production** (professional, reliable)
4. **Verify sender email/domain** để tránh spam
5. **Setup SPF/DKIM records** cho domain

---

## 🚫 Những điều KHÔNG NÊN làm

- ❌ Yêu cầu người dùng nhập password email của họ
- ❌ Lưu trữ password email của người dùng
- ❌ Dùng email cá nhân của người dùng để gửi email
- ❌ Gửi email từ email account của người dùng

---

## 📝 Privacy Policy

Website chỉ sử dụng email của người dùng để:
- Gửi thông báo cuộc gọi video
- Gửi thông báo hệ thống
- Không chia sẻ với bên thứ 3
- Không lưu trữ password email

