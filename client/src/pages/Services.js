import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '📋',
      title: 'Tư vấn chọn trường',
      description: 'Tư vấn chọn trường phù hợp với năng lực và nguyện vọng của bạn',
      features: ['Phân tích hồ sơ học tập', 'Tư vấn chọn ngành học', 'Giới thiệu các trường phù hợp']
    },
    {
      icon: '📝',
      title: 'Làm hồ sơ du học',
      description: 'Hỗ trợ chuẩn bị và hoàn thiện hồ sơ du học một cách chuyên nghiệp',
      features: ['Dịch thuật công chứng', 'Chuẩn bị giấy tờ', 'Nộp hồ sơ xin visa']
    },
    {
      icon: '💬',
      title: 'Luyện thi TOPIK',
      description: 'Chương trình luyện thi TOPIK hiệu quả với giáo viên giàu kinh nghiệm',
      features: ['Lộ trình học cá nhân hóa', 'Giáo viên bản ngữ', 'Thi thử miễn phí']
    },
    {
      icon: '🏠',
      title: 'Hỗ trợ tìm nhà trọ',
      description: 'Hỗ trợ tìm kiếm chỗ ở phù hợp khi sang Hàn Quốc',
      features: ['Tư vấn khu vực sống', 'Giới thiệu ký túc xá', 'Hỗ trợ thuê nhà']
    },
    {
      icon: '✈️',
      title: 'Hỗ trợ đón sân bay',
      description: 'Dịch vụ đón tại sân bay và hỗ trợ những ngày đầu tại Hàn Quốc',
      features: ['Đón tại sân bay', 'Hướng dẫn đi lại', 'Hỗ trợ mở tài khoản ngân hàng']
    },
    {
      icon: '📚',
      title: 'Hỗ trợ sau khi sang',
      description: 'Tiếp tục đồng hành và hỗ trợ bạn sau khi đã sang Hàn Quốc',
      features: ['Tư vấn học tập', 'Hỗ trợ tìm việc làm thêm', 'Giải đáp thắc mắc']
    }
  ];

  return (
    <div className="services-page">
      <div className="page-header">
        <h1>Dịch vụ của chúng tôi</h1>
        <p>Hỗ trợ toàn diện cho hành trình du học Hàn Quốc của bạn</p>
      </div>

      <section className="services-section section">
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="section">
          <h2 className="section-title">Quy trình tư vấn</h2>
          <div className="process-steps">
            <motion.div
              className="process-step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="step-number">1</div>
              <h3>Tiếp nhận thông tin</h3>
              <p>Liên hệ và cung cấp thông tin cơ bản về nhu cầu du học</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="step-number">2</div>
              <h3>Tư vấn và chọn trường</h3>
              <p>Phân tích hồ sơ và tư vấn chọn trường phù hợp</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="step-number">3</div>
              <h3>Chuẩn bị hồ sơ</h3>
              <p>Hỗ trợ chuẩn bị và hoàn thiện tất cả giấy tờ cần thiết</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="step-number">4</div>
              <h3>Nộp hồ sơ và xin visa</h3>
              <p>Nộp hồ sơ và hỗ trợ quá trình xin visa</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="step-number">5</div>
              <h3>Hỗ trợ sau khi sang</h3>
              <p>Tiếp tục đồng hành và hỗ trợ sau khi sang Hàn Quốc</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Bắt đầu hành trình của bạn ngay hôm nay</h2>
          <p>Liên hệ với chúng tôi để được tư vấn miễn phí</p>
          <Link to="/contact" className="btn-primary">Liên hệ ngay</Link>
        </div>
      </section>
    </div>
  );
};

export default Services;

