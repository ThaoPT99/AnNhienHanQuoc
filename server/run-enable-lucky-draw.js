/**
 * Script để bật lại chương trình vòng quay may mắn và thêm phần quà
 * Chạy: node run-enable-lucky-draw.js
 */

require('dotenv').config();
const { dbHelpers } = require('./database');

console.log('🚀 Bắt đầu bật lại chương trình vòng quay may mắn...\n');

// Bật lại chương trình
dbHelpers.updateLuckyDrawSettings(30, 1, (err, settings) => {
  if (err) {
    console.error('❌ Lỗi khi bật chương trình:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Đã bật lại chương trình vòng quay may mắn');
  console.log(`   - Tỷ lệ trúng thưởng: ${settings.win_rate}%`);
  console.log(`   - Trạng thái: ${settings.is_active === 1 ? 'Hoạt động' : 'Tạm dừng'}\n`);

  // Thêm các phần quà mặc định
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

  let completed = 0;
  let inserted = 0;
  let skipped = 0;
  let errors = [];

  console.log('📦 Đang thêm phần quà...\n');

  rewards.forEach(([name, description, image, stock]) => {
    dbHelpers.createLuckyDrawReward({
      name,
      description,
      image,
      stock_quantity: stock,
      is_active: 1
    }, (err, reward) => {
      completed++;
      
      if (err) {
        // Nếu lỗi do duplicate (UNIQUE constraint), bỏ qua
        if (err.message && err.message.includes('UNIQUE')) {
          skipped++;
          console.log(`ℹ️  "${name}" - đã tồn tại, bỏ qua`);
        } else {
          console.error(`❌ "${name}" - Lỗi: ${err.message}`);
          errors.push({ name, error: err.message });
        }
      } else {
        inserted++;
        console.log(`✅ "${name}" - Đã thêm (Số lượng: ${stock})`);
      }
      
      // Khi hoàn tất tất cả
      if (completed === rewards.length) {
        console.log('\n📊 Kết quả:');
        console.log(`   ✅ Đã thêm: ${inserted} phần quà`);
        console.log(`   ℹ️  Đã tồn tại: ${skipped} phần quà`);
        if (errors.length > 0) {
          console.log(`   ❌ Lỗi: ${errors.length} phần quà`);
          errors.forEach(e => console.log(`      - ${e.name}: ${e.error}`));
        }
        console.log(`\n🎉 Hoàn tất! Chương trình đã được bật và có ${inserted + skipped} phần quà.`);
        process.exit(0);
      }
    });
  });
});
