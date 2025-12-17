import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Services.css';

const Services = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Tư vấn du học Hàn Quốc",
    "name": "Dịch vụ tư vấn du học Hàn Quốc",
    "description": "Dịch vụ tư vấn du học Hàn Quốc chuyên nghiệp: Tư vấn chọn trường, làm hồ sơ du học, xin visa, tìm chỗ ở, hỗ trợ đón sân bay và hỗ trợ sau khi nhập cảnh Hàn Quốc",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Du học An Nhiên",
      "url": "https://duhocannhien.vercel.app"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Vietnam"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dịch vụ du học Hàn Quốc",
      "itemListElement": [
        {
          "@type": "Offer",
          "position": 1,
          "itemOffered": {
            "@type": "Service",
            "name": "Tư vấn chọn trường",
            "description": "Tư vấn chọn trường phù hợp với năng lực và nguyện vọng của bạn"
          }
        },
        {
          "@type": "Offer",
          "position": 2,
          "itemOffered": {
            "@type": "Service",
            "name": "Làm hồ sơ du học",
            "description": "Hỗ trợ chuẩn bị và hoàn thiện hồ sơ du học một cách chuyên nghiệp"
          }
        },
        {
          "@type": "Offer",
          "position": 3,
          "itemOffered": {
            "@type": "Service",
            "name": "Luyện thi TOPIK",
            "description": "Chương trình luyện thi TOPIK hiệu quả với giáo viên giàu kinh nghiệm"
          }
        },
        {
          "@type": "Offer",
          "position": 4,
          "itemOffered": {
            "@type": "Service",
            "name": "Hỗ trợ tìm nhà trọ",
            "description": "Hỗ trợ tìm kiếm chỗ ở phù hợp khi sang Hàn Quốc"
          }
        },
        {
          "@type": "Offer",
          "position": 5,
          "itemOffered": {
            "@type": "Service",
            "name": "Hỗ trợ đón sân bay",
            "description": "Dịch vụ đón tại sân bay và hỗ trợ những ngày đầu tại Hàn Quốc"
          }
        },
        {
          "@type": "Offer",
          "position": 6,
          "itemOffered": {
            "@type": "Service",
            "name": "Hỗ trợ sau khi nhập cảnh",
            "description": "Tiếp tục đồng hành và hỗ trợ bạn sau khi đã nhập cảnh Hàn Quốc"
          }
        }
      ]
    }
  };

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
      title: 'Hỗ trợ sau khi nhập cảnh',
      description: 'Tiếp tục đồng hành và hỗ trợ bạn sau khi đã nhập cảnh Hàn Quốc',
      features: ['Tư vấn học tập', 'Hỗ trợ tìm việc làm thêm', 'Giải đáp thắc mắc']
    }
  ];

  return (
    <div className="services-page">
      <SEO
        title="Dịch vụ - Du học An Nhiên"
        description="Dịch vụ tư vấn du học Hàn Quốc chuyên nghiệp: Tư vấn chọn trường, làm hồ sơ du học, xin visa, tìm chỗ ở, hỗ trợ đón sân bay và hỗ trợ sau khi nhập cảnh Hàn Quốc."
        keywords="dịch vụ du học Hàn Quốc, tư vấn chọn trường, làm hồ sơ du học, xin visa Hàn Quốc, hỗ trợ du học sinh"
        url="https://duhocannhien.vercel.app/services"
        structuredData={structuredData}
      />
      <div className="page-header">
        <div className="header-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-emoji">🎯</div>
          <h1 className="header-title">
            <span className="gradient-text-header">Dịch vụ</span> của chúng tôi
          </h1>
          <p className="header-subtitle">
            <span className="subtitle-icon">🚀</span>
            Hỗ trợ toàn diện cho hành trình du học Hàn Quốc của bạn
            <span className="subtitle-icon">🚀</span>
          </p>
        </motion.div>
      </div>

      <section className="services-section section">
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
            >
              <div className="service-icon-wrapper">
                <div className="service-icon">{service.icon}</div>
                <div className="service-icon-glow"></div>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
                  >
                    <span className="feature-check">✓</span> {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="service-badge">Popular</div>
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
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number-wrapper">
                <div className="step-number">1</div>
                <div className="step-number-glow"></div>
              </div>
              <div className="step-icon">📞</div>
              <h3>Tiếp nhận thông tin</h3>
              <p>Liên hệ và cung cấp thông tin cơ bản về nhu cầu du học</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number-wrapper">
                <div className="step-number">2</div>
                <div className="step-number-glow"></div>
              </div>
              <div className="step-icon">🎓</div>
              <h3>Tư vấn và chọn trường</h3>
              <p>Phân tích hồ sơ và tư vấn chọn trường phù hợp</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number-wrapper">
                <div className="step-number">3</div>
                <div className="step-number-glow"></div>
              </div>
              <div className="step-icon">📝</div>
              <h3>Chuẩn bị hồ sơ</h3>
              <p>Hỗ trợ chuẩn bị và hoàn thiện tất cả giấy tờ cần thiết</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number-wrapper">
                <div className="step-number">4</div>
                <div className="step-number-glow"></div>
              </div>
              <div className="step-icon">✈️</div>
              <h3>Nộp hồ sơ và xin visa</h3>
              <p>Nộp hồ sơ và hỗ trợ quá trình xin visa</p>
            </motion.div>
            
            <motion.div
              className="process-step"
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number-wrapper">
                <div className="step-number">5</div>
                <div className="step-number-glow"></div>
              </div>
              <div className="step-icon">🇰🇷</div>
              <h3>Hỗ trợ sau khi nhập cảnh</h3>
              <p>Tiếp tục đồng hành và hỗ trợ sau khi nhập cảnh Hàn Quốc</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-background-animation">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
        </div>
        <div className="cta-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
        </div>
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-emoji">🎉</div>
          <h2 className="cta-title">
            <span className="cta-title-line">Bắt đầu hành trình</span>
            <span className="cta-title-line gradient-text-cta">ngay hôm nay!</span>
          </h2>
          <p className="cta-subtitle">
            <span className="cta-subtitle-icon">💬</span>
            Liên hệ với chúng tôi để được tư vấn miễn phí
            <span className="cta-subtitle-icon">💬</span>
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/contact" className="cta-button">
              <span className="cta-button-text">Liên hệ ngay</span>
              <span className="cta-button-icon">👉</span>
              <div className="cta-button-shine"></div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;

