# Hướng dẫn Setup Chatbot cho Website

## Tổng quan
Website đã được tích hợp sẵn code cho chatbot. Bạn chỉ cần chọn một trong các phương án dưới đây và làm theo hướng dẫn.

---

## Phương án 1: Tawk.to (Khuyến nghị - Miễn phí)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Dễ setup, không cần code
- ✅ Hỗ trợ nhiều ngôn ngữ (có tiếng Việt)
- ✅ Mobile app để trả lời tin nhắn
- ✅ Tích hợp với Facebook, Instagram
- ✅ Báo cáo và thống kê chi tiết
- ✅ Chat offline (khách để lại tin nhắn)

### Cách setup:

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://www.tawk.to
2. Click "Sign Up Free"
3. Đăng ký bằng email hoặc Google/Facebook

#### Bước 2: Tạo Property
1. Sau khi đăng nhập, click "Add Property"
2. Điền thông tin:
   - **Property Name**: Du học An Nhiên
   - **Website URL**: https://duhocannhien.vercel.app
   - **Timezone**: Asia/Ho_Chi_Minh
3. Click "Create Property"

#### Bước 3: Lấy Property ID và Widget ID
1. Sau khi tạo property, bạn sẽ thấy một đoạn code JavaScript
2. Trong đoạn code, tìm dòng:
   ```javascript
   s1.src='https://embed.tawk.to/PROPERTY_ID/WIDGET_ID';
   ```
3. Copy 2 ID này (ví dụ: `1234567890/abcdefgh`)

#### Bước 4: Cập nhật vào website
1. Mở file: `client/public/index.html`
2. Tìm dòng 65 (trong phần Tawk.to)
3. Thay thế:
   ```javascript
   s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
   ```
   Bằng:
   ```javascript
   s1.src='https://embed.tawk.to/PROPERTY_ID/WIDGET_ID'; // ID của bạn
   ```
4. Uncomment (bỏ dấu `<!--` và `-->`) phần code Tawk.to
5. Lưu file và deploy lại website

#### Bước 5: Tùy chỉnh giao diện (Tùy chọn)
1. Vào Dashboard Tawk.to
2. Chọn "Chat Widget" → "Appearance"
3. Tùy chỉnh:
   - Màu sắc (phù hợp với website)
   - Vị trí (góc dưới bên phải/trái)
   - Logo
   - Lời chào tự động

#### Bước 6: Cài đặt thông báo
1. Vào "Settings" → "Notifications"
2. Bật thông báo email khi có tin nhắn mới
3. Cài app Tawk.to trên điện thoại để nhận thông báo real-time

---

## Phương án 2: Facebook Messenger

### Ưu điểm:
- ✅ Miễn phí
- ✅ Người dùng quen thuộc với Messenger
- ✅ Tích hợp với Facebook Page
- ✅ Chat trên mobile app Messenger

### Yêu cầu:
- Cần có Facebook Page cho "Du học An Nhiên"

### Cách setup:

#### Bước 1: Lấy Facebook Page ID
1. Truy cập Facebook Page của bạn
2. Vào "Settings" → "Page Info"
3. Scroll xuống tìm "Page ID" (hoặc xem trong URL: `facebook.com/PAGE_ID`)
4. Copy Page ID

#### Bước 2: Cập nhật vào website
1. Mở file: `client/public/index.html`
2. Uncomment phần Facebook Messenger (dòng 75-95)
3. Thay `YOUR_FACEBOOK_PAGE_ID` bằng Page ID của bạn
4. Lưu file và deploy

#### Bước 3: Kích hoạt Messenger trên Page
1. Vào Facebook Page Settings
2. Chọn "Messaging"
3. Bật "Allow people to contact my Page privately"

---

## Phương án 3: Zalo Chat

### Ưu điểm:
- ✅ Phổ biến tại Việt Nam
- ✅ Miễn phí
- ✅ Người dùng Việt Nam quen thuộc

### Yêu cầu:
- Cần có Zalo Official Account (OA)

### Cách setup:

#### Bước 1: Tạo Zalo Official Account
1. Truy cập: https://oa.zalo.me
2. Đăng ký tài khoản Zalo OA
3. Xác thực và lấy OA ID

#### Bước 2: Cập nhật vào website
1. Mở file: `client/public/index.html`
2. Uncomment phần Zalo Chat (dòng 97-99)
3. Thay `YOUR_ZALO_OA_ID` bằng OA ID của bạn
4. Lưu file và deploy

---

## Phương án 4: Custom Chatbot đơn giản (Tự code)

Nếu bạn muốn một chatbot đơn giản, tự quản lý, tôi có thể tạo một chatbot component React với các tính năng:
- Trả lời tự động các câu hỏi thường gặp
- Form liên hệ
- Chuyển sang tư vấn viên

Bạn có muốn tôi tạo custom chatbot không?

---

## So sánh các phương án

| Tính năng | Tawk.to | Facebook Messenger | Zalo Chat | Custom |
|-----------|---------|-------------------|-----------|--------|
| **Chi phí** | Miễn phí | Miễn phí | Miễn phí | Miễn phí |
| **Dễ setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Tự động trả lời** | ✅ | ✅ | ✅ | ✅ (tùy code) |
| **Mobile app** | ✅ | ✅ | ✅ | ❌ |
| **Thống kê** | ✅ | ✅ | ✅ | ❌ |
| **Tùy biến** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## Khuyến nghị

**Cho website du học:**
1. **Tawk.to** - Tốt nhất cho doanh nghiệp, có đầy đủ tính năng
2. **Facebook Messenger** - Nếu bạn có fanpage hoạt động tốt
3. **Zalo Chat** - Nếu khách hàng chủ yếu dùng Zalo

**Có thể dùng kết hợp:**
- Tawk.to làm chatbot chính
- Facebook Messenger làm kênh phụ
- Zalo Chat cho khách hàng Việt Nam

---

## Lưu ý

1. **Chỉ nên dùng 1 chatbot** để tránh gây rối cho người dùng
2. **Test kỹ** sau khi setup để đảm bảo hoạt động tốt
3. **Trả lời nhanh** để tăng conversion rate
4. **Cài đặt auto-reply** cho các câu hỏi thường gặp

---

## Hỗ trợ

Nếu gặp khó khăn trong quá trình setup, hãy:
1. Kiểm tra lại code trong `index.html`
2. Xem console của browser (F12) để tìm lỗi
3. Đảm bảo đã uncomment đúng phần code
4. Clear cache và reload lại trang

---

## Bước tiếp theo

Sau khi setup chatbot:
1. ✅ Test trên desktop và mobile
2. ✅ Tùy chỉnh giao diện phù hợp với website
3. ✅ Viết các câu trả lời tự động (auto-reply)
4. ✅ Cài app để nhận thông báo
5. ✅ Theo dõi và phân tích hiệu quả

