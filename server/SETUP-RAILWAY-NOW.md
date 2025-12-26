# ✅ App Password đã tạo thành công!

## App Password của bạn: `adav nque lekd fszq`

---

## 🚀 Bước tiếp theo: Thêm vào Railway

### 1. Copy App Password
- App Password: `adav nque lekd fszq`
- **Lưu ý:** Khi thêm vào Railway, **BỎ DẤU CÁCH**
- Sẽ thành: `adavnquelekdfszq`

### 2. Vào Railway và thêm Environment Variables

1. Vào: https://railway.app
2. Chọn **Project** → **Service** (backend server)
3. Vào tab **Variables**
4. Click **New Variable** và thêm từng biến sau:

#### Variable 1:
- **Key:** `EMAIL_PROVIDER`
- **Value:** `gmail`

#### Variable 2:
- **Key:** `EMAIL_USER`
- **Value:** `annhienduhochan@gmail.com`

#### Variable 3:
- **Key:** `EMAIL_PASSWORD`
- **Value:** `adavnquelekdfszq` ⚠️ **BỎ DẤU CÁCH!**
  - Không phải: `adav nque lekd fszq`
  - Mà là: `adavnquelekdfszq`

#### Variable 4:
- **Key:** `EMAIL_FROM`
- **Value:** `annhienduhochan@gmail.com`

#### Variable 5:
- **Key:** `SITE_NAME`
- **Value:** `Du học An Nhiên`

#### Variable 6:
- **Key:** `FRONTEND_URL`
- **Value:** `https://duhocannhien.vercel.app`

### 3. Railway sẽ tự động restart

- Sau khi thêm variables, Railway sẽ tự động deploy lại
- Hoặc vào **Deployments** → Click **Redeploy**

### 4. Kiểm tra Logs

Vào Railway → **Deployments** → Click deployment mới nhất → Xem **Logs**

**✅ Thành công:**
```
✅ Email service initialized with provider: gmail
✅ Email sent successfully
```

**❌ Lỗi:**
```
❌ Error: Invalid login
```
→ Kiểm tra lại App Password (đã bỏ dấu cách chưa?)

---

## 🧪 Test Email

### Cách 1: Dùng script test
```bash
cd server
node test-email.js your-email@example.com
```

### Cách 2: Test trực tiếp
1. Vào website → `/login`
2. Đăng ký tài khoản mới
3. Kiểm tra email inbox
4. Click link xác thực

---

## 📋 Checklist

- [x] Đã tạo App Password: `adav nque lekd fszq`
- [ ] Đã thêm 6 biến vào Railway
- [ ] Đã bỏ dấu cách trong App Password: `adavnquelekdfszq`
- [ ] Server đã restart
- [ ] Đã kiểm tra logs (thấy "Email service initialized")
- [ ] Đã test gửi email thành công

---

## ⚠️ Lưu ý quan trọng

1. ✅ **Bỏ dấu cách** trong App Password khi thêm vào Railway
2. ✅ App Password chỉ hiện 1 lần, đã copy chưa?
3. ✅ Nếu quên App Password, tạo lại App Password mới

---

## 🔗 Links

- Railway Dashboard: https://railway.app
- Test Email Script: `server/test-email.js`

---

**Sau khi thêm vào Railway, email xác thực sẽ tự động gửi!** ✅



