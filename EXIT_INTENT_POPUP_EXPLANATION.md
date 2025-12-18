# 🎯 Giải thích Exit-Intent Popup

## 📖 Exit-Intent Popup là gì?

Exit-Intent Popup là một popup thông minh xuất hiện khi người dùng **chuẩn bị rời khỏi website** của bạn. Mục đích là "giữ chân" người dùng bằng cách đưa ra ưu đãi hấp dẫn.

---

## 🔍 Cách hoạt động chi tiết

### **Bước 1: Kiểm tra xem đã hiển thị chưa**

```javascript
// Kiểm tra trong localStorage
const hasSeenPopup = localStorage.getItem('exitIntentPopupShown');
if (hasSeenPopup) {
  // Nếu đã hiển thị rồi thì KHÔNG hiển thị lại
  return;
}
```

**Giải thích:**
- Lần đầu vào website → chưa có trong localStorage → có thể hiển thị
- Đã từng thấy popup → đã lưu vào localStorage → KHÔNG hiển thị lại (tránh spam)

---

### **Bước 2: Phát hiện Exit Intent trên Desktop**

```javascript
const handleMouseLeave = (e) => {
  // e.clientY <= 0 nghĩa là chuột đã di chuyển LÊN TRÊN màn hình
  // (ra khỏi cửa sổ trình duyệt)
  if (!hasShown && e.clientY <= 0) {
    setIsOpen(true); // Hiển thị popup
    localStorage.setItem('exitIntentPopupShown', 'true'); // Lưu lại
  }
};

document.addEventListener('mouseleave', handleMouseLeave);
```

**Ví dụ cụ thể:**

```
┌─────────────────────────────────┐
│  [Thanh địa chỉ trình duyệt]    │ ← Chuột di chuyển lên đây
├─────────────────────────────────┤
│                                 │
│      NỘI DUNG WEBSITE           │
│                                 │
│         [Chuột ở đây]           │
│                                 │
└─────────────────────────────────┘

→ Khi chuột di chuyển LÊN TRÊN thanh địa chỉ
→ e.clientY = 0 hoặc số âm
→ Popup xuất hiện! 🎉
```

---

### **Bước 3: Phát hiện Exit Intent trên Mobile**

```javascript
let lastScrollTop = 0; // Vị trí scroll trước đó

const handleScroll = () => {
  const scrollTop = window.pageYOffset; // Vị trí scroll hiện tại
  
  // Điều kiện:
  // 1. lastScrollTop > scrollTop → Đang cuộn LÊN (scroll up)
  // 2. scrollTop < 100 → Đang ở gần đầu trang
  if (!hasShown && lastScrollTop > scrollTop && scrollTop < 100) {
    setIsOpen(true); // Hiển thị popup
    localStorage.setItem('exitIntentPopupShown', 'true');
  }
  
  lastScrollTop = scrollTop; // Lưu vị trí hiện tại
};
```

**Ví dụ cụ thể:**

```
Trạng thái 1: Người dùng đang ở giữa trang
┌─────────────────┐
│  ĐẦU TRANG      │ ← scrollTop = 0
├─────────────────┤
│                 │
│  [Người dùng]   │ ← scrollTop = 500
│                 │
└─────────────────┘

Trạng thái 2: Người dùng cuộn LÊN NHANH
┌─────────────────┐
│  ĐẦU TRANG      │ ← scrollTop = 50 (gần đầu trang)
│  [Người dùng]   │
├─────────────────┤
│                 │
│                 │
└─────────────────┘

→ Cuộn lên nhanh + gần đầu trang = Chuẩn bị rời
→ Popup xuất hiện! 🎉
```

---

## 🎬 Quy trình hoạt động (Flowchart)

```
NGƯỜI DÙNG VÀO WEBSITE
        ↓
Đã từng thấy popup? 
        ↓
    [CÓ] → KHÔNG hiển thị (kết thúc)
        ↓
    [KHÔNG]
        ↓
Lắng nghe sự kiện:
  - mouseleave (Desktop)
  - scroll (Mobile)
        ↓
Phát hiện Exit Intent?
        ↓
    [CÓ] → Hiển thị popup
        ↓
    Lưu vào localStorage
        ↓
Người dùng thấy popup với ưu đãi
        ↓
Người dùng chọn:
  - "Nhận ưu đãi" → Mở form tư vấn
  - "Tải tài liệu" → Chuyển đến trang Resources
  - Đóng popup → Popup biến mất
```

---

## 🧪 Cách test thử

### **Test trên Desktop:**

1. Mở website
2. Di chuyển chuột **chậm rãi lên trên** (ra khỏi cửa sổ trình duyệt)
3. Popup sẽ xuất hiện! ✨

**Lưu ý:** 
- Phải di chuyển chuột **ra khỏi cửa sổ trình duyệt** (lên thanh địa chỉ hoặc tab)
- Nếu chỉ di chuyển trong trang thì KHÔNG hiển thị

### **Test trên Mobile:**

1. Mở website trên điện thoại
2. Cuộn xuống giữa trang
3. Cuộn **LÊN NHANH** về đầu trang
4. Popup sẽ xuất hiện! ✨

**Lưu ý:**
- Phải cuộn lên **NHANH** và **gần đầu trang** (scrollTop < 100)
- Cuộn chậm hoặc cuộn bình thường thì KHÔNG hiển thị

---

## 🔧 Các tính năng bổ sung

### **1. Chỉ hiển thị 1 lần**

```javascript
localStorage.setItem('exitIntentPopupShown', 'true');
```

- Sau khi hiển thị, lưu vào localStorage
- Lần sau vào website, KHÔNG hiển thị lại
- Muốn test lại: Xóa localStorage trong DevTools

### **2. Tự động đóng khi click bên ngoài**

```javascript
<div className="exit-intent-overlay" onClick={() => setIsOpen(false)}>
```

- Click vào vùng tối bên ngoài popup → Đóng popup

### **3. Tích hợp với form tư vấn**

```javascript
const handleGetOffer = () => {
  setIsOpen(false); // Đóng popup
  setShowConsultationForm(true); // Mở form tư vấn
};
```

- Click "Nhận ưu đãi" → Đóng popup và mở form tư vấn

---

## 📊 Tỷ lệ thành công

Exit-Intent Popup thường có tỷ lệ chuyển đổi cao vì:
- ✅ Hiển thị đúng thời điểm (khi người dùng sắp rời)
- ✅ Tạo cảm giác cấp bách (ưu đãi có hạn)
- ✅ Không làm phiền (chỉ hiển thị 1 lần)
- ✅ Có giá trị rõ ràng (ưu đãi cụ thể)

---

## 🎯 Kết luận

Exit-Intent Popup là công cụ mạnh mẽ để:
- Giảm tỷ lệ bounce rate (người rời trang)
- Tăng conversion rate (tỷ lệ chuyển đổi)
- Thu thập thông tin khách hàng tiềm năng
- Tạo cơ hội "giữ chân" người dùng cuối cùng

**Cách hoạt động tóm tắt:**
1. Phát hiện khi người dùng chuẩn bị rời trang
2. Hiển thị popup với ưu đãi hấp dẫn
3. Chỉ hiển thị 1 lần (lưu vào localStorage)
4. Tích hợp với form tư vấn để thu thập lead

