# 🔐 THÔNG TIN ĐĂNG NHẬP ADMIN

## 📋 Thông tin mặc định

**Tài khoản Admin mặc định:**
- **Username**: `admin`
- **Password**: `admin123`

## ⚠️ QUAN TRỌNG - Bảo mật

⚠️ **Đây là thông tin mặc định, bạn CẦN THAY ĐỔI ngay khi deploy lên production!**

## 🔧 Cách thay đổi thông tin đăng nhập

### Option 1: Sử dụng Environment Variables (Khuyến nghị)

Thêm vào file `.env` trong thư mục `server/`:

```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

Hoặc trên Railway/Render, thêm vào Environment Variables:
- `ADMIN_USERNAME` = tên đăng nhập của bạn
- `ADMIN_PASSWORD` = mật khẩu mạnh của bạn

### Option 2: Thay đổi trong code (Không khuyến nghị)

Sửa trong file `server/index.js`:

```javascript
const adminUsername = 'your_username';
const adminPassword = 'your_password';
```

## 🚀 Cách sử dụng

1. **Truy cập trang đăng nhập:**
   - Local: `http://localhost:3000/admin-login`
   - Production: `https://duhocannhien.vercel.app/admin-login`

2. **Nhập thông tin:**
   - Username: `admin` (hoặc username bạn đã set)
   - Password: `admin123` (hoặc password bạn đã set)

3. **Sau khi đăng nhập:**
   - Bạn sẽ được chuyển đến trang Admin
   - Token được lưu trong localStorage
   - Token sẽ hết hạn khi đóng trình duyệt

## 🔒 Bảo mật nâng cao (Tùy chọn)

Hiện tại hệ thống sử dụng authentication đơn giản. Để bảo mật hơn, bạn có thể:

1. **Sử dụng JWT (JSON Web Tokens)**
2. **Hash password với bcrypt**
3. **Thêm rate limiting**
4. **Thêm 2FA (Two-Factor Authentication)**

## 📝 Lưu ý

- ⚠️ **KHÔNG commit file `.env` lên GitHub**
- ⚠️ **Đổi mật khẩu mặc định ngay khi deploy**
- ⚠️ **Sử dụng mật khẩu mạnh** (ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
- ✅ **Sử dụng Environment Variables** cho production

## 🐛 Xử lý lỗi

### Lỗi: "Invalid username or password"
- Kiểm tra lại username và password
- Đảm bảo không có khoảng trắng thừa
- Kiểm tra environment variables đã được set đúng chưa

### Lỗi: "No token provided"
- Đăng nhập lại
- Xóa localStorage và thử lại
- Kiểm tra token có được lưu trong localStorage không

## 📞 Hỗ trợ

Nếu quên mật khẩu:
1. Kiểm tra file `.env` hoặc Environment Variables trên hosting
2. Hoặc reset bằng cách thay đổi trong code và deploy lại

