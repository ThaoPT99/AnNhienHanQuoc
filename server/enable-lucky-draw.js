const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Đường dẫn đến database (giống như trong database.js)
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'contacts.db');

// Mở kết nối database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    process.exit(1);
  }
  console.log('✅ Đã kết nối đến database');
});

// Bật lại chương trình
db.run(`UPDATE lucky_draw_settings SET is_active = 1, updated_at = datetime('now') WHERE id = 1`, function(err) {
  if (err) {
    console.error('❌ Lỗi khi bật chương trình:', err.message);
  } else {
    console.log('✅ Đã bật lại chương trình vòng quay may mắn');
  }
});

// Thêm các phần quà
const rewards = [
  ['Gấu bông dễ thương', 'Gấu bông size lớn, chất liệu mềm mại', null, 50],
  ['Trà sữa thơm ngon', 'Voucher trà sữa tại các cửa hàng đối tác', null, 100],
  ['Thẻ cào điện thoại 50k', 'Thẻ cào điện thoại trị giá 50.000 VNĐ', null, 200],
  ['Thẻ cào điện thoại 100k', 'Thẻ cào điện thoại trị giá 100.000 VNĐ', null, 100],
  ['Voucher giảm giá 20%', 'Voucher giảm giá 20% cho dịch vụ tư vấn du học', null, 150],
  ['Balo du học', 'Balo cao cấp phù hợp cho du học sinh', null, 30],
  ['Sổ tay ghi chép', 'Sổ tay đẹp, tiện lợi cho việc học tập', null, 80],
  ['Bút ký cao cấp', 'Bút ký chất lượng tốt, thiết kế đẹp', null, 60]
];

let inserted = 0;
rewards.forEach(([name, description, image, stock]) => {
  db.run(
    `INSERT OR IGNORE INTO lucky_draw_rewards (name, description, image, stock_quantity, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
    [name, description, image, stock],
    function(err) {
      if (err) {
        console.error(`❌ Lỗi khi thêm phần quà "${name}":`, err.message);
      } else {
        if (this.changes > 0) {
          inserted++;
          console.log(`✅ Đã thêm phần quà: ${name} (Số lượng: ${stock})`);
        } else {
          console.log(`ℹ️  Phần quà "${name}" đã tồn tại, bỏ qua`);
        }
      }
    }
  );
});

// Kiểm tra kết quả sau 1 giây
setTimeout(() => {
  db.get('SELECT is_active FROM lucky_draw_settings WHERE id = 1', (err, row) => {
    if (err) {
      console.error('❌ Lỗi khi kiểm tra trạng thái:', err.message);
    } else {
      console.log(`\n📊 Trạng thái chương trình: ${row.is_active === 1 ? '✅ Hoạt động' : '❌ Tạm dừng'}`);
    }
  });

  db.get('SELECT COUNT(*) as count FROM lucky_draw_rewards WHERE is_active = 1', (err, row) => {
    if (err) {
      console.error('❌ Lỗi khi đếm phần quà:', err.message);
    } else {
      console.log(`📦 Tổng số phần quà đang hoạt động: ${row.count}`);
    }
    
    // Đóng kết nối
    db.close((err) => {
      if (err) {
        console.error('❌ Lỗi khi đóng database:', err.message);
      } else {
        console.log('\n✅ Hoàn tất!');
      }
      process.exit(0);
    });
  });
}, 2000);
