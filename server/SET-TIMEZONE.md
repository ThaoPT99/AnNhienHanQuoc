# ⏰ SETUP TIMEZONE VIỆT NAM (UTC+7)

## 🎯 Vấn đề
Server deploy ở Hà Lan nên thời gian hiển thị theo múi giờ Hà Lan (UTC+1 hoặc UTC+2), không phải Việt Nam (UTC+7).

## ✅ Giải pháp

### 1. **Frontend (Đã sửa)**
- ✅ Tạo `utils/timezone.js` với các function convert sang múi giờ Việt Nam
- ✅ Sửa `SimpleChatbot.js` để dùng `formatVietnamTime()`
- ✅ Sửa `Community.js` để dùng `getRelativeTime()`
- ✅ Sửa `CalendarBooking.js` và `ProgressTracker.js` để dùng `formatVietnamDate()`

### 2. **Backend (Đã sửa)**
- ✅ Tạo `server/timezone.js` với utility functions
- ✅ Set `process.env.TZ = 'Asia/Ho_Chi_Minh'` trong `index.js`
- ✅ Sửa health check endpoint để dùng `getVietnamTimeISO()`

### 3. **Railway Environment Variable (Cần làm)**
Thêm biến môi trường trên Railway:

1. Railway Dashboard → Project → Service
2. Tab **"Variables"** → **"+ New Variable"**
3. Thêm:
   ```
   Name: TZ
   Value: Asia/Ho_Chi_Minh
   ```
4. Click **"Add"**
5. **Redeploy** service

---

## 📝 Lưu ý

- **Frontend**: Tất cả thời gian hiển thị đã được convert sang múi giờ Việt Nam
- **Backend**: Code đã set timezone, nhưng cần thêm biến `TZ` trên Railway để đảm bảo
- **Database**: Timestamps trong database vẫn lưu UTC (đúng chuẩn), chỉ convert khi hiển thị

---

## ✅ Sau khi setup

Tất cả thời gian trên website sẽ hiển thị theo múi giờ Việt Nam (UTC+7)!




