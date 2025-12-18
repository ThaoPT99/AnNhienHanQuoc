import React from 'react';
import { motion } from 'framer-motion';
import './TransparentStats.css';

const TransparentStats = () => {
  const stats = [
    {
      id: 1,
      number: '1000+',
      label: 'Học sinh đã du học thành công',
      description: 'Hơn 1000 học sinh đã được hỗ trợ du học Hàn Quốc thành công',
      icon: '🇰🇷',
      color: '#667eea',
      details: [
        'Đại học Yonsei: 150+ học sinh',
        'Đại học Korea: 120+ học sinh',
        'Đại học SNU: 80+ học sinh',
        'Các trường khác: 650+ học sinh'
      ]
    },
    {
      id: 2,
      number: '95%',
      label: 'Tỷ lệ đậu visa',
      description: '95% học sinh đạt visa thành công trong lần đầu tiên',
      icon: '✈️',
      color: '#2ed573',
      details: [
        '2024: 96% tỷ lệ đậu',
        '2023: 94% tỷ lệ đậu',
        '2022: 95% tỷ lệ đậu',
        'Trung bình 3 năm: 95%'
      ]
    },
    {
      id: 3,
      number: '50+',
      label: 'Trường đối tác',
      description: 'Quan hệ đối tác với hơn 50 trường đại học hàng đầu Hàn Quốc',
      icon: '🏛️',
      color: '#f5576c',
      details: [
        'Top 10 trường: 10 trường',
        'Top 20 trường: 15 trường',
        'Top 50 trường: 25 trường',
        'Tổng cộng: 50+ trường'
      ]
    },
    {
      id: 4,
      number: '10+',
      label: 'Năm kinh nghiệm',
      description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn du học Hàn Quốc',
      icon: '⭐',
      color: '#ffc107',
      details: [
        'Thành lập: 2014',
        'Kinh nghiệm: 10+ năm',
        'Đội ngũ: 20+ nhân viên',
        'Văn phòng: Hà Nội'
      ]
    },
    {
      id: 5,
      number: '80%',
      label: 'Tỷ lệ nhận học bổng',
      description: '80% học sinh nhận được học bổng từ 30% đến 100%',
      icon: '💰',
      color: '#764ba2',
      details: [
        'Học bổng 100%: 15%',
        'Học bổng 50-70%: 35%',
        'Học bổng 30-50%: 30%',
        'Tổng cộng: 80%'
      ]
    },
    {
      id: 6,
      number: '24/7',
      label: 'Hỗ trợ học sinh',
      description: 'Hỗ trợ học sinh 24/7 từ khi đăng ký đến sau khi nhập cảnh',
      icon: '💬',
      color: '#4facfe',
      details: [
        'Tư vấn trực tuyến: 24/7',
        'Hỗ trợ visa: Trong giờ hành chính',
        'Hỗ trợ sau nhập cảnh: 24/7',
        'Hotline: 0961.321.930'
      ]
    }
  ];

  return (
    <div className="transparent-stats-section">
      <div className="stats-header">
        <h2>📊 Thống kê minh bạch</h2>
        <p>Những con số thực tế về thành tựu của Du học An Nhiên</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}20` }}>
              <span className="stat-icon" style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="stat-number" style={{ color: stat.color }}>{stat.number}</div>
            <h3 className="stat-label">{stat.label}</h3>
            <p className="stat-description">{stat.description}</p>
            
            <div className="stat-details">
              <div className="details-header">Chi tiết:</div>
              <ul className="details-list">
                {stat.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="stat-verification">
              <span className="verification-icon">✓</span>
              <span className="verification-text">Đã xác minh</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="stats-note">
        <p>
          <strong>Lưu ý:</strong> Tất cả số liệu được cập nhật thường xuyên và có thể xác minh. 
          Chúng tôi cam kết minh bạch và trung thực trong mọi thông tin.
        </p>
      </div>
    </div>
  );
};

export default TransparentStats;

