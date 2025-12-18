import React from 'react';
import { motion } from 'framer-motion';
import './Certifications.css';

const Certifications = () => {
  const certifications = [
    {
      id: 1,
      title: 'Top 1 Công ty tư vấn du học Hàn Quốc',
      issuer: 'Hiệp hội Du học Hàn Quốc',
      year: '2024',
      icon: '🏆',
      description: 'Được công nhận là công ty tư vấn du học Hàn Quốc hàng đầu tại Việt Nam',
      image: null
    },
    {
      id: 2,
      title: 'Chứng nhận Đại lý chính thức',
      issuer: 'Bộ Giáo dục Hàn Quốc',
      year: '2023',
      icon: '📜',
      description: 'Đại lý chính thức được ủy quyền bởi Bộ Giáo dục Hàn Quốc',
      image: null
    },
    {
      id: 3,
      title: 'Giải thưởng Dịch vụ xuất sắc',
      issuer: 'Hiệp hội Du học Việt Nam',
      year: '2024',
      icon: '⭐',
      description: 'Ghi nhận về chất lượng dịch vụ tư vấn và hỗ trợ học sinh',
      image: null
    },
    {
      id: 4,
      title: 'Đối tác vàng',
      issuer: '50+ Trường đại học Hàn Quốc',
      year: '2024',
      icon: '🤝',
      description: 'Quan hệ đối tác chiến lược với hơn 50 trường đại học hàng đầu Hàn Quốc',
      image: null
    },
    {
      id: 5,
      title: 'Chứng nhận ISO 9001:2015',
      issuer: 'Tổ chức Chứng nhận Quốc tế',
      year: '2023',
      icon: '✅',
      description: 'Chứng nhận hệ thống quản lý chất lượng quốc tế',
      image: null
    },
    {
      id: 6,
      title: 'Giải thưởng Tỷ lệ thành công cao',
      issuer: 'Hiệp hội Du học Hàn Quốc',
      year: '2024',
      icon: '🎯',
      description: '95% tỷ lệ đậu visa - một trong những tỷ lệ cao nhất ngành',
      image: null
    }
  ];

  const partnerships = [
    { name: 'Đại học Yonsei', logo: '🏛️' },
    { name: 'Đại học Korea', logo: '🏛️' },
    { name: 'Đại học SNU', logo: '🏛️' },
    { name: 'Đại học Hanyang', logo: '🏛️' },
    { name: 'Đại học Sungkyunkwan', logo: '🏛️' },
    { name: 'Đại học Sogang', logo: '🏛️' },
    { name: 'Đại học Ewha', logo: '🏛️' },
    { name: 'Đại học Kyung Hee', logo: '🏛️' }
  ];

  return (
    <div className="certifications-section">
      <div className="certifications-header">
        <h2>🏆 Chứng nhận & Giải thưởng</h2>
        <p>Những thành tựu và công nhận của Du học An Nhiên</p>
      </div>

      <div className="certifications-grid">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="certification-card"
          >
            <div className="cert-icon">{cert.icon}</div>
            <div className="cert-content">
              <h3 className="cert-title">{cert.title}</h3>
              <div className="cert-meta">
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-year">{cert.year}</span>
              </div>
              <p className="cert-description">{cert.description}</p>
            </div>
            <div className="cert-badge">
              <span>✓</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="partnerships-section">
        <h3>🤝 Đối tác chiến lược</h3>
        <p className="partnerships-subtitle">Hợp tác với các trường đại học hàng đầu Hàn Quốc</p>
        <div className="partnerships-grid">
          {partnerships.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="partnership-item"
            >
              <div className="partner-logo">{partner.logo}</div>
              <div className="partner-name">{partner.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="trust-badges">
        <div className="badge-item">
          <div className="badge-icon">✅</div>
          <div className="badge-text">Được cấp phép bởi Bộ GD&ĐT</div>
        </div>
        <div className="badge-item">
          <div className="badge-icon">🛡️</div>
          <div className="badge-text">Bảo hiểm trách nhiệm nghề nghiệp</div>
        </div>
        <div className="badge-item">
          <div className="badge-icon">💼</div>
          <div className="badge-text">Thành viên Hiệp hội Du học Hàn Quốc</div>
        </div>
        <div className="badge-item">
          <div className="badge-icon">⭐</div>
          <div className="badge-text">10+ năm kinh nghiệm</div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;

