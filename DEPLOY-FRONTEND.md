# 🚀 HƯỚNG DẪN DEPLOY FRONTEND LÊN VERCEL

## ✅ Email đã có trong code

Email `annhienduhochan@gmail.com` đã được thêm vào:
- ✅ Footer.js (dòng 19)
- ✅ Contact.js (dòng 80)
- ✅ About.js (dòng 128)

## 🔄 Cần deploy lại để thấy thay đổi

### Bước 1: Commit và Push code lên GitHub

```bash
cd "C:\Users\phant\OneDrive\MYTNH~1\AnNhienHanQuoc"
git add .
git commit -m "Add email to Footer, Contact, and About pages"
git push
```

### Bước 2: Vercel sẽ tự động deploy

- Vercel sẽ tự động detect code mới từ GitHub
- Đợi 1-2 phút để Vercel build và deploy
- Kiểm tra Vercel dashboard để xem deployment status

### Bước 3: Clear browser cache

Sau khi Vercel deploy xong:

1. **Hard refresh trang:**
   - Windows: `Ctrl + F5` hoặc `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Hoặc clear cache:**
   - Mở Developer Tools (F12)
   - Right-click vào nút refresh
   - Chọn "Empty Cache and Hard Reload"

### Bước 4: Kiểm tra

1. Mở: `https://duhocannhien.vercel.app`
2. Scroll xuống footer
3. Trong phần "Liên hệ", bạn sẽ thấy:
   - 📍 Địa chỉ
   - 📞 Số điện thoại
   - 📧 **Email: annhienduhochan@gmail.com** ← Đây!

## 🔍 Kiểm tra Vercel Deployment

1. Vào: https://vercel.com/
2. Chọn project của bạn
3. Kiểm tra:
   - Deployment mới nhất đã thành công
   - Build logs không có lỗi
   - URL đã được update

## ⚠️ Nếu vẫn không thấy email

### Kiểm tra 1: Code đã được push chưa?

```bash
git status
```

Nếu có file chưa commit, commit và push lại.

### Kiểm tra 2: Vercel đã deploy chưa?

- Vào Vercel dashboard
- Xem deployment mới nhất
- Đảm bảo status là "Ready"

### Kiểm tra 3: Browser cache

- Thử mở trang trong Incognito/Private mode
- Hoặc clear cache hoàn toàn

### Kiểm tra 4: Xem source code trên Vercel

1. Vào Vercel dashboard
2. Chọn deployment
3. Xem "Source" để đảm bảo code mới đã được deploy

## 📝 Tóm tắt

Email đã có trong code, chỉ cần:
1. ✅ Commit và push code
2. ✅ Đợi Vercel deploy (1-2 phút)
3. ✅ Clear browser cache
4. ✅ Refresh trang

Sau đó bạn sẽ thấy email trong footer! 📧

