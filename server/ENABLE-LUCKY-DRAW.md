# 🎁 Hướng dẫn bật lại chương trình vòng quay may mắn

## Cách 1: Chạy script Node.js (Khuyến nghị)

```bash
cd server
npm run enable-lucky-draw
```

Hoặc:

```bash
cd server
node run-enable-lucky-draw.js
```

## Cách 2: Gọi API endpoint (nếu server đang chạy)

Nếu server đang chạy, bạn có thể gọi API:

```bash
curl -X POST https://your-server-url/api/admin/lucky-draw/enable \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

Hoặc dùng Postman/Thunder Client với:
- Method: POST
- URL: `http://localhost:5000/api/admin/lucky-draw/enable`
- Headers: `x-admin-token: YOUR_ADMIN_TOKEN`

## Cách 3: Chạy SQL trực tiếp

Nếu có SQLite CLI:

```bash
sqlite3 contacts.db < enable-lucky-draw.sql
```

## Kết quả

Script sẽ:
- ✅ Bật lại chương trình (`is_active = 1`)
- ✅ Thêm 8 phần quà mặc định:
  - Gấu bông dễ thương (50 cái)
  - Trà sữa thơm ngon (100 voucher)
  - Thẻ cào điện thoại 50k (200 thẻ)
  - Thẻ cào điện thoại 100k (100 thẻ)
  - Voucher giảm giá 20% (150 voucher)
  - Balo du học (30 cái)
  - Sổ tay ghi chép (80 cuốn)
  - Bút ký cao cấp (60 cây)
