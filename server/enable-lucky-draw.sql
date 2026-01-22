-- Bật lại chương trình vòng quay may mắn
UPDATE lucky_draw_settings SET is_active = 1, updated_at = datetime('now') WHERE id = 1;

-- Thêm các phần quà mẫu
INSERT OR IGNORE INTO lucky_draw_rewards (name, description, image, stock_quantity, is_active, created_at, updated_at) VALUES
('Gấu bông dễ thương', 'Gấu bông size lớn, chất liệu mềm mại', NULL, 50, 1, datetime('now'), datetime('now')),
('Trà sữa thơm ngon', 'Voucher trà sữa tại các cửa hàng đối tác', NULL, 100, 1, datetime('now'), datetime('now')),
('Thẻ cào điện thoại 50k', 'Thẻ cào điện thoại trị giá 50.000 VNĐ', NULL, 200, 1, datetime('now'), datetime('now')),
('Thẻ cào điện thoại 100k', 'Thẻ cào điện thoại trị giá 100.000 VNĐ', NULL, 100, 1, datetime('now'), datetime('now')),
('Voucher giảm giá 20%', 'Voucher giảm giá 20% cho dịch vụ tư vấn du học', NULL, 150, 1, datetime('now'), datetime('now')),
('Balo du học', 'Balo cao cấp phù hợp cho du học sinh', NULL, 30, 1, datetime('now'), datetime('now')),
('Sổ tay ghi chép', 'Sổ tay đẹp, tiện lợi cho việc học tập', NULL, 80, 1, datetime('now'), datetime('now')),
('Bút ký cao cấp', 'Bút ký chất lượng tốt, thiết kế đẹp', NULL, 60, 1, datetime('now'), datetime('now'));

-- Kiểm tra kết quả
SELECT 'Chương trình đã được bật' as status;
SELECT COUNT(*) as total_rewards FROM lucky_draw_rewards WHERE is_active = 1;
SELECT name, stock_quantity FROM lucky_draw_rewards WHERE is_active = 1 ORDER BY created_at DESC;
