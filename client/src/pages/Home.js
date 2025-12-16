import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Du học Hàn Quốc<br />
              <span className="gradient-text">Khởi đầu tương lai</span>
            </h1>
            <p className="hero-subtitle">
              Đồng hành cùng bạn trên hành trình chinh phục ước mơ du học tại xứ sở Kim Chi
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn-primary">Tư vấn ngay</Link>
              <Link to="/services" className="btn-secondary">Tìm hiểu thêm</Link>
            </div>
          </motion.div>
        </div>
        <div className="hero-image">
          <img 
            src="https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg"
            alt="Khuôn viên đại học tại Seoul, Hàn Quốc"
            className="hero-img"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
        <p className="section-subtitle">
          Với nhiều năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng nghìn học sinh
        </p>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-icon">🎓</div>
            <h3>Tư vấn chuyên nghiệp</h3>
            <p>Đội ngũ tư vấn viên giàu kinh nghiệm, am hiểu về hệ thống giáo dục Hàn Quốc</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="feature-icon">✈️</div>
            <h3>Hỗ trợ toàn diện</h3>
            <p>Từ tư vấn, làm hồ sơ đến hỗ trợ sau khi sang Hàn Quốc</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-icon">🏆</div>
            <h3>Tỷ lệ thành công cao</h3>
            <p>Hàng nghìn học sinh đã thành công với chúng tôi</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="feature-icon">💼</div>
            <h3>Hợp tác với nhiều trường</h3>
            <p>Mạng lưới đối tác rộng khắp tại Hàn Quốc</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="korea-pattern"></div>
        <div className="stats-container">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-icon">🇰🇷</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">1000+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Học sinh đã du học</p>
            <p className="stat-korean">한국 유학생</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="stat-icon">🏛️</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">50+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Trường đối tác</p>
            <p className="stat-korean">파트너 학교</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-icon">🏆</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">95%</h3>
              <span className="stat-percent">%</span>
            </div>
            <p className="stat-label">Tỷ lệ thành công</p>
            <p className="stat-korean">성공률</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="stat-icon">⭐</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">10+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Năm kinh nghiệm</p>
            <p className="stat-korean">경험 연수</p>
          </motion.div>
        </div>
        <div className="korea-pattern-bottom"></div>
      </section>

      {/* CTA Section - Gen Z Style */}
      <section className="cta-section">
        <div className="cta-background-animation">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
          <div className="cta-blob cta-blob-3"></div>
        </div>
        <div className="cta-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
        </div>
        <div className="cta-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-emoji">🚀</div>
            <h2 className="cta-title">
              <span className="cta-title-line">Sẵn sàng bắt đầu</span>
              <span className="cta-title-line gradient-text-cta">hành trình của bạn?</span>
            </h2>
            <p className="cta-subtitle">
              <span className="cta-subtitle-icon">💬</span>
              Liên hệ ngay để được tư vấn miễn phí
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
            <div className="cta-features">
              <div className="cta-feature-item">
                <span className="cta-feature-icon">✅</span>
                <span>Miễn phí 100%</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">⚡</span>
                <span>Phản hồi nhanh</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">🎯</span>
                <span>Tư vấn chuyên nghiệp</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

